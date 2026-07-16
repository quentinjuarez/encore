interface SetlistPage {
  setlist?: Setlist[];
  total?: number;
  page?: number;
  itemsPerPage?: number;
}

// Paginated setlists for one artist (by MusicBrainz id).
export default defineEventHandler(async (event) => {
  const mbid = getRouterParam(event, 'mbid');
  if (!mbid) throw createError({ statusCode: 400, statusMessage: 'Missing artist id' });

  const page = Number(getQuery(event).p) || 1;
  const empty = { setlists: [] as Setlist[], page, total: 0, itemsPerPage: 20 };

  try {
    const data = await setlistfm<SetlistPage>(event, `/artist/${mbid}/setlists`, { p: page });
    return {
      setlists: data.setlist ?? [],
      page: data.page ?? page,
      total: data.total ?? 0,
      itemsPerPage: data.itemsPerPage ?? 20,
    };
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 404) return empty;
    throw err;
  }
});
