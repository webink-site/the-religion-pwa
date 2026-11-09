<template>
  <div
    class="fixed bottom-0 left-0 z-40 w-full transition-all duration-500"
    :class="isScrolled || isMenuOpen ? 'bg-white' : ''"
  >
    <div class="flex justify-center items-center pb-4 pt-1">
      <NuxtLink
        v-for="link in bottomBarLinks"
        :key="link.title"
        :to="link.url"
        class="bottombar-link flex flex-col items-center space-y-1 px-6 py-4"
        :class="{ 'is-active-navlink': isLinkActive(link.url) }"
        active-class=""
        exact-active-class=""
      >
        <component
          :is="link.icon"
          :count="1"
          class="mx-auto h-6 w-6 shrink-0 text-black"
          :class="{ 'text-white': route.meta.darkNav && !isScrolled && !isMenuOpen }"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const {
  isScrolled,
  isMenuOpen,
  bottomBarLinks,
  isLinkActive,
} = useNav()
</script>
