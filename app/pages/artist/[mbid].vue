<script setup lang="ts">
const route = useRoute();
const toast = useToast();
const mbid = computed(() => String(route.params.mbid));

const shows = ref<Setlist[]>([]);
const total = ref(0);
const loadedPages = ref(0);
const loadingMore = ref(false);

// Page 1 (SSR); further pages are appended client-side via Load more.
const {
  data: first,
  pending,
  error,
} = await useFetch(() => `/api/artist/${mbid.value}/setlists`, {
  query: { p: 1 },
});
watch(
  first,
  (f) => {
    if (f) {
      shows.value = f.setlists;
      total.value = f.total;
      loadedPages.value = 1;
    }
  },
  { immediate: true },
);

const artistName = ref('This artist');
watchEffect(() => {
  const name = shows.value[0]?.artist?.name;
  if (name) artistName.value = name;
});

const hasMore = computed(() => shows.value.length < total.value);

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  try {
    const next = loadedPages.value + 1;
    const res = await $fetch(`/api/artist/${mbid.value}/setlists`, { query: { p: next } });
    const seen = new Set(shows.value.map((s) => s.id));
    shows.value.push(...res.setlists.filter((s) => !seen.has(s.id)));
    total.value = res.total || total.value;
    loadedPages.value = next;
  } catch {
    toast.error('Could not load more shows. Try again.');
  } finally {
    loadingMore.value = false;
  }
}

// Client-side text filter across every field of the loaded shows.
const query = ref('');
function haystack(s: Setlist): string {
  return normalizeText(
    [
      formatSetlistDate(s.eventDate),
      s.eventDate?.split('-')[2],
      s.venue?.name,
      s.venue?.city?.name,
      s.venue?.city?.state,
      s.venue?.city?.country?.name,
      s.venue?.city?.country?.code,
      s.tour?.name,
    ]
      .filter(Boolean)
      .join(' '),
  );
}
const filtered = computed(() => {
  const q = normalizeText(query.value);
  if (!q) return shows.value;
  const tokens = q.split(' ').filter(Boolean);
  return shows.value.filter((s) => {
    const h = haystack(s);
    return tokens.every((t) => h.includes(t));
  });
});

useSeoMeta({
  title: () => `${artistName.value} setlists - Encore`,
  robots: 'noindex',
});
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-1 text-sm font-semibold text-cocoa hover:text-espresso"
    >
      <Icon name="ph:arrow-left-bold" size="16" /> New search
    </NuxtLink>

    <EmptyState
      v-if="error"
      icon="ph:warning-bold"
      title="Couldn't load shows"
      message="setlist.fm didn't answer. Try again in a moment."
    />

    <template v-else>
      <header class="mt-4">
        <p class="font-mono text-sm uppercase tracking-widest text-teal">Shows</p>
        <h1 class="mt-1 font-display text-3xl font-bold text-espresso sm:text-4xl">
          {{ artistName }}
        </h1>
        <p class="mt-1 text-xs text-cocoa">
          Setlists from
          <a
            href="https://www.setlist.fm"
            target="_blank"
            rel="noopener noreferrer"
            class="underline decoration-mustard underline-offset-2"
            >setlist.fm</a
          >
        </p>
      </header>

      <div
        class="mt-5 flex max-w-md items-center gap-2 rounded-full border-2 border-espresso bg-paper px-4 py-2"
      >
        <Icon name="ph:magnifying-glass-bold" size="16" class="shrink-0 text-cocoa" />
        <input
          v-model="query"
          type="search"
          placeholder="Filter by venue, city, tour or year"
          aria-label="Filter shows"
          class="min-w-0 flex-1 bg-transparent text-sm text-espresso outline-none placeholder:text-cocoa/70"
        />
      </div>

      <div v-if="pending && !shows.length" class="flex justify-center py-20 text-burnt">
        <UiSpinner :size="36" label="Loading shows" />
      </div>

      <template v-else>
        <p v-if="shows.length" class="mt-6 font-mono text-xs text-cocoa">
          {{
            query
              ? `${filtered.length} of ${shows.length} loaded`
              : `${shows.length}${hasMore ? '+' : ''} shows`
          }}
        </p>

        <div v-if="filtered.length" class="mt-3 flex flex-col gap-3">
          <SetlistCard v-for="s in filtered" :key="s.id" :setlist="s" />
        </div>

        <EmptyState
          v-else-if="query"
          icon="ph:magnifying-glass"
          title="No loaded shows match"
          :message="
            hasMore
              ? `Nothing loaded matches '${query}'. Load more shows and try again.`
              : `Nothing matches '${query}'.`
          "
        />

        <EmptyState
          v-else
          icon="ph:calendar-x"
          title="No setlists yet"
          message="Nobody has logged a setlist for this artist on setlist.fm."
        />

        <div v-if="hasMore" class="mt-8 flex justify-center">
          <UiButton variant="secondary" :disabled="loadingMore" @click="loadMore">
            <UiSpinner v-if="loadingMore" :size="18" />
            <template v-else>Load more shows</template>
          </UiButton>
        </div>
      </template>
    </template>
  </div>
</template>
