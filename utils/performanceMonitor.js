// Performance monitoring utility for tracking improvements
export const usePerformanceMonitor = () => {
  const metrics = useState('performance-metrics', () => ({
    pageLoadTimes: {},
    componentRenderTimes: {},
    apiCallTimes: {},
    memoryUsage: {},
  }))

  // Track page load time
  const trackPageLoad = (pageName) => {
    const startTime = performance.now()

    onMounted(() => {
      const loadTime = performance.now() - startTime
      metrics.value.pageLoadTimes[pageName] = loadTime
      console.log(`🚀 Page load time for ${pageName}: ${loadTime.toFixed(2)}ms`)
    })
  }

  // Track component render time
  const trackComponentRender = (componentName) => {
    const startTime = performance.now()

    onMounted(() => {
      const renderTime = performance.now() - startTime
      if (!metrics.value.componentRenderTimes[componentName]) {
        metrics.value.componentRenderTimes[componentName] = []
      }
      metrics.value.componentRenderTimes[componentName].push(renderTime)
      console.log(`⚡ Component render time for ${componentName}: ${renderTime.toFixed(2)}ms`)
    })
  }

  // Track API call time
  const trackApiCall = async (apiName, apiCall) => {
    const startTime = performance.now()
    try {
      const result = await apiCall()
      const callTime = performance.now() - startTime
      if (!metrics.value.apiCallTimes[apiName]) {
        metrics.value.apiCallTimes[apiName] = []
      }
      metrics.value.apiCallTimes[apiName].push(callTime)
      console.log(`🌐 API call time for ${apiName}: ${callTime.toFixed(2)}ms`)
      return result
    }
    catch (error) {
      const callTime = performance.now() - startTime
      console.error(`❌ API call failed for ${apiName} after ${callTime.toFixed(2)}ms:`, error)
      throw error
    }
  }

  // Track memory usage
  const trackMemoryUsage = (context) => {
    if (typeof performance.memory !== 'undefined') {
      const memory = performance.memory
      metrics.value.memoryUsage[context] = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      }
      console.log(`💾 Memory usage for ${context}:`, {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
      })
    }
  }

  // Get performance summary
  const getPerformanceSummary = () => {
    const summary = {
      averagePageLoadTime: 0,
      averageComponentRenderTime: 0,
      averageApiCallTime: 0,
      totalApiCalls: 0,
      totalComponents: 0,
    }

    // Calculate average page load times
    const pageLoadTimes = Object.values(metrics.value.pageLoadTimes)
    if (pageLoadTimes.length > 0) {
      summary.averagePageLoadTime = pageLoadTimes.reduce((a, b) => a + b, 0) / pageLoadTimes.length
    }

    // Calculate average component render times
    const allComponentTimes = Object.values(metrics.value.componentRenderTimes).flat()
    if (allComponentTimes.length > 0) {
      summary.averageComponentRenderTime = allComponentTimes.reduce((a, b) => a + b, 0) / allComponentTimes.length
      summary.totalComponents = allComponentTimes.length
    }

    // Calculate average API call times
    const allApiTimes = Object.values(metrics.value.apiCallTimes).flat()
    if (allApiTimes.length > 0) {
      summary.averageApiCallTime = allApiTimes.reduce((a, b) => a + b, 0) / allApiTimes.length
      summary.totalApiCalls = allApiTimes.length
    }

    return summary
  }

  // Clear metrics
  const clearMetrics = () => {
    metrics.value = {
      pageLoadTimes: {},
      componentRenderTimes: {},
      apiCallTimes: {},
      memoryUsage: {},
    }
  }

  // Export metrics for debugging
  const exportMetrics = () => {
    const summary = getPerformanceSummary()
    console.log('📊 Performance Summary:', summary)
    console.log('📈 Detailed Metrics:', metrics.value)
    return { summary, details: metrics.value }
  }

  return {
    trackPageLoad,
    trackComponentRender,
    trackApiCall,
    trackMemoryUsage,
    getPerformanceSummary,
    clearMetrics,
    exportMetrics,
    metrics: readonly(metrics),
  }
}

// Higher-order function to wrap API calls with performance tracking
export const withPerformanceTracking = (apiName) => {
  return (apiCall) => {
    const { trackApiCall } = usePerformanceMonitor()
    return trackApiCall(apiName, apiCall)
  }
}

// Composable to automatically track component performance
export const useComponentPerformance = (componentName) => {
  const { trackComponentRender, trackMemoryUsage } = usePerformanceMonitor()

  onMounted(() => {
    trackComponentRender(componentName)
    trackMemoryUsage(componentName)
  })

  return {
    trackRender: () => trackComponentRender(componentName),
    trackMemory: () => trackMemoryUsage(componentName),
  }
}
