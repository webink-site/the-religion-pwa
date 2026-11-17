<template>
  <div class="grid grid-cols-2 gap-1">
    <button
      v-for="(slide, index) in slides"
      :key="slide.src"
      type="button"
      class="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-surface"
      @click="lightboxIndex = index"
    >
      <img
        :src="slide.src"
        :srcset="slide.srcset || undefined"
        sizes="(min-width: 1025px) 33vw, 50vw"
        :alt="product.name"
        class="absolute inset-0 size-full object-cover"
        :loading="index < 2 ? 'eager' : 'lazy'"
        :fetchpriority="index === 0 ? 'high' : 'auto'"
        decoding="async"
      >
    </button>

    <ProductLightbox v-model:index="lightboxIndex" />
  </div>
</template>

<script setup lang="ts">
const { product, slides } = useProduct()

const lightboxIndex = ref<number | null>(null)
</script>
