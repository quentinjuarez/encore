// Pure song -> Spotify-track matching. setlist.fm gives us song titles as text;
// Spotify needs a real track, so we build the search query and score results.
// No framework imports, so `scripts/test-match.mjs` can exercise it under `node --test`.

export interface SpotifyTrackLite {
  uri: string
  name: string
  artists: { name: string }[]
  album?: { images?: { url: string }[] }
}

// Strip a title to something comparable: no accents, no punctuation, no
// "(live)" / "- remastered 2011" noise, collapsed whitespace.
export function normalize(input: string): string {
  return (input || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacritics
    .toLowerCase()
    .replace(/\s*[([].*?[)\]]\s*/g, ' ') // (live), [remastered], ...
    .replace(/\s*-\s*(live|remaster(ed)?|mono|stereo|single|radio|edit|version|demo).*$/i, ' ')
    .replace(/\bfeat\.?\b.*$/i, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function clean(s: string): string {
  return (s || '').replace(/"/g, '').trim()
}

// Spotify search query with field filters (tight match).
export function buildQuery(song: string, artist: string): string {
  return `track:${clean(song)} artist:${clean(artist)}`
}

// Looser fallback query when the tight one returns nothing.
export function buildLooseQuery(song: string, artist: string): string {
  return `${clean(song)} ${clean(artist)}`.trim()
}

// Jaccard overlap of word tokens, 0..1.
function tokenOverlap(a: string, b: string): number {
  const sa = new Set(a.split(' ').filter(Boolean))
  const sb = new Set(b.split(' ').filter(Boolean))
  if (!sa.size || !sb.size) return 0
  let inter = 0
  for (const t of sa) if (sb.has(t)) inter++
  return inter / (sa.size + sb.size - inter)
}

// Score one candidate against the wanted song + artist. Higher is better.
export function scoreTrack(song: string, artist: string, track: SpotifyTrackLite): number {
  const wantSong = normalize(song)
  const gotSong = normalize(track.name)
  const wantArtist = normalize(artist)
  const gotArtists = (track.artists || []).map((a) => normalize(a.name))

  let score: number
  if (gotSong === wantSong) score = 100
  else if (gotSong.startsWith(wantSong) || wantSong.startsWith(gotSong)) score = 80
  else score = Math.round(tokenOverlap(wantSong, gotSong) * 70)

  // Right title, wrong artist is still wrong: artist agreement matters.
  const artistHit = gotArtists.some((a) => a === wantArtist || a.includes(wantArtist) || wantArtist.includes(a))
  score += artistHit ? 12 : -25

  // Prefer studio recordings unless the requested title itself asked for live.
  const raw = (track.name || '').toLowerCase()
  if (!/\blive\b/.test(song.toLowerCase()) && /\blive\b/.test(raw)) score -= 18
  if (/remaster/.test(raw)) score -= 4

  return score
}

// Pick the best track above a confidence floor, else null.
export function pickBestMatch(
  song: string,
  artist: string,
  tracks: SpotifyTrackLite[],
  floor = 45,
): SpotifyTrackLite | null {
  let best: SpotifyTrackLite | null = null
  let bestScore = -Infinity
  for (const track of tracks || []) {
    const s = scoreTrack(song, artist, track)
    if (s > bestScore) {
      bestScore = s
      best = track
    }
  }
  return bestScore >= floor ? best : null
}
