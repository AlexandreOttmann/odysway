<template>
  <ColorContainer color="">
    <HorizontalCarousel
      :show-buttons="experiences.length > 4"
    >
      <template #title>
        <h3 class="custom-title">
          {{ _props.pageContent?.index?.pageTitle || 'Toutes nos expériences' }}
        </h3>
      </template>
      <template #carousel-item>
        <ThematiqueColCard
          v-for="experience in experiences"
          :key="experience.id"
          :slug="experience.slug"
          :image="experience.image.src"
          :title="experience.title"
          type="experiences"
          :description="experience.discoveryTitle"
        />
      </template>
    </HorizontalCarousel>
  </ColorContainer>
</template>

<script setup>
const _props = defineProps({
  pageContent: {
    type: Object,
    default: () => ({}),
  },
})

// Fetch experiences data only when this component is loaded
const { data: experiences } = await useAsyncData('experiences-section', () => {
  return queryCollection('experiences')
    .where('published', '=', true)
    .all()
})
</script>

<style scoped>
.custom-title {
  font-weight: 700;
  font-size: 50px;
  line-height: 50px;
}

@media (min-width: 960px) {
  .custom-title {
    font-size: 42px !important;
    line-height: 42px !important;
  }
}

@media (max-width: 960px) {
  .custom-title {
    font-size: 42px !important;
    line-height: 42px !important;
  }
}

@media (max-width: 400px) {
  .custom-title {
    font-size: 30px !important;
    line-height: 30px !important;
  }
}
</style>
