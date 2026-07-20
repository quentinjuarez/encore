<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy - Encore',
  description: 'How Encore handles your data. Short version: it barely touches any.',
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

    <h1 class="mt-4 font-display text-3xl font-bold text-espresso sm:text-4xl">Privacy Policy</h1>
    <p class="mt-1 font-mono text-xs text-cocoa">Last updated 20 July 2026</p>

    <div class="prose mt-6">
      <p>
        Encore is a personal, non-commercial project that turns concert setlists into Spotify
        playlists. It is built to hold as little of your data as possible. There is no database and
        no user account.
      </p>

      <h2>What Encore accesses</h2>
      <p>
        When you choose to connect Spotify, Encore asks Spotify for permission to create and edit
        your private playlists (the <strong>playlist-modify-private</strong> scope) and to read your
        display name so it can greet you. That is the only access it requests.
      </p>

      <h2>What Encore stores</h2>
      <p>
        Your Spotify access and refresh tokens are kept in a single encrypted, http-only session
        cookie in your browser. They are never written to a database or shared. The cookie is
        removed when you sign out. Encore does not store the setlists you view or the playlists you
        create; they live in your Spotify account, not here.
      </p>

      <h2>What Encore does not do</h2>
      <ul>
        <li>No analytics, tracking pixels, or advertising.</li>
        <li>No selling or sharing of your data.</li>
        <li>No training of machine-learning models on Spotify content.</li>
        <li>No caching of Spotify content beyond the moment it is shown to you.</li>
      </ul>

      <h2>Third parties</h2>
      <p>
        Setlist data comes from
        <a href="https://www.setlist.fm" target="_blank" rel="noopener noreferrer">setlist.fm</a>
        and playlists are created through
        <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">Spotify</a>.
        Your use of Spotify is also governed by
        <a
          href="https://www.spotify.com/legal/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          >Spotify's Privacy Policy</a
        >.
      </p>

      <h2>Cookies</h2>
      <p>
        Encore sets one essential cookie: the encrypted session described above. There are no
        tracking or advertising cookies, so there is no consent banner to click through.
      </p>

      <h2>Your choices</h2>
      <p>
        Sign out at any time to clear the session cookie. You can also revoke Encore's access
        entirely from your
        <a href="https://www.spotify.com/account/apps/" target="_blank" rel="noopener noreferrer"
          >Spotify account under Apps</a
        >.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email
        <a href="mailto:contact@quentinjuarez.dev">contact@quentinjuarez.dev</a>.
      </p>

      <p>
        Encore is not affiliated with, endorsed, or certified by Spotify or setlist.fm. This policy
        may change; the date above reflects the latest revision.
      </p>
    </div>
  </div>
</template>
