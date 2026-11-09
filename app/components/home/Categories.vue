<template>
  <section class="relative z-0 py-4 overflow-x-hidden">
    <div class="container">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg tracking-tight leading-[120%]">
          Категории
        </h2>

        <div
          v-if="items.length > 1"
          class="flex items-center gap-1"
        >
          <button
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-ui cursor-pointer disabled:cursor-default disabled:opacity-30"
            :disabled="isBeginning"
            aria-label="Предыдущая категория"
            @click="swiper.prev()"
          >
            <ChevronLeft class="size-5" />
          </button>
          <button
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-ui cursor-pointer disabled:cursor-default disabled:opacity-30"
            :disabled="isEnd"
            aria-label="Следующая категория"
            @click="swiper.next()"
          >
            <ChevronRight class="size-5" />
          </button>
        </div>
      </div>

      <ClientOnly>
        <swiper-container
          v-if="items.length"
          ref="swiperRef"
          :init="false"
        >
          <swiper-slide
            v-for="item in items"
            :key="item.slug"
          >
            <CatalogCategoryCard
              :image="item.image ?? ''"
              :title="item.title"
              :slug="item.slug"
            />
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type { SwiperContainer } from 'swiper/element'
import type { ICategory } from '~/types/catalog'

const config = useRuntimeConfig()

const { data: categoriesResponse } = await useFetch<Record<string, ICategory> | ICategory[]>(
  `${config.public.apiUrl}/categories`,
)

const items = computed(() => {
  const raw = categoriesResponse.value
  if (!raw)
    return [] as ICategory[]

  const list = Array.isArray(raw) ? raw : Object.values(raw)

  return list.filter(category =>
    category.image
    && category.slug !== 'bez-gruppy-tovarov',
  )
})

const swiperRef = ref<SwiperContainer | null>(null)
const isBeginning = ref(true)
const isEnd = ref(false)

const swiper = useSwiper(swiperRef, {
  slidesPerView: 1.15,
  spaceBetween: 8,
  breakpoints: {
    320: {
      slidesPerView: 1.15,
      spaceBetween: 8,
    },
    640: {
      slidesPerView: 2.2,
      spaceBetween: 10,
    },
    1025: {
      slidesPerView: 3,
      spaceBetween: 12,
    },
  },
  on: {
    init() {
      unlockSwiperOverflow()
      syncNavState()
    },
    slideChange: syncNavState,
    resize: syncNavState,
  },
})

function unlockSwiperOverflow() {
  const host = swiperRef.value as (SwiperContainer & { shadowRoot?: ShadowRoot | null }) | null
  const root = host?.shadowRoot
  if (!root)
    return

  root.querySelectorAll<HTMLElement>('.swiper, .swiper-wrapper').forEach((el) => {
    el.style.setProperty('overflow', 'visible', 'important')
  })
}

function syncNavState() {
  const instance = swiper.instance.value
  if (!instance)
    return

  isBeginning.value = instance.isBeginning
  isEnd.value = instance.isEnd
}
</script>
