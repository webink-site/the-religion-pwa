<template>
  <label
    class="inline-flex max-w-full cursor-pointer select-none items-center gap-3"
    :for="customId"
  >
    <input
      :id="customId"
      v-model="selected"
      type="checkbox"
      class="peer sr-only"
      @change="emit('change')"
    >
    <span
      class="relative flex size-5 shrink-0 items-center justify-center rounded-[4px] bg-surface text-white transition-[background-color] duration-300 ease-out peer-checked:bg-ink"
      :class="{ '!bg-[#fdecec]': error && !selected }"
      aria-hidden="true"
    >
      <Check
        class="size-3.5 shrink-0 transition-opacity duration-200"
        :class="selected ? 'opacity-100' : 'opacity-0'"
        :stroke-width="2.5"
      />
    </span>
    <span
      class="body-txt text-ink leading-[130%]"
      :class="{ 'text-danger': error }"
    >
      {{ label }}
      <slot name="label" />
    </span>
  </label>
</template>

<script setup lang="ts">
import { Check } from '@lucide/vue'

const emit = defineEmits<{ change: [] }>()

type Props = {
  customId: string
  label?: string
  error?: boolean
}

const { customId, label, error = false } = defineProps<Props>()
const selected = defineModel<boolean>('selected', { default: false })
</script>
