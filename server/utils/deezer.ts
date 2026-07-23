import type { H3Event } from 'h3';

const API = 'https://api.deezer.com';

type DeezerSession = NonNullable<Awaited<ReturnType<typeof getUserSession>>['deezer']>;

interface DeezerError {
  error?: { type?: string; message?: string; code?: number };
}

// Read the Deezer token out of the sealed session, or refuse.
export async function requireDeezer(event: H3Event): Promise<DeezerSession> {
  const session = await getUserSession(event);
  if (!session.deezer?.accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Connect your Deezer account first' });
  }
  if (session.deezer.expiresAt && Date.now() > session.deezer.expiresAt) {
    await clearUserSession(event);
    throw createError({
      statusCode: 401,
      statusMessage: 'Deezer session expired, please reconnect',
    });
  }
  return session.deezer;
}

// Deezer returns errors as HTTP 200 with an `error` field, so we inspect the body.
async function deezerFetch<T>(
  event: H3Event,
  path: string,
  opts: { method?: 'GET' | 'POST'; query?: Record<string, unknown>; auth?: boolean } = {},
): Promise<T> {
  const query: Record<string, unknown> = { ...opts.query };
  if (opts.auth !== false) {
    const { accessToken } = await requireDeezer(event);
    query.access_token = accessToken;
  }

  const res = (await $fetch(`${API}${path}`, { method: opts.method || 'GET', query })) as T &
    DeezerError;

  if (res && typeof res === 'object' && res.error) {
    const e = res.error;
    const code = e.code ?? 0;
    // Token / permission failures: clear the session so the user reconnects.
    if (code === 300 || code === 200 || /token|permission/i.test(e.message || '')) {
      await clearUserSession(event);
      throw createError({
        statusCode: 401,
        statusMessage: 'Deezer session expired, please reconnect',
      });
    }
    throw createError({
      statusCode: 502,
      statusMessage: 'Deezer request failed',
      data: { reason: e.message || null },
    });
  }
  return res;
}

interface DeezerTrack {
  id: number;
  title: string;
  artist?: { name: string };
  album?: { cover_medium?: string; cover?: string };
  link?: string;
}

// Deezer search is public (no token needed).
export async function deezerSearch(
  event: H3Event,
  q: string,
  limit = 8,
): Promise<TrackCandidate[]> {
  const res = await deezerFetch<{ data?: DeezerTrack[] }>(event, '/search', {
    query: { q, limit },
    auth: false,
  });
  return (res.data ?? []).map((t) => ({
    id: String(t.id),
    title: t.title,
    artist: t.artist?.name ?? '',
    albumArt: t.album?.cover_medium ?? t.album?.cover ?? null,
    url: t.link ?? `https://www.deezer.com/track/${t.id}`,
  }));
}

export async function deezerCreatePlaylist(
  event: H3Event,
  opts: { name: string; ids: string[] },
): Promise<{ url: string; added: number }> {
  const created = await deezerFetch<{ id?: number }>(event, '/user/me/playlists', {
    method: 'POST',
    query: { title: opts.name },
  });
  const playlistId = created?.id;
  if (!playlistId) {
    throw createError({ statusCode: 502, statusMessage: 'Deezer did not return a playlist id' });
  }

  // Deezer adds tracks by comma-separated track ids; chunk to stay well within limits.
  for (let i = 0; i < opts.ids.length; i += 100) {
    await deezerFetch(event, `/playlist/${playlistId}/tracks`, {
      method: 'POST',
      query: { songs: opts.ids.slice(i, i + 100).join(',') },
    });
  }

  return { url: `https://www.deezer.com/playlist/${playlistId}`, added: opts.ids.length };
}
