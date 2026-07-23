# Encore

Turn a live concert setlist into a Spotify playlist. Search a band, pick the show
you went to, and Encore rebuilds that setlist as a playlist in your own account,
song for song.

Setlists come from [setlist.fm](https://www.setlist.fm); playlists are written
through the [Spotify Web API](https://developer.spotify.com). A personal,
non-commercial project. The backend is provider-generic and Deezer is fully
wired, but the UI ships Spotify-only because Deezer has closed new API apps (see
Music providers below).

## Stack

- Nuxt 4 + TypeScript, deployed on Vercel
- Provider abstraction: Spotify (OAuth via `nuxt-auth-utils`) and Deezer (custom
  OAuth handler, currently dormant), tokens in a sealed cookie session (no database)
- Tailwind CSS v4 with a small custom design system (70s cream + soul)
- `@nuxt/icon` (Phosphor) and `@nuxt/fonts` (self-hosted, no CDN)

## Setup

Uses Yarn 3.8.6 (Berry) via Corepack. Run `corepack enable` once, then:

```bash
yarn install
cp .env.example .env   # then fill it in
yarn dev
```

Fill `.env` with:

- `NUXT_SETLISTFM_API_KEY` - register a free key at api.setlist.fm (non-commercial).
- `NUXT_OAUTH_SPOTIFY_CLIENT_ID` / `NUXT_OAUTH_SPOTIFY_CLIENT_SECRET` - create an app at
  developer.spotify.com and add the redirect URIs `http://127.0.0.1:3000/auth/spotify`
  and `https://YOUR_DOMAIN/auth/spotify`. Spotify requires HTTPS and only permits http
  on the `127.0.0.1` loopback, so browse the app locally at `http://127.0.0.1:3000`, not
  `localhost`.
- `NUXT_DEEZER_APP_ID` / `NUXT_DEEZER_SECRET` - create an app at
  developers.deezer.com/myapps, set its application domain to your host, and its redirect
  URL to `https://YOUR_DOMAIN/auth/deezer` (plus `http://localhost:3000/auth/deezer` for dev).
- `NUXT_SESSION_PASSWORD` - any 32+ character secret (`openssl rand -base64 32`).
- `NUXT_PUBLIC_SITE_URL` - used for canonical and Open Graph tags.

## Scripts

```bash
yarn dev          # dev server
yarn build        # production build (Vercel preset auto-detected)
yarn test         # run the matching self-check
yarn typecheck    # vue-tsc
yarn lint         # oxlint (add --fix, or run: yarn lint:fix)
yarn format       # oxfmt, format in place (yarn format:check to verify)
yarn assets       # regenerate icons + OG image from app/assets/brand/*.svg
```

## How it works

1. `/api/artists` proxies setlist.fm artist search (the API key stays server-side).
2. `/artist/[mbid]` lists that artist's setlists (with a client-side text filter).
3. `/setlist/[id]` shows the songs. You connect Spotify, and the neutral
   `/api/resolve` endpoint matches each song. After you review the matches,
   `/api/create-playlist` builds the playlist.

Providers live behind a small abstraction: `server/utils/spotify.ts` and
`server/utils/deezer.ts` each expose `search` + `createPlaylist`, and the neutral
API routes (`/api/resolve`, `/api/create-playlist`, `/api/search`) dispatch on a
`provider` field. `/api/providers` reports which providers are configured, and
the UI only offers those. The song-to-track scoring is shared in
`server/utils/match.ts` and covered by `scripts/test-match.mjs`.

## Deploy

Runs on Vercel at `https://encore.quentinjuarez.dev`. Push to GitHub, import the
repo in Vercel, set the same environment variables (with
`NUXT_PUBLIC_SITE_URL=https://encore.quentinjuarez.dev`), and add the
`/auth/spotify` and `/auth/deezer` redirect URIs to the Spotify and Deezer apps.

## Music providers

- **Spotify** is the only provider enabled in the UI. It runs in Development Mode
  (up to 5 allowlisted accounts, owner must be Premium); Extended Quota Mode is
  organizations-only, so it stays invite-only by design and is labelled as such.
- **Deezer** is fully implemented in the backend (OAuth, search, playlist
  creation, neutral endpoints) but **disabled in the UI**: Deezer has frozen new
  API app creation, so no credentials can be obtained. The moment `NUXT_DEEZER_APP_ID`
  and `NUXT_DEEZER_SECRET` are set, `/api/providers` reports Deezer as available
  and the provider chooser reappears, no code changes needed.

See `docs/spotify-compliance.md` for the Spotify compliance notes and
app-profile details.
