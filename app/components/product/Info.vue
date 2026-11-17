<template>
  <div class="space-y-4">
    <div
      v-if="!compact"
      class="space-y-2"
    >
      <h1 class="body-txt">
        {{ product.name }}
      </h1>
      <p
        v-if="price"
        class="body-txt"
      >
        {{ price }}
      </p>
      <ProductChips />
    </div>

    <button
      v-if="price"
      type="button"
      class="flex w-full items-center justify-between gap-3 rounded-ui bg-surface px-3 py-2.5 text-left body-txt transition-colors hover:bg-surface-hover"
      @click="modal = 'installments'"
    >
      от {{ installment }} × 4 платежа
      <ChevronRight
        class="size-4 shrink-0"
        :stroke-width="1.4"
      />
    </button>

    <p
      v-if="product.model_info"
      class="body-txt whitespace-pre-line"
    >
      {{ product.model_info }}
    </p>

    <p
      v-if="stockLabel"
      class="caption-txt text-muted"
    >
      В наличии: {{ stockLabel }}
    </p>

    <ProductColors />

    <p class="caption-txt text-muted">
      <NuxtLink
        to="/client-service/delivery"
        class="basic-link text-muted"
      >Доставка</NuxtLink>
      ·
      <NuxtLink
        to="/client-service/refund"
        class="basic-link text-muted"
      >Возврат</NuxtLink>
      ·
      <NuxtLink
        to="/client-service/loyalty"
        class="basic-link text-muted"
      >Лояльность</NuxtLink>
    </p>

    <ProductPurchaseOptions />
    <ProductActions v-if="!compact" />
    <ProductDetails class="!mt-8" />
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

const { compact = false } = defineProps<{
  compact?: boolean
}>()

const { product, price, stockLabel, modal } = useProduct()

const installment = computed(() => `${Math.round(product.value.price.current / 4).toLocaleString('ru-RU')} ₽`)
</script>
