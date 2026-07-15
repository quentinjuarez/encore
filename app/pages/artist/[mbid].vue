<script setup lang="ts">
const route = useRoute()
const mbid = computed(() => String(route.params.mbid))

const page = ref(1)
const filter = ref('')
const applied = ref('') // debounced value that actually drives the query

let timer: ReturnType<typeof setTimeout>
watch(filter, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    applied.value = v.trim()
    page.value = 1
  }, 350)
})

// A 4-digit token is treated as the year; the rest is the city.
const year = computed(() => (applied.value.match(/\b(19|20)\d{2}\b/) || [''])[0])
const city = computed(() => applied.value.replace(/\b(19|20)\d{2}\b/, '').replace(/\s+/g, ' ').trim())

const { data, pending, error } = await useFetch(() => `/api/artist/${mbid.value}/setlists`, {
  query: { p: page, year, city },
  watch: [page, year, city],
})

// Keep the artist name even when a filter returns nothing.
const artistName = ref('This artist')
watchEffect(() => {
  const name = data.value?.setlists?.[0]?.artist?.name
  if (name) artistName.value = name
})

const hasNext = computed(() => (data.value?.page ?? 1) * (data.value?.itemsPerPage ?? 20) < (data.value?.total ?? 0))

watch(page, () => {
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
})

useSeoMeta({
  title: () => `${artistName.value} setlists - Encore`,
  robots: 'noindex',
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10">
    <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm font-semibold text-cocoa hover:text-espresso">
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
        <h1 class="mt-1 font-display text-3xl font-bold text-espresso sm:text-4xl">{{ artistName }}</h1>
      </header>

      <div class="mt-5 flex max-w-sm items-center gap-2 rounded-full border-2 border-espresso bg-paper px-4 py-2">
        <Icon name="ph:funnel-bold" size="16" class="shrink-0 text-cocoa" />
        <input
          v-model="filter"
          type="search"
          placeholder="Filter by year or city"
          aria-label="Filter shows by year or city"
          class="min-w-0 flex-1 bg-transparent text-sm text-espresso outline-none placeholder:text-cocoa/70"
        />
        <UiSpinner v-if="pending" :size="16" label="Filtering" class="shrink-0 text-burnt" />
      </div>

      <div v-if="pending && !data" class="flex justify-center py-20 text-burnt">
        <UiSpinner :size="36" label="Loading shows" />
      </div>

      <template v-else>
        <div v-if="data?.setlists?.length" class="mt-8 flex flex-col gap-3">
          <SetlistCard v-for="s in data.setlists" :key="s.id" :setlist="s" />
        </div>

        <EmptyState
          v-else
          icon="ph:calendar-x"
          :title="applied ? 'No shows match that filter' : 'No setlists yet'"
          :message="
            applied
              ? `Nothing for '${applied}'. Try a different year or city.`
              : 'Nobody has logged a setlist for this artist on setlist.fm.'
          "
        />

        <nav v-if="data?.setlists?.length && (page > 1 || hasNext)" class="mt-10 flex items-center justify-between">
          <UiButton v-if="page > 1" variant="secondary" @click="page--">
            <Icon name="ph:arrow-left-bold" size="18" /> Newer
          </UiButton>
          <span v-else />
          <span class="font-mono text-sm text-cocoa">Page {{ data?.page ?? page }}</span>
          <UiButton v-if="hasNext" variant="secondary" @click="page++">
            Older <Icon name="ph:arrow-right-bold" size="18" />
          </UiButton>
          <span v-else />
        </nav>
      </template>
    </template>
  </div>
</template>
