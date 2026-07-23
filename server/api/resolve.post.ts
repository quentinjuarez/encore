// Turn setlist song titles into tracks on the chosen provider. We search per
// song (cover songs against their original artist) and return honest matched /
// unmatched rows. The scoring in match.ts is provider-agnostic.
export default defineEventHandler(async (event): Promise<{ matches: TrackMatch[] }> => {
  const body = await readBody<{ provider: Provider; artist: string; songs: SetlistSong[] }>(event);
  const provider: Provider = body?.provider === 'deezer' ? 'deezer' : 'spotify';
  const artist = (body?.artist || '').trim();
  const songs = (body?.songs || []).filter((s) => s?.name?.trim());

  if (!artist || songs.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'artist and songs are required' });
  }

  const searchFn = (q: string) =>
    provider === 'deezer' ? deezerSearch(event, q, 8) : spotifySearch(event, q, 8);

  const matches = await mapLimit(songs, 6, async (song): Promise<TrackMatch> => {
    const searchArtist = song.cover?.name?.trim() || artist;
    // Spotify understands field filters; Deezer's plain search does better with
    // a loose query, so we skip the tight one for it.
    const queries =
      provider === 'deezer'
        ? [buildLooseQuery(song.name, searchArtist)]
        : [buildQuery(song.name, searchArtist), buildLooseQuery(song.name, searchArtist)];

    let candidates: TrackCandidate[] = [];
    for (const q of queries) {
      candidates = await searchFn(q);
      if (candidates.length) break;
    }

    const best = pickCandidate(song.name, searchArtist, candidates);
    return {
      song: song.name,
      isCover: Boolean(song.cover),
      matched: Boolean(best),
      id: best?.id ?? null,
      title: best?.title ?? null,
      artist: best?.artist ?? null,
      albumArt: best?.albumArt ?? null,
      url: best?.url ?? null,
    };
  });

  return { matches };
});

// Score provider candidates with the shared heuristic and keep the best above a floor.
function pickCandidate(
  song: string,
  artist: string,
  candidates: TrackCandidate[],
): TrackCandidate | null {
  let best: TrackCandidate | null = null;
  let bestScore = -Infinity;
  for (const c of candidates) {
    const score = scoreTrack(song, artist, {
      uri: c.id,
      name: c.title,
      artists: [{ name: c.artist }],
    });
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return bestScore >= 45 ? best : null;
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
