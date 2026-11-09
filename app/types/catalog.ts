export interface ICategory {
  id: number
  title: string
  slug: string
  image: string | null
  children?: ICategory[]
}

export type CatalogSort = 'default' | 'new' | 'asc' | 'desc'

export type CatalogFilters = {
  inStock: boolean
  preorder: boolean
  collection: string | null
  categories: string[]
  sex: string[]
  sizes: string[]
}

export type CatalogOption = {
  id: string
  label: string
}

export interface CatalogImageSize {
  w?: number
  webp?: string | null
  avif?: string | null
}

export interface CatalogImageVariant {
  original?: string | null
  urls?: Partial<Record<'thumb' | 'card' | 'sm' | 'md' | 'pdp' | 'lg' | 'xl' | 'xxl' | 'full', CatalogImageSize | string>>
}

export interface CatalogImages {
  main: string
  gallery?: string[]
  responsive?: {
    main?: CatalogImageVariant | null
    gallery?: CatalogImageVariant[] | null
  } | null
}

export interface CatalogColorItem {
  name?: string | null
  hex?: string | null
}

export interface CatalogColorVariant {
  color: string
  slug?: string
  color_hex?: string | null
  colors?: CatalogColorItem[]
}

export interface CatalogProduct {
  id: number
  slug: string
  name: string
  color?: string | null
  color_hex?: string | null
  colors?: CatalogColorItem[]
  color_variants?: CatalogColorVariant[]
  price: {
    current: number
    currency: string
    formatted?: string
  }
  stock: {
    in_stock: boolean
    total_quantity: number
  }
  flags?: {
    allow_notify?: boolean
    is_limited?: boolean
    last_sale?: boolean
  }
  arrival_date?: string | null
  preorder_estimated_arrival_date?: string | null
  drop?: { can_purchase?: boolean } | null
  loyalty_points_earn_preview?: number | null
  loyalty?: {
    earn_preview?: number | null
    excluded?: boolean
  } | null
  images: CatalogImages
  category?: {
    type?: string
    slug?: string
  }
}

export type CatalogFeedResult = 'cached' | 'fresh' | 'stale'

export interface CatalogListResponse {
  data: CatalogProduct[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}
