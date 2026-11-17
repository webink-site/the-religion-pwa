<template>
  <div v-if="colors.length">
    <p class="body-txt mb-2">
      Цвет: {{ product.color }}
    </p>
    <div class="flex flex-wrap gap-2">
      <NuxtLink
        v-for="color in colors"
        :key="color.slug"
        :to="`/catalog/${color.slug}`"
        :title="color.label"
        :aria-label="color.label"
        :aria-current="color.selected ? 'true' : undefined"
        class="flex size-8 items-center justify-center rounded-full outline outline-1 outline-offset-2"
        :class="[
          color.selected ? 'outline-ink' : 'outline-transparent hover:outline-line',
          color.light ? 'border border-line' : '',
        ]"
        :style="color.style"
      >
        <Check
          v-if="color.selected"
          class="size-4"
          :class="color.light ? 'text-ink' : 'text-white'"
          :stroke-width="1.6"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from '@lucide/vue'

const { product, colors } = useProduct()
</script>
