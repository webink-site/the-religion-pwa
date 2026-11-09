<template>
  <article>
    <div class="relative mb-2">
      <button
        type="button"
        class="absolute top-2 right-2 z-20 p-1 text-ink"
        :aria-label="inWishlist ? 'Убрать из избранного' : 'В избранное'"
        @click="wishlistStore.toggle(product.id)"
      >
        <Heart
          class="size-4 sm:size-6"
          :fill="inWishlist ? 'currentColor' : 'none'"
        />
      </button>
      <NuxtLink
        :to="`/catalog/${product.slug}`"
        class="block"
      >
        <div
          ref="mediaRef"
          class="group relative aspect-[4/5] overflow-hidden bg-surface"
        >
          <template v-if="showMedia">
            <img
              :src="photos.main"
              :alt="product.name"
              class="absolute inset-0 size-full object-cover"
              :fetchpriority="priority ? 'high' : 'auto'"
              decoding="async"
            >
            <img
              v-if="photos.hover"
              ref="hoverRef"
              :src="photos.hover"
              alt=""
              class="pointer-events-none absolute inset-0 size-full object-cover opacity-0"
              :class="hoverReady ? 'transition-opacity duration-150 group-hover:opacity-100' : ''"
              decoding="async"
              fetchpriority="low"
              @load="hoverReady = true"
            >
          </template>
          <div
            v-if="chips.length"
            class="absolute top-2 left-2 z-10 flex max-w-[calc(100%-3rem)] flex-wrap gap-1"
          >
            <UiChip
              v-for="chip in chips"
              :key="chip.id"
              :title="chip.title"
              :dark="chip.dark"
            />
          </div>
        </div>
      </NuxtLink>
    </div>

    <div :class="{ 'pl-4 sm:pl-0': offset }">
      <NuxtLink
        :to="`/catalog/${product.slug}`"
        class="block"
      >
        <p class="text-xs line-clamp-1">
          {{ product.name }}
        </p>
      </NuxtLink>
      <div class="flex items-center justify-between gap-3">
        <NuxtLink
          v-if="price"
          :to="`/catalog/${product.slug}`"
          class="body-txt shrink-0"
        >
          {{ price }}
        </NuxtLink>
        <div
          v-if="colors.length"
          class="ml-auto flex items-center gap-1.5 pr-4 sm:pr-0"
        >
          <CatalogColorDot
            v-for="color in colors"
            :key="color.slug"
            :label="color.label"
            :selected="color.selected"
            :light="color.light"
            :swatch-style="color.style"
            :class="color.selected ? 'outline outline-1 outline-offset-1 outline-ink' : ''"
            @select="openColor(color.slug)"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalog'
import { Heart } from '@lucide/vue'
import { catalogCardChips, catalogCardColors, catalogCardPhotos, catalogCardPrice } from '~/utils/catalogCard'

const props = defineProps<{
  product: CatalogProduct
  offset?: boolean
  priority?: boolean
}>()

const mediaRef = ref<HTMLElement | null>(null)
const hoverRef = ref<HTMLImageElement | null>(null)
const showMedia = ref(Boolean(props.priority))
const hoverReady = ref(false)
let observer: IntersectionObserver | null = null

const wishlistStore = useWishlistStore()
const inWishlist = computed(() => wishlistStore.has(props.product.id))
const photos = computed(() => catalogCardPhotos(props.product))
const chips = computed(() => catalogCardChips(props.product))
const colors = computed(() => catalogCardColors(props.product))
const price = computed(() => catalogCardPrice(props.product))

function openColor(slug: string) {
  if (slug === props.product.slug)
    return
  navigateTo(`/catalog/${slug}`)
}

watch(hoverRef, (image) => {
  if (image?.complete && image.naturalWidth > 0)
    hoverReady.value = true
})

onMounted(() => {
  if (showMedia.value || !mediaRef.value)
    return

  observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting))
      return
    showMedia.value = true
    observer?.disconnect()
    observer = null
  }, { rootMargin: '240px 0px' })

  observer.observe(mediaRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>
