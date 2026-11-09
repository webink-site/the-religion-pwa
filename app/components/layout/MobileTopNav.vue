<template>
  <ClientOnly>
    <div
      class="fixed top-0 left-0 z-[70] w-full px-4 pb-3 flex items-center justify-between transition-all duration-500"
      :class="[
        isNativeApp ? 'pt-16' : 'pt-3',
        isScrolled || isMenuOpen ? 'bg-white' : 'bg-transparent',
      ]"
    >
      <button
        type="button"
        class="inline-flex size-10 items-center justify-center"
        :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
        @click="toggleSidebar"
      >
        <X
          v-if="isMenuOpen"
          class="size-6"
          :stroke-width="1.3"
        />
        <IconsBurger
          v-else
          class="h-8 w-8"
        />
      </button>

      <NuxtLink
        v-if="!isNativeApp"
        to="/"
      >
        <img
          src="/img/logo/dark_logo.svg"
          alt="The Religion logo"
        >
      </NuxtLink>

      <button
        type="button"
        class="inline-flex size-10 items-center justify-center"
        aria-label="Открыть поиск"
        @click="openSearch"
      >
        <Search class="size-6" :stroke-width="1.3" />
      </button>

      <Teleport
        v-if="isMounted"
        to="#layout-div"
      >
        <Transition
          name="fade-slide"
          mode="out-in"
        >
          <SearchPanel
            v-if="showSearchPanel"
            @close-panel="closeSearch"
          />
        </Transition>
      </Teleport>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Search, X } from '@lucide/vue'

const { isNativeApp } = useNativeApp()
const {
  isScrolled,
  isMenuOpen,
  showSearchPanel,
  toggleSidebar,
  openSearch,
  closeSearch,
} = useNav()

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>
