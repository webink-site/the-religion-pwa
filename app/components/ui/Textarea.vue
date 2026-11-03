<template>
  <div
    class="flex flex-col gap-3 mb-2"
    :class="{ 'opacity-60 pointer-events-none': disabled }"
  >
    <span
      class="body-txt transition-colors"
      :class="error ? 'text-[#e64646]' : 'text-secondary'"
    >
      {{ label }}
    </span>
    <textarea
      v-model="inputVal"
      rows="4"
      class="w-full resize-none rounded-[var(--ui-radius-lg)] bg-[var(--ui-surface)] px-4 py-3 text-sm leading-[140%] text-[var(--ui-ink)] outline-none placeholder:text-secondary transition-shadow shadow-[inset_0_0_0_1px_transparent] focus:shadow-[inset_0_0_0_1px_var(--ui-ink)]"
      :class="{ 'shadow-[inset_0_0_0_1px_#e64646] focus:shadow-[inset_0_0_0_1px_#e64646]': error }"
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
