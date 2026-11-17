import { saleNotStarted, type CatalogCardChip } from '~/utils/catalogCard'
import type { CatalogImageSize, CatalogImageVariant, CatalogProduct } from '~/types/catalog'
import type { Product, ProductModal, ProductSlide, ProductTeaser, ProductVariant, SizeChartRow, SizeOption } from '~/types/product'

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const ONE_SIZE_TOKENS = new Set(['OS', 'ONE', 'ONESIZE'])

export const FREE_DELIVERY_FROM = 100_000

export type ProductChip = CatalogCardChip & { modal?: ProductModal }

export function productSlides(product: Product): ProductSlide[] {
  const originals = [product.images.main, ...(product.images.gallery ?? [])]
  const variants = [product.images.responsive?.main, ...(product.images.responsive?.gallery ?? [])]

  return originals
    .map((original, index) => slideOf(variants[index], original))
    .filter(slide => slide.src)
}

function slideOf(variant: CatalogImageVariant | null | undefined, original: string): ProductSlide {
  const urls = variant?.urls
  return {
    src: webp(urls?.lg) || webp(urls?.pdp) || original,
    srcset: variant?.srcset?.webp || '',
    preview: webp(urls?.md) || webp(urls?.sm) || original,
  }
}

function webp(entry: CatalogImageSize | string | null | undefined) {
  return entry && typeof entry !== 'string' ? entry.webp || '' : ''
}

export function productIsOneSize(product: Product) {
  const variants = product.variants ?? []
  return variants.length > 0 && variants.every(variant => isOneSizeValue(variant.properties?.size))
}

export function productSizeOptions(product: Product): SizeOption[] {
  const variants = product.variants ?? []

  if (productIsOneSize(product)) {
    const first = variants[0]
    return [{
      id: first?.product_inventory_id ?? null,
      label: first?.properties?.size?.trim() || 'One size',
      disabled: !first || variantSoldOut(first),
    }]
  }

  const byLabel = new Map(variants.map(variant => [sizeLabel(variant.properties?.size), variant]))
  const chartKeys = chartSizeKeys(product.size_chart_table)
    .filter(key => byLabel.has(sizeLabel(key)) || isClothingSize(key))

  const options: SizeOption[] = chartKeys.map((key) => {
    const variant = byLabel.get(sizeLabel(key))
    return variant ? variantOption(variant) : { id: null, label: key, disabled: true }
  })

  const inChart = new Set(chartKeys.map(sizeLabel))
  for (const variant of variants) {
    const label = sizeLabel(variant.properties?.size)
    if (label && !inChart.has(label))
      options.push(variantOption(variant))
  }

  return options.sort((a, b) => sizeRank(a.label) - sizeRank(b.label))
}

export function availableSizesLabel(product: Product) {
  return [...(product.available_sizes ?? [])]
    .sort((a, b) => sizeRank(a) - sizeRank(b))
    .join(', ')
}

export function productChips(product: Product): ProductChip[] {
  const chips: ProductChip[] = []
  if (product.flags?.is_limited)
    chips.push({ id: 'limited', title: 'Individual', modal: 'limited' })
  if (product.flags?.last_sale)
    chips.push({ id: 'last-sale', title: 'Last Sale', modal: 'lastSale' })
  if (product.stock.total_quantity < 1)
    chips.push({ id: 'sold-out', title: 'Sold out', dark: true })

  const earn = productEarnPoints(product)
  if (earn > 0)
    chips.push({ id: 'earn', title: `+${earn.toLocaleString('ru-RU')} баллов`, dark: true })

  chips.push({ id: 'delivery', title: `Бесплатная доставка от ${FREE_DELIVERY_FROM.toLocaleString('ru-RU')} ₽` })
  return chips
}

export function productEarnPoints(product: Product) {
  if (product.loyalty?.excluded)
    return 0
  return Number(product.loyalty?.earn_preview ?? product.loyalty_points_earn_preview ?? 0) || 0
}

export function canPurchaseNow(product: Product) {
  return !saleNotStarted(product) && product.drop?.can_purchase !== false
}

export function shouldOfferNotify(product: Product) {
  if (!canPurchaseNow(product))
    return true
  return Boolean(product.flags?.allow_notify) && product.stock.total_quantity < 1
}

export function formatDate(raw?: string | null) {
  const date = raw ? new Date(raw) : null
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('ru-RU') : ''
}

export function teaserToCatalogProduct(item: ProductTeaser): CatalogProduct {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    color: item.color,
    color_hex: item.color_hex,
    price: {
      current: item.price,
      currency: 'RUB',
      formatted: item.formatted_price,
    },
    stock: {
      in_stock: item.in_stock,
      total_quantity: item.in_stock ? 1 : 0,
    },
    images: { main: item.images.md || item.images.original || '' },
  }
}

function variantOption(variant: ProductVariant): SizeOption {
  return {
    id: variant.product_inventory_id,
    label: String(variant.properties?.size ?? '').trim(),
    disabled: variantSoldOut(variant),
  }
}

function variantSoldOut(variant: ProductVariant) {
  return variant.in_stock === false || (typeof variant.quantity === 'number' && variant.quantity < 1)
}

function sizeLabel(size?: string | null) {
  const trimmed = size?.trim() ?? ''
  return (trimmed.match(/^([A-Za-z0-9]+)/)?.[1] ?? trimmed).toUpperCase()
}

function sizeRank(size: string) {
  const index = SIZE_ORDER.indexOf(sizeLabel(size))
  if (index !== -1)
    return index
  const range = size.match(/\((\d+)/)
  return range ? 1000 + Number(range[1]) : 9999
}

function isOneSizeValue(size?: string | null) {
  return !size?.trim() || ONE_SIZE_TOKENS.has(size.trim().toUpperCase().replace(/[\s_-]+/g, ''))
}

function isClothingSize(key: string) {
  const label = sizeLabel(key)
  return SIZE_ORDER.includes(label) || ONE_SIZE_TOKENS.has(label) || /^\d{1,3}(?:\s*[/-]\s*\d{1,3})?$/.test(key.trim())
}

function chartSizeKeys(table?: SizeChartRow[] | null) {
  return [...new Set((table ?? []).flatMap(row => Object.keys(row.values ?? {})))]
}
