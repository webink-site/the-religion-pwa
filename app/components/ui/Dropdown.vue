<template>
  <div
    ref="dropdownRef"
    v-click-outside="close"
    class="relative flex items-center min-h-[46px] px-4 py-1.5 body-txt bg-white rounded-ui cursor-pointer select-none"
    :class="[
      error ? 'ring-2 ring-danger/30' : 'shadow-inset-line',
      disabled ? 'opacity-60 pointer-events-none' : '',
    ]"
    @click="toggle"
  >
    <span
      class="truncate pr-10"
      :class="!selectedLabel ? 'text-secondary' : 'text-ink'"
    >
      {{ selectedLabel || placeholder }}
    </span>
    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 text-ink">
      <ChevronDown
        class="size-4 transition-transform duration-300"
        :class="{ 'rotate-180': open }"
      />
    </div>

    <Teleport to="body">
      <div
        v-if="open"
        ref="menuRef"
        class="fixed z-[90] overflow-auto bg-white rounded-ui divide-y divide-line shadow-float"
        :style="menuStyle"
        @click.stop
      >
        <button
          v-for="(item, i) in items"
          :key="i"
          type="button"
          class="flex items-center w-full min-h-[44px] px-4 text-left body-txt enabled:hover:bg-surface disabled:opacity-40"
          :class="{ 'bg-surface font-medium': isSelected(item) }"
          :disabled="isItemDisabled(item)"
          @click.stop="selectItem(item)"
        >
          {{ getItemLabel(item) }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { onFloatingDismiss } from '~/utils/floating'

const MENU_MAX = 256
const GAP = 4
const ROW = 44

const emit = defineEmits<{ change: [] }>()

const modelValue = defineModel<string | number | null>('modelValue', { default: null })
const dropdownRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const open = ref(false)
const menuStyle = ref<Record<string, string>>({})

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

onFloatingDismiss(close)

function toggle() {
  if (props.disabled)
    return
  open.value = !open.value
}

function contentHeight() {
  const menu = menuRef.value
  if (menu)
    return Math.min(menu.scrollHeight, MENU_MAX)
  return Math.min(props.items.length * ROW, MENU_MAX)
}

function updatePlacement() {
  const trigger = dropdownRef.value
  if (!trigger)
    return

  const rect = trigger.getBoundingClientRect()
  const height = contentHeight()
  const spaceBelow = window.innerHeight - rect.bottom - GAP
  const spaceAbove = rect.top - GAP

  let above = false
  if (props.upOnly)
    above = true
  else if (!props.downOnly)
    above = spaceBelow < height && spaceAbove > spaceBelow

  const maxHeight = Math.min(MENU_MAX, Math.max(ROW, above ? spaceAbove : spaceBelow))

  menuStyle.value = {
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxHeight: `${maxHeight}px`,
    top: above ? 'auto' : `${rect.bottom + GAP}px`,
    bottom: above ? `${window.innerHeight - rect.top + GAP}px` : 'auto',
  }
}

function onScrollOrResize() {
  updatePlacement()
}

watch(open, async (value) => {
  if (!value) {
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
    return
  }
  updatePlacement()
  window.addEventListener('scroll', onScrollOrResize, true)
  window.addEventListener('resize', onScrollOrResize)
  await nextTick()
  updatePlacement()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
})
</script>
