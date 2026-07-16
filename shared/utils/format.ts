// Small helpers shared by server and client. Auto-imported in both.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// setlist.fm dates come as "dd-MM-yyyy". Render them as "12 Jul 2025".
export function formatSetlistDate(eventDate?: string): string {
  if (!eventDate) return ''
  const [d, m, y] = eventDate.split('-').map(Number)
  if (!d || !m || !y || !MONTHS[m - 1]) return eventDate
  return `${d} ${MONTHS[m - 1]} ${y}`
}

export function countSongs(setlist: Setlist): number {
  return (setlist.sets?.set || []).reduce((n, s) => n + (s.song?.length || 0), 0)
}

export function allSongs(setlist: Setlist): SetlistSong[] {
  return (setlist.sets?.set || []).flatMap((s) => s.song || [])
}

// Lowercase, strip accents and punctuation. Used for loose text filtering.
export function normalizeText(input: string): string {
  return (input || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
