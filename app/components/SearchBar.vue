<script setup lang="ts">
const props = withDefaults(defineProps<{ initial?: string; big?: boolean }>(), { initial: '', big: false })
const q = ref(props.initial)

async function submit() {
  const term = q.value.trim()
  if (!term) return
  await navigateTo({ path: '/search', query: { q: term } })
}
</script>

<template>
  <form class="search" :class="{ 'search--big': big }" role="search" @submit.prevent="submit">
    <Icon name="ph:magnifying-glass-bold" class="search__icon" />
    <input
      v-model="q"
      type="search"
      name="q"
      autocomplete="off"
      placeholder="Search a band or artist"
      aria-label="Search a band or artist"
      class="search__input"
    />
    <button type="submit" class="search__btn" aria-label="Search">
      <span class="hidden sm:inline">Search</span>
      <Icon name="ph:arrow-right-bold" class="sm:hidden" size="20" />
    </button>
  </form>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  background: var(--color-paper);
  border: 2px solid var(--color-espresso);
  border-radius: 999px;
  box-shadow: var(--shadow-pop);
  padding: 0.35rem 0.4rem 0.35rem 1rem;
}
.search__icon {
  flex-shrink: 0;
  color: var(--color-cocoa);
  font-size: 1.2rem;
}
.search__input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  outline: none;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-espresso);
}
.search__input::placeholder {
  color: var(--color-cocoa);
  opacity: 0.7;
}
.search__btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-paper);
  background: var(--color-burnt);
  border: 2px solid var(--color-espresso);
  border-radius: 999px;
  padding: 0.55rem 1.2rem;
  cursor: pointer;
}
.search--big {
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
}
.search--big .search__input {
  font-size: 1.15rem;
  padding: 0.35rem 0;
}
.search--big .search__icon {
  font-size: 1.4rem;
}
</style>
