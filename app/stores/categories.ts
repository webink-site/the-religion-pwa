import type { ICategory } from '~/types/catalog'

function isCategory(value: unknown): value is ICategory {
  if (!value || typeof value !== 'object')
    return false

  const category = value as ICategory
  return typeof category.slug === 'string' && typeof category.title === 'string'
}

function asCategories(payload: unknown): ICategory[] {
  if (Array.isArray(payload))
    return payload.filter(isCategory)
  if (!payload || typeof payload !== 'object')
    return []

  const record = payload as { data?: unknown }
  if (record.data)
    return asCategories(record.data)

  return Object.values(record).filter(isCategory)
}

export const useCategoryStore = defineStore('categories', () => {
  const items = ref<ICategory[]>([])
  const loaded = ref(false)
  let request: Promise<void> | null = null

  function load() {
    if (loaded.value)
      return Promise.resolve()
    if (request)
      return request

    request = apiFetch<unknown>('/categories')
      .then((payload) => {
        items.value = asCategories(payload)
        loaded.value = true
      })
      .catch(() => {})
      .finally(() => {
        request = null
      })

    return request
  }

  return {
    items,
    loaded,
    load,
  }
})
