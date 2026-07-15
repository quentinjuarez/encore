<script setup lang="ts">
const props = defineProps<{ setlist: Setlist }>()

const songs = computed(() => countSongs(props.setlist))
const date = computed(() => formatSetlistDate(props.setlist.eventDate))
const city = computed(() => props.setlist.venue?.city?.name)
const country = computed(() => props.setlist.venue?.city?.country?.code)
</script>

<template>
  <NuxtLink :to="`/setlist/${setlist.id}`" class="block">
    <UiCard interactive>
      <div class="p-5">
        <div class="flex items-start justify-between gap-3">
          <p class="font-mono text-sm text-burnt">{{ date }}</p>
          <span v-if="songs" class="badge">{{ songs }} songs</span>
        </div>
        <h3 class="mt-1 font-display text-lg font-semibold leading-tight text-espresso">
          {{ setlist.venue?.name || 'Unknown venue' }}
        </h3>
        <p class="mt-0.5 text-sm text-cocoa">
          {{ [city, country].filter(Boolean).join(', ') }}
        </p>
        <p v-if="setlist.tour?.name" class="mt-2 truncate text-sm text-cocoa">
          <Icon name="ph:path-bold" size="14" class="mr-1 inline align-[-2px] text-teal" />{{ setlist.tour.name }}
        </p>
        <p v-if="!songs" class="mt-2 text-sm text-cocoa/70">No songs listed for this show.</p>
      </div>
    </UiCard>
  </NuxtLink>
</template>
