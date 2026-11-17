<template>
  <div
    class="px-4"
    :class="isNativeApp ? 'pt-28' : 'pt-20'"
  >
    <p class="body-txt text-ink">
      {{ slug }}
    </p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { isNativeApp } = useNativeApp()
const slug = computed(() => String(route.params.slug || ''))
</script>
