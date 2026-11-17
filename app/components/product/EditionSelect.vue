<template>
  <div class="space-y-2">
    <div
      v-click-outside="close"
      class="relative"
    >
      <button
        type="button"
        class="flex min-h-[46px] w-full items-center justify-between rounded-ui bg-white px-4 py-1.5 text-left body-txt"
        :class="serialError ? 'ring-2 ring-danger/30' : 'shadow-inset-line'"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span :class="selected ? 'text-ink' : 'text-secondary'">
          {{ selected ? `Номер ${selected.formatted}` : 'Выберите номер' }}
        </span>
        <ChevronDown
          class="size-4 transition-transform duration-300"
          :class="{ 'rotate-180': open }"
        />
      </button>

      <div
        v-if="open"
        class="absolute inset-x-0 bottom-full z-30 mb-1 grid max-h-64 grid-cols-6 gap-1 overflow-auto rounded-ui bg-white p-2 shadow-float sm:grid-cols-8"
      >
        <button
          v-for="item in serialNumbers"
          :key="item.id"
          type="button"
          class="aspect-square rounded-[4px] caption-txt disabled:bg-surface disabled:text-muted"
          :class="item.id === serialNumber ? 'bg-ink text-white' : 'shadow-inset-line hover:shadow-inset-ink'"
          :disabled="!item.available"
          @click="select(item.id)"
        >
          {{ item.formatted.replace('#', '') }}
        </button>
      </div>
    </div>

    <button
      type="button"
      class="basic-link body-txt"
      @click="modal = 'serial'"
    >
      Подробнее о выборе номера
    </button>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

const { serialNumbers, serialNumber, serialError, modal } = useProduct()

const open = ref(false)
const selected = computed(() => serialNumbers.value.find(item => item.id === serialNumber.value))

function select(id: number) {
  serialNumber.value = id
  open.value = false
}

function close() {
  open.value = false
}
</script>
