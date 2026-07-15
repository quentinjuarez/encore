<script setup lang="ts">
defineProps<{ artist: SetlistArtist }>()
</script>

<template>
  <NuxtLink :to="`/artist/${artist.mbid}`" class="block">
    <UiCard interactive>
      <div class="flex items-center gap-4 p-4">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-espresso bg-mustard">
          <Icon name="ph:vinyl-record-fill" size="26" class="text-espresso" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate font-display text-lg font-semibold text-espresso">{{ artist.name }}</span>
          <span v-if="artist.disambiguation" class="block truncate text-sm text-cocoa">
            {{ artist.disambiguation }}
          </span>
        </span>
        <Icon name="ph:arrow-right-bold" size="20" class="shrink-0 text-burnt" />
      </div>
    </UiCard>
  </NuxtLink>
</template>
