<template>
  <ColorContainer color="">
    <HorizontalCarousel
      :show-buttons="categories.length > 4"
    >
      <template #title>
        <h3 class="custom-title">
          {{ _props.pageContent?.index?.pageTitle || 'Toutes nos thématiques' }}
        </h3>
      </template>
      <template #carousel-item>
        <ThematiqueColCard
          v-for="category in categories"
          :key="category.id"
          :slug="category.slug"
          :image="category.image.src"
          :title="category.title"
          type="thematiques"
          :description="category.discoveryTitle"
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

// Fetch categories data only when this component is loaded
const { data: categories } = await useAsyncData('categories-section', () => {
  return queryCollection('categories')
    .where('showOnHome', '=', true)
    .select('id', 'title', 'slug', 'discoveryTitle', 'image')
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
