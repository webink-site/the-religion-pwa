<template>
  <NuxtLink
    :to="`/catalog?categories=${slug}`"
    class="block group"
  >
    <div class="relative aspect-[4/5] overflow-hidden bg-surface">
      <img
        v-if="image"
        :src="image"
        :alt="title"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      >
      <p class="absolute bottom-4 left-4 right-4 font-spectral font-medium text-black text-lg sm:text-xl tracking-tight leading-[120%]">
        {{ title }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  image?: string
  title: string
  slug: string
}>()
</script>
