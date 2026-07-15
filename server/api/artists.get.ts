// Artist search. Returns a short list of artists matching a name.
export default defineEventHandler(async (event) => {
  const name = String(getQuery(event).q || '').trim()
  if (!name) return { artists: [] as SetlistArtist[] }

  try {
    const data = await setlistfm<{ artist?: SetlistArtist[] }>(event, '/search/artists', {
      artistName: name,
      sort: 'relevance',
    })
    return { artists: data.artist ?? [] }
  } catch (err) {
    // setlist.fm answers 404 when nothing matches; that is an empty result, not an error.
    if ((err as { statusCode?: number }).statusCode === 404) return { artists: [] }
    throw err
  }
})
