<script setup lang="ts">
const route = useRoute()
const q = computed(() => String(route.query.q || '').trim())

const { data, pending, error } = await useFetch('/api/artists', {
  query: { q },
  watch: [q],
})

useSeoMeta({
  title: () => (q.value ? `${q.value} - Encore` : 'Search - Encore'),
  robots: 'noindex',
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10">
    <SearchBar :initial="q" />

    <div class="mt-8">
      <div v-if="pending" class="flex justify-center py-16 text-burnt">
        <UiSpinner :size="36" label="Searching" />
      </div>

      <EmptyState
        v-else-if="error"
        icon="ph:warning-bold"
        title="Search hiccuped"
        message="We couldn't reach setlist.fm just now. Give it another go in a moment."
      />

      <template v-else-if="q">
        <div v-if="data?.artists?.length" class="flex flex-col gap-3">
          <ArtistResult v-for="a in data.artists" :key="a.mbid" :artist="a" />
        </div>
        <EmptyState
          v-else
          icon="ph:magnifying-glass"
          title="No artists found"
          :message="`Nothing came back for '${q}'. Check the spelling and try again.`"
        />
      </template>

      <EmptyState
        v-else
        icon="ph:music-notes"
        title="Find a band"
        message="Type an artist name above to dig up their shows."
      />
    </div>
  </div>
</template>
