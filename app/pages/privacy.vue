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
        Encore is a personal, non-commercial project that turns concert setlists into playlists on
        Spotify or Deezer. It is built to hold as little of your data as possible. There is no
        database and no user account.
      </p>

      <h2>What Encore accesses</h2>
      <p>
        You choose which music service to connect. On Spotify, Encore requests the
        <strong>playlist-modify-private</strong> scope (to create your private playlists) and your
        display name. On Deezer, it requests the <strong>manage_library</strong> permission (to
        create playlists) and basic profile. Those are the only permissions it asks for, and only
        for the service you connect.
      </p>

      <h2>What Encore stores</h2>
      <p>
        The access (and, for Spotify, refresh) tokens for the service you connect are kept in a
        single encrypted, http-only session cookie in your browser. They are never written to a
        database or shared. The cookie is removed when you sign out. Encore does not store the
        setlists you view or the playlists you create; they live in your music account, not here.
      </p>

      <h2>What Encore does not do</h2>
      <ul>
        <li>No analytics, tracking pixels, or advertising.</li>
        <li>No selling or sharing of your data.</li>
        <li>No training of machine-learning models on the content it fetches.</li>
        <li>No caching of that content beyond the moment it is shown to you.</li>
      </ul>

      <h2>Third parties</h2>
      <p>
        Setlist data comes from
        <a href="https://www.setlist.fm" target="_blank" rel="noopener noreferrer">setlist.fm</a>,
        and playlists are created through
        <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">Spotify</a> or
        <a href="https://www.deezer.com" target="_blank" rel="noopener noreferrer">Deezer</a>
        depending on what you connect. Your use of those services is also governed by
        <a
          href="https://www.spotify.com/legal/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          >Spotify's</a
        >
        and
        <a
          href="https://www.deezer.com/legal/personal-datas"
          target="_blank"
          rel="noopener noreferrer"
          >Deezer's</a
        >
        privacy policies.
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
        >
        or your Deezer account settings.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email
        <a href="mailto:contact@quentinjuarez.dev">contact@quentinjuarez.dev</a>.
      </p>

      <p>
        Encore is not affiliated with, endorsed, or certified by Spotify, Deezer, or setlist.fm.
        This policy may change; the date above reflects the latest revision.
      </p>
    </div>
  </div>
</template>
