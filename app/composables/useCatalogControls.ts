import type { CatalogFilters, CatalogOption, CatalogSort, ICategory } from '~/types/catalog'

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

export function useCatalogControls() {
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig()

  const sort = useState<CatalogSort>('catalog-sort', () => 'default')
  const filters = useState<CatalogFilters>('catalog-filters', emptyFilters)
  const draft = useState<CatalogFilters>('catalog-filter-draft', emptyFilters)
  const filterOpen = useState('catalog-filter-open', () => false)
  const lockReady = useState('catalog-filter-lock-ready', () => false)
  const controlsReady = useState('catalog-controls-ready', () => false)
  const writingQuery = useState('catalog-writing-query', () => false)

  const { data: categoriesResponse } = useFetch<Record<string, ICategory> | ICategory[]>(
    `${config.public.apiUrl}/categories`,
    { key: 'catalog-filter-categories' },
  )

  const categoryOptions = computed<CatalogOption[]>(() => {
    const raw = categoriesResponse.value
    if (!raw)
      return []

    const list = Array.isArray(raw) ? raw : Object.values(raw)
    return list
      .filter(category => category.slug && category.slug !== 'bez-gruppy-tovarov' && category.slug !== 'sertifikat')
      .map(category => ({
        id: category.slug,
        label: category.title,
      }))
  })

  const activeFilterCount = computed(() => countCatalogFilters(filters.value))
  const draftFilterCount = computed(() => countCatalogFilters(draft.value))

  function hydrateFromRoute() {
    const query = route.query
    const sortQuery = String(queryValue(query.sort) || '')
    if (queryValue(query.new_collection) === '1' || sortQuery === 'new')
      sort.value = 'new'
    else if (sortQuery === 'asc' || sortQuery === 'desc' || sortQuery === 'default')
      sort.value = sortQuery
    else
      sort.value = 'default'

    const collection = queryValue(query.collection_code)
    filters.value = {
      inStock: queryValue(query.in_stock) === '1',
      preorder: queryValue(query.preorder) === '1',
      collection: typeof collection === 'string' && collection ? collection : null,
      categories: splitQuery(query.categories),
      sex: splitQuery(query.sex),
      sizes: splitQuery(query.sizes),
    }
  }

  function buildQuery() {
    const query: Record<string, string> = {}
    if (sort.value !== 'default')
      query.sort = sort.value
    if (filters.value.inStock)
      query.in_stock = '1'
    if (filters.value.preorder)
      query.preorder = '1'
    if (filters.value.collection)
      query.collection_code = filters.value.collection
    if (filters.value.categories.length)
      query.categories = filters.value.categories.join(',')
    if (filters.value.sex.length)
      query.sex = filters.value.sex.join(',')
    if (filters.value.sizes.length)
      query.sizes = filters.value.sizes.join(',')
    return query
  }

  async function writeQuery() {
    writingQuery.value = true
    await router.replace({ query: buildQuery() })
    writingQuery.value = false
  }

  function openFilters() {
    draft.value = cloneFilters(filters.value)
    filterOpen.value = true
  }

  function closeFilters() {
    filterOpen.value = false
  }

  async function applyFilters() {
    filters.value = cloneFilters(draft.value)
    filterOpen.value = false
    await writeQuery()
  }

  function resetDraft() {
    draft.value = emptyFilters()
  }

  async function setSort(value: CatalogSort) {
    sort.value = value
    await writeQuery()
  }

  function toggleDraftList(key: 'categories' | 'sex' | 'sizes', id: string, selected: boolean) {
    const list = draft.value[key]
    draft.value = {
      ...draft.value,
      [key]: selected ? [...list, id] : list.filter(item => item !== id),
    }
  }

  if (!controlsReady.value) {
    controlsReady.value = true
    watch(() => route.fullPath, () => {
      if (writingQuery.value)
        return
      hydrateFromRoute()
    }, { immediate: true })
  }

  if (!lockReady.value) {
    lockReady.value = true
    watch(filterOpen, (open) => {
      if (!import.meta.client)
        return
      document.body.style.overflow = open ? 'hidden' : ''
    })
  }

  return {
    sort,
    filters,
    draft,
    filterOpen,
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
