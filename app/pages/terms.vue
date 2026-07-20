<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Use - Encore',
  description: 'The plain terms for using Encore, a free, non-commercial project.',
});
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-12">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-1 text-sm font-semibold text-cocoa hover:text-espresso"
    >
      <Icon name="ph:arrow-left-bold" size="16" /> Home
    </NuxtLink>

    <h1 class="mt-4 font-display text-3xl font-bold text-espresso sm:text-4xl">Terms of Use</h1>
    <p class="mt-1 font-mono text-xs text-cocoa">Last updated 20 July 2026</p>

    <div class="prose mt-6">
      <p>
        Encore is a free, non-commercial hobby project. By using it you agree to these terms. They
        are intentionally short.
      </p>

      <h2>What Encore is</h2>
      <p>
        Encore helps you rebuild a concert setlist as a playlist in your own Spotify account. It is
        provided as is, with no warranty and no guarantee of availability, accuracy, or fitness for
        any purpose. Setlist data is community-sourced from setlist.fm and may be incomplete, and
        track matching is a best effort you are asked to review before saving.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Use Encore for your own personal, non-commercial listening.</li>
        <li>Do not abuse, overload, scrape, or attempt to break the service or its providers.</li>
        <li>
          Respect the terms of Spotify and setlist.fm while using their content through Encore.
        </li>
      </ul>

      <h2>Content and attribution</h2>
      <p>
        Setlists are provided by
        <a href="https://www.setlist.fm" target="_blank" rel="noopener noreferrer">setlist.fm</a>
        and track data by
        <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">Spotify</a>. All
        trademarks and content belong to their respective owners. Encore claims no ownership of
        them.
      </p>

      <h2>Liability</h2>
      <p>
        Encore is offered without charge and without warranty. To the extent permitted by law, the
        author is not liable for any loss arising from its use, including anything that happens to
        your Spotify library. You use it at your own discretion.
      </p>

      <h2>Not affiliated</h2>
      <p>
        Encore is an independent project. It is not affiliated with, endorsed, or certified by
        Spotify or setlist.fm.
      </p>

      <h2>Contact</h2>
      <p>
        Reach out at <a href="mailto:contact@quentinjuarez.dev">contact@quentinjuarez.dev</a>. These
        terms may change; the date above reflects the latest revision.
      </p>
    </div>
  </div>
</template>
