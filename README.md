# Encore

Turn a live concert setlist into a Spotify playlist. Search a band, pick the
show you went to, and Encore rebuilds that setlist as a playlist in your own
Spotify account, song for song.

Setlists come from [setlist.fm](https://www.setlist.fm); playlists are written
through the [Spotify Web API](https://developer.spotify.com). A personal,
non-commercial project.

## Stack

- Nuxt 4 + TypeScript, deployed on Vercel
- `nuxt-auth-utils` for Spotify OAuth in a sealed cookie session (no database)
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

1. `/search` proxies setlist.fm artist search (the API key stays server-side).
2. `/artist/[mbid]` lists that artist's setlists.
3. `/setlist/[id]` shows the songs and, once you connect Spotify, resolves each
   song to a real Spotify track (`server/api/spotify/resolve.post.ts`), lets you
   untick bad matches, then creates the playlist.

The song-to-track matching heuristic lives in `lib/match.js` and is covered by
`scripts/test-match.mjs`.

## Deploy

Runs on Vercel at `https://encore.quentinjuarez.dev`. Push to GitHub, import the
repo in Vercel, set the same environment variables (with
`NUXT_PUBLIC_SITE_URL=https://encore.quentinjuarez.dev`), and add
`https://encore.quentinjuarez.dev/auth/spotify` as a redirect URI in the Spotify
app.

## Spotify access

The Spotify app runs in Development Mode, which allows up to 5 allowlisted
Spotify accounts (the owner must have Premium). Extended Quota Mode, which would
lift that cap, is only available to organizations, so this personal build stays
invite-only by design. See `docs/spotify-compliance.md` for the compliance
notes and app-profile details.
