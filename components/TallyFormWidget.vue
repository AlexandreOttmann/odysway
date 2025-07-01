<template>
  <iframe
    data-tally-src="https://tally.so/embed/wQM8g1?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
    loading="lazy"
    width="100%"
    height="1097"
    frameborder="0"
    marginheight="0"
    marginwidth="0"
    title="Créez votre voyage sur-mesure 🌍"
  />
</template>

<script setup>
onMounted(() => {
  if (typeof window !== 'undefined' && window.Tally) {
    window.Tally.loadEmbeds()
  }
})
</script>
