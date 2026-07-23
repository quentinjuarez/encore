// Free-text track search on the chosen provider, used to fix a match by hand.
export default defineEventHandler(async (event): Promise<{ tracks: TrackCandidate[] }> => {
  const q = String(getQuery(event).q || '').trim();
  const provider: Provider = getQuery(event).provider === 'deezer' ? 'deezer' : 'spotify';
  if (!q) return { tracks: [] };

  const tracks =
    provider === 'deezer' ? await deezerSearch(event, q, 6) : await spotifySearch(event, q, 6);
  return { tracks };
});
