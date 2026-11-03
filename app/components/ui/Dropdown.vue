<template>
  <div
    ref="dropdownRef"
    v-click-outside="close"
    class="relative flex items-center min-h-[46px] px-4 py-1.5 body-txt bg-white rounded-[var(--ui-radius)] cursor-pointer select-none"
    :class="[
      error ? 'ring-2 ring-[#e64646]/30' : 'shadow-[inset_0_0_0_1px_var(--ui-line)]',
      disabled ? 'opacity-60 pointer-events-none' : '',
    ]"
    @click="!disabled && (open = !open)"
  >
    <span
      class="truncate pr-10"
      :class="!selectedLabel ? 'text-secondary' : 'text-[var(--ui-ink)]'"
    >
      {{ selectedLabel || placeholder }}
    </span>
    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 text-[var(--ui-ink)]">
      <ChevronDown
        class="size-4 transition-transform duration-300"
        :class="{ 'rotate-180': open }"
      />
    </div>

    <div
      v-if="open"
      class="absolute left-0 right-0 z-30 overflow-auto max-h-64 bg-white rounded-[var(--ui-radius)] divide-y divide-[var(--ui-line)]"
      :class="dropTop ? 'bottom-full mb-1' : 'top-full mt-1'"
      style="box-shadow: var(--ui-shadow-float);"
    >
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="flex items-center w-full min-h-[44px] px-4 text-left body-txt hover:bg-[var(--ui-surface)] disabled:text-secondary"
        :class="{ 'bg-[var(--ui-surface)] font-medium': isSelected(item) }"
        :disabled="isItemDisabled(item)"
        @click.stop="selectItem(item)"
      >
        {{ getItemLabel(item) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

const emit = defineEmits<{ change: [] }>()

const modelValue = defineModel<string | number | null>('modelValue', { default: null })
const dropdownRef = ref<HTMLElement | null>(null)
const open = ref(false)

const props = withDefaults(
  defineProps<{
    placeholder: string
    items: unknown[]
    downOnly?: boolean
    upOnly?: boolean
    itemValue?: string
    itemTitle?: string
    itemDisabled?: string
    error?: boolean
    disabled?: boolean
  }>(),
  { disabled: false },
)

const { getItemValue, getItemLabel } = useListItem(props)

function isItemDisabled(item: unknown) {
  if (typeof item === 'object' && item !== null && props.itemDisabled) {
    return Boolean((item as Record<string, unknown>)[props.itemDisabled])
  }
  return false
}

function isSelected(item: unknown) {
  if (modelValue.value == null || modelValue.value === '')
    return false
  return getItemValue(item) === modelValue.value
}

const selectedLabel = computed(() => {
  if (modelValue.value == null || modelValue.value === '')
    return ''
  const found = props.items.find(it => getItemValue(it) === modelValue.value)
  return found ? getItemLabel(found) : ''
})

function selectItem(item: unknown) {
  if (isItemDisabled(item))
    return
  modelValue.value = getItemValue(item) as string | number
  open.value = false
  emit('change')
}

function close() {
  open.value = false
}

const dropTop = computed(() => {
  if (props.upOnly)
    return true
  if (props.downOnly)
    return false
  if (!dropdownRef.value)
    return false
  const rect = dropdownRef.value.getBoundingClientRect()
  return rect.top > window.innerHeight / 2
})
</script>
