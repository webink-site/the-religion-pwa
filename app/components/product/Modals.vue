<template>
  <UiModal
    v-model="open"
    :title="titles[shown]"
    :side="shown === 'measure' || shown === 'installments' ? 'right' : 'center'"
  >
    <div class="body-txt space-y-4">
      <template v-if="shown === 'limited'">
        <p>
          Подтверждая заказ, вы соглашаетесь с тем, что данный товар возврату и обмену не подлежит (за исключением случаев брака). Каждое изделие изготавливается по индивидуальному заказу покупателя с учетом выбранного размера и уникального номера.
        </p>
        <p>
          Данный товар обладает индивидуально-определёнными свойствами, так как изготавливается специально для вас с выбранным номером и размером. Согласно пункту 4 статьи 26.1 Закона РФ «О защите прав потребителей», товары, изготовленные по индивидуальному заказу, возврату и обмену не подлежат, за исключением случаев выявления производственного брака или несоответствия заказу. Перед оформлением заказа, пожалуйста, внимательно проверьте выбранные параметры (размер и номер).
        </p>
        <UiButton
          title="Перейти к покупкам"
          block
          @click="open = false"
        />
      </template>

      <template v-else-if="shown === 'lastSale'">
        <p>Товары из категории «Last Sale» не подлежат возврату, однако могут быть обменены на другой размер при его наличии.</p>
        <UiButton
          title="Перейти к покупкам"
          block
          @click="open = false"
        />
      </template>

      <template v-else-if="shown === 'serial'">
        <p>Изделие выпущено ограниченным пронумерованным тиражом.</p>
        <p>Выберите номер — он будет закреплён исключительно за вашим экземпляром.</p>
      </template>

      <template v-else-if="shown === 'measure' && guide">
        <p class="text-lg leading-[120%]">
          {{ guide.title }}
        </p>
        <img
          :src="guide.image_url"
          :alt="guide.title"
          class="h-auto w-full"
          loading="lazy"
        >
        <ul class="space-y-2">
          <li
            v-for="label in guide.labels"
            :key="label"
          >
            {{ label }}
          </li>
        </ul>
      </template>

      <template v-else-if="shown === 'installments'">
        <p class="text-lg leading-[120%]">
          Оплатите 25% от стоимости покупки сразу
        </p>
        <p class="text-muted">
          А оставшиеся 3 части спишутся автоматически с шагом в две недели
        </p>
        <div class="grid grid-cols-4 gap-2 rounded-ui bg-surface px-3 py-4">
          <div
            v-for="(step, index) in installmentSteps"
            :key="step"
          >
            <p class="caption-txt mb-1 text-muted">
              {{ step }}
            </p>
            <p class="mb-3">
              {{ installmentAmount }}
            </p>
            <div
              class="h-0.5 rounded-full"
              :class="index === 0 ? 'bg-ink' : 'bg-line'"
            />
          </div>
        </div>
        <p>Без процентов и переплат. Как обычная оплата картой.</p>
        <p class="caption-txt text-muted">
          Правила использования сервисов оплаты
          <a
            href="https://dolyame.ru/documents/"
            target="_blank"
            rel="noopener noreferrer"
            class="underline underline-offset-4"
          >Долями</a>
          и
          <a
            href="https://yandex.ru/legal/pravilarassrochki/"
            target="_blank"
            rel="noopener noreferrer"
            class="underline underline-offset-4"
          >Сплит</a>
        </p>
      </template>

      <form
        v-else-if="shown === 'notify'"
        class="space-y-4"
        @submit.prevent="submitNotify"
      >
        <UiInput
          v-model:input-val="email"
          label="E-mail"
          type="email"
          :error="emailError"
        />
        <UiButton
          title="Подписаться на уведомления"
          block
          :loading="notifyPending"
          @click="submitNotify"
        />
      </form>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { ProductModal } from '~/types/product'

const { product, modal, notify, notifyPending } = useProduct()

const titles: Record<ProductModal, string> = {
  limited: 'Individual',
  lastSale: 'Last Sale',
  serial: 'Подробнее о выборе номера',
  measure: 'Руководство по размерам',
  installments: 'Оплата частями',
  notify: 'Уведомить о поступлении',
}

const shown = ref<ProductModal>('limited')
const email = ref('')
const emailError = ref(false)

const open = computed({
  get: () => modal.value !== null,
  set: (value) => {
    if (!value)
      modal.value = null
  },
})

const guide = computed(() => product.value.measurement_guide)
const installmentAmount = computed(() => `${Math.round(product.value.price.current / 4).toLocaleString('ru-RU')} ₽`)
const installmentSteps = computed(() => [0, 14, 28, 42].map((days) => {
  if (!days)
    return 'Сегодня'
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
}))

watch(modal, (value) => {
  if (value)
    shown.value = value
})

async function submitNotify() {
  emailError.value = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
  if (!emailError.value)
    await notify(email.value.trim())
}
</script>
