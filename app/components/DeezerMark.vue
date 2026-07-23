<script setup lang="ts">
// Deezer logo (equalizer mark) drawn with currentColor so it sits correctly on
// any background, mirroring how SpotifyMark is handled.
withDefaults(defineProps<{ size?: number; label?: string }>(), { size: 20, label: '' });
</script>

<template>
  <svg
    :style="{ width: `${size}px`, height: `${size}px` }"
    viewBox="0 0 24 24"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <path
      fill="currentColor"
      d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38h-5.19zm12.54 0v3.027H24V8.38h-5.19zM0 12.594v3.027h5.19v-3.027H0zm6.27 0v3.027h5.189v-3.027h-5.19zm6.271 0v3.027h5.19v-3.027h-5.19zm6.269 0v3.027H24v-3.027h-5.19zM0 16.81v3.03h5.19v-3.03H0zm6.27 0v3.03h5.189v-3.03h-5.19zm6.271 0v3.03h5.19v-3.03h-5.19zm6.269 0v3.03H24v-3.03h-5.19z"
    />
  </svg>
</template>
