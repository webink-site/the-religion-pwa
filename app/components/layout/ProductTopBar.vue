<template>
  <div
    v-show="!sheetOpen"
    class="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 pb-3 text-white mix-blend-difference lg:hidden"
    :class="isNativeApp ? 'pt-16' : 'pt-3'"
  >
    <button
      type="button"
      class="inline-flex size-10 items-center justify-center"
      aria-label="Назад"
      @click="goBack"
    >
      <ChevronLeft
        class="size-6"
        :stroke-width="1.3"
      />
    </button>
    <NuxtLink
      to="/cart"
      class="inline-flex size-10 items-center justify-center"
      aria-label="Корзина"
    >
      <Handbag
        class="size-6"
        :stroke-width="1.25"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Handbag } from '@lucide/vue'

const { isNativeApp } = useNativeApp()
const sheetOpen = useProductSheetOpen()
const router = useRouter()

function goBack() {
  if (window.history.state?.back)
    router.back()
  else
    navigateTo('/catalog')
}
</script>
