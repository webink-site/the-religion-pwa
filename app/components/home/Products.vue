<template>
  <div class="pb-20 pt-4 grid grid-cols-2">
    <!-- <pre>{{ data?.data }}</pre> -->
    <ShopProductCard
      v-for="(item, index) in data?.data"
      :key="index"
      :minimal-mode="true"
      :name="item.name"
      :main-img="item.images.main"
      :class="getGridCols(index)"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const { data } = useFetch(`${config.public.apiUrl}/home/top-products`)

function getGridCols(index: number) {
  return index % 6 < 2 ? 'col-span-2' : 'col-span-1'
}
</script>
