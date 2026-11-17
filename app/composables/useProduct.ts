import type { InjectionKey, Ref } from 'vue'
import type { Product, ProductCta, ProductModal } from '~/types/product'
import { catalogCardColors, catalogCardPrice, catalogSaleStartLabel } from '~/utils/catalogCard'
import {
  availableSizesLabel,
  canPurchaseNow,
  formatDate,
  productChips,
  productIsOneSize,
  productSizeOptions,
  productSlides,
  shouldOfferNotify,
} from '~/utils/product'

type ProductContext = ReturnType<typeof createProductContext>

const PRODUCT_KEY: InjectionKey<ProductContext> = Symbol('product')

export function useProductSheetOpen() {
  return useState('product-sheet-open', () => false)
}

export function provideProduct(product: Ref<Product>, options: { onMissingOptions?: () => void } = {}) {
  const context = createProductContext(product, options)
  provide(PRODUCT_KEY, context)
  return context
}

export function useProduct() {
  const context = inject(PRODUCT_KEY)
  if (!context)
    throw new Error('useProduct() must be used inside provideProduct()')
  return context
}

function createProductContext(product: Ref<Product>, options: { onMissingOptions?: () => void }) {
  const authStore = useAuthStore()
  const productStore = useProductStore()

  const selectedSize = ref<number | null>(null)
  const serialNumber = ref<number | null>(null)
  const sizeError = ref(false)
  const serialError = ref(false)
  const notifyPending = ref(false)
  const modal = ref<ProductModal | null>(null)

  const slides = computed(() => productSlides(product.value))
  const chips = computed(() => productChips(product.value))
  const colors = computed(() => catalogCardColors(product.value))
  const price = computed(() => catalogCardPrice(product.value))
  const sizes = computed(() => productSizeOptions(product.value))
  const isOneSize = computed(() => productIsOneSize(product.value))
  const serialNumbers = computed(() => product.value.serial_numbers?.numbers ?? [])
  const stockLabel = computed(() => availableSizesLabel(product.value))

  const purchasable = computed(() => canPurchaseNow(product.value))
  const saleStartLabel = computed(() => catalogSaleStartLabel(product.value))
  const preorderEta = computed(() => {
    const date = product.value.flags?.preorder && purchasable.value
      ? formatDate(product.value.preorder_estimated_arrival_date)
      : ''
    return date ? `Ожидаемая дата поступления: ${date}` : ''
  })

  const selectedSizeSoldOut = computed(() => {
    if (selectedSize.value == null)
      return false
    return sizes.value.find(size => size.id === selectedSize.value)?.disabled ?? false
  })

  const cta = computed<ProductCta>(() => {
    if (shouldOfferNotify(product.value))
      return 'notify'
    if (product.value.stock.total_quantity < 1 || selectedSizeSoldOut.value)
      return 'soldOut'
    return purchasable.value ? 'buy' : 'none'
  })

  const ctaTitle = computed(() => {
    const action = product.value.flags?.preorder ? 'Оформить предзаказ' : 'Добавить в корзину'
    return price.value ? `${action} · ${price.value}` : action
  })

  function validate() {
    sizeError.value = selectedSize.value == null && !isOneSize.value
    serialError.value = serialNumbers.value.length > 0 && serialNumber.value == null
    return !sizeError.value && !serialError.value && selectedSize.value != null
  }

  function addToCart() {
    if (!purchasable.value)
      return
    if (!validate()) {
      options.onMissingOptions?.()
      return
    }
    navigateTo('/cart')
  }

  async function notify(email?: string) {
    if (!authStore.loggedIn && !email) {
      modal.value = 'notify'
      return
    }
    notifyPending.value = true
    try {
      await productStore.subscribeNotify(product.value.slug, email)
      modal.value = null
    }
    finally {
      notifyPending.value = false
    }
  }

  watch(() => product.value.slug, () => {
    const [first] = sizes.value
    selectedSize.value = isOneSize.value && first && !first.disabled ? first.id : null
    serialNumber.value = null
    sizeError.value = false
    serialError.value = false
  }, { immediate: true })

  watch(selectedSize, (value) => {
    if (value != null)
      sizeError.value = false
  })

  watch(serialNumber, (value) => {
    if (value != null)
      serialError.value = false
  })

  return {
    product,
    slides,
    chips,
    colors,
    price,
    sizes,
    isOneSize,
    serialNumbers,
    stockLabel,
    purchasable,
    saleStartLabel,
    preorderEta,
    selectedSize,
    serialNumber,
    sizeError,
    serialError,
    cta,
    ctaTitle,
    modal,
    notifyPending,
    addToCart,
    notify,
  }
}
