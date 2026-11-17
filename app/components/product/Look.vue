<template>
  <div class="grid grid-cols-2 gap-2 pb-4">
    <button
      v-for="item in items"
      :key="item.slug"
      type="button"
      class="text-left"
      @click="quickSlug = item.slug"
    >
      <div class="mb-2 aspect-[4/5] overflow-hidden bg-surface">
        <img
          :src="item.images.md || item.images.original"
          :alt="item.name"
          class="size-full object-cover"
          loading="lazy"
          decoding="async"
        >
      </div>
      <p class="line-clamp-1 text-xs">
        {{ item.name }}
      </p>
      <p class="body-txt">
        {{ item.formatted_price || `${item.price.toLocaleString('ru-RU')} ₽` }}
      </p>
    </button>

    <ProductQuickView v-model:slug="quickSlug" />
  </div>
</template>

<script setup lang="ts">
import type { ProductTeaser } from '~/types/product'

defineProps<{
  items: ProductTeaser[]
}>()

const quickSlug = ref<string | null>(null)
</script>
