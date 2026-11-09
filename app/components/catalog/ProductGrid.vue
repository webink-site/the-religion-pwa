<template>
  <section class="mt-4">
    <div
      v-if="pending"
      class="grid grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
    >
      <CatalogProductSkeleton
        v-for="item in 8"
        :key="item"
        :offset="(item - 1) % 2 === 0"
      />
    </div>

    <p
      v-else-if="!products.length"
      class="body-txt py-10"
    >
      По этому запросу ничего не найдено
    </p>

    <template v-else>
      <div class="grid grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        <CatalogProductCard
          v-for="(product, index) in products"
          :key="product.slug"
          :product="product"
          :offset="index % 2 === 0"
          :priority="index < 4"
        />
        <CatalogProductSkeleton
          v-for="item in loadingMore ? 2 : 0"
          :key="`more-${item}`"
          :offset="(products.length + item - 1) % 2 === 0"
        />
      </div>
      <div
        v-if="hasMore"
        ref="sentinelRef"
        class="h-px"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalog'

const props = defineProps<{
  products: CatalogProduct[]
  pending: boolean
  loadingMore: boolean
  hasMore: boolean
}>()

const emit = defineEmits<{ loadMore: [] }>()

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function bindSentinel() {
  observer?.disconnect()
  if (!import.meta.client || !sentinelRef.value || !props.hasMore)
    return
  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting))
      emit('loadMore')
  }, { rootMargin: '480px 0px' })
  observer.observe(sentinelRef.value)
}

watch(() => [sentinelRef.value, props.hasMore, props.products.length, props.loadingMore], () => {
  if (props.loadingMore)
    return
  bindSentinel()
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>
