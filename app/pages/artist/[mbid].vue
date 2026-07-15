<script setup lang="ts">
const route = useRoute()
const mbid = computed(() => String(route.params.mbid))
const page = computed(() => Number(route.query.p) || 1)

const { data, pending, error } = await useFetch(() => `/api/artist/${mbid.value}/setlists`, {
  query: { p: page },
  watch: [page],
})

const artistName = computed(() => data.value?.setlists?.[0]?.artist?.name || 'This artist')
const hasNext = computed(() => (data.value?.page ?? 1) * (data.value?.itemsPerPage ?? 20) < (data.value?.total ?? 0))

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

    <div v-if="pending" class="flex justify-center py-20 text-burnt">
      <UiSpinner :size="36" label="Loading shows" />
    </div>

    <EmptyState
      v-else-if="error"
      icon="ph:warning-bold"
      title="Couldn't load shows"
      message="setlist.fm didn't answer. Try again in a moment."
    />

    <template v-else>
      <header class="mt-4">
        <p class="font-mono text-sm uppercase tracking-widest text-teal">Shows</p>
        <h1 class="mt-1 font-display text-3xl font-bold text-espresso sm:text-4xl">{{ artistName }}</h1>
      </header>

      <div v-if="data?.setlists?.length" class="mt-8 grid gap-4 sm:grid-cols-2">
        <SetlistCard v-for="s in data.setlists" :key="s.id" :setlist="s" />
      </div>

      <EmptyState
        v-else
        icon="ph:calendar-x"
        title="No setlists yet"
        message="Nobody has logged a setlist for this artist on setlist.fm."
      />

      <nav v-if="data?.setlists?.length && (page > 1 || hasNext)" class="mt-10 flex items-center justify-between">
        <UiButton v-if="page > 1" variant="secondary" :to="{ path: `/artist/${mbid}`, query: { p: page - 1 } }">
          <Icon name="ph:arrow-left-bold" size="18" /> Newer
        </UiButton>
        <span v-else />
        <span class="font-mono text-sm text-cocoa">Page {{ data?.page ?? page }}</span>
        <UiButton v-if="hasNext" variant="secondary" :to="{ path: `/artist/${mbid}`, query: { p: page + 1 } }">
          Older <Icon name="ph:arrow-right-bold" size="18" />
        </UiButton>
        <span v-else />
      </nav>
    </template>
  </div>
</template>
