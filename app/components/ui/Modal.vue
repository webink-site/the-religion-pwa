<template>
  <Teleport to="body">
    <Transition name="ui-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-end bg-black/40 sm:p-4"
        :class="side === 'right' ? 'sm:items-stretch sm:justify-end sm:p-0' : 'sm:items-center sm:justify-center'"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click.self="open = false"
      >
        <div
          class="ui-modal-panel flex max-h-[90dvh] w-full flex-col rounded-t-ui-lg bg-white pb-[env(safe-area-inset-bottom)]"
          :class="side === 'right'
            ? 'sm:h-full sm:max-h-none sm:max-w-[500px] sm:rounded-none'
            : 'sm:max-w-[480px] sm:rounded-ui-lg'"
        >
          <div class="flex shrink-0 items-center justify-between gap-4 px-4 pt-3 pb-2 sm:px-6 sm:pt-5">
            <p class="body-txt text-ink">
              {{ title }}
            </p>
            <button
              type="button"
              class="-mr-2 inline-flex size-10 items-center justify-center"
              aria-label="Закрыть"
              @click="open = false"
            >
              <X
                class="size-6"
                :stroke-width="1.3"
              />
            </button>
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'

const { side = 'center' } = defineProps<{
  title: string
  side?: 'center' | 'right'
}>()

const open = defineModel<boolean>({ default: false })
const route = useRoute()
let bodyOverflow = ''

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    open.value = false
}

watch(open, (value) => {
  if (!import.meta.client)
    return
  if (value) {
    bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
  }
  else {
    document.body.style.overflow = bodyOverflow
    window.removeEventListener('keydown', onKeydown)
  }
})

watch(() => route.fullPath, () => {
  open.value = false
})

onBeforeUnmount(() => {
  if (open.value)
    document.body.style.overflow = bodyOverflow
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.ui-modal-enter-active,
.ui-modal-leave-active,
.ui-modal-enter-active .ui-modal-panel,
.ui-modal-leave-active .ui-modal-panel {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 0.82, 0.16, 1);
}

.ui-modal-enter-from,
.ui-modal-leave-to {
  opacity: 0;
}

.ui-modal-enter-from .ui-modal-panel,
.ui-modal-leave-to .ui-modal-panel {
  transform: translateY(24px);
}
</style>
