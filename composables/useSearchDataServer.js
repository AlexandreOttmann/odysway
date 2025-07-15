// Server-side composable for search data fetching - use this in pages and layouts
export const useSearchDataServer = () => {
  // Fetch destinations data using useAsyncData (server-side)
  const { data: destinations, pending: destinationsPending, error: destinationsError } = useAsyncData('destinations-in-search', () => {
    return queryCollection('destinations')
      .select('titre', 'slug', 'metaDescription', 'published', 'regions', 'image', 'stem', 'isTopDestination')
      .where('published', '=', true)
      .all()
  })

  // Fetch regions data using useAsyncData (server-side)
  const { data: regions, pending: regionsPending, error: regionsError } = useAsyncData('regions', () => {
    return queryCollection('regions')
      .select('nom', 'slug', 'meta_description')
      .all()
  })

  // Fetch search field content using useAsyncData (server-side)
  const { data: searchFieldContent, pending: searchFieldContentPending, error: searchFieldContentError } = useAsyncData('search-field-content', () => {
    return queryCollection('search_field').first()
  })

  // Fetch content text using useAsyncData (server-side)
  const { data: contentText, pending: contentTextPending, error: contentTextError } = useAsyncData('page-search-search-hero', () => {
    return queryCollection('page_search').first()
  })

  // Computed loading state
  const isLoading = computed(() =>
    destinationsPending.value
    || regionsPending.value
    || searchFieldContentPending.value
    || contentTextPending.value,
  )

  // Computed error state
  const hasError = computed(() =>
    destinationsError.value
    || regionsError.value
    || searchFieldContentError.value
    || contentTextError.value,
  )

  return {
    // Data
    destinations: readonly(destinations),
    regions: readonly(regions),
    searchFieldContent: readonly(searchFieldContent),
    contentText: readonly(contentText),

    // Loading states
    destinationsPending: readonly(destinationsPending),
    regionsPending: readonly(regionsPending),
    searchFieldContentPending: readonly(searchFieldContentPending),
    contentTextPending: readonly(contentTextPending),
    isLoading: readonly(isLoading),

    // Error states
    destinationsError: readonly(destinationsError),
    regionsError: readonly(regionsError),
    searchFieldContentError: readonly(searchFieldContentError),
    contentTextError: readonly(contentTextError),
    hasError: readonly(hasError),
  }
}
