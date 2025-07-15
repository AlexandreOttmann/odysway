<template>
  <ContentLayout
    :is-category="true"
    :selected-category="selectedCategory"
    :page-content="pageContent"
  >
    <template #slugContent>
      <DisplayVoyagesRow
        :selected-category="selectedCategory"
        :voyages="voyages"
        :page-content="pageContent"
      />
    </template>
    <template
      v-if="categorieContentStatus === 'success' && categorieContent"
      #blogPost
    >
      <ContentRenderer
        v-if="categorieContent"
        :value="categorieContent"
      />
    </template>
  </ContentLayout>
</template>

<script setup>
import { usePerformanceMonitor, useComponentPerformance } from '~/utils/performanceMonitor'

const route = useRoute()
const slug = computed(() => route.params.thematiqueSlug)

// Initialize performance monitoring
const { trackPageLoad, trackApiCall, exportMetrics, trackMemoryUsage } = usePerformanceMonitor()

// Track page performance with dynamic slug
trackPageLoad(`thematique-${slug.value}`)

// Track component performance
useComponentPerformance(`ThematiqueSlug-${slug.value}`)

// Track memory usage
trackMemoryUsage(`thematique-${slug.value}`)

// Track API calls with performance monitoring
const { data: pageContent } = await useAsyncData('page-thematiques', async () => {
  return await trackApiCall('page-thematiques', () =>
    queryCollection('page_thematiques').first(),
  )
})

const { data: categories } = await useAsyncData('categories', async () => {
  return await trackApiCall('categories', () =>
    queryCollection('categories').where('showOnHome', '=', true).all(),
  )
})

// Track computed property performance
const selectedCategory = computed(() => {
  const startTime = performance.now()
  const result = categories.value?.find(c => c.slug === slug.value) || null
  const computeTime = performance.now() - startTime

  if (computeTime > 1) { // Only log if computation takes more than 1ms
    console.log(`⚡ Computed property 'selectedCategory' took: ${computeTime.toFixed(2)}ms`)
  }

  return result
})

const { data: categorieContent, status: categorieContentStatus } = useAsyncData('categorieContent', async () => {
  return await trackApiCall(`categorieContent-${slug.value}`, () =>
    queryCollection('categoriesContent')
      .where('stem', 'LIKE', `categories/${slug.value}/%`)
      .where('published', '=', true)
      .first(),
  )
}, {
  watch: [slug],
})

provide('page', categorieContent)

// Optimized voyages query with performance tracking
const { data: voyages } = await useAsyncData('voyages', async () => {
  return await trackApiCall(`voyages-${slug.value}`, async () => {
    const travelList = await queryCollection('voyages')
      .where('published', '=', true)
      .all()
    return travelList.filter(v => v.categories?.some(c => c.name?.includes(slug.value)))
  })
}, {
  watch: [slug],
})

// Track slug changes for performance analysis
watch(slug, (newSlug, oldSlug) => {
  if (oldSlug && newSlug !== oldSlug) {
    console.log(`🔄 Thematique slug changed from ${oldSlug} to ${newSlug}`)
    // Track performance for slug changes
    trackPageLoad(`thematique-${newSlug}`)
    useComponentPerformance(`ThematiqueSlug-${newSlug}`)
  }
})

// Export performance metrics on page unload
onBeforeUnmount(() => {
  console.log(`📊 Thematique Slug Page Performance Metrics (${slug.value}):`)
  exportMetrics()
})

// Track route changes
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
