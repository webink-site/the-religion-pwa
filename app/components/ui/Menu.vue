<template>
  <UiPopover v-model:open="menuOpen">
    <template #trigger>
      <slot name="trigger">
        <UiButton
          :title="triggerLabel"
          :variant="triggerVariant"
        />
      </slot>
    </template>
    <template #content="{ close }">
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="flex w-full items-center gap-2 px-4 py-2.5 text-left body-txt hover:bg-[var(--ui-surface)] disabled:opacity-40 rounded-[var(--ui-radius)] mx-1 w-[calc(100%-8px)]"
        :disabled="Boolean(item.disabled)"
        @click="onSelect(item, close)"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          class="size-4 shrink-0 opacity-70"
        />
        {{ item.label }}
      </button>
    </template>
  </UiPopover>
</template>

<script setup lang="ts">
import type { UiMenuItem } from '~/types/ui-menu'

const emit = defineEmits<{ select: [UiMenuItem] }>()

withDefaults(
  defineProps<{
    items: UiMenuItem[]
    triggerLabel?: string
    triggerVariant?: 'primary' | 'transparent' | 'soft' | 'ghost' | 'link'
  }>(),
  {
    triggerLabel: 'Меню',
    triggerVariant: 'transparent',
  },
)

const menuOpen = ref(false)

function onSelect(item: UiMenuItem, close: () => void) {
  if (item.disabled)
    return
  emit('select', item)
  close()
}
</script>
