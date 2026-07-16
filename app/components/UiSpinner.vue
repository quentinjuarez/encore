<script setup lang="ts">
withDefaults(defineProps<{ size?: number; label?: string }>(), { size: 28, label: 'Loading' });
</script>

<template>
  <svg
    :style="{ width: `${size}px`, height: `${size}px`, animationDuration: '1s' }"
    viewBox="0 0 24 24"
    class="spin-slow"
    role="status"
    :aria-label="label"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.2"
      stroke-width="3"
    />
    <path
      d="M12 3 a9 9 0 0 1 9 9"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</template>
