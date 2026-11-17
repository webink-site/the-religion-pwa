<template>
  <UiModal
    v-model="open"
    side="right"
    :title="product?.name ?? 'Товар'"
  >
    <ProductQuickViewBody
      v-if="product"
      :product="product"
    />
    <div
      v-else
      class="flex justify-center py-10"
    >
      <UiLoader />
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const slug = defineModel<string | null>('slug', { default: null })

const productStore = useProductStore()
const product = ref<Product | null>(null)

const open = computed({
  get: () => slug.value !== null,
  set: (value) => {
    if (!value)
      slug.value = null
  },
})

watch(slug, async (value) => {
  product.value = null
  if (!value)
    return
  try {
    const response = await productStore.load(value)
    if (slug.value === value)
      product.value = response.data
  }
  catch {
    slug.value = null
  }
})
</script>
