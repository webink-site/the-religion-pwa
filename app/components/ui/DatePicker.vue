<template>
  <div
    class="max-w-full"
    style="width: var(--ui-calendar-width);"
  >
    <UiPopover
      v-model:open="open"
      full-width
      :panel-padding="false"
      panel-fit-content
    >
      <template #trigger>
        <button
          type="button"
          class="w-full text-left relative select-none min-h-[48px] flex items-center px-4 py-3 pr-12 body-txt bg-white rounded-[var(--ui-radius-lg)] transition-colors hover:bg-[var(--ui-surface)]/80"
          :class="error ? 'ring-2 ring-[#e64646]/30' : 'shadow-[inset_0_0_0_1px_var(--ui-line)]'"
        >
          <span
            class="block truncate"
            :class="!displayValue ? 'text-secondary' : 'text-[var(--ui-ink)]'"
          >
            {{ displayValue || placeholder }}
          </span>
          <CalendarIcon class="pointer-events-none size-[18px] absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
        </button>
      </template>
      <template #content="{ close }">
        <UiCalendar
          v-model="modelValue"
          @update:model-value="close()"
        />
      </template>
    </UiPopover>
  </div>
</template>

<script setup lang="ts">
import { Calendar as CalendarIcon } from '@lucide/vue'

withDefaults(
  defineProps<{
    placeholder?: string
    error?: boolean
  }>(),
  { placeholder: 'Выберите дату' },
)

const modelValue = defineModel<Date | null>('modelValue', { default: null })
const open = ref(false)

const displayValue = computed(() => {
  if (!modelValue.value)
    return ''
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(modelValue.value)
})
</script>
