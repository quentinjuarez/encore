<script setup lang="ts">
withDefaults(defineProps<{ size?: number; showWord?: boolean; tone?: 'ink' | 'cream' }>(), {
  size: 40,
  showWord: true,
  tone: 'ink',
})
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <svg :style="{ width: `${size}px`, height: `${size}px` }" viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="#2b2118" />
      <g transform="rotate(-7 256 256)">
        <rect x="88" y="168" width="336" height="176" rx="28" fill="#f5ecd7" />
        <circle cx="306" cy="168" r="15" fill="#2b2118" />
        <circle cx="306" cy="344" r="15" fill="#2b2118" />
        <line
          x1="306"
          y1="192"
          x2="306"
          y2="320"
          stroke="#2b2118"
          stroke-width="6"
          stroke-dasharray="2 17"
          stroke-linecap="round"
        />
        <rect x="126" y="196" width="34" height="120" rx="17" fill="#e0662e" />
        <rect x="150" y="196" width="118" height="32" rx="16" fill="#e0662e" />
        <rect x="150" y="240" width="92" height="32" rx="16" fill="#e0662e" />
        <rect x="150" y="284" width="70" height="32" rx="16" fill="#e0662e" />
        <path d="M348 230 L348 282 L392 256 Z" fill="#e7b84b" />
      </g>
    </svg>
    <span
      v-if="showWord"
      class="font-display text-2xl font-semibold tracking-tight"
      :class="tone === 'cream' ? 'text-cream' : 'text-espresso'"
      >Encore</span
    >
  </span>
</template>
