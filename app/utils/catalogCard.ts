import type { CatalogColorItem, CatalogImageSize, CatalogImageVariant, CatalogProduct } from '~/types/catalog'

export type CatalogCardChip = {
  id: string
  title: string
  dark?: boolean
}

export type CatalogCardColor = {
  slug: string
  label: string
  selected: boolean
  style: { background?: string, backgroundColor?: string }
  light: boolean
}

const PER_PAGE = 16

export const catalogPerPage = PER_PAGE

export function isCatalogProduct(product: CatalogProduct) {
  const type = product.category?.type
  const slug = product.category?.slug
  return type !== 'sertifikat' && slug !== 'sertifikat' && type !== 'certificates'
}

export function catalogCardPhotos(product: CatalogProduct) {
  const hoverOriginal = product.images.gallery?.[0] || ''

  return {
    main: catalogWebp(product.images.responsive?.main, product.images.main),
    hover: hoverOriginal && hoverOriginal !== product.images.main
      ? catalogWebp(product.images.responsive?.gallery?.[0], hoverOriginal)
      : '',
  }
}

function catalogWebp(variant: CatalogImageVariant | null | undefined, fallback: string) {
  const urls = variant?.urls
  return webpUrl(urls?.md) || webpUrl(urls?.card) || webpUrl(urls?.sm) || fallback
}

function webpUrl(entry: CatalogImageSize | string | null | undefined) {
  if (!entry || typeof entry === 'string')
    return ''
  return entry.webp || ''
}

export function catalogCardPrice(product: CatalogProduct) {
  const soldOut = product.stock.total_quantity < 1
  if (soldOut && product.price.current === 0)
    return ''
  if (product.price.formatted)
    return product.price.formatted
  return `${product.price.current.toLocaleString('ru-RU')} ₽`
}

export function catalogCardChips(product: CatalogProduct): CatalogCardChip[] {
  const chips: CatalogCardChip[] = []

  if (product.stock.total_quantity < 1) {
    chips.push({ id: 'sold-out', title: 'Sold out', dark: true })
  }

  const saleStart = catalogSaleStartLabel(product)
  if (saleStart)
    chips.push({ id: 'sale-start', title: saleStart, dark: true })

  // const earn = catalogEarnPoints(product)
  // if (earn > 0) {
  //   chips.push({
  //     id: 'earn',
  //     title: `+${earn.toLocaleString('ru-RU')} баллов`,
  //     dark: true,
  //   })
  // }

  if (product.flags?.is_limited)
    chips.push({ id: 'limited', title: 'Individual', dark: true })

  if (product.flags?.last_sale)
    chips.push({ id: 'last-sale', title: 'Last Sale', dark: true })

  return chips
}

export function catalogCardColors(product: CatalogProduct): CatalogCardColor[] {
  const items: CatalogCardColor[] = []
  const seen = new Set<string>()

  const push = (item: {
    color?: string | null
    slug?: string | null
    color_hex?: string | null
    colors?: CatalogColorItem[]
  }) => {
    const slug = item.slug?.trim()
    const label = item.color?.trim()
    if (!slug || !label || seen.has(slug))
      return
    seen.add(slug)
    const hexes = colorHexes(item.colors, item.color_hex)
    items.push({
      slug,
      label,
      selected: slug === product.slug,
      style: colorStyle(hexes),
      light: hexes.some(isLightHex),
    })
  }

  push(product)
  for (const variant of product.color_variants ?? [])
    push(variant)

  return items.sort((a, b) => a.label.localeCompare(b.label, 'ru', { sensitivity: 'base' }))
}

// function catalogEarnPoints(product: CatalogProduct) {
//   if (product.loyalty?.excluded)
//     return 0
//   const value = product.loyalty?.earn_preview ?? product.loyalty_points_earn_preview ?? 0
//   return Number(value) || 0
// }

function catalogSaleStartLabel(product: CatalogProduct) {
  if (!saleNotStarted(product))
    return ''
  const raw = product.arrival_date?.trim() || product.preorder_estimated_arrival_date?.trim()
  if (!raw)
    return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime()))
    return ''
  const label = date.toLocaleDateString('ru-RU')
  return `Старт продаж ${label}`
}

function saleNotStarted(product: CatalogProduct) {
  if (product.drop?.can_purchase === false)
    return true
  const raw = product.arrival_date?.trim() || product.preorder_estimated_arrival_date?.trim()
  if (!raw)
    return false
  const saleStart = new Date(raw)
  if (Number.isNaN(saleStart.getTime()))
    return false
  saleStart.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return saleStart > today
}

function colorHexes(colors?: CatalogColorItem[], colorHex?: string | null) {
  const fromList = (colors ?? [])
    .map(item => item.hex?.trim())
    .filter((hex): hex is string => Boolean(hex))
  if (fromList.length)
    return fromList
  return colorHex?.trim() ? [colorHex.trim()] : []
}

function colorStyle(hexes: string[]) {
  if (hexes.length >= 2) {
    return { background: `linear-gradient(135deg, ${hexes[0]} 50%, ${hexes[1]} 50%)` }
  }
  return { backgroundColor: hexes[0] || '#e5e5e5' }
}

function isLightHex(hex: string) {
  const normalized = hex.trim().toUpperCase()
  return normalized === '#FFFFFF' || normalized === '#FFF' || normalized === '#F3EEE7'
}
