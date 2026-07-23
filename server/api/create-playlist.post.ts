// Create a playlist on the chosen provider from the resolved track ids.
export default defineEventHandler(async (event): Promise<{ url: string; added: number }> => {
  const body = await readBody<{
    provider: Provider;
    name: string;
    description?: string;
    ids: string[];
  }>(event);

  const provider: Provider = body?.provider === 'deezer' ? 'deezer' : 'spotify';
  const name = (body?.name || '').trim() || 'Encore setlist';
  const ids = (body?.ids || []).filter(Boolean);
  const description = body?.description || 'Built with Encore from a live setlist.';

  if (ids.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No tracks to add' });
  }

  return provider === 'deezer'
    ? await deezerCreatePlaylist(event, { name, ids })
    : await spotifyCreatePlaylist(event, { name, description, ids });
});
