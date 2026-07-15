interface CreatedPlaylist {
  id: string
  external_urls: { spotify: string }
}

// Create a fresh playlist on the user's account and fill it with the resolved
// track URIs (Spotify caps additions at 100 per request, so we chunk).
export default defineEventHandler(async (event): Promise<{ id: string; url: string; added: number }> => {
  const body = await readBody<{ name: string; description?: string; uris: string[] }>(event)
  const name = (body?.name || '').trim() || 'Encore setlist'
  const uris = (body?.uris || []).filter(Boolean)

  if (uris.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No tracks to add' })
  }

  const me = await spotifyFetch<{ id: string }>(event, '/me')

  const playlist = await spotifyFetch<CreatedPlaylist>(event, `/users/${me.id}/playlists`, {
    method: 'POST',
    body: {
      name,
      description: body?.description || 'Built with Encore from a live setlist.',
      public: false,
    },
  })

  for (let i = 0; i < uris.length; i += 100) {
    await spotifyFetch(event, `/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      body: { uris: uris.slice(i, i + 100) },
    })
  }

  return { id: playlist.id, url: playlist.external_urls.spotify, added: uris.length }
})
