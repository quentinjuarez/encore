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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

  let res: SpotifyTokens
  try {
    res = await $fetch<SpotifyTokens>(TOKEN_URL, {
      method: 'POST',
      headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: current.refreshToken }).toString(),
    })
  } catch (err) {
    const status = (err as { status?: number; statusCode?: number }).status ?? (err as { statusCode?: number }).statusCode
    // A rejected refresh token means the grant is gone: clear the session so the
    // user is sent back through authorization. Transient failures are not fatal.
    if (status === 400 || status === 401) {
      await clearUserSession(event)
      throw createError({ statusCode: 401, statusMessage: 'Spotify session expired, please reconnect' })
    }
    throw createError({ statusCode: 502, statusMessage: 'Could not refresh the Spotify token' })
  }

  const spotify: SpotifySession = {
    accessToken: res.access_token,
    refreshToken: res.refresh_token || current.refreshToken, // Spotify may not resend it
    expiresAt: Date.now() + res.expires_in * 1000,
    scope: res.scope || current.scope,
  }
  await setUserSession(event, { spotify })
  return spotify
}

// Authenticated Spotify call. Refreshes near expiry and once more on a 401,
// and backs off on 429 while respecting Retry-After.
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
    withRateLimit(() =>
      $fetch<T>(`${API}${path}`, {
        ...opts,
        headers: { Authorization: `Bearer ${accessToken}`, ...(opts?.headers as Record<string, string>) },
      }),
    )

  try {
    return await call(tokens.accessToken)
  } catch (err) {
    if (isUnauthorized(err)) {
      const refreshed = await refreshAccessToken(event, tokens)
      try {
        return await call(refreshed.accessToken)
      } catch (retryErr) {
        throw spotifyError(retryErr, path, refreshed.scope)
      }
    }
    throw spotifyError(err, path, tokens.scope)
  }
}

// Retry 429s with exponential backoff, honoring Retry-After when Spotify sends it.
async function withRateLimit<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const e = err as {
        status?: number
        statusCode?: number
        response?: { headers?: { get?: (k: string) => string | null } }
      }
      const status = e.status ?? e.statusCode
      if (status !== 429 || attempt >= maxRetries) throw err
      const retryAfter = Number(e.response?.headers?.get?.('retry-after')) || 0
      const backoff = Math.min(1000 * 2 ** attempt, 8000)
      await sleep(Math.min(retryAfter > 0 ? retryAfter * 1000 : backoff, 10_000))
    }
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
