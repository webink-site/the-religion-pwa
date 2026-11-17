import type { ProductResponse } from '~/types/product'

export const useProductStore = defineStore('product', () => {
  const bySlug = ref<Record<string, ProductResponse>>({})
  const inflight = new Map<string, Promise<ProductResponse>>()

  async function load(slug: string) {
    const cached = bySlug.value[slug]
    if (cached)
      return cached

    const pending = inflight.get(slug) ?? apiFetch<ProductResponse>(`/products/${slug}`)
    inflight.set(slug, pending)

    try {
      const response = await pending
      bySlug.value[slug] = response
      return response
    }
    finally {
      inflight.delete(slug)
    }
  }

  async function subscribeNotify(slug: string, email?: string) {
    await apiFetch(`/products/${slug}/notify`, {
      method: 'POST',
      body: email ? { email } : {},
    })
  }

  return {
    bySlug,
    load,
    subscribeNotify,
  }
})
