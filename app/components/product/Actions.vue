<template>
  <div class="space-y-2">
    <div
      v-if="cta !== 'none'"
      class="flex items-stretch gap-2"
    >
      <UiButton
        v-if="cta === 'notify'"
        title="Уведомить о поступлении"
        class="min-w-0 flex-1"
        :loading="notifyPending"
        @click="notify()"
      />
      <UiButtonSecondary
        v-else-if="cta === 'soldOut'"
        title="Товар закончился"
        class="min-w-0 flex-1"
        disabled
      />
      <UiButton
        v-else
        :title="ctaTitle"
        class="min-w-0 flex-1"
        @click="addToCart"
      />

      <UiButton
        variant="soft"
        class="!w-[54px] shrink-0 !p-0"
        :aria-label="inWishlist ? 'Убрать из избранного' : 'В избранное'"
        @click="wishlistStore.toggle(product.id)"
      >
        <Heart
          class="size-5"
          :stroke-width="1.4"
          :fill="inWishlist ? 'currentColor' : 'none'"
        />
      </UiButton>
    </div>

    <UiChip
      v-for="note in notes"
      :key="note"
      :title="note"
      class="mx-auto block w-full text-center"
    />
  </div>
</template>

<script setup lang="ts">
import { Heart } from '@lucide/vue'

const { product, cta, ctaTitle, notifyPending, saleStartLabel, preorderEta, addToCart, notify } = useProduct()
const wishlistStore = useWishlistStore()

const inWishlist = computed(() => wishlistStore.has(product.value.id))
const notes = computed(() => [cta.value === 'notify' ? saleStartLabel.value : preorderEta.value].filter(Boolean))
</script>
