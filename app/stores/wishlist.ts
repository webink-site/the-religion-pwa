interface WishlistItem {
  id: number
}

interface Wishlist {
  id?: number
  items?: WishlistItem[]
}

function asWishlist(payload: unknown): Wishlist | null {
  if (!payload || typeof payload !== 'object')
    return null

  const record = payload as { data?: unknown, items?: unknown, id?: unknown }
  if (Array.isArray(record.items) || typeof record.id === 'number')
    return record as Wishlist
  if (record.data && typeof record.data === 'object')
    return asWishlist(record.data)

  return null
}

function productIds(items: WishlistItem[] | undefined) {
  return (items ?? [])
    .map(item => Number(item.id))
    .filter(id => Number.isFinite(id))
}

export const useWishlistStore = defineStore('wishlist', () => {
  const ids = ref<number[]>([])
  const wishlist = ref<Wishlist | null>(null)
  const loaded = ref(false)
  const pendingProductId = ref<number | null>(null)
  let loadSeq = 0

  function has(productId?: number | null) {
    const id = Number(productId)
    return Number.isFinite(id) && ids.value.includes(id)
  }

  function applyWishlist(data: Wishlist) {
    wishlist.value = data
    ids.value = productIds(data.items)
    loaded.value = true
  }

  async function load() {
    const seq = ++loadSeq
    try {
      const data = asWishlist(await apiFetch<unknown>('/wishlists'))
      if (seq !== loadSeq || !data)
        return
      applyWishlist(data)
    }
    catch {
      // гость или протухшая сессия
    }
  }

  async function toggle(productId: number) {
    const id = Number(productId)
    if (!Number.isFinite(id))
      return

    if (!useAuthStore().token) {
      pendingProductId.value = id
      const from = useRoute().fullPath
      await navigateTo({ path: '/login', query: from.startsWith('/') ? { from } : {} })
      return
    }

    if (ids.value.includes(id)) {
      ids.value = ids.value.filter(item => item !== id)
      if (wishlist.value?.items)
        wishlist.value.items = wishlist.value.items.filter(item => Number(item.id) !== id)

      try {
        await apiFetch('/wishlists/remove-product', {
          method: 'POST',
          body: { product_id: id },
        })
      }
      catch {
        ids.value = [...ids.value, id]
      }
      return
    }

    ids.value = [...ids.value, id]
    try {
      await apiFetch('/wishlists/add-product', {
        method: 'POST',
        body: { product_id: id },
      })
    }
    catch {
      ids.value = ids.value.filter(item => item !== id)
      return
    }

    await load()
    if (!ids.value.includes(id))
      ids.value = [...ids.value, id]
  }

  function reset() {
    ids.value = []
    wishlist.value = null
    loaded.value = false
    pendingProductId.value = null
  }

  async function flushPending() {
    const id = pendingProductId.value
    if (!id)
      return
    pendingProductId.value = null
    await toggle(id)
  }

  return {
    ids,
    wishlist,
    loaded,
    pendingProductId,
    has,
    load,
    toggle,
    reset,
    flushPending,
  }
})
