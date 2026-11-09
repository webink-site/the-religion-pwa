<template>
  <div class="flex items-center justify-between gap-3">
    <UiPopover v-model:open="sortOpen">
      <template #trigger>
        <UiButton
          variant="ghost"
          size="sm"
          class="!w-auto whitespace-nowrap !px-0"
        >
          Сортировать по
          <ChevronDown
            class="ml-1.5 size-4"
            :stroke-width="1.6"
          />
        </UiButton>
      </template>
      <template #content="{ close }">
        <button
          v-for="option in catalogSortOptions"
          :key="option.value"
          type="button"
          class="block w-full px-4 py-2.5 text-left body-txt hover:bg-surface rounded-ui"
          :class="sort === option.value ? 'font-medium text-ink' : 'text-ink'"
          @click="selectSort(option.value, close)"
        >
          {{ option.label }}
        </button>
      </template>
    </UiPopover>

    <UiButton
      variant="ghost"
      size="sm"
      class="!w-auto whitespace-nowrap !px-0"
      @click="openFilters"
    >
      Фильтр
      <span class="relative ml-1.5 inline-flex">
        <SlidersHorizontal
          class="size-4"
          :stroke-width="1.6"
        />
        <span
          v-if="activeFilterCount"
          class="absolute -top-1 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-black text-[8px] text-white"
        >
          {{ activeFilterCount }}
        </span>
      </span>
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, SlidersHorizontal } from '@lucide/vue'
import { catalogSortOptions } from '~/composables/useCatalogControls'
import type { CatalogSort } from '~/types/catalog'

const sortOpen = ref(false)
const { sort, activeFilterCount, openFilters, setSort } = useCatalogControls()

function selectSort(value: CatalogSort, close: () => void) {
  setSort(value)
  close()
}
</script>
