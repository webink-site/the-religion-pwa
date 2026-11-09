<template>
  <button
    type="button"
    class="inline-flex size-3 shrink-0 rounded-full"
    :class="light && !selected ? 'border border-black/30' : ''"
    :style="swatchStyle"
    :title="label"
    :aria-label="label"
    :aria-current="selected ? 'true' : undefined"
    @click.stop.prevent="emit('select')"
  />
</template>

<script setup lang="ts">
defineProps<{
  label: string
  selected?: boolean
  light?: boolean
  swatchStyle: { background?: string, backgroundColor?: string }
}>()

const emit = defineEmits<{ select: [] }>()
</script>
