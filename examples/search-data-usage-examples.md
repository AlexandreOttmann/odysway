# Search Data Usage Examples

This guide shows you how to properly use the search data composables to avoid the `[useAsyncData] Component is already mounted` warning.

## Problem

When using `useAsyncData` in a composable that's called after a component is mounted, you get this warning:

```
[useAsyncData] Component is already mounted, please use $fetch instead. See https://nuxt.com/docs/getting-started/data-fetching
```

## Solution

We've created two different composables for different use cases:

1. **`useSearchDataServer`** - For server-side rendering and pages
2. **`useSearchData`** - For client-side components (with proper error handling)

## 1. Server-Side Usage (Recommended for Pages)

### In Pages and Layouts

```vue
<!-- pages/thematiques/index.vue -->
<script setup>
import { useSearchDataServer } from '~/composables/useSearchDataServer'

// Use the server-side composable - this works in pages and layouts
const {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  isLoading,
  hasError
} = useSearchDataServer()

// Data is automatically fetched server-side
// No need to call any initialization methods
</script>
```

### In Layouts

```vue
<!-- layouts/default.vue -->
<script setup>
import { useSearchDataServer } from '~/composables/useSearchDataServer'

// Use in layouts for global search data
const {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  isLoading
} = useSearchDataServer()

// Provide data to child components
provide('searchData', {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  isLoading
})
</script>
```

## 2. Client-Side Usage (For Components)

### In Components that Mount After Page Load

```vue
<!-- components/content/SearchFieldOptimized.vue -->
<script setup>
import { useSearchData } from '~/composables/useSearchData'

// Use the client-side composable for components
const {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  destinationsStatus,
  regionsStatus,
  searchFieldContentStatus,
  contentTextStatus,
  initializeSearchData
} = useSearchData()

// Initialize data when component mounts
onMounted(async () => {
  try {
    await initializeSearchData()
  } catch (error) {
    console.error('Error initializing search data:', error)
  }
})

// Computed loading state
const isLoading = computed(() => 
  destinationsStatus.value === 'pending' || 
  regionsStatus.value === 'pending' || 
  searchFieldContentStatus.value === 'pending' || 
  contentTextStatus.value === 'pending'
)
</script>
```

## 3. Hybrid Approach (Best of Both Worlds)

### Create a Smart Composable

```javascript
// composables/useSearchDataSmart.js
export const useSearchDataSmart = () => {
  // Check if we're in a page context (server-side)
  const isPageContext = process.client ? false : true
  
  if (isPageContext) {
    // Use server-side composable for pages
    return useSearchDataServer()
  } else {
    // Use client-side composable for components
    return useSearchData()
  }
}
```

### Usage

```vue
<script setup>
import { useSearchDataSmart } from '~/composables/useSearchDataSmart'

// Automatically chooses the right approach
const {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  isLoading
} = useSearchDataSmart()
</script>
```

## 4. Performance Monitoring Integration

### With Performance Tracking

```vue
<script setup>
import { useSearchDataServer } from '~/composables/useSearchDataServer'
import { usePerformanceMonitor } from '~/utils/performanceMonitor'

const { trackApiCall } = usePerformanceMonitor()

// Use server-side composable
const {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  isLoading,
  hasError
} = useSearchDataServer()

// Track performance
onMounted(() => {
  if (hasError.value) {
    console.error('❌ Search data loading failed')
  } else {
    console.log('✅ Search data loaded successfully')
  }
})
</script>
```

## 5. Error Handling

### Server-Side Error Handling

```vue
<script setup>
import { useSearchDataServer } from '~/composables/useSearchDataServer'

const {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  isLoading,
  hasError,
  destinationsError,
  regionsError,
  searchFieldContentError,
  contentTextError
} = useSearchDataServer()

// Handle errors
watch(hasError, (error) => {
  if (error) {
    console.error('Search data errors:', {
      destinations: destinationsError.value,
      regions: regionsError.value,
      searchFieldContent: searchFieldContentError.value,
      contentText: contentTextError.value
    })
  }
})
</script>
```

### Client-Side Error Handling

```vue
<script setup>
import { useSearchData } from '~/composables/useSearchData'

const {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  destinationsStatus,
  regionsStatus,
  searchFieldContentStatus,
  contentTextStatus,
  initializeSearchData
} = useSearchData()

// Initialize with error handling
onMounted(async () => {
  try {
    await initializeSearchData()
  } catch (error) {
    console.error('Failed to initialize search data:', error)
    // Handle error (show fallback, retry, etc.)
  }
})

// Watch for status changes
watch([destinationsStatus, regionsStatus, searchFieldContentStatus, contentTextStatus], 
  ([destStatus, regStatus, searchStatus, contentStatus]) => {
    if (destStatus === 'error' || regStatus === 'error' || 
        searchStatus === 'error' || contentStatus === 'error') {
      console.error('One or more search data requests failed')
    }
  }
)
</script>
```

## 6. Caching and State Management

### Using Nuxt's Built-in Caching

```vue
<script setup>
import { useSearchDataServer } from '~/composables/useSearchDataServer'

// Data is automatically cached by Nuxt
const {
  destinations,
  regions,
  searchFieldContent,
  contentText,
  isLoading
} = useSearchDataServer()

// Force refresh if needed
const refreshData = async () => {
  await refreshNuxtData(['destinations-in-search', 'regions', 'search-field-content', 'page-search-search-hero'])
}
</script>
```

### Custom State Management

```javascript
// composables/useSearchDataState.js
export const useSearchDataState = () => {
  const searchData = useState('global-search-data', () => ({
    destinations: null,
    regions: null,
    searchFieldContent: null,
    contentText: null,
    lastUpdated: null
  }))

  const updateSearchData = (newData) => {
    searchData.value = {
      ...searchData.value,
      ...newData,
      lastUpdated: Date.now()
    }
  }

  const clearSearchData = () => {
    searchData.value = {
      destinations: null,
      regions: null,
      searchFieldContent: null,
      contentText: null,
      lastUpdated: null
    }
  }

  return {
    searchData: readonly(searchData),
    updateSearchData,
    clearSearchData
  }
}
```

## 7. Best Practices

### ✅ Do's

- Use `useSearchDataServer` in pages and layouts
- Use `useSearchData` in components that mount after page load
- Handle errors gracefully
- Monitor performance
- Use proper loading states
- Cache data appropriately

### ❌ Don'ts

- Don't use `useAsyncData` in composables called after mounting
- Don't forget to handle loading states
- Don't ignore errors
- Don't make redundant API calls
- Don't use client-side composables in server-side contexts

### Migration Checklist

- [ ] Replace `useSearchData` with `useSearchDataServer` in pages
- [ ] Keep `useSearchData` for client-side components
- [ ] Add proper error handling
- [ ] Add loading states
- [ ] Test both server-side and client-side scenarios
- [ ] Monitor performance
- [ ] Add proper TypeScript types if using TypeScript

## 8. Troubleshooting

### Common Issues

1. **Warning: Component is already mounted**
   - **Solution**: Use `useSearchDataServer` instead of `useSearchData`

2. **Data not loading**
   - **Check**: Network tab for API errors
   - **Check**: Console for JavaScript errors
   - **Check**: Server logs for backend issues

3. **Performance issues**
   - **Solution**: Use performance monitoring
   - **Solution**: Implement proper caching
   - **Solution**: Optimize API queries

4. **Memory leaks**
   - **Solution**: Clear data when components unmount
   - **Solution**: Use proper cleanup in composables

This approach ensures you get the best performance and avoid the mounting warning while maintaining a clean, maintainable codebase. 