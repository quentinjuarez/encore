# Encore - Spotify compliance notes

A reference showing how Encore complies with the Spotify Developer Policy and
Design Guidelines, plus the app-profile details for the Spotify dashboard.
Encore is a free, non-commercial personal project.

## Access model (current reality)

- The Spotify app runs in **Development Mode**: up to **5 allowlisted** Spotify
  accounts, and the app owner must have Spotify Premium.
- **Extended Quota Mode** (which lifts the cap) is only granted to organizations
  (registered business, 250k+ MAU, key-market availability, ~6-week review), so
  an individual project cannot obtain it. Encore therefore stays invite-only by
  design and communicates this to users (a clear message on failed connect).
- No quota submission is pending or implied; this document exists to keep the
  app demonstrably compliant and professional.

## Developer Policy compliance

| Requirement                                | How Encore complies                                                                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Minimal scope                              | Requests only `playlist-modify-private` (creates private playlists).                                                                                   |
| No unauthorized data storage               | Stateless. Spotify tokens live only in an encrypted, http-only session cookie; no database; cleared on sign out.                                       |
| No caching of content beyond immediate use | Setlist and track data are fetched per request and rendered; nothing is persisted or cached server-side.                                               |
| No ML training on Spotify content          | None. Stated in the privacy policy.                                                                                                                    |
| Attribution of Spotify content             | Track matches are labelled "Matches from Spotify" with the Spotify logo, and each matched track links to `open.spotify.com`.                           |
| No implied endorsement                     | "Encore is not affiliated with, endorsed, or certified by Spotify" appears in the footer, privacy, and terms. The app name does not contain "Spotify". |
| Rate limiting                              | Server retries on HTTP 429 with exponential backoff, honoring `Retry-After`.                                                                           |
| Current endpoints                          | Uses `POST /me/playlists` and `POST /playlists/{id}/items` (post Feb 2026 migration); no deprecated endpoints.                                         |
| User transparency and control              | Published privacy policy and terms; users can sign out (clears the cookie) or revoke access from their Spotify account.                                |

## Design / branding compliance

- The Spotify logo is used unaltered via a dedicated `SpotifyMark` component:
  Spotify green on light surfaces, white (monochrome) on the coloured button,
  never recoloured into brand tones, stretched, or rotated.
- Links to Spotify content use approved wording ("Open Spotify") and open the
  Spotify app/site.
- Content shown from Spotify (album art, track title/artist) is attributed and
  links back to Spotify.

## App profile (paste into the Spotify dashboard)

- **Name:** Encore
- **Description:** Encore is a free, non-commercial project that turns a live
  concert setlist (from setlist.fm) into a playlist in your own Spotify account.
  You search an artist, pick a show, review the matched tracks, and save them as
  a private playlist.
- **Website:** https://encore.quentinjuarez.dev
- **Redirect URIs:**
  - https://encore.quentinjuarez.dev/auth/spotify
  - http://127.0.0.1:3000/auth/spotify (local development)
- **APIs used:** Web API
- **Scopes:** `playlist-modify-private`
- **Privacy policy:** https://encore.quentinjuarez.dev/privacy
- **Terms of use:** https://encore.quentinjuarez.dev/terms

## Not covered

Not commercial, no accounts or database, no analytics, single music provider
(Spotify).
