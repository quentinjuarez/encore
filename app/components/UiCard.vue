<script setup lang="ts">
withDefaults(defineProps<{ interactive?: boolean; tone?: 'paper' | 'cream' }>(), {
  interactive: false,
  tone: 'paper',
});
</script>

<template>
  <div class="card" :class="[`card--${tone}`, { 'card--interactive': interactive }]">
    <slot />
  </div>
</template>

<style scoped>
.card {
  border: 2px solid var(--color-espresso);
  border-radius: var(--radius-blob);
  box-shadow: var(--shadow-pop);
}
.card--paper {
  background: var(--color-paper);
}
.card--cream {
  background: var(--color-cream);
}
.card--interactive {
  transition:
    transform 0.13s ease,
    box-shadow 0.13s ease;
}
.card--interactive:hover {
  transform: translateY(-3px);
  box-shadow: 0 9px 0 0 var(--color-espresso);
}
</style>
