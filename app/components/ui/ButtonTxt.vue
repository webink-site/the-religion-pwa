<template>
  <button
    type="button"
    class="cursor-pointer text-sm leading-[130%] tracking-ui text-ink underline underline-offset-4 hover:opacity-60 transition-opacity"
  >
    <slot>{{ title }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
