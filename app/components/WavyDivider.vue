<script setup lang="ts">
withDefaults(defineProps<{ color?: string; flip?: boolean }>(), {
  color: '#fbf6e7',
  flip: false,
});
</script>

<template>
  <svg
    class="block h-10 w-full"
    :class="{ 'rotate-180': flip }"
    viewBox="0 0 1200 60"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d="M0,32 C150,64 330,4 600,30 C860,54 1050,2 1200,30 L1200,60 L0,60 Z" :fill="color" />
  </svg>
</template>
