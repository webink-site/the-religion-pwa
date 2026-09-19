<template>
  <div class="relative">
    <svg
      width="94"
      height="94"
      viewBox="0 0 94 94"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
    >
      <path
        d="M69.4775 28.3037H24.8292C18.8484 28.3037 14 33.1521 14 39.1329V75.1711C14 81.1519 18.8484 86.0003 24.8292 86.0003H69.4775C75.4583 86.0003 80.3068 81.1519 80.3068 75.1711V39.1329C80.3068 33.1521 75.4583 28.3037 69.4775 28.3037Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M64.5955 39.8427V24.7528C64.5955 14.9482 56.6473 7 46.8427 7C37.038 7 29.0898 14.9482 29.0898 24.7528L29.0898 39.8427"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
    <span
      v-if="count"
      class="absolute left-1/2 top-[8px] -translate-x-1/2 text-[8px] text-current"
    >{{ count }}</span>
  </div>
</template>

<script setup lang="ts">
const { count = 0 } = defineProps<{
  count?: number
}>()
</script>
