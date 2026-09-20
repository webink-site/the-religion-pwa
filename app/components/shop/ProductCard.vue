<template>
  <nuxt-link to="/" class="">
    <div
      class="aspect-[0.659997] bg-gray-200 relative group"
      :class="{
        'mb-2': !props.minimalMode,
      }"
    >
      <img
        :src="props.mainImg"
        class="object-cover w-full h-full"
        alt="props.name"
        loading="lazy"
        decoding="async"
      >
      <IconsPlus class="size-6 absolute bottom-6 left-1/2 -translate-x-1/2 group-hover:rotate-180 transition-all" />
    </div>
    <div v-if="!props.minimalMode">
      <p class="text-xs">{{ props.name }}</p>
      <p class="text-xs">39 980 ₽</p>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  minimalMode?: boolean
  mainImg: string
}>()
</script>
