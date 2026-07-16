<script setup lang="ts">
const { toasts, dismiss } = useToast();
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2 px-4"
  >
    <TransitionGroup name="toast">
      <button
        v-for="t in toasts"
        :key="t.id"
        class="toast pointer-events-auto"
        :class="`toast--${t.kind}`"
        @click="dismiss(t.id)"
      >
        {{ t.message }}
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast {
  max-width: 90vw;
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.95rem;
  text-align: left;
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  border: 2px solid var(--color-espresso);
  box-shadow: var(--shadow-pop);
  cursor: pointer;
}
.toast--info {
  background: var(--color-mustard);
  color: var(--color-espresso);
}
.toast--success {
  background: var(--color-teal);
  color: var(--color-paper);
}
.toast--error {
  background: var(--color-burnt);
  color: var(--color-paper);
}
.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>
