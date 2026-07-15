import type { H3Event } from 'h3'

const API = 'https://api.spotify.com/v1'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'

interface SpotifyTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
  scope?: string
}

type SpotifySession = NonNullable<Awaited<ReturnType<typeof getUserSession>>['spotify']>

// Read the Spotify tokens out of the sealed session, or refuse.
export async function requireSpotify(event: H3Event): Promise<SpotifySession> {
  const session = await getUserSession(event)
  if (!session.spotify?.accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Connect your Spotify account first' })
  }
  return session.spotify
}

async function refreshAccessToken(event: H3Event, current: SpotifySession): Promise<SpotifySession> {
  const { clientId, clientSecret } = (useRuntimeConfig(event) as unknown as {
    oauth: { spotify: { clientId: string; clientSecret: string } }
  }).oauth.spotify

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await $fetch<SpotifyTokens>(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: current.refreshToken }).toString(),
  })

  const spotify: SpotifySession = {
    accessToken: res.access_token,
    refreshToken: res.refresh_token || current.refreshToken, // Spotify may not resend it
    expiresAt: Date.now() + res.expires_in * 1000,
    scope: res.scope || current.scope, // keep the granted scope if not resent
  }
  await setUserSession(event, { spotify })
  return spotify
}

// Authenticated Spotify call. Refreshes proactively near expiry and once
// more if the token is rejected mid-flight.
export async function spotifyFetch<T>(
  event: H3Event,
  path: string,
  opts: Parameters<typeof $fetch>[1] = {},
): Promise<T> {
  let tokens = await requireSpotify(event)

  if (Date.now() > tokens.expiresAt - 30_000) {
    tokens = await refreshAccessToken(event, tokens)
  }

  const call = (accessToken: string) =>
    $fetch<T>(`${API}${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${accessToken}`, ...(opts?.headers as Record<string, string>) },
    })

  try {
    return await call(tokens.accessToken)
  } catch (err) {
    if (isUnauthorized(err)) {
      try {
        const refreshed = await refreshAccessToken(event, tokens)
        return await call(refreshed.accessToken)
      } catch (retryErr) {
        throw spotifyError(retryErr, path, tokens.scope)
      }
    }
    throw spotifyError(err, path, tokens.scope)
  }
}

function isUnauthorized(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { statusCode?: number }).statusCode === 401
}

// Turn an opaque Spotify failure into an HTTP error that carries Spotify's own
// message (e.g. "Insufficient client scope") and the scopes the token holds.
function spotifyError(err: unknown, path: string, grantedScope?: string) {
  const e = err as { status?: number; statusCode?: number; data?: { error?: { message?: string } } }
  const status = e.status || e.statusCode || 502
  const reason = e.data?.error?.message || null
  console.error(`[spotify] ${path} failed (${status}): ${reason} | granted scope: ${grantedScope ?? 'unknown'}`)
  return createError({
    statusCode: status,
    statusMessage: 'Spotify request failed',
    data: { reason, status, grantedScope: grantedScope ?? null },
  })
}
