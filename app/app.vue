<template>
  <div class="flex min-h-[100dvh] flex-col overflow-x-clip">
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
    <GrainOverlay />
    <ToastHost />
  </div>
</template>
