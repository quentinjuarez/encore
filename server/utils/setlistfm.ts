import type { H3Event } from 'h3'

const BASE = 'https://api.setlist.fm/rest/1.0'

// Thin proxy so the API key stays on the server and never ships to the browser.
export function setlistfm<T>(event: H3Event, path: string, query?: Record<string, unknown>): Promise<T> {
  const { setlistfmApiKey } = useRuntimeConfig(event)
  if (!setlistfmApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'setlist.fm API key is not configured' })
  }
  return $fetch<T>(`${BASE}${path}`, {
    query,
    headers: {
      'x-api-key': setlistfmApiKey,
      Accept: 'application/json',
    },
  })
}
