<template>
  <ClientOnly>
    <section v-if="items.length">
      <h2 class="mb-6 text-lg leading-[120%] tracking-tight">
        Смотрите также
      </h2>
      <swiper-container
        ref="swiperRef"
        :init="false"
      >
        <swiper-slide
          v-for="item in items"
          :key="item.slug"
        >
          <CatalogProductCard :product="item" />
        </swiper-slide>
      </swiper-container>
    </section>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { SwiperContainer } from 'swiper/element'
import { teaserToCatalogProduct } from '~/utils/product'

const { product } = useProduct()

const swiperRef = ref<SwiperContainer | null>(null)
const items = computed(() => (product.value.recommendations ?? []).map(teaserToCatalogProduct))

useSwiper(swiperRef, {
  slidesPerView: 2.1,
  spaceBetween: 8,
  breakpoints: {
    640: { slidesPerView: 3.1, spaceBetween: 16 },
    1025: { slidesPerView: 4, spaceBetween: 16 },
  },
})
</script>
