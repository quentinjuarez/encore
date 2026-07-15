interface SetlistPage {
  setlist?: Setlist[]
  total?: number
  page?: number
  itemsPerPage?: number
}

// Paginated setlists for one artist. With a year and/or city filter, use
// setlist.fm's search endpoint so the filter applies across all pages.
export default defineEventHandler(async (event) => {
  const mbid = getRouterParam(event, 'mbid')
  if (!mbid) throw createError({ statusCode: 400, statusMessage: 'Missing artist id' })

  const q = getQuery(event)
  const page = Number(q.p) || 1
  const year = String(q.year || '').trim()
  const city = String(q.city || '').trim()
  const empty = { setlists: [] as Setlist[], page, total: 0, itemsPerPage: 20 }

  try {
    const data =
      year || city
        ? await setlistfm<SetlistPage>(event, '/search/setlists', {
            artistMbid: mbid,
            p: page,
            ...(year ? { year } : {}),
            ...(city ? { cityName: city } : {}),
          })
        : await setlistfm<SetlistPage>(event, `/artist/${mbid}/setlists`, { p: page })

    return {
      setlists: data.setlist ?? [],
      page: data.page ?? page,
      total: data.total ?? 0,
      itemsPerPage: data.itemsPerPage ?? 20,
    }
  } catch (err) {
    // setlist.fm answers 404 when nothing matches; that is an empty result.
    if ((err as { statusCode?: number }).statusCode === 404) return empty
    throw err
  }
})
