<template>
  <ContentLayout
    :is-category="true"
    :page-content="pageContent"
    :show-categories="true"
  >
    <template #indexContent>
      <DisplayVoyagesRow
        :voyages="categoriesWithVoyages"
        :page-content="pageContent"
      />
    </template>
  </ContentLayout>
</template>

<script setup>
import { usePerformanceMonitor, useComponentPerformance } from '~/utils/performanceMonitor'

// Initialize performance monitoring
const { trackPageLoad, trackApiCall, exportMetrics } = usePerformanceMonitor()

// Track page performance
trackPageLoad('thematiques-index')

// Track component performance
useComponentPerformance('ThematiquesIndex')

// Track API calls with performance monitoring
const { data: pageContent } = await useAsyncData('page-thematiques', async () => {
  return await trackApiCall('page-thematiques', () =>
    queryCollection('page_thematiques').first(),
  )
})

const { data: categories } = useAsyncData('categories', async () => {
  return await trackApiCall('categories', () =>
    queryCollection('categories').select('id', 'title', 'slug', 'discoveryTitle', 'image').all(),
  )
})

const { data: voyages } = useAsyncData('voyages-on-thematiques', async () => {
  return await trackApiCall('voyages-on-thematiques', () =>
    queryCollection('voyages').where('published', '=', true).all(),
  )
})

// Memoized computed property for better performance
const categoriesWithVoyages = computed(() => {
  if (!categories.value || voyages.value?.length === 0) return []

  return categories.value?.map(category => ({
    ...category,
    voyages: voyages.value?.filter(voyage =>
      voyage.categories && voyage.categories?.some(c => c.name?.includes(category.slug)),
    ),
  }))
})

// Track computed property performance
const startComputedTime = performance.now()
watch(categoriesWithVoyages, () => {
  const computedTime = performance.now() - startComputedTime
  console.log(`⚡ Computed property 'categoriesWithVoyages' took: ${computedTime.toFixed(2)}ms`)
}, { immediate: true })

// Export performance metrics on page unload (for debugging)
onBeforeUnmount(() => {
  console.log('📊 Thematiques Index Page Performance Metrics:')
  exportMetrics()
})

// Track route changes for SPA navigation performance
const route = useRoute()
watch(() => route.path, (newPath, oldPath) => {
  if (oldPath && newPath !== oldPath) {
    console.log(`🔄 Route changed from ${oldPath} to ${newPath}`)
  }
})

useHead({
  htmlAttrs: {
    lang: 'fr',
  },
})
</script>
