// buildQuery, buildLooseQuery, pickBestMatch are auto-imported from server/utils/match.ts

interface SpotifyTrack {
  uri: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}
interface SpotifySearch {
  tracks: { items: SpotifyTrack[] };
}

// Turn setlist song titles into Spotify tracks. We search per song, cover songs
// against their original artist, and hand back honest matched/unmatched rows.
export default defineEventHandler(async (event): Promise<{ matches: TrackMatch[] }> => {
  const body = await readBody<{ artist: string; songs: SetlistSong[] }>(event);
  const artist = (body?.artist || '').trim();
  const songs = (body?.songs || []).filter((s) => s?.name?.trim());

  if (!artist || songs.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'artist and songs are required' });
  }

  const matches = await mapLimit(songs, 6, async (song): Promise<TrackMatch> => {
    const searchArtist = song.cover?.name?.trim() || artist;
    let items = await search(event, buildQuery(song.name, searchArtist));
    if (items.length === 0) items = await search(event, buildLooseQuery(song.name, searchArtist));

    const best = pickBestMatch(song.name, searchArtist, items);
    return {
      song: song.name,
      isCover: Boolean(song.cover),
      matched: Boolean(best),
      uri: best?.uri ?? null,
      title: best?.name ?? null,
      artist: best?.artists?.map((a) => a.name).join(', ') ?? null,
      albumArt: best?.album?.images?.at(-1)?.url ?? null,
    };
  });

  return { matches };
});

async function search(
  event: Parameters<typeof spotifyFetch>[0],
  q: string,
): Promise<SpotifyTrack[]> {
  const res = await spotifyFetch<SpotifySearch>(event, '/search', {
    query: { q, type: 'track', limit: 8 },
  });
  return res.tracks?.items ?? [];
}

// Run an async mapper with bounded concurrency, preserving order.
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, i: number) => Promise<R>,
): Promise<R[]> {
  const out = Array.from({ length: items.length }) as R[];
  let cursor = 0;
  const worker = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i] as T, i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}
