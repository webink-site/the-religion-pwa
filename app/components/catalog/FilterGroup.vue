<template>
  <section>
    <button
      type="button"
      class="flex w-full items-center justify-between gap-6 py-3 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="text-base leading-[130%] tracking-ui text-ink">
        {{ title }}
      </span>
      <IconsPlus
        class="size-[18px] shrink-0 transition-transform duration-300"
        :class="open ? 'rotate-45' : ''"
      />
    </button>

    <div
      class="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    >
      <div class="min-h-0 overflow-hidden">
        <div class="pb-4">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

const open = ref(false)
</script>
