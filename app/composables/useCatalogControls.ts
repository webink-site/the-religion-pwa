import type { CatalogFilters, CatalogOption, CatalogSort } from '~/types/catalog'

export const catalogSortOptions: { value: CatalogSort, label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'new', label: 'Сначала новинки' },
  { value: 'asc', label: 'Цена по возрастанию' },
  { value: 'desc', label: 'Цена по убыванию' },
]

export const catalogCollections: CatalogOption[] = [
  { id: '', label: 'Все' },
  { id: 'F/W 26', label: 'FW26' },
  { id: 'S/S 26', label: 'SS26' },
]

export const catalogSexOptions: CatalogOption[] = [
  { id: 'female', label: 'Женский' },
  { id: 'male', label: 'Мужской' },
  { id: 'unisex', label: 'Унисекс' },
]

export const catalogSizes: CatalogOption[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(id => ({
  id,
  label: id,
}))

function emptyFilters(): CatalogFilters {
  return {
    inStock: false,
    preorder: false,
    collection: null,
    categories: [],
    sex: [],
    sizes: [],
  }
}

function cloneFilters(filters: CatalogFilters): CatalogFilters {
  return {
    inStock: filters.inStock,
    preorder: filters.preorder,
    collection: filters.collection,
    categories: [...filters.categories],
    sex: [...filters.sex],
    sizes: [...filters.sizes],
  }
}

function queryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value
}

function splitQuery(value: unknown) {
  const raw = queryValue(value)
  if (typeof raw !== 'string' || !raw)
    return []
  return raw.split(',').map(item => item.trim()).filter(Boolean)
}

export function countCatalogFilters(filters: CatalogFilters) {
  return Number(filters.inStock)
    + Number(filters.preorder)
    + Number(Boolean(filters.collection))
    + filters.categories.length
    + filters.sex.length
    + filters.sizes.length
}

const filterOpen = ref(false)
const applying = ref(false)
const draft = ref<CatalogFilters>(emptyFilters())
let bodyLockBound = false

function readSort(query: ReturnType<typeof useRoute>['query']): CatalogSort {
  const sortQuery = String(queryValue(query.sort) || '')
  if (queryValue(query.new_collection) === '1' || sortQuery === 'new')
    return 'new'
  if (sortQuery === 'asc' || sortQuery === 'desc' || sortQuery === 'default')
    return sortQuery
  return 'default'
}

function readFilters(query: ReturnType<typeof useRoute>['query']): CatalogFilters {
  const collection = queryValue(query.collection_code)
  return {
    inStock: queryValue(query.in_stock) === '1',
    preorder: queryValue(query.preorder) === '1',
    collection: typeof collection === 'string' && collection ? collection : null,
    categories: splitQuery(query.categories),
    sex: splitQuery(query.sex),
    sizes: splitQuery(query.sizes),
  }
}

function buildQuery(sort: CatalogSort, filters: CatalogFilters) {
  const query: Record<string, string> = {}
  if (sort !== 'default')
    query.sort = sort
  if (filters.inStock)
    query.in_stock = '1'
  if (filters.preorder)
    query.preorder = '1'
  if (filters.collection)
    query.collection_code = filters.collection
  if (filters.categories.length)
    query.categories = filters.categories.join(',')
  if (filters.sex.length)
    query.sex = filters.sex.join(',')
  if (filters.sizes.length)
    query.sizes = filters.sizes.join(',')
  return query
}

export function releaseCatalogSheet() {
  filterOpen.value = false
  applying.value = false
  draft.value = emptyFilters()
  if (import.meta.client)
    document.body.style.overflow = ''
}

function bindBodyLock() {
  if (!import.meta.client || bodyLockBound)
    return
  bodyLockBound = true
  watch(filterOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  })
}

export function useCatalogControls() {
  const route = useRoute()
  const router = useRouter()
  const categoryStore = useCategoryStore()

  bindBodyLock()

  const sort = computed(() => readSort(route.query))
  const filters = computed(() => readFilters(route.query))

  const categoryOptions = computed<CatalogOption[]>(() => categoryStore.items
    .filter(category => category.slug && category.slug !== 'bez-gruppy-tovarov' && category.slug !== 'sertifikat')
    .map(category => ({
      id: category.slug,
      label: category.title,
    })))

  const activeFilterCount = computed(() => countCatalogFilters(filters.value))
  const draftFilterCount = computed(() => countCatalogFilters(draft.value))

  function openFilters() {
    draft.value = cloneFilters(filters.value)
    filterOpen.value = true
  }

  function closeFilters() {
    filterOpen.value = false
  }

  async function applyFilters() {
    const next = cloneFilters(draft.value)
    if (JSON.stringify(next) === JSON.stringify(filters.value)) {
      filterOpen.value = false
      return
    }

    applying.value = true
    try {
      await router.replace({ query: buildQuery(sort.value, next) })
    }
    catch {
      applying.value = false
    }
  }

  function resetDraft() {
    draft.value = emptyFilters()
  }

  async function setSort(value: CatalogSort) {
    await router.replace({ query: buildQuery(value, filters.value) })
  }

  function toggleDraftList(key: 'categories' | 'sex' | 'sizes', id: string, selected: boolean) {
    const list = draft.value[key]
    draft.value = {
      ...draft.value,
      [key]: selected ? [...list, id] : list.filter(item => item !== id),
    }
  }

  return {
    sort,
    filters,
    draft,
    filterOpen,
    applying,
    categoryOptions,
    activeFilterCount,
    draftFilterCount,
    openFilters,
    closeFilters,
    applyFilters,
    resetDraft,
    setSort,
    toggleDraftList,
  }
}
