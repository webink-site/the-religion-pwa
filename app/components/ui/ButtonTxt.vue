<template>
  <button
    type="button"
    class="cursor-pointer text-sm leading-[130%] text-[var(--ui-ink)] underline underline-offset-4 hover:opacity-60 transition-opacity"
    style="letter-spacing: var(--letter-spacing-ui)"
  >
    <slot>{{ title }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
