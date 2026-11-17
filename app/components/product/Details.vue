<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="divide-y divide-line border-y border-line text-sm">
    <UiAccordion
      v-for="item in product.accordions"
      :key="item.title"
      :title="item.title"
      header-class="py-4"
    >
      <div
        v-if="item.content"
        class="product-rich body-txt pb-4"
        v-html="item.content"
      />
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.title"
        class="mb-4 h-auto w-full"
        loading="lazy"
      >
    </UiAccordion>

    <UiAccordion
      v-if="sizeChartImage || sizeChart.length"
      title="Таблица размеров"
      header-class="py-4"
    >
      <div class="space-y-3 pb-4">
        <img
          v-if="sizeChartImage"
          :src="sizeChartImage"
          alt="Таблица размеров"
          class="h-auto w-full"
          loading="lazy"
        >
        <ProductSizeTable
          v-if="sizeChart.length"
          :rows="sizeChart"
        />
      </div>
    </UiAccordion>

    <button
      v-if="product.measurement_guide"
      type="button"
      class="flex w-full items-center justify-between py-4 text-left leading-[130%] tracking-ui"
      @click="modal = 'measure'"
    >
      Как произвести замеры
      <ChevronRight
        class="size-[18px]"
        :stroke-width="1.4"
      />
    </button>

    <UiAccordion
      v-if="product.shop_the_look?.items.length"
      title="Купить этот образ"
      header-class="py-4"
    >
      <ProductLook :items="product.shop_the_look.items" />
    </UiAccordion>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

const { product, modal } = useProduct()

const sizeChart = computed(() => product.value.size_chart_table ?? [])
const sizeChartImage = computed(() => product.value.images.size_chart || '')
</script>

<style scoped>
.product-rich :deep(p + p) {
  margin-top: 0.75rem;
}
</style>
