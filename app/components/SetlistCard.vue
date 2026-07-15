<script setup lang="ts">
const props = defineProps<{ setlist: Setlist }>()

const songs = computed(() => countSongs(props.setlist))
const date = computed(() => formatSetlistDate(props.setlist.eventDate))
const location = computed(() =>
  [props.setlist.venue?.city?.name, props.setlist.venue?.city?.country?.code].filter(Boolean).join(', '),
)
</script>

<template>
  <NuxtLink :to="`/setlist/${setlist.id}`" class="block">
    <UiCard interactive>
      <div class="flex items-center gap-3 p-4 sm:gap-4 sm:px-5">
        <p class="w-24 shrink-0 font-mono text-xs text-burnt sm:text-sm">{{ date }}</p>
        <div class="min-w-0 flex-1">
          <h3 class="truncate font-display text-base font-semibold text-espresso sm:text-lg">
            {{ setlist.venue?.name || 'Unknown venue' }}
          </h3>
          <p class="truncate text-sm text-cocoa">
            {{ location }}<span v-if="setlist.tour?.name"> &middot; {{ setlist.tour.name }}</span>
          </p>
        </div>
        <span v-if="songs" class="badge shrink-0">{{ songs }} songs</span>
        <span v-else class="shrink-0 text-xs text-cocoa/70">no songs</span>
        <Icon name="ph:arrow-right-bold" size="18" class="shrink-0 text-burnt" />
      </div>
    </UiCard>
  </NuxtLink>
</template>
