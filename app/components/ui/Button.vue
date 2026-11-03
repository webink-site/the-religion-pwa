<template>
  <button
    type="button"
    class="ui-btn-base disabled:opacity-50 disabled:pointer-events-none"
    :class="[
      variantClasses,
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
} = defineProps<{
  title?: string
  loading?: boolean
  disabled?: boolean
  error?: boolean
  block?: boolean
  variant?: 'primary' | 'transparent' | 'soft' | 'ghost' | 'link'
}>()

const variantClasses = computed(() => {
  if (error) {
    return 'bg-[var(--ui-surface)] text-[#e64646] cursor-not-allowed'
  }

  switch (variant) {
    case 'transparent':
      return 'bg-transparent text-[var(--ui-ink)] border border-[var(--ui-ink)] hover:bg-black/[0.03]'
    case 'soft':
      return 'bg-[var(--ui-surface)] text-[var(--ui-ink)] hover:bg-[var(--ui-surface-hover)]'
    case 'ghost':
      return 'bg-transparent text-[var(--ui-ink)] hover:bg-black/[0.04] min-h-10 sm:min-h-10 py-2'
    case 'link':
      return 'bg-transparent text-[var(--ui-ink)] underline underline-offset-4 min-h-0 py-1 px-0 w-auto hover:opacity-70'
    default:
      return 'bg-[var(--ui-ink)] text-white hover:bg-[#333]'
  }
})
</script>
