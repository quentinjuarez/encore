<script setup lang="ts">
defineProps<{ index: number; song: SetlistSong }>()
</script>

<template>
  <li class="flex items-baseline gap-3 py-1.5">
    <span class="w-7 shrink-0 text-right font-mono text-sm text-burnt">{{ String(index).padStart(2, '0') }}</span>
    <span class="font-medium text-espresso">{{ song.name || 'Untitled' }}</span>
    <span v-if="song.cover" class="badge">{{ song.cover.name }} cover</span>
    <span v-if="song.tape" class="badge badge--muted">tape</span>
  </li>
</template>
