<template>
  <v-container
    fluid
    class="px-2 px-md-4 pt-0"
  >
    <!-- Lazy load SearchHeroSection only when needed -->
    <!-- <SearchHeroSection
      v-if="showSearchHero"
      :is-category="isCategory"
      :is-experience="isExperience"
      :is-destination="isDestination"
      :destination="selectedCategory || selectedExperience || selectedDestination"
    >
      <SearchFieldOptimized />
    </SearchHeroSection> -->

    <!-- Lazy load Categories section only when needed -->
    <LazyCategoriesSection
      v-if="showCategories"
      :page-content="pageContent"
    />

    <!-- Lazy load Experiences section only when needed -->
    <LazyExperiencesSection
      v-if="showExperiences"
      :page-content="pageContent"
    />

    <v-divider
      v-if="displayDivider"
      thickness="2"
      class="mt-2 mb-4 mb-md-6"
    />

    <ColorContainer color="">
      <slot name="indexContent" />
      <slot name="slugContent" />
      <slot name="blogPost" />
      <LazyCommonReviewContainer class="mt-8" />
    </ColorContainer>
  </v-container>
</template>

<script setup>
const props = defineProps({
  isCategory: {
    type: Boolean,
    default: false,
  },
  isExperience: {
    type: Boolean,
    default: false,
  },
  selectedCategory: {
    type: Object,
    default: () => null,
  },
  selectedExperience: {
    type: Object,
    default: () => null,
  },
  selectedDestination: {
    type: Object,
    default: () => null,
  },
  isDestination: {
    type: Boolean,
    default: false,
  },
  pageContent: {
    type: Object,
    default: () => ({}),
  },
  displayDivider: {
    type: Boolean,
    default: true,
  },
  // New props for better control
  showSearchHero: {
    type: Boolean,
    default: true,
  },
  showCategories: {
    type: Boolean,
    default: false,
  },
  showExperiences: {
    type: Boolean,
    default: false,
  },
})

// Computed properties for conditional rendering
const _showCategoriesComputed = computed(() =>
  props.showCategories || props.isCategory,
)

const _showExperiencesComputed = computed(() =>
  props.showExperiences || props.isExperience,
)
</script>

<style scoped>
/* Styles moved to individual components for better modularity */
</style>
