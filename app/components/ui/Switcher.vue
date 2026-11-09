<template>
  <div
    class="flex justify-between items-center cursor-pointer gap-4 py-1"
    role="switch"
    :aria-checked="selected"
    @click="toggle"
  >
    <label class="cursor-pointer select-none body-txt text-ink">{{ label }}</label>
    <div
      class="relative h-6 w-11 shrink-0 rounded-full bg-[#e5e7eb] transition-colors duration-300"
      :class="{ '!bg-ink': selected }"
    >
      <div
        class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-300"
        :class="{ 'translate-x-5': selected }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ change: [] }>()

type Props = {
  label: string
}

const { label } = defineProps<Props>()
const selected = defineModel<boolean>('selected', { default: false })

function toggle() {
  selected.value = !selected.value
  emit('change')
}
</script>
