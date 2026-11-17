<template>
  <div>
    <div class="lg:hidden">
      <ProductMobileGallery @last-slide="nudgeSheet" />
      <ProductSheet
        ref="sheetRef"
        v-model:expanded="sheetOpen"
      >
        <template #peek="{ progress }">
          <ProductPeek :progress="progress" />
        </template>

        <ProductInfo compact />
        <ProductRecommendations class="pt-10" />
        <LayoutFooter class="-mx-4" />

        <template #cta>
          <ProductActions />
        </template>
      </ProductSheet>
    </div>

    <div class="hidden px-4 pt-16 lg:grid lg:grid-cols-12 lg:gap-8">
      <ProductDesktopGallery class="col-span-8" />
      <aside class="col-span-4">
        <div class="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto py-8 [scrollbar-width:none]">
          <ProductInfo />
        </div>
      </aside>
    </div>
    <ProductRecommendations class="hidden px-4 pt-20 lg:block" />

    <ProductModals />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

definePageMeta({
  layout: 'product',
  key: route => route.fullPath,
})

const route = useRoute()
const productStore = useProductStore()
const sheetOpen = useProductSheetOpen()
const sheetRef = ref<{ nudge: () => void } | null>(null)

const slug = String(route.params.slug)
const { data } = await useAsyncData(`product:${slug}`, () => productStore.load(slug))

if (!data.value?.data)
  throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })

const product = computed(() => data.value!.data as Product)
const seo = computed(() => data.value?.seo)

provideProduct(product, {
  onMissingOptions: () => {
    if (window.innerWidth <= 1024)
      sheetOpen.value = true
  },
})

sheetOpen.value = false

function nudgeSheet() {
  setTimeout(() => sheetRef.value?.nudge(), 220)
}

useSeoMeta({
  title: () => seo.value?.title || product.value.name,
  ogTitle: () => seo.value?.title || product.value.name,
  description: () => seo.value?.description,
  ogDescription: () => seo.value?.description,
  ogImage: () => seo.value?.image || product.value.images.main,
})

useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.value.name,
      'image': product.value.images.main,
      'description': seo.value?.description || product.value.name,
      'offers': {
        '@type': 'Offer',
        'priceCurrency': product.value.price.currency || 'RUB',
        'price': product.value.price.current,
        'availability': product.value.stock.total_quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    }),
  }],
}))
</script>
