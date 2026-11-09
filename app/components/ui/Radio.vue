<template>
  <div class="w-full">
    <p
      v-if="label"
      class="body-txt mb-3"
      :class="{ 'text-danger': error }"
    >
      {{ label }}
    </p>

    <div
      class="flex"
      :class="layoutClass"
    >
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="text-left transition-all duration-300"
        :class="optionClass(item)"
        @click="select(item)"
      >
        {{ getItemLabel(item) }}
      </button>
    </div>

    <span
      v-if="error"
      class="caption-txt text-danger mt-2 block"
    >
      Обязательное поле
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: unknown[]
    itemValue?: string
    itemTitle?: string
    label?: string
    horizontal?: boolean
    error?: boolean
    variant?: 'text' | 'chip' | 'block'
  }>(),
  { variant: 'text' },
)

const modelValue = defineModel<string | number | null>('modelValue', { default: null })
const { getItemValue, getItemLabel } = useListItem(props)

const layoutClass = computed(() => {
  if (props.variant === 'chip') {
    return props.horizontal ? 'flex-row flex-wrap gap-2' : 'flex-col gap-2'
  }
  if (props.variant === 'block') {
    return 'flex-col gap-2 w-full'
  }
  return props.horizontal ? 'flex-row flex-wrap gap-x-6 gap-y-1' : 'flex-col gap-1'
})

function isSelected(item: unknown) {
  return getItemValue(item) === modelValue.value
}

function select(item: unknown) {
  modelValue.value = getItemValue(item) as string | number
}

function optionClass(item: unknown) {
  const selected = isSelected(item)

  if (props.variant === 'chip') {
    return [
      'rounded-ui px-4 py-2 body-txt cursor-pointer',
      selected
        ? 'bg-ink text-white'
        : 'bg-surface text-ink hover:bg-surface-hover',
    ]
  }

  if (props.variant === 'block') {
    return [
      'w-full rounded-ui-lg px-4 py-4 body-txt cursor-pointer',
      selected
        ? 'bg-ink text-white'
        : 'bg-surface text-ink hover:bg-surface-hover',
    ]
  }

  return [
    'py-2 body-txt cursor-pointer',
    selected
      ? 'text-ink font-medium'
      : 'text-secondary hover:text-ink',
  ]
}
</script>
