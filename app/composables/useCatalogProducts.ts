import { releaseCatalogSheet } from '~/composables/useCatalogControls'
import type { CatalogFeedQuery } from '~/stores/catalog'

const SCROLL_KEY = 'catalog-scroll-y'

export async function useCatalogProducts() {
  const catalog = useCatalogStore()
  const { sort, filters, applying, filterOpen } = useCatalogControls()

  releaseCatalogSheet()
  onScopeDispose(releaseCatalogSheet)

  function currentQuery(): CatalogFeedQuery {
    return {
      sort: sort.value,
      filters: filters.value,
    }
  }

  const filterKey = computed(() => JSON.stringify(currentQuery()))

  onBeforeRouteLeave((to) => {
    if (!import.meta.client)
      return
    if (to.path.startsWith('/catalog/') && to.path !== '/catalog')
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
    else
      sessionStorage.removeItem(SCROLL_KEY)
  })

  watch(filterKey, async () => {
    const result = await catalog.ensure(currentQuery())
    if (result === 'stale')
      return
    if (applying.value) {
      applying.value = false
      filterOpen.value = false
    }
    if (import.meta.client && result === 'fresh')
      window.scrollTo(0, 0)
  })

  const hadFeed = catalog.feedKey === filterKey.value
  const result = catalog.ensure(currentQuery())

  if (import.meta.server || hadFeed)
    await result

  if (import.meta.client && hadFeed)
    await restoreScroll()
  else if (import.meta.client)
    sessionStorage.removeItem(SCROLL_KEY)

  async function restoreScroll() {
    const raw = sessionStorage.getItem(SCROLL_KEY)
    if (!raw)
      return
    sessionStorage.removeItem(SCROLL_KEY)
    const top = Number(raw)
    if (!Number.isFinite(top))
      return
    await nextTick()
    requestAnimationFrame(() => {
      window.scrollTo(0, top)
    })
  }

  const { products, pending, loadingMore, hasMore } = storeToRefs(catalog)

  return {
    products,
    pending,
    loadingMore,
    hasMore,
    loadMore: () => catalog.loadMore(currentQuery()),
  }
}
