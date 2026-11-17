<template>
  <div class="relative h-dvh w-full touch-pan-y overflow-hidden bg-surface">
    <ClientOnly>
      <swiper-container
        ref="swiperRef"
        :init="false"
        class="gallery-swiper block h-full"
      >
        <swiper-slide
          v-for="(slide, index) in slides"
          :key="slide.src"
          class="h-full"
        >
          <img
            v-if="isWarm(index)"
            :src="slide.src"
            :srcset="slide.srcset || undefined"
            sizes="100vw"
            :alt="product.name"
            class="size-full object-cover"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            decoding="async"
          >
        </swiper-slide>
      </swiper-container>

      <template #fallback>
        <img
          v-if="slides[0]"
          :src="slides[0].src"
          :alt="product.name"
          class="size-full object-cover"
          fetchpriority="high"
        >
      </template>
    </ClientOnly>

    <div
      v-if="slides.length > 1"
      class="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1.5 mix-blend-difference"
    >
      <button
        v-for="(slide, index) in slides"
        :key="slide.src"
        type="button"
        class="size-1.5 rounded-full"
        :class="index === active ? 'bg-white' : 'bg-white/40'"
        :aria-label="`Фото ${index + 1}`"
        @click="swiper.to(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SwiperContainer } from 'swiper/element'

const emit = defineEmits<{ lastSlide: [] }>()

const { product, slides } = useProduct()

const swiperRef = ref<SwiperContainer | null>(null)
const active = ref(0)
const seen = ref(new Set([0, 1]))

const swiper = useSwiper(swiperRef, {
  direction: 'vertical',
  slidesPerView: 1,
  spaceBetween: 0,
  resistanceRatio: 0.65,
  touchAngle: 70,
  speed: 420,
  on: {
    slideChange(instance) {
      const previous = active.value
      const last = slides.value.length - 1
      active.value = instance.activeIndex
      seen.value = new Set([...seen.value, active.value - 1, active.value, active.value + 1])
      if (last >= 1 && active.value === last && previous !== last)
        emit('lastSlide')
    },
  },
})

function isWarm(index: number) {
  return seen.value.has(index)
}
</script>

<style scoped>
.gallery-swiper::part(container),
.gallery-swiper::part(wrapper) {
  height: 100%;
}
</style>
