<template>
  <button
    type="button"
    class="ui-btn-base bg-surface text-ink hover:bg-surface-hover disabled:opacity-50 disabled:pointer-events-none"
    :class="[
      sizeClasses,
      block ? '!w-full' : '',
    ]"
    :disabled="disabled || loading"
  >
    <span
      v-if="loading"
      class="inline-block size-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin mr-2"
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
  size = 'md',
} = defineProps<{
  title?: string
  disabled?: boolean
  loading?: boolean
  block?: boolean
  size?: 'sm' | 'md'
}>()

const sizeClasses = computed(() => {
  if (size === 'sm')
    return '!min-h-0 sm:!min-h-0 !py-2.5'
  return ''
})
</script>
