<template>
  <div
    class="flex flex-col gap-3 mb-2"
    :class="{ 'opacity-60 pointer-events-none': disabled }"
  >
    <span
      class="body-txt truncate transition-colors"
      :class="error ? 'text-danger' : 'text-secondary'"
    >
      {{ label }}
    </span>

    <div
      v-if="!isFilled"
      class="relative flex items-center gap-1 min-h-[30px] pt-1 pb-2"
    >
      <input
        v-model="inputVal"
        :type="type"
        class="relative z-[2] w-full border-0 bg-transparent outline-none text-base text-ink placeholder:text-ink pb-1"
        :disabled="disabled"
        @focus="focused = true"
        @blur="focused = false"
      >
      <div
        class="absolute left-0 right-0 top-2 bottom-0 pointer-events-none ui-input-line"
        :class="lineClass"
      />
      <div
        v-if="hasSuffix"
        class="relative z-[3] shrink-0"
      >
        <slot name="suffix" />
      </div>
    </div>

    <input
      v-else
      v-model="inputVal"
      :type="type"
      class="w-full rounded-ui-lg bg-surface px-4 py-3 text-sm text-ink outline-none placeholder:text-secondary transition-shadow shadow-[inset_0_0_0_1px_transparent] focus:shadow-inset-ink"
      :class="{
        'shadow-inset-danger focus:shadow-inset-danger': error,
      }"
      :disabled="disabled"
    >

    <slot name="descr" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  label: string
  type?: string
  disabled?: boolean
  error?: boolean
  /** @deprecated используй filled */
  outlined?: boolean
  filled?: boolean
}

const {
  label,
  type = 'text',
  error = false,
  disabled = false,
  outlined = false,
  filled = false,
} = defineProps<Props>()

const inputVal = defineModel<string>('inputVal', { default: '' })
const slots = useSlots()
const hasSuffix = computed(() => Boolean(slots.suffix))
const focused = ref(false)

const isFilled = computed(() => filled || outlined)

const lineClass = computed(() => {
  if (error)
    return 'ui-input-line-error'
  if (focused.value)
    return 'ui-input-line-focus'
  return ''
})
</script>
