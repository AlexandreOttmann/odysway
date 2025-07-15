<template>
  <div class="display-voyages-row">
    <!-- Your existing template content -->
    <slot />
  </div>
</template>

<script setup>
import { useComponentPerformance } from '~/utils/performanceMonitor'

// Track component performance
useComponentPerformance('DisplayVoyagesRow')

// Your existing script logic here
const props = defineProps({
  voyages: {
    type: Array,
    default: () => [],
  },
  pageContent: {
    type: Object,
    default: () => ({}),
  },
  selectedCategory: {
    type: Object,
    default: null,
  },
  selectedExperience: {
    type: Object,
    default: null,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
})

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

<style scoped>
.display-voyages-row {
  /* Your existing styles */
}
</style>
