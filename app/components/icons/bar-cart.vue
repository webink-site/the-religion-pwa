<template>
  <div class="relative">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handbag preview-icon"><path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z" /><path d="M8 11V6a4 4 0 0 1 8 0v5" /></svg>

    <!-- <span
      v-if="count"
      class="absolute left-1/2 top-[8px] -translate-x-1/2 text-[8px] text-current"
    >{{ count }}</span> -->
    <span class="absolute -top-1 right-0 h-3 w-3 bg-black rounded-full flex justify-center items-center text-[8px] text-white">{{ count }}</span>
  </div>
</template>

<script setup lang="ts">
const { count = 0 } = defineProps<{
  count?: number
}>()
</script>
