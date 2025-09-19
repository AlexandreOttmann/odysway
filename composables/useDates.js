export function useDates() {
  const route = useRoute()
  const dates = ref([])
  const isLoading = ref(false)

  const getDates = async () => {
    isLoading.value = true
    const res = await apiRequest(`/booking/${route.params.voyageSlug}/dates`)
    dates.value = res
    isLoading.value = false
  }

  onMounted(() => {
    if (route.params.voyageSlug) {
      getDates()
    }
    return dates.value
  })

  return { dates, getDates, isLoading }
}
