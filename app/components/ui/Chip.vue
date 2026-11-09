<template>
  <span
    class="caption-txt inline-flex w-fit items-center rounded-ui px-1.5 py-0.5"
    :class="dark ? 'bg-ink text-white' : 'bg-surface text-ink'"
  >
    {{ title }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  dark?: boolean
}>()
</script>
