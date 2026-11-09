<template>
  <div
    class="flex flex-col gap-3 mb-2"
    :class="{ 'opacity-60 pointer-events-none': disabled }"
  >
    <span
      class="body-txt transition-colors"
      :class="error ? 'text-danger' : 'text-secondary'"
    >
      {{ label }}
    </span>
    <textarea
      v-model="inputVal"
      rows="4"
      class="w-full resize-none rounded-ui-lg bg-surface px-4 py-3 text-sm leading-[140%] text-ink outline-none placeholder:text-secondary transition-shadow shadow-[inset_0_0_0_1px_transparent] focus:shadow-inset-ink"
      :class="{ 'shadow-inset-danger focus:shadow-inset-danger': error }"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  label: string
  disabled?: boolean
  error?: boolean
}

const { label, error = false, disabled = false } = defineProps<Props>()
const inputVal = defineModel<string>('inputVal', { default: '' })
</script>
