<template>
  <client-only>
    <div
      class="fixed top-0 left-0 w-full z-10 pt-16 px-4 pb-4 flex items-center justify-between"
      :class="{ '!pt-4': !isNativeApp }"
    >
      <!-- бургер -->
      <button @click="showSidebar = !showSidebar">
        <IconsBurger class="h-8 w-8" />
      </button>

      <NuxtLink v-if="!isNativeApp" to="/">
        <img
          src="/img/logo/dark_logo.svg"
          alt="The Religion logo"
        >
      </NuxtLink>

      <!-- поиск -->
      <button @click="showSearchPanel = !showSearchPanel">
        <Search />
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
            @close-panel="showSearchPanel = false"
          />
        </Transition>
      </Teleport>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { Search } from '@lucide/vue'

const { isNativeApp } = useNativeApp()

const showSidebar = ref(false)
const showSearchPanel = ref(false)

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>
