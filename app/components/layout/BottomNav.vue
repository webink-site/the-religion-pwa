<template>
  <div class="fixed bottom-0 left-0 w-full">
    <div class="flex justify-center items-center pb-4 pt-1">
      <nuxt-link
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
          :class="{ 'text-white': route.meta.darkNav }"
        />
        <!-- <p class="text-xs tracking-tight leading-[120%] text-white">
          {{ link.title }}
        </p> -->
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconsBarCatalog from '../icons/bar-catalog.vue'
import IconsBarContacts from '../icons/bar-contacts.vue'
import IconsBarCart from '../icons/bar-cart.vue'
import IconsBarProfile from '../icons/bar-profile.vue'
import IconsBarHome from '../icons/bar-home.vue'

const route = useRoute()

const bottomBarLinks = [
  {
    title: 'Каталог',
    url: '/catalog',
    icon: IconsBarCatalog,
  },
  {
    title: 'Контакты',
    url: '/contacts',
    icon: IconsBarContacts,
  },
  {
    title: 'Главная',
    url: '/',
    icon: IconsBarHome,
  },
  {
    title: 'Профиль',
    url: '/profile',
    icon: IconsBarProfile,
  },
  {
    title: 'Корзина',
    url: '/cart',
    icon: IconsBarCart,
  },
]

function isLinkActive(url: string) {
  return route.path === url || route.path.startsWith(`${url}/`)
}
</script>
