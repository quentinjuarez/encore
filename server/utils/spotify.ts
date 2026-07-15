import type { H3Event } from 'h3'

const API = 'https://api.spotify.com/v1'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'

interface SpotifyTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
}

// Read the Spotify tokens out of the sealed session, or refuse.
export async function requireSpotify(event: H3Event) {
  const session = await getUserSession(event)
  if (!session.spotify?.accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Connect your Spotify account first' })
  }
  return session.spotify
}

async function refreshAccessToken(event: H3Event, refreshToken: string) {
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
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }).toString(),
  })

  const spotify = {
    accessToken: res.access_token,
    refreshToken: res.refresh_token || refreshToken, // Spotify may not resend it
    expiresAt: Date.now() + res.expires_in * 1000,
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
    tokens = await refreshAccessToken(event, tokens.refreshToken)
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
      const refreshed = await refreshAccessToken(event, tokens.refreshToken)
      return await call(refreshed.accessToken)
    }
    throw err
  }
}

function isUnauthorized(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { statusCode?: number }).statusCode === 401
}
