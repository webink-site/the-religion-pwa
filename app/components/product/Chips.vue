<template>
  <div
    v-if="visibleChips.length"
    class="flex flex-wrap gap-1"
    data-sheet-static
  >
    <component
      :is="chip.modal ? 'button' : 'span'"
      v-for="chip in visibleChips"
      :key="chip.id"
      :type="chip.modal ? 'button' : undefined"
      class="inline-flex"
      @click="chip.modal && (modal = chip.modal)"
    >
      <UiChip
        :title="chip.title"
        :dark="chip.dark"
        class="transition-colors duration-500"
        :class="onPhoto && !chip.dark ? '!bg-white/15 !text-white' : ''"
      />
    </component>
  </div>
</template>

<script setup lang="ts">
const { onPhoto = false, hide = [] } = defineProps<{
  onPhoto?: boolean
  hide?: string[]
}>()

const { chips, modal } = useProduct()

const visibleChips = computed(() => chips.value.filter(chip => !hide.includes(chip.id)))
</script>
