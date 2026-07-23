<script setup lang="ts">
const { loggedIn, session, clear } = useUserSession();
</script>

<template>
  <header class="sticky top-0 z-50 border-b-2 border-espresso/90 bg-cream/85 backdrop-blur">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <NuxtLink to="/" aria-label="Encore home" class="shrink-0">
        <Logo :size="38" />
      </NuxtLink>

      <nav class="flex items-center gap-2 sm:gap-4">
        <NuxtLink
          to="/#how"
          class="hidden font-semibold text-cocoa transition-colors hover:text-espresso sm:inline"
        >
          How it works
        </NuxtLink>
        <template v-if="loggedIn">
          <span
            v-if="session?.deezer"
            class="hidden items-center gap-1.5 rounded-full border-2 border-espresso bg-teal px-3 py-1 text-sm font-bold text-paper sm:inline-flex"
          >
            <DeezerMark :size="16" />
            {{ session.deezer.name || 'Deezer' }}
          </span>
          <span
            v-if="session?.spotify"
            class="hidden items-center gap-1.5 rounded-full border-2 border-espresso bg-teal px-3 py-1 text-sm font-bold text-paper sm:inline-flex"
          >
            <SpotifyMark :size="16" />
            {{ session.spotify.name || 'Spotify' }}
          </span>
          <UiButton variant="ghost" @click="clear()">Sign out</UiButton>
        </template>
      </nav>
    </div>
  </header>
</template>
