<template>
  <button
    type="button"
    class="ui-btn-base bg-[var(--ui-surface)] text-[var(--ui-ink)] hover:bg-[var(--ui-surface-hover)] disabled:opacity-50 disabled:pointer-events-none"
    :class="{ '!w-full': block }"
    :disabled="disabled || loading"
  >
    <span
      v-if="loading"
      class="inline-block size-3.5 border-2 border-[var(--ui-ink)] border-t-transparent rounded-full animate-spin mr-2"
    />
    <slot>{{ title }}</slot>
  </button>
</template>

<script setup lang="ts">
const {
  title = '',
  disabled = false,
  loading = false,
  block = false,
} = defineProps<{
  title?: string
  disabled?: boolean
  loading?: boolean
  block?: boolean
}>()
</script>
