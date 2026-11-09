<template>
  <div aria-hidden="true">
    <div class="mb-2 aspect-[4/5] animate-pulse bg-surface" />
    <div :class="{ 'pl-4 sm:pl-0': offset }">
      <div class="mb-2 h-3.5 w-3/4 animate-pulse bg-surface" />
      <div class="flex items-center justify-between gap-3">
        <div class="h-3.5 w-16 animate-pulse bg-surface" />
        <div class="ml-auto flex gap-1.5 pr-4 sm:pr-0">
          <span
            v-for="dot in 3"
            :key="dot"
            class="size-3 animate-pulse rounded-full bg-surface"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  offset?: boolean
}>()
</script>
