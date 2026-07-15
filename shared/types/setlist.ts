// setlist.fm response shapes, trimmed to the fields Encore uses.
// Placed in shared/ so both server routes and Vue components see the types.

export interface SetlistArtist {
  mbid: string
  name: string
  sortName?: string
  disambiguation?: string
}

export interface SetlistSong {
  name: string
  info?: string
  tape?: boolean
  cover?: { mbid?: string; name: string }
  with?: { name: string }
}

export interface SetlistSet {
  name?: string
  encore?: number
  song: SetlistSong[]
}

export interface SetlistVenue {
  name: string
  city?: { name: string; state?: string; country?: { name: string; code?: string } }
}

export interface Setlist {
  id: string
  eventDate: string // dd-MM-yyyy
  artist: SetlistArtist
  venue: SetlistVenue
  tour?: { name: string }
  sets: { set: SetlistSet[] }
  url: string
}

// One resolved match: a setlist song lined up against a Spotify track.
export interface TrackMatch {
  song: string
  isCover: boolean
  matched: boolean
  uri: string | null
  title: string | null
  artist: string | null
  albumArt: string | null
}
