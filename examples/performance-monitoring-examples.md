# Performance Monitoring Examples for Thematiques Pages

This guide shows you how to use the performance monitor in the thematiques pages and other components.

## 1. Basic Page Performance Monitoring

### Thematiques Index Page (`pages/thematiques/index.vue`)

```vue
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
    queryCollection('page_thematiques').first()
  )
})

// Export performance metrics on page unload
onBeforeUnmount(() => {
  console.log('📊 Thematiques Index Page Performance Metrics:')
  exportMetrics()
})
</script>
```

## 2. Dynamic Page Performance Monitoring

### Thematique Slug Page (`pages/thematiques/[thematiqueSlug].vue`)

```vue
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
    queryCollection('page_thematiques').first()
  )
})

// Track slug changes for performance analysis
watch(slug, (newSlug, oldSlug) => {
  if (oldSlug && newSlug !== oldSlug) {
    console.log(`🔄 Thematique slug changed from ${oldSlug} to ${newSlug}`)
    trackPageLoad(`thematique-${newSlug}`)
    useComponentPerformance(`ThematiqueSlug-${newSlug}`)
  }
})
</script>
```

## 3. Component Performance Monitoring

### DisplayVoyagesRow Component

```vue
<script setup>
import { useComponentPerformance } from '~/utils/performanceMonitor'

// Track component performance
useComponentPerformance('DisplayVoyagesRow')

// Track prop changes for performance analysis
watch(() => props.voyages, (newVoyages, oldVoyages) => {
  if (newVoyages && oldVoyages && newVoyages.length !== oldVoyages.length) {
    console.log(`📊 DisplayVoyagesRow: Voyages count changed from ${oldVoyages.length} to ${newVoyages.length}`)
  }
}, { deep: true })

// Track component lifecycle
onMounted(() => {
  console.log(`🎯 DisplayVoyagesRow mounted with ${props.voyages?.length || 0} voyages`)
})

onBeforeUnmount(() => {
  console.log('👋 DisplayVoyagesRow unmounting')
})
</script>
```

## 4. Advanced Performance Monitoring

### Custom Performance Tracking

```vue
<script setup>
import { usePerformanceMonitor } from '~/utils/performanceMonitor'

const { trackApiCall, trackMemoryUsage } = usePerformanceMonitor()

// Track custom operations
const performHeavyOperation = async () => {
  const startTime = performance.now()
  
  // Your heavy operation here
  const result = await someHeavyComputation()
  
  const operationTime = performance.now() - startTime
  console.log(`⚡ Heavy operation took: ${operationTime.toFixed(2)}ms`)
  
  return result
}

// Track memory usage before and after operations
const trackMemoryBeforeOperation = () => {
  trackMemoryUsage('before-heavy-operation')
}

const trackMemoryAfterOperation = () => {
  trackMemoryUsage('after-heavy-operation')
}

// Track API calls with custom error handling
const fetchDataWithTracking = async () => {
  try {
    return await trackApiCall('custom-api-call', async () => {
      const response = await fetch('/api/data')
      return response.json()
    })
  } catch (error) {
    console.error('❌ API call failed:', error)
    throw error
  }
}
</script>
```

## 5. Performance Monitoring in Composables

### Custom Composable with Performance Tracking

```javascript
// composables/useThematiquesData.js
import { usePerformanceMonitor } from '~/utils/performanceMonitor'

export const useThematiquesData = () => {
  const { trackApiCall, trackMemoryUsage } = usePerformanceMonitor()

  const fetchThematiquesData = async (slug) => {
    trackMemoryUsage(`before-fetch-thematiques-${slug}`)
    
    const data = await trackApiCall(`thematiques-data-${slug}`, async () => {
      const [pageContent, categories, voyages] = await Promise.all([
        queryCollection('page_thematiques').first(),
        queryCollection('categories').where('showOnHome', '=', true).all(),
        queryCollection('voyages').where('published', '=', true).all()
      ])
      
      return { pageContent, categories, voyages }
    })
    
    trackMemoryUsage(`after-fetch-thematiques-${slug}`)
    return data
  }

  return {
    fetchThematiquesData
  }
}
```

## 6. Performance Monitoring in Layouts

### Layout with Performance Tracking

```vue
<!-- layouts/thematiques.vue -->
<script setup>
import { usePerformanceMonitor } from '~/utils/performanceMonitor'

const { trackPageLoad, trackMemoryUsage } = usePerformanceMonitor()

// Track layout performance
trackPageLoad('thematiques-layout')

// Track memory usage on layout mount
onMounted(() => {
  trackMemoryUsage('thematiques-layout-mounted')
})

// Track route changes in layout
const route = useRoute()
watch(() => route.path, (newPath, oldPath) => {
  if (oldPath && newPath !== oldPath) {
    console.log(`🔄 Layout: Route changed from ${oldPath} to ${newPath}`)
    trackMemoryUsage(`route-change-${newPath}`)
  }
})
</script>
```

## 7. Performance Monitoring Utilities

### Using Higher-Order Functions

```javascript
// utils/performanceHelpers.js
import { withPerformanceTracking } from '~/utils/performanceMonitor'

// Wrap API calls with performance tracking
export const trackedQueryCollection = withPerformanceTracking('query-collection')

// Usage
const fetchData = async () => {
  return await trackedQueryCollection(() => 
    queryCollection('categories').all()
  )
}
```

### Performance Monitoring Hooks

```javascript
// composables/usePerformanceHooks.js
import { usePerformanceMonitor } from '~/utils/performanceMonitor'

export const usePerformanceHooks = (componentName) => {
  const { trackComponentRender, trackMemoryUsage } = usePerformanceMonitor()
  
  // Auto-track component performance
  onMounted(() => {
    trackComponentRender(componentName)
    trackMemoryUsage(`${componentName}-mounted`)
  })
  
  onBeforeUnmount(() => {
    trackMemoryUsage(`${componentName}-unmounted`)
  })
  
  return {
    trackRender: () => trackComponentRender(componentName),
    trackMemory: () => trackMemoryUsage(componentName)
  }
}
```

## 8. Console Output Examples

When you use the performance monitor, you'll see output like this in the console:

```
🚀 Page load time for thematiques-index: 1250.45ms
⚡ Component render time for ThematiquesIndex: 45.23ms
🌐 API call time for page-thematiques: 234.12ms
🌐 API call time for categories: 156.78ms
🌐 API call time for voyages-on-thematiques: 445.67ms
⚡ Computed property 'categoriesWithVoyages' took: 12.34ms
💾 Memory usage for thematiques-index: { used: "45.23MB", total: "67.89MB", limit: "512.00MB" }
🎯 DisplayVoyagesRow mounted with 15 voyages
📊 DisplayVoyagesRow: Voyages count changed from 15 to 20
🔄 Route changed from /thematiques to /thematiques/aventure
📊 Thematiques Index Page Performance Metrics:
📈 Detailed Metrics: { pageLoadTimes: {...}, componentRenderTimes: {...}, apiCallTimes: {...}, memoryUsage: {...} }
```

## 9. Performance Metrics Analysis

### Understanding the Metrics

```javascript
// Get performance summary
const { getPerformanceSummary } = usePerformanceMonitor()

const summary = getPerformanceSummary()
console.log('Performance Summary:', {
  averagePageLoadTime: `${summary.averagePageLoadTime.toFixed(2)}ms`,
  averageComponentRenderTime: `${summary.averageComponentRenderTime.toFixed(2)}ms`,
  averageApiCallTime: `${summary.averageApiCallTime.toFixed(2)}ms`,
  totalApiCalls: summary.totalApiCalls,
  totalComponents: summary.totalComponents
})
```

### Performance Thresholds

```javascript
// Set performance thresholds
const PERFORMANCE_THRESHOLDS = {
  pageLoad: 2000, // 2 seconds
  componentRender: 100, // 100ms
  apiCall: 500, // 500ms
  memoryUsage: 100 * 1024 * 1024 // 100MB
}

// Check if performance meets thresholds
const checkPerformance = (metrics) => {
  const warnings = []
  
  if (metrics.pageLoadTime > PERFORMANCE_THRESHOLDS.pageLoad) {
    warnings.push(`Page load time (${metrics.pageLoadTime}ms) exceeds threshold`)
  }
  
  if (metrics.memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage) {
    warnings.push(`Memory usage (${metrics.memoryUsage}MB) exceeds threshold`)
  }
  
  return warnings
}
```

## 10. Best Practices

### Do's ✅
- Use descriptive names for tracking (e.g., `thematique-${slug}`)
- Track both success and failure cases
- Monitor memory usage for heavy operations
- Export metrics for debugging
- Use performance thresholds for alerts

### Don'ts ❌
- Don't track everything (only important operations)
- Don't leave performance tracking in production
- Don't use generic names like "api-call"
- Don't forget to handle errors in tracked operations
- Don't track sensitive information

### Performance Monitoring Checklist

- [ ] Track page load times
- [ ] Monitor API call performance
- [ ] Track component render times
- [ ] Monitor memory usage
- [ ] Track computed property performance
- [ ] Monitor route changes
- [ ] Export metrics for analysis
- [ ] Set up performance thresholds
- [ ] Handle errors gracefully
- [ ] Clean up tracking on unmount

This comprehensive guide shows you how to effectively use the performance monitor in your thematiques pages and other components to identify and resolve performance bottlenecks. 