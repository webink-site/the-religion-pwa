import type { CatalogFeedResult, CatalogFilters, CatalogListResponse, CatalogProduct, CatalogSort } from '~/types/catalog'
import { catalogPerPage, isCatalogProduct } from '~/utils/catalogCard'

export type CatalogFeedQuery = {
  sort: CatalogSort
  filters: CatalogFilters
}

function feedKeyOf(query: CatalogFeedQuery) {
  return JSON.stringify(query)
}

function requestParams(query: CatalogFeedQuery, pageNum: number) {
  const current = query.filters
  return {
    per_page: catalogPerPage,
    page: pageNum,
    exclude: 'certificate',
    ...(query.sort === 'asc' || query.sort === 'desc' ? { price_sort: query.sort } : {}),
    ...(query.sort === 'new' ? { new_collection: 1 } : {}),
    ...(current.inStock ? { in_stock: true } : {}),
    ...(current.preorder ? { preorder: true } : {}),
    ...(current.categories.length ? { category_slugs: current.categories.join(',') } : {}),
    ...(current.sizes.length ? { sizes: current.sizes.join(',') } : {}),
    ...(current.sex.length ? { sex: current.sex.join(',') } : {}),
    ...(current.collection
      ? { collection_code: current.collection, visible: 'null' }
      : {}),
  }
}

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref<CatalogProduct[]>([])
  const page = ref(1)
  const lastPage = ref(1)
  const pending = ref(true)
  const loadingMore = ref(false)
  const feedKey = ref('')
  let requestId = 0

  const hasMore = computed(() => page.value < lastPage.value)

  function sameFeed(query: CatalogFeedQuery) {
    return feedKey.value === feedKeyOf(query)
  }

  async function fetchPage(query: CatalogFeedQuery, pageNum: number) {
    return apiFetch<CatalogListResponse>('/products', {
      params: requestParams(query, pageNum),
    })
  }

  async function ensure(query: CatalogFeedQuery): Promise<CatalogFeedResult> {
    if (sameFeed(query))
      return 'cached'

    const key = feedKeyOf(query)
    const id = ++requestId
    pending.value = true
    loadingMore.value = false

    try {
      const response = await fetchPage(query, 1)
      if (id !== requestId)
        return 'stale'
      products.value = response.data.filter(isCatalogProduct)
      page.value = 1
      lastPage.value = response.meta.last_page || 1
      feedKey.value = key
      pending.value = false
      return 'fresh'
    }
    catch {
      if (id !== requestId)
        return 'stale'
      products.value = []
      page.value = 1
      lastPage.value = 1
      pending.value = false
      return 'fresh'
    }
  }

  async function loadMore(query: CatalogFeedQuery) {
    if (!sameFeed(query) || pending.value || loadingMore.value || !hasMore.value)
      return

    const nextPage = page.value + 1
    const id = requestId
    loadingMore.value = true

    try {
      const response = await fetchPage(query, nextPage)
      if (id !== requestId)
        return
      const seen = new Set(products.value.map(item => item.slug))
      const fresh = response.data.filter(item => isCatalogProduct(item) && !seen.has(item.slug))
      products.value = [...products.value, ...fresh]
      page.value = nextPage
      lastPage.value = response.meta.last_page || nextPage
    }
    finally {
      if (id === requestId)
        loadingMore.value = false
    }
  }

  return {
    products,
    page,
    lastPage,
    pending,
    loadingMore,
    feedKey,
    hasMore,
    ensure,
    loadMore,
  }
})
