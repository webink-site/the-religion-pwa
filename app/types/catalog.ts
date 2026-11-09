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
