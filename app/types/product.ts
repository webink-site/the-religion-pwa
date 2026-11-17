import type { CatalogProduct } from '~/types/catalog'

export interface ProductVariant {
  product_inventory_id: number
  quantity?: number | null
  in_stock?: boolean
  properties?: { size?: string | null } | null
}

export interface ProductSerialNumber {
  id: number
  number: number
  formatted: string
  available: boolean
}

export interface ProductAccordion {
  title: string
  content: string
  type: string
  image?: string | null
}

export interface SizeChartRow {
  key: string
  label: string
  values: Record<string, string | number>
}

export interface MeasurementGuide {
  key: string
  title: string
  image_url: string
  labels: string[]
}

export interface ProductTeaser {
  id: number
  slug: string
  name: string
  color?: string | null
  color_hex?: string | null
  images: Partial<Record<'original' | 'sm' | 'md' | 'lg', string>>
  price: number
  formatted_price?: string
  in_stock: boolean
}

export interface Product extends CatalogProduct {
  model_info?: string | null
  available_sizes?: string[]
  variants?: ProductVariant[]
  serial_numbers?: { numbers: ProductSerialNumber[] } | null
  accordions?: ProductAccordion[]
  size_chart_table?: SizeChartRow[]
  measurement_guide?: MeasurementGuide | null
  shop_the_look?: { items: ProductTeaser[] } | null
  recommendations?: ProductTeaser[]
  flags?: CatalogProduct['flags'] & { preorder?: boolean }
  images: CatalogProduct['images'] & { size_chart?: string | null }
}

export interface ProductSeo {
  title?: string
  description?: string
  image?: string
}

export interface ProductResponse {
  data: Product
  seo?: ProductSeo
}

export interface SizeOption {
  id: number | null
  label: string
  disabled: boolean
}

export interface ProductSlide {
  src: string
  srcset: string
  preview: string
}

export type ProductModal = 'limited' | 'lastSale' | 'serial' | 'measure' | 'installments' | 'notify'

export type ProductCta = 'notify' | 'soldOut' | 'buy' | 'none'
