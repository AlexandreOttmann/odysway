<template>
  <ClientOnly>
    <LazyTallyFormWidget />
    <template #fallback>
      <v-skeleton-loader
        type="card"
        height="1097"
      />
    </template>
  </ClientOnly>
</template>

<script setup>
// Load Tally script only when component is needed
useHead({
  script: [
    {
      src: 'https://tally.so/widgets/embed.js',
      async: true,
    },
  ],
})

onMounted(() => {
  if (typeof window !== 'undefined' && window.Tally) {
    window.Tally.loadEmbeds()
  }
})
</script>
