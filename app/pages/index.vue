<script setup lang="ts">
const { public: pub } = useRuntimeConfig();
const site = pub.siteUrl;

useSeoMeta({
  title: 'Encore - turn concert setlists into Spotify playlists',
  titleTemplate: null,
  description:
    'Search a band, pick the exact show you went to, and Encore rebuilds that setlist as a playlist in your own Spotify account.',
  ogTitle: 'Encore',
  ogDescription: 'Turn concert setlists into Spotify playlists.',
  ogType: 'website',
  ogUrl: site,
  ogImage: `${site}/og.png`,
  twitterCard: 'summary_large_image',
});

// Spotify OAuth bounces failures back here with ?auth=failed.
const route = useRoute();
onMounted(() => {
  if (route.query.auth === 'failed') {
    useToast().error('Spotify connection was cancelled or failed. Try again.');
  }
});

const suggestions = ['Radiohead', 'Fleetwood Mac', 'Tame Impala'];

const steps = [
  {
    icon: 'ph:magnifying-glass-bold',
    title: 'Find the show',
    body: 'Search any band and pick the exact night you were there, venue, city and date.',
  },
  {
    icon: 'ph:waveform-bold',
    title: 'We match every song',
    body: 'Encore finds each track on Spotify and honestly flags anything it is not sure about.',
  },
  {
    icon: 'ph:spotify-logo-fill',
    title: 'Keep the playlist',
    body: 'One tap and the whole set lands in your Spotify, ready for the drive home.',
  },
];
</script>

<template>
  <div>
    <!-- Hero -->
    <section
      class="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-8 pt-12 md:grid-cols-2 md:pt-20"
    >
      <div>
        <p
          class="inline-flex items-center gap-1.5 font-mono text-sm font-bold uppercase tracking-widest text-teal"
        >
          Setlist <Icon name="ph:arrow-right-bold" size="14" /> Playlist
        </p>
        <h1
          class="mt-3 font-display text-4xl font-bold leading-[1.02] text-espresso sm:text-5xl md:text-6xl"
        >
          The show doesn't have to end when the lights come up.
        </h1>
        <p class="mt-4 max-w-md text-lg text-cocoa">
          Encore rebuilds the setlist from a gig you loved as a Spotify
          playlist, song for song.
        </p>

        <div class="mt-7 max-w-md">
          <SearchBar big />
          <div class="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span class="text-cocoa">Try</span>
            <NuxtLink
              v-for="s in suggestions"
              :key="s"
              :to="{ path: '/search', query: { q: s } }"
              class="rounded-full border-2 border-espresso bg-paper px-3 py-1 font-medium text-espresso transition-transform hover:-translate-y-0.5"
            >
              {{ s }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Signature: a roadie's setlist sheet, taped to the page -->
      <div class="relative mx-auto w-full max-w-sm">
        <div
          class="absolute -left-3 -top-3 h-16 w-24 -rotate-6 rounded bg-mustard/70 shadow"
          aria-hidden="true"
        />
        <div
          class="setlist-sheet -rotate-1 rounded-2xl border-2 border-espresso p-6"
        >
          <p class="font-mono text-xs uppercase tracking-widest text-cocoa">
            Red Rocks · 2025
          </p>
          <p class="mt-1 font-display text-2xl font-bold text-espresso">
            The Encore Band
          </p>
          <ol class="mt-4">
            <li
              v-for="(t, i) in [
                'Golden Hour',
                'Paper Moon',
                'Reverb City',
                'Cream Soda',
                'Afterglow',
              ]"
              :key="t"
              class="flex items-baseline gap-3 py-1.5"
            >
              <span class="w-6 text-right font-mono text-sm text-burnt">{{
                String(i + 1).padStart(2, '0')
              }}</span>
              <span class="font-medium text-espresso">{{ t }}</span>
            </li>
          </ol>
          <div
            class="mt-4 flex items-center gap-2 rounded-full border-2 border-espresso bg-burnt px-4 py-2 font-display font-semibold text-paper"
          >
            <Icon name="ph:spotify-logo-fill" size="20" /> Add to Spotify
          </div>
        </div>
      </div>
    </section>

    <WavyDivider color="#fbf6e7" />

    <!-- How it works -->
    <section id="how" class="scroll-mt-20 bg-paper py-16">
      <div class="mx-auto max-w-5xl px-4">
        <h2
          class="text-center font-display text-3xl font-bold text-espresso sm:text-4xl"
        >
          Three steps, one souvenir
        </h2>
        <ol class="mt-10 grid gap-6 md:grid-cols-3">
          <li v-for="(step, i) in steps" :key="step.title">
            <UiCard tone="cream" class="h-full">
              <div class="p-6">
                <div class="flex items-center gap-3">
                  <span class="font-display text-4xl font-bold text-mustard">{{
                    String(i + 1).padStart(2, '0')
                  }}</span>
                  <span
                    class="grid h-11 w-11 place-items-center rounded-full border-2 border-espresso bg-cream"
                  >
                    <Icon :name="step.icon" size="22" class="text-espresso" />
                  </span>
                </div>
                <h3
                  class="mt-4 font-display text-xl font-semibold text-espresso"
                >
                  {{ step.title }}
                </h3>
                <p class="mt-1 text-cocoa">{{ step.body }}</p>
              </div>
            </UiCard>
          </li>
        </ol>
      </div>
    </section>

    <WavyDivider color="#fbf6e7" flip />

    <!-- CTA -->
    <section class="mx-auto max-w-3xl px-4 py-16 text-center">
      <h2 class="font-display text-3xl font-bold text-espresso sm:text-4xl">
        Which show do you miss?
      </h2>
      <p class="mx-auto mt-3 max-w-md text-cocoa">
        Find the band, pick the night, and take the setlist home with you.
      </p>
      <div class="mx-auto mt-6 max-w-md">
        <SearchBar big />
      </div>
    </section>
  </div>
</template>
