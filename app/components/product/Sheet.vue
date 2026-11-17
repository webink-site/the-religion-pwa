<template>
  <div>
    <div
      class="pointer-events-none fixed inset-x-0 bottom-0 z-[19] h-56 bg-gradient-to-t from-black/70 via-black/35 to-transparent"
      :class="chromeTransition"
      :style="{ opacity: 1 - progress }"
      aria-hidden="true"
    />

    <div
      class="fixed inset-x-0 top-0 z-20 flex flex-col overflow-hidden"
      :class="animating ? 'transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,0.82,0.16,1)]' : ''"
      :style="sheetStyle"
      @transitionend="onTransitionEnd"
    >
      <div
        ref="handleRef"
        class="flex w-full shrink-0 touch-none justify-center pt-2 pb-4"
        @pointerdown="onHandlePointerDown"
      >
        <span
          class="block h-1 w-10 rounded-full"
          :class="chromeTransition"
          :style="handleStyle"
        />
      </div>

      <div
        ref="scrollerRef"
        class="min-h-0 flex-1 overscroll-y-contain [scrollbar-width:none]"
        :class="progress >= 1 && !dragging ? 'overflow-y-auto' : 'overflow-hidden'"
      >
        <div
          ref="peekRef"
          class="select-none px-4 pb-3"
          :class="[chromeTransition, { 'touch-none': progress < 1 }]"
          :style="peekStyle"
          @pointerdown="onPeekPointerDown"
        >
          <slot
            name="peek"
            :progress="progress"
          />
        </div>

        <div
          v-show="progress > 0"
          class="px-4 pb-4"
          :style="{ opacity: Math.min(1, progress * 1.35) }"
        >
          <slot />
        </div>
      </div>
    </div>

    <div
      ref="ctaRef"
      class="fixed inset-x-0 bottom-0 z-30 border-t px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
      :class="chromeTransition"
      :style="ctaStyle"
    >
      <slot name="cta" />
    </div>
  </div>
</template>

<script setup lang="ts">
const expanded = defineModel<boolean>('expanded', { default: false })

const handleRef = ref<HTMLElement | null>(null)
const peekRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const scrollerRef = ref<HTMLElement | null>(null)

const {
  progress,
  dragging,
  animating,
  offset,
  ctaHeight,
  setExpanded,
  nudge,
  onHandlePointerDown,
  onPeekPointerDown,
  onTransitionEnd,
} = useBottomSheet(expanded, {
  handle: handleRef,
  peek: peekRef,
  cta: ctaRef,
  scroller: scrollerRef,
})

const chromeTransition = computed(() => animating.value
  ? 'transition-[color,background-color,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,0.82,0.16,1)]'
  : '')

const sheetStyle = computed(() => ({
  bottom: `${ctaHeight.value}px`,
  transform: `translate3d(0, ${offset.value}px, 0)`,
  backgroundColor: `rgba(255, 255, 255, ${progress.value})`,
}))

const peekStyle = computed(() => {
  const channel = Math.round(255 - 223 * progress.value)
  return { color: `rgb(${channel}, ${channel}, ${channel})` }
})

const handleStyle = computed(() => {
  const channel = Math.round(255 - 191 * progress.value)
  return { backgroundColor: `rgba(${channel}, ${channel}, ${channel}, ${0.7 - 0.45 * progress.value})` }
})

const ctaStyle = computed(() => ({
  backgroundColor: `rgba(255, 255, 255, ${progress.value})`,
  borderTopColor: `rgba(229, 229, 229, ${progress.value})`,
}))

defineExpose({
  nudge,
  open: () => setExpanded(true),
})
</script>
