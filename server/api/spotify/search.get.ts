interface SpotifyTrack {
  uri: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
}

// Free-text Spotify track search, used to fix or replace a match by hand.
export default defineEventHandler(async (event) => {
  const q = String(getQuery(event).q || '').trim()
  if (!q) return { tracks: [] as TrackCandidate[] }

  const res = await spotifyFetch<{ tracks: { items: SpotifyTrack[] } }>(event, '/search', {
    query: { q, type: 'track', limit: 6 },
  })

  const tracks: TrackCandidate[] = (res.tracks?.items ?? []).map((t) => ({
    uri: t.uri,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(', '),
    albumArt: t.album?.images?.at(-1)?.url ?? null,
  }))

  return { tracks }
})
