<template>
  <Teleport to="body">
    <Transition name="filter-sheet">
      <div
        v-if="filterOpen"
        class="fixed inset-0 z-[60] flex flex-col bg-white"
        role="dialog"
        aria-modal="true"
        aria-label="Фильтр"
      >
        <div
          class="flex items-center justify-between gap-4 px-4 pb-2"
          :class="isNativeApp ? 'pt-28' : 'pt-20'"
        >
          <button
            type="button"
            class="text-sm leading-[130%] tracking-ui text-ink underline underline-offset-4"
            @click="resetDraft"
          >
            Сбросить все
          </button>
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center"
            aria-label="Закрыть фильтр"
            @click="closeFilters"
          >
            <X
              class="size-6"
              :stroke-width="1.3"
            />
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <CatalogFilterGroup title="Наличие">
            <div class="space-y-3">
              <UiSwitcher
                v-model:selected="draft.inStock"
                label="Скрыть распроданные"
              />
              <UiSwitcher
                v-model:selected="draft.preorder"
                label="Только предзаказ"
              />
            </div>
          </CatalogFilterGroup>

          <CatalogFilterGroup title="Коллекция">
            <UiRadio
              :model-value="draft.collection ?? ''"
              :items="catalogCollections"
              item-value="id"
              item-title="label"
              @update:model-value="draft.collection = $event ? String($event) : null"
            />
          </CatalogFilterGroup>

          <CatalogFilterGroup title="Категории">
            <div class="flex flex-col gap-3">
              <UiCheckbox
                v-for="option in categoryOptions"
                :key="option.id"
                :custom-id="`filter-category-${option.id}`"
                :label="option.label"
                :selected="draft.categories.includes(option.id)"
                @update:selected="toggleDraftList('categories', option.id, $event)"
              />
            </div>
          </CatalogFilterGroup>

          <CatalogFilterGroup title="Пол">
            <div class="flex flex-col gap-3">
              <UiCheckbox
                v-for="option in catalogSexOptions"
                :key="option.id"
                :custom-id="`filter-sex-${option.id}`"
                :label="option.label"
                :selected="draft.sex.includes(option.id)"
                @update:selected="toggleDraftList('sex', option.id, $event)"
              />
            </div>
          </CatalogFilterGroup>

          <CatalogFilterGroup title="Размер">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in catalogSizes"
                :key="option.id"
                type="button"
                class="rounded-ui px-4 py-2 body-txt"
                :class="draft.sizes.includes(option.id) ? 'bg-ink text-white' : 'bg-surface text-ink'"
                @click="toggleDraftList('sizes', option.id, !draft.sizes.includes(option.id))"
              >
                {{ option.label }}
              </button>
            </div>
          </CatalogFilterGroup>
        </div>

        <div class="border-t border-line px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <UiButton
            title="Показать"
            block
            :loading="applying"
            @click="applyFilters"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'
import { catalogCollections, catalogSexOptions, catalogSizes } from '~/composables/useCatalogControls'

const { isNativeApp } = useNativeApp()
const {
  filterOpen,
  applying,
  draft,
  categoryOptions,
  closeFilters,
  applyFilters,
  resetDraft,
  toggleDraftList,
} = useCatalogControls()
</script>

<style scoped>
.filter-sheet-enter-active,
.filter-sheet-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.filter-sheet-enter-from,
.filter-sheet-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
