<template>
  <footer class="mt-20">
    <WavyDivider color="#2b2118" />
    <div class="bg-espresso text-cream">
      <div class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:flex-row sm:justify-between">
        <div class="max-w-sm">
          <Logo :size="34" tone="cream" />
          <p class="mt-3 text-sm leading-relaxed text-cream/70">
            Encore turns the setlist from a show you loved into a Spotify playlist you can keep.
            Search a band, pick a night, relive it.
          </p>
        </div>
        <div class="text-sm text-cream/70">
          <p class="font-display text-base font-semibold text-mustard">Built on</p>
          <ul class="mt-2 space-y-1">
            <li>
              Setlists from
              <a
                href="https://www.setlist.fm"
                class="underline decoration-mustard underline-offset-2"
                >setlist.fm</a
              >
            </li>
            <li>
              Playlists via
              <a
                href="https://developer.spotify.com"
                class="underline decoration-mustard underline-offset-2"
                >Spotify</a
              >
            </li>
          </ul>
          <p class="mt-4 text-xs text-cream/50">
            A personal, non-commercial project. Not affiliated with setlist.fm or Spotify.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
