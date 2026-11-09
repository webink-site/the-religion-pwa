<template>
  <button
    type="button"
    class="ui-btn-base disabled:opacity-50 disabled:pointer-events-none"
    :class="[
      variantClasses,
      sizeClasses,
      block ? '!w-full' : '',
    ]"
    :disabled="disabled || loading"
  >
    <span
      v-if="loading"
      class="inline-block size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
    />
    <slot>{{ title }}</slot>
  </button>
</template>

<script setup lang="ts">
const {
  title = '',
  loading = false,
  disabled = false,
  error = false,
  block = false,
  variant = 'primary',
  size = 'md',
} = defineProps<{
  title?: string
  loading?: boolean
  disabled?: boolean
  error?: boolean
  block?: boolean
  variant?: 'primary' | 'transparent' | 'soft' | 'ghost' | 'link'
  size?: 'sm' | 'md'
}>()

const sizeClasses = computed(() => {
  if (size === 'sm')
    return '!min-h-0 sm:!min-h-0 !py-2.5'
  return ''
})

const variantClasses = computed(() => {
  if (error) {
    return 'bg-surface text-danger cursor-not-allowed'
  }

  switch (variant) {
    case 'transparent':
      return 'bg-transparent text-ink border border-ink hover:bg-black/[0.03]'
    case 'soft':
      return 'bg-surface text-ink hover:bg-surface-hover'
    case 'ghost':
      return 'bg-transparent text-ink hover:bg-black/[0.04] min-h-10 sm:min-h-10 py-2'
    case 'link':
      return 'bg-transparent text-ink underline underline-offset-4 min-h-0 py-1 px-0 w-auto hover:opacity-70'
    default:
      return 'bg-ink text-white hover:bg-[#333]'
  }
})
</script>
