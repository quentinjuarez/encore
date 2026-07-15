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

```bash
pnpm install
cp .env.example .env   # then fill it in
pnpm dev
```

Fill `.env` with:

- `NUXT_SETLISTFM_API_KEY` - register a free key at api.setlist.fm (non-commercial).
- `NUXT_OAUTH_SPOTIFY_CLIENT_ID` / `NUXT_OAUTH_SPOTIFY_CLIENT_SECRET` - create an app at
  developer.spotify.com and add the redirect URIs `http://localhost:3000/auth/spotify`
  and `https://YOUR_DOMAIN/auth/spotify`.
- `NUXT_SESSION_PASSWORD` - any 32+ character secret (`openssl rand -base64 32`).
- `NUXT_PUBLIC_SITE_URL` - used for canonical and Open Graph tags.

## Scripts

```bash
pnpm dev          # dev server
pnpm build        # production build (Vercel preset auto-detected)
pnpm test         # run the matching self-check
pnpm typecheck    # vue-tsc
pnpm assets       # regenerate icons + OG image from app/assets/brand/*.svg
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

Push to GitHub, import the repo in Vercel, set the same environment variables,
and add your production `/auth/spotify` redirect URI to the Spotify app.
