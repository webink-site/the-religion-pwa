<template>
  <Teleport to="body">
    <Transition name="fade-slide">
      <div
        v-if="index !== null"
        class="fixed inset-0 z-[80] space-y-4 overflow-y-auto bg-white pb-24"
        role="dialog"
        aria-modal="true"
        aria-label="Фотографии товара"
      >
        <button
          type="button"
          class="fixed right-4 top-4 z-10 inline-flex size-10 items-center justify-center mix-blend-difference text-white"
          aria-label="Закрыть"
          @click="index = null"
        >
          <X
            class="size-6"
            :stroke-width="1.3"
          />
        </button>
        <p class="caption-txt px-4 pt-4 text-center text-muted">
          Нажмите на фото, чтобы увеличить. Листайте вниз — следующие кадры.
        </p>
        <button
          v-for="(slide, slideIndex) in slides"
          :key="slide.src"
          :ref="el => setSlideRef(el, slideIndex)"
          type="button"
          class="block w-full overflow-hidden"
          @click="zoomed = zoomed === slideIndex ? null : slideIndex"
        >
          <img
            :src="slide.src"
            :srcset="slide.srcset || undefined"
            sizes="100vw"
            :alt="`${product.name}, фото ${slideIndex + 1}`"
            class="w-full transition-transform duration-200"
            :class="zoomed === slideIndex ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'"
            loading="lazy"
            decoding="async"
          >
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'

const index = defineModel<number | null>('index', { default: null })

const { product, slides } = useProduct()

const zoomed = ref<number | null>(null)
const slideRefs: HTMLElement[] = []

function setSlideRef(el: unknown, slideIndex: number) {
  if (el instanceof HTMLElement)
    slideRefs[slideIndex] = el
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    index.value = null
}

watch(index, async (value) => {
  zoomed.value = null
  document.body.style.overflow = value === null ? '' : 'hidden'
  if (value === null) {
    window.removeEventListener('keydown', onKeydown)
    return
  }
  window.addEventListener('keydown', onKeydown)
  await nextTick()
  slideRefs[value]?.scrollIntoView({ block: 'start' })
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
