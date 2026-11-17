<template>
  <div
    v-if="purchasable"
    class="space-y-4"
  >
    <UiDropdown
      v-model="selectedSize"
      :items="sizes"
      item-title="label"
      item-value="id"
      item-disabled="disabled"
      placeholder="Выберите размер"
      :disabled="isOneSize"
      :error="sizeError"
    />
    <ProductEditionSelect v-if="serialNumbers.length" />
  </div>
</template>

<script setup lang="ts">
const { purchasable, sizes, selectedSize, isOneSize, sizeError, serialNumbers } = useProduct()
</script>
