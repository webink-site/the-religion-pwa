<template>
  <UiRadio
    v-model="modelValue"
    :items="items"
    :item-value="itemValue"
    :item-title="itemTitle"
    :error="error"
    variant="block"
  />
</template>

<script setup lang="ts">
defineProps<{
  items: unknown[]
  itemValue?: string
  itemTitle?: string
  error?: boolean
}>()

const modelValue = defineModel<string | number | null>('modelValue', { default: null })
</script>
