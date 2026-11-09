<template>
  <div
    class="px-4 pb-28"
    :class="isNativeApp ? 'pt-28' : 'pt-20'"
  >
    <CatalogToolbar />
    <CatalogFilterSheet />
  </div>
</template>

<script setup lang="ts">
const { isNativeApp } = useNativeApp()
</script>
