<template>
  <div
    class="box-border select-none px-5 pt-5 pb-4"
    style="width: var(--ui-calendar-width);"
  >
    <div class="flex items-center justify-between mb-4 px-0.5">
      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-[var(--ui-radius)] hover:bg-[var(--ui-surface)]"
        aria-label="Предыдущий месяц"
        @click="prevMonth"
      >
        <ChevronLeft class="size-4" />
      </button>
      <p class="text-sm font-medium capitalize">
        {{ monthLabel }}
      </p>
      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-[var(--ui-radius)] hover:bg-[var(--ui-surface)]"
        aria-label="Следующий месяц"
        @click="nextMonth"
      >
        <ChevronRight class="size-4" />
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      <span
        v-for="wd in weekDays"
        :key="wd"
        class="text-secondary text-[11px] text-center py-1.5"
      >
        {{ wd }}
      </span>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="(day, index) in gridDays"
        :key="`${day.date.toISOString()}-${index}`"
        type="button"
        class="mx-auto flex size-9 items-center justify-center text-xs rounded-[var(--ui-radius)] transition-colors"
        :class="dayCellClass(day)"
        :disabled="day.outside && !showOutsideDays"
        @click="pickDay(day)"
      >
        {{ day.date.getDate() }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'

type CalendarDay = {
  date: Date
  outside: boolean
}

const props = withDefaults(
  defineProps<{
    showOutsideDays?: boolean
  }>(),
  { showOutsideDays: true },
)

const modelValue = defineModel<Date | null>('modelValue', { default: null })

const viewDate = ref(startOfMonth(modelValue.value ?? new Date()))
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const monthLabel = computed(() => {
  return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(viewDate.value)
})

const gridDays = computed(() => buildMonthGrid(viewDate.value))

watch(modelValue, (value) => {
  if (value)
    viewDate.value = startOfMonth(value)
})

function pickDay(day: CalendarDay) {
  if (day.outside && !props.showOutsideDays)
    return
  modelValue.value = stripTime(day.date)
}

function prevMonth() {
  viewDate.value = addMonths(viewDate.value, -1)
}

function nextMonth() {
  viewDate.value = addMonths(viewDate.value, 1)
}

function dayCellClass(day: CalendarDay) {
  const selected = modelValue.value && isSameDay(day.date, modelValue.value)
  const today = isSameDay(day.date, new Date())

  return {
    'text-secondary': day.outside,
    'opacity-40': day.outside && !props.showOutsideDays,
    'bg-[var(--ui-ink)] text-white hover:bg-[#333]': selected,
    'hover:bg-[var(--ui-surface)]': !selected,
    'bg-[var(--ui-surface)] font-medium': today && !selected,
    'font-medium': today,
  }
}

function buildMonthGrid(month: Date): CalendarDay[] {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const startOffset = (start.getDay() + 6) % 7
  const days: CalendarDay[] = []

  for (let i = startOffset; i > 0; i--) {
    const d = new Date(start)
    d.setDate(start.getDate() - i)
    days.push({ date: d, outside: true })
  }

  for (let d = 1; d <= end.getDate(); d++) {
    days.push({ date: new Date(start.getFullYear(), start.getMonth(), d), outside: false })
  }

  while (days.length % 7 !== 0) {
    const last = days[days.length - 1]!.date
    const next = new Date(last)
    next.setDate(last.getDate() + 1)
    days.push({ date: next, outside: true })
  }

  return days
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1)
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}
</script>
