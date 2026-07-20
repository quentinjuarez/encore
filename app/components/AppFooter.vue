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
        <div class="flex gap-12 text-sm text-cream/70">
          <div>
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
                  href="https://www.spotify.com"
                  class="underline decoration-mustard underline-offset-2"
                  >Spotify</a
                >
              </li>
            </ul>
          </div>
          <div>
            <p class="font-display text-base font-semibold text-mustard">Legal</p>
            <ul class="mt-2 space-y-1">
              <li>
                <NuxtLink to="/privacy" class="underline decoration-mustard underline-offset-2"
                  >Privacy</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/terms" class="underline decoration-mustard underline-offset-2"
                  >Terms</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-5xl px-4 pb-10">
        <p class="text-xs text-cream/50">
          A personal, non-commercial project. Encore is not affiliated with, endorsed, or certified
          by Spotify or setlist.fm.
        </p>
      </div>
    </div>
  </footer>
</template>
