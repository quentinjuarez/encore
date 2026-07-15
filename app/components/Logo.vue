<script setup lang="ts">
withDefaults(defineProps<{ size?: number; showWord?: boolean; spin?: boolean; tone?: 'ink' | 'cream' }>(), {
  size: 40,
  showWord: true,
  spin: false,
  tone: 'ink',
})
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <svg :style="{ width: `${size}px`, height: `${size}px` }" viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="#e0662e" />
      <g :class="{ 'spin-slow': spin }" style="transform-origin: 256px 256px">
        <circle cx="256" cy="256" r="178" fill="#2b2118" />
        <circle cx="256" cy="256" r="146" fill="none" stroke="#f5ecd7" stroke-opacity="0.12" stroke-width="6" />
        <circle cx="256" cy="256" r="116" fill="none" stroke="#f5ecd7" stroke-opacity="0.12" stroke-width="6" />
      </g>
      <circle cx="256" cy="256" r="78" fill="#f5ecd7" />
      <path d="M236 214 L236 298 L312 256 Z" fill="#e0662e" />
    </svg>
    <span
      v-if="showWord"
      class="font-display text-2xl font-semibold tracking-tight"
      :class="tone === 'cream' ? 'text-cream' : 'text-espresso'"
      >Encore</span
    >
  </span>
</template>
