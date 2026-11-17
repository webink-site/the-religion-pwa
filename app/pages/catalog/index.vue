<template>
  <div :class="isNativeApp ? 'pt-24' : 'pt-16'">
    <CatalogToolbar />
    <CatalogFilterSheet />
    <CatalogProductGrid
      :products="products"
      :pending="pending"
      :loading-more="loadingMore"
      :has-more="hasMore"
      @load-more="loadMore"
    />
  </div>
</template>

<script setup lang="ts">
const { isNativeApp } = useNativeApp()
const {
  products,
  pending,
  loadingMore,
  hasMore,
  loadMore,
} = await useCatalogProducts()
</script>
