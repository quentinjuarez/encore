<script setup lang="ts">
defineProps<{ match: TrackMatch }>()
const included = defineModel<boolean>({ default: true })
</script>

<template>
  <li class="flex items-center gap-3 border-t border-sand py-2 first:border-t-0">
    <input
      v-if="match.matched"
      v-model="included"
      type="checkbox"
      class="h-5 w-5 shrink-0 accent-[var(--color-teal)]"
      :aria-label="`Include ${match.song}`"
    />
    <span v-else class="grid h-5 w-5 shrink-0 place-items-center text-burnt" aria-hidden="true">
      <Icon name="ph:x-bold" size="14" />
    </span>

    <img
      v-if="match.albumArt"
      :src="match.albumArt"
      alt=""
      width="44"
      height="44"
      class="h-11 w-11 shrink-0 rounded-lg border-2 border-espresso object-cover"
    />
    <span v-else class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 border-espresso bg-cream">
      <Icon name="ph:music-notes" size="20" class="text-cocoa" />
    </span>

    <span class="min-w-0 flex-1">
      <span class="block truncate font-medium text-espresso">{{ match.song }}</span>
      <span v-if="match.matched" class="block truncate text-sm text-cocoa">
        {{ match.title }} · {{ match.artist }}
      </span>
      <span v-else class="block truncate text-sm text-burnt">No confident match on Spotify</span>
    </span>

    <span v-if="match.isCover" class="badge">cover</span>
  </li>
</template>
