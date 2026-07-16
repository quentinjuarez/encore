<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

withDefaults(
  defineProps<{
    to?: RouteLocationRaw;
    href?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    type?: 'button' | 'submit';
    disabled?: boolean;
    block?: boolean;
  }>(),
  { variant: 'primary', type: 'button', disabled: false, block: false },
);

const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <component
    :is="to ? NuxtLink : href ? 'a' : 'button'"
    :to="to || undefined"
    :href="href || undefined"
    :type="to || href ? undefined : type"
    :disabled="!to && !href ? disabled : undefined"
    class="btn"
    :class="[`btn--${variant}`, { 'btn--block': block, 'btn--disabled': disabled }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.02rem;
  line-height: 1;
  border-radius: 999px;
  padding: 0.72rem 1.5rem;
  cursor: pointer;
  border: 2px solid var(--color-espresso);
  box-shadow: var(--shadow-pop);
  text-decoration: none;
  transition:
    transform 0.08s ease,
    box-shadow 0.08s ease;
}
.btn:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 0 var(--color-espresso);
}
.btn--primary {
  background: var(--color-burnt);
  color: var(--color-paper);
}
.btn--secondary {
  background: var(--color-mustard);
  color: var(--color-espresso);
}
.btn--ghost {
  background: transparent;
  color: var(--color-espresso);
  border-color: transparent;
  box-shadow: none;
}
.btn--ghost:active {
  transform: none;
}
.btn--block {
  width: 100%;
}
.btn--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
