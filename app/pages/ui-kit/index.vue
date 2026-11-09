<template>
  <div class="pb-32 pt-24 custom-container space-y-14 bg-page min-h-screen">
    <header class="space-y-2">
      <p class="ui-section-title">
        UI Kit
      </p>
      <h1 class="text-2xl tracking-tight font-light">
        Компоненты интерфейса
      </h1>
      <p class="body-txt text-secondary max-w-md">
        Визуал по мотивам 2MOOD / 12 Storeez. Логика полей — через
        <code class="text-[10px] bg-surface px-1.5 py-0.5 rounded-[4px]">defineModel</code>.
      </p>
    </header>

    <section class="space-y-4">
      <h2 class="ui-section-title">
        Кнопки
      </h2>
      <div class="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center max-w-md">
        <UiButton
          title="Оформить заказ"
          block
        />
        <UiButton
          title="Перейти к покупкам"
          variant="transparent"
          block
        />
        <UiButtonSecondary
          title="Мягкая кнопка"
          block
        />
        <UiButton
          title="Ghost"
          variant="ghost"
        />
        <UiButtonTxt title="Подробнее" />
        <UiButton
          title="Loading"
          loading
          block
        />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="ui-section-title">
        Float-меню
      </h2>
      <div class="flex flex-wrap gap-4">
        <UiMenu
          trigger-label="Действия"
          trigger-variant="transparent"
          :items="menuItems"
          @select="onMenuSelect"
        />
        <UiPopover v-model:open="sortOpen">
          <template #trigger>
            <UiButton
              title="Сортировка"
              variant="ghost"
            />
          </template>
          <template #content="{ close }">
            <button
              v-for="opt in sortOptions"
              :key="opt.value"
              type="button"
              class="block w-full px-4 py-2.5 text-left body-txt hover:bg-surface rounded-ui"
              :class="{ 'bg-surface font-medium': form.sort === opt.value }"
              @click="form.sort = opt.value; close()"
            >
              {{ opt.label }}
            </button>
          </template>
        </UiPopover>
        <UiPopover v-model:open="filterOpen">
          <template #trigger>
            <UiButton
              title="Фильтр"
              variant="transparent"
            />
          </template>
          <template #content>
            <div class="px-4 py-3 w-56 space-y-3">
              <p class="caption-txt text-secondary">
                Размер
              </p>
              <UiRadio
                v-model="form.sizeFilter"
                :items="sizeFilterItems"
                variant="chip"
                horizontal
              />
            </div>
          </template>
        </UiPopover>
      </div>
      <p
        v-if="lastMenuAction"
        class="caption-txt text-secondary"
      >
        Последнее действие меню: {{ lastMenuAction }}
      </p>
    </section>

    <section class="space-y-6">
      <h2 class="ui-section-title">
        Поля ввода
      </h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <UiInput
          v-model:input-val="form.name"
          label="Имя"
        />
        <UiInput
          v-model:input-val="form.email"
          label="E-mail"
          type="email"
          filled
        />
        <UiInput
          v-model:input-val="form.phone"
          label="Телефон"
          :error="showErrors && !form.phone"
        />
        <UiTextarea
          v-model:input-val="form.comment"
          label="Комментарий"
        />
      </div>
    </section>

    <section class="space-y-6 max-w-md">
      <h2 class="ui-section-title">
        Select
      </h2>
      <UiDropdown
        v-model="form.city"
        placeholder="Город"
        :items="cities"
        item-value="id"
        item-title="name"
      />
    </section>

    <section class="space-y-5 w-fit max-w-full">
      <h2 class="ui-section-title">
        Календарь (shadcn)
      </h2>
      <div class="w-fit rounded-ui-lg bg-white overflow-hidden shadow-float">
        <UiCalendar v-model="form.birthDate" />
      </div>
      <UiDatePicker
        v-model="form.deliveryDate"
        placeholder="Дата доставки"
      />
    </section>

    <section class="space-y-6 max-w-lg">
      <h2 class="ui-section-title">
        Radio
      </h2>
      <UiRadio
        v-model="form.delivery"
        label="Способ доставки (text)"
        :items="deliveryOptions"
        item-value="id"
        item-title="title"
        variant="text"
      />
      <UiRadio
        v-model="form.payment"
        label="Оплата (block)"
        :items="paymentOptions"
        item-value="id"
        item-title="title"
        variant="block"
      />
    </section>

    <section class="space-y-4 max-w-lg">
      <h2 class="ui-section-title">
        Checkbox & Switch
      </h2>
      <UiCheckbox
        v-model:selected="form.newsletter"
        custom-id="newsletter"
        label="Подписаться на рассылку"
      />
      <UiCheckbox
        v-model:selected="form.agree"
        custom-id="agree"
        label="Согласие на обработку данных"
        :error="showErrors && !form.agree"
      />
      <UiSwitcher
        v-model:selected="form.smsNotify"
        label="SMS-уведомления"
      />
    </section>

    <section class="space-y-3 border-t border-line pt-8">
      <div class="flex flex-col sm:flex-row gap-3 max-w-md">
        <UiButton
          title="Проверить форму"
          variant="transparent"
          block
          @click="showErrors = true"
        />
        <UiButton
          title="Сбросить"
          variant="ghost"
          block
          @click="resetForm"
        />
      </div>
      <pre class="text-[10px] sm:text-xs bg-white p-4 overflow-auto rounded-ui-lg leading-relaxed shadow-inset-line">{{ formPreview }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Ellipsis, Heart, Share2, Trash2 } from '@lucide/vue'
import type { UiMenuItem } from '~/types/ui-menu'

definePageMeta({
  title: 'UI Kit',
})

const showErrors = ref(false)
const sortOpen = ref(false)
const filterOpen = ref(false)
const lastMenuAction = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  comment: '',
  city: null as number | null,
  birthDate: null as Date | null,
  deliveryDate: null as Date | null,
  delivery: 'courier' as string | number | null,
  payment: 'card' as string | number | null,
  newsletter: false,
  agree: false,
  smsNotify: true,
  sort: 'new',
  sizeFilter: 'm' as string | number | null,
})

const cities = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
  { id: 3, name: 'Казань' },
  { id: 4, name: 'Екатеринбург' },
]

const deliveryOptions = [
  { id: 'courier', title: 'Курьер' },
  { id: 'pickup', title: 'Самовывоз из бутика' },
  { id: 'pvz', title: 'Пункт выдачи' },
]

const paymentOptions = [
  { id: 'card', title: 'Банковская карта' },
  { id: 'split', title: 'Долями' },
  { id: 'cash', title: 'При получении' },
]

const sortOptions = [
  { value: 'new', label: 'Сначала новые' },
  { value: 'price-asc', label: 'Цена по возрастанию' },
  { value: 'price-desc', label: 'Цена по убыванию' },
]

const sizeFilterItems = ['xs', 's', 'm', 'l', 'xl']

const menuItems: UiMenuItem[] = [
  { label: 'В избранное', value: 'favorite', icon: Heart },
  { label: 'Поделиться', value: 'share', icon: Share2 },
  { label: 'Ещё', value: 'more', icon: Ellipsis },
  { label: 'Удалить', value: 'delete', icon: Trash2, disabled: true },
]

function onMenuSelect(item: UiMenuItem) {
  lastMenuAction.value = item.label
}

function resetForm() {
  showErrors.value = false
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    comment: '',
    city: null,
    birthDate: null,
    deliveryDate: null,
    delivery: 'courier',
    payment: 'card',
    newsletter: false,
    agree: false,
    smsNotify: true,
    sort: 'new',
    sizeFilter: 'm',
  })
}

const formPreview = computed(() => {
  return JSON.stringify({
    ...form,
    birthDate: form.birthDate?.toISOString().slice(0, 10) ?? null,
    deliveryDate: form.deliveryDate?.toISOString().slice(0, 10) ?? null,
  }, null, 2)
})
</script>
