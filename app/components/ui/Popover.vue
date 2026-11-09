<template>
  <div
    ref="rootRef"
    class="relative"
    :class="fullWidth ? 'block w-full' : 'inline-block'"
  >
    <div
      ref="triggerRef"
      class="w-full"
      @click.stop="toggle"
    >
      <slot name="trigger" :open="open" />
    </div>

    <Teleport to="body">
      <Transition name="fade-slide">
        <div
          v-if="open"
          ref="panelRef"
          class="fixed z-[100] min-w-[10rem] rounded-ui-lg border border-line bg-white overflow-hidden shadow-float"
          :class="[
            panelPadding ? 'py-1' : 'p-0',
            panelFitContent ? 'w-fit max-w-[calc(100vw-16px)]' : '',
          ]"
          :style="panelStyle"
        >
          <slot name="content" :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    fullWidth?: boolean
    panelPadding?: boolean
    panelFitContent?: boolean
  }>(),
  {
    fullWidth: false,
    panelPadding: true,
    panelFitContent: false,
  },
)

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

function updatePosition() {
  const el = triggerRef.value
  if (!el)
    return

  const rect = el.getBoundingClientRect()
  const gap = 8
  const panelHeight = panelRef.value?.offsetHeight ?? 200
  const spaceBelow = window.innerHeight - rect.bottom
  const openUp = spaceBelow < panelHeight + gap && rect.top > panelHeight + gap

  panelStyle.value = {
    left: `${Math.max(8, Math.min(rect.left, window.innerWidth - (props.fullWidth ? rect.width + 16 : 220)))}px`,
    top: openUp
      ? `${rect.top - gap}px`
      : `${rect.bottom + gap}px`,
    transform: openUp ? 'translateY(-100%)' : 'none',
    ...(props.fullWidth && !props.panelFitContent ? { minWidth: `${rect.width}px` } : {}),
  }
}

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    updatePosition()
  }
})

function onDocumentClick(event: Event) {
  if (!open.value)
    return
  const target = event.target as Node
  if (rootRef.value?.contains(target) || panelRef.value?.contains(target))
    return
  close()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>
