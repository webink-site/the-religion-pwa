<template>
  <div class="space-y-4">
    <div class="-mx-4 flex snap-x snap-mandatory gap-1 overflow-x-auto [scrollbar-width:none] sm:-mx-6">
      <img
        v-for="slide in slides"
        :key="slide.src"
        :src="slide.preview"
        :alt="product.name"
        class="aspect-[4/5] w-[85%] shrink-0 snap-start bg-surface object-cover"
        loading="lazy"
      >
    </div>

    <div class="space-y-2">
      <p class="body-txt">
        {{ price }}
      </p>
      <ProductChips :hide="['delivery', 'earn']" />
    </div>

    <ProductColors />
    <ProductPurchaseOptions />
    <ProductActions />

    <UiButton
      title="Подробнее о товаре"
      variant="link"
      @click="navigateTo(`/catalog/${product.slug}`)"
    />

    <ProductModals />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
  product: Product
}>()

const { slides, price } = provideProduct(toRef(props, 'product'))
</script>
