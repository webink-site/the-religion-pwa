<template>
  <div class="fixed bottom-0 left-0 w-full transition-all duration-500" :class="scrollY < offsetTrigger ? '' : 'bg-white'">
    <div class="flex justify-center items-center pb-4 pt-1 ">
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
          :class="{ 'text-white': route.meta.darkNav && scrollY < offsetTrigger }"
        />
        <!-- <p class="text-xs tracking-tight leading-[120%] text-white">
          {{ link.title }}
        </p> -->
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import BarCart from '../icons/bar-cart.vue'
import { Heart, House, Shirt, UserRound } from '@lucide/vue'

const route = useRoute()
const scrollY = ref(0)
const offsetTrigger = 200

const updateScroll = () => {
  scrollY.value = window.scrollY
}

onMounted(() => {
  updateScroll()
  window.addEventListener('scroll', updateScroll)
})

const bottomBarLinks = [
  {
    title: 'Каталог',
    url: '/catalog',
    icon: Shirt,
  },
  {
    title: 'Контакты',
    url: '/contacts',
    icon: Heart,
  },
  {
    title: 'Главная',
    url: '/',
    icon: House,
  },
  {
    title: 'Профиль',
    url: '/profile',
    icon: UserRound,
  },
  {
    title: 'Корзина',
    url: '/cart',
    icon: BarCart,
  },
]

function isLinkActive(url: string) {
  return route.path === url || route.path.startsWith(`${url}/`)
}
</script>
