// Full detail for one setlist, including the songs played.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing setlist id' });
  return await setlistfm<Setlist>(event, `/setlist/${id}`);
});
