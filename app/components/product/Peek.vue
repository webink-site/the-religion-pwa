<template>
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0 space-y-1">
      <p class="text-[15px] leading-[130%] tracking-tight">
        {{ product.name }}
      </p>
      <ProductChips
        :on-photo="progress < 0.45"
        :hide="progress > 0 ? [] : ['earn']"
      />
    </div>

    <div
      v-if="colors.length"
      class="flex shrink-0 items-center gap-2 rounded-ui px-1.5 py-1"
      :style="plaqueStyle"
      data-sheet-static
    >
      <CatalogColorDot
        v-for="color in colors"
        :key="color.slug"
        :label="color.label"
        :selected="color.selected"
        :light="color.light && progress >= 0.45"
        :swatch-style="color.style"
        class="!size-5"
        :class="color.selected ? 'outline outline-1 outline-offset-1 outline-current' : ''"
        @select="openColor(color.slug)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { progress } = defineProps<{
  progress: number
}>()

const { product, colors } = useProduct()

const plaqueStyle = computed(() => {
  const fade = 1 - progress
  const blur = fade > 0.03 ? `blur(${12 * fade}px)` : 'none'
  return {
    backgroundColor: `rgba(255, 255, 255, ${0.28 * fade})`,
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
  }
})

function openColor(slug: string) {
  if (slug !== product.value.slug)
    navigateTo(`/catalog/${slug}`)
}
</script>
