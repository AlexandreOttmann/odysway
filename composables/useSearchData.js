// Composable to centralize search data fetching and reduce redundant API calls
export const useSearchData = () => {
  // Shared state for destinations and regions
  const destinations = useState('search-destinations', () => null)
  const regions = useState('search-regions', () => null)
  const searchFieldContent = useState('search-field-content', () => null)
  const contentText = useState('search-content-text', () => null)

  // Loading states
  const destinationsStatus = useState('search-destinations-status', () => 'idle')
  const regionsStatus = useState('search-regions-status', () => 'idle')
  const searchFieldContentStatus = useState('search-field-content-status', () => 'idle')
  const contentTextStatus = useState('search-content-text-status', () => 'idle')

  // Fetch destinations data using queryCollection directly
  const fetchDestinations = async () => {
    if (destinations.value) return destinations.value

    destinationsStatus.value = 'pending'
    try {
      // Use queryCollection directly which works in both SSR and CSR contexts
      const data = await queryCollection('destinations')
        .select('titre', 'slug', 'metaDescription', 'published', 'regions', 'image', 'stem', 'isTopDestination')
        .where('published', '=', true)
        .all()

      destinations.value = data
      destinationsStatus.value = 'success'
      return data
    }
    catch (error) {
      destinationsStatus.value = 'error'
      console.error('Error fetching destinations:', error)
      return null
    }
  }

  // Fetch regions data using queryCollection directly
  const fetchRegions = async () => {
    if (regions.value) return regions.value

    regionsStatus.value = 'pending'
    try {
      const data = await queryCollection('regions')
        .select('nom', 'slug', 'meta_description')
        .all()

      regions.value = data
      regionsStatus.value = 'success'
      return data
    }
    catch (error) {
      regionsStatus.value = 'error'
      console.error('Error fetching regions:', error)
      return null
    }
  }

  // Fetch search field content using queryCollection directly
  const fetchSearchFieldContent = async () => {
    if (searchFieldContent.value) return searchFieldContent.value

    searchFieldContentStatus.value = 'pending'
    try {
      const data = await queryCollection('search_field').first()

      searchFieldContent.value = data
      searchFieldContentStatus.value = 'success'
      return data
    }
    catch (error) {
      searchFieldContentStatus.value = 'error'
      console.error('Error fetching search field content:', error)
      return null
    }
  }

  // Fetch content text using queryCollection directly
  const fetchContentText = async () => {
    if (contentText.value) return contentText.value

    contentTextStatus.value = 'pending'
    try {
      const data = await queryCollection('page_search').first()

      contentText.value = data
      contentTextStatus.value = 'success'
      return data
    }
    catch (error) {
      contentTextStatus.value = 'error'
      console.error('Error fetching content text:', error)
      return null
    }
  }

  // Initialize all search data
  const initializeSearchData = async () => {
    await Promise.all([
      fetchDestinations(),
      fetchRegions(),
      fetchSearchFieldContent(),
      fetchContentText(),
    ])
  }

  // Clear cached data (useful for testing or when data needs to be refreshed)
  const clearSearchData = () => {
    destinations.value = null
    regions.value = null
    searchFieldContent.value = null
    contentText.value = null
    destinationsStatus.value = 'idle'
    regionsStatus.value = 'idle'
    searchFieldContentStatus.value = 'idle'
    contentTextStatus.value = 'idle'
  }

  return {
    // Data
    destinations: readonly(destinations),
    regions: readonly(regions),
    searchFieldContent: readonly(searchFieldContent),
    contentText: readonly(contentText),

    // Status
    destinationsStatus: readonly(destinationsStatus),
    regionsStatus: readonly(regionsStatus),
    searchFieldContentStatus: readonly(searchFieldContentStatus),
    contentTextStatus: readonly(contentTextStatus),

    // Methods
    fetchDestinations,
    fetchRegions,
    fetchSearchFieldContent,
    fetchContentText,
    initializeSearchData,
    clearSearchData,
  }
}
