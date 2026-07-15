<script setup lang="ts">
withDefaults(defineProps<{ icon?: string; title: string; message?: string }>(), {
  icon: 'ph:magnifying-glass',
  message: '',
})
</script>

<template>
  <div class="mx-auto max-w-md py-16 text-center">
    <span class="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-espresso bg-mustard">
      <Icon :name="icon" size="30" class="text-espresso" />
    </span>
    <h3 class="mt-4 font-display text-xl font-semibold text-espresso">{{ title }}</h3>
    <p v-if="message" class="mt-1 text-cocoa">{{ message }}</p>
    <div v-if="$slots.default" class="mt-5 flex justify-center">
      <slot />
    </div>
  </div>
</template>
