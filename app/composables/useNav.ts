import type { Component } from 'vue'
import BarCart from '~/components/icons/bar-cart.vue'
import { Heart, House, Shirt, UserRound } from '@lucide/vue'
import type { ICategory } from '~/types/catalog'

export type NavLink = {
  id: string
  title: string
  url: string
  external?: boolean
}

export type NavItem = {
  id: string
  title: string
  url?: string
  children?: NavLink[]
}

export type BottomNavLink = {
  title: string
  url: string
  icon: Component
}

const SCROLL_TRIGGER = 200

export function useNav() {
  const route = useRoute()
  const showSidebar = useState('nav-sidebar-open', () => false)
  const showSearchPanel = useState('nav-search-open', () => false)
  const scrollY = useState('nav-scroll-y', () => 0)
  const scrollReady = useState('nav-scroll-ready', () => false)
  const bodyLockReady = useState('nav-body-lock-ready', () => false)

  const isScrolled = computed(() => scrollY.value >= SCROLL_TRIGGER)
  const isMenuOpen = computed(() => showSidebar.value)

  const genderTabs = computed<NavLink[]>(() => [
    { id: 'women', title: 'Женское', url: '/catalog?sex=female' },
    { id: 'men', title: 'Мужское', url: '/catalog?sex=male' },
  ])

  const promoLink = computed<NavLink>(() => ({
    id: 'certificates',
    title: 'Подарочные сертификаты',
    url: '/certificates',
  }))

  const catalogStaticChildren = computed<NavLink[]>(() => [
    { id: 'catalog-all', title: 'Все товары', url: '/catalog' },
    {
      id: 'catalog-fw26',
      title: 'Fall-Winter 26',
      url: `/catalog?collection_code=${encodeURIComponent('F/W 26')}`,
    },
    {
      id: 'catalog-ss26',
      title: 'Spring-Summer 26',
      url: `/catalog?collection_code=${encodeURIComponent('S/S 26')}`,
    },
  ])

  const lookbookChildren = computed<NavLink[]>(() => [
    { id: 'lookbook-ss26', title: 'SS26', url: '/spring-summer-2026' },
    { id: 'lookbook-fw26', title: 'FW26', url: '/fall-winter-2026' },
  ])

  const clientServiceChildren = computed<NavLink[]>(() => [
    { id: 'cs-home', title: 'Клиентский сервис', url: '/client-service' },
    { id: 'cs-delivery', title: 'Доставка', url: '/client-service/delivery' },
    { id: 'cs-refund', title: 'Возврат', url: '/client-service/refund' },
    { id: 'cs-policy', title: 'Политика безопасности', url: '/client-service/policy' },
    { id: 'cs-loyalty', title: 'Программа лояльности', url: '/client-service/loyalty' },
    { id: 'cs-org', title: 'Данные об организации', url: '/client-service/organization' },
    { id: 'cs-offer', title: 'Публичная оферта', url: '/client-service/public-offer' },
    { id: 'cs-preorder', title: 'Предзаказ', url: '/client-service/preorder' },
  ])

  function mapCategoriesToLinks(categories: ICategory[]): NavLink[] {
    return categories
      .filter(category => category.slug !== 'bez-gruppy-tovarov')
      .map(category => ({
        id: `category-${category.slug}`,
        title: category.title,
        url: `/catalog?categories=${category.slug}`,
      }))
  }

  function buildMenuItems(categories: ICategory[] = []): NavItem[] {
    const categoryLinks = mapCategoriesToLinks(categories)
    const [allProducts, ...collections] = catalogStaticChildren.value

    return [
      {
        id: 'new-collection',
        title: 'Новая коллекция',
        url: '/catalog?new_collection=1',
      },
      {
        id: 'catalog',
        title: 'Каталог',
        children: [
          ...(allProducts ? [allProducts] : []),
          ...categoryLinks,
          ...collections,
        ],
      },
      {
        id: 'lookbook',
        title: 'Lookbook',
        children: lookbookChildren.value,
      },
      {
        id: 'running-club',
        title: 'Running Club',
        url: '/running-club',
      },
      {
        id: 'about',
        title: 'О нас',
        url: '/about',
      },
      {
        id: 'contacts',
        title: 'Контакты',
        url: '/contacts',
      },
      {
        id: 'client-service',
        title: 'Клиентский сервис',
        children: clientServiceChildren.value,
      },
    ]
  }

  const menuItems = computed(() => buildMenuItems())

  const socials = computed<NavLink[]>(() => [
    { id: 'tg', title: 'Telegram', url: 'https://t.me/therlgn', external: true },
    { id: 'wa', title: 'WhatsApp', url: 'https://wa.me/79801548825', external: true },
  ])

  const bottomBarLinks = computed<BottomNavLink[]>(() => [
    { title: 'Каталог', url: '/catalog', icon: Shirt },
    { title: 'Контакты', url: '/contacts', icon: Heart },
    { title: 'Главная', url: '/', icon: House },
    { title: 'Профиль', url: '/profile', icon: UserRound },
    { title: 'Корзина', url: '/cart', icon: BarCart },
  ])

  function isLinkActive(url: string) {
    const [path = '/', query = ''] = url.split('?')
    if (path === '/')
      return route.path === '/'

    if (route.path !== path && !route.path.startsWith(`${path}/`))
      return false

    if (!query)
      return true

    const params = new URLSearchParams(query)
    for (const [key, value] of params.entries()) {
      const current = route.query[key]
      const currentValue = Array.isArray(current) ? current[0] : current
      if (String(currentValue ?? '') !== value)
        return false
    }
    return true
  }

  function openSidebar() {
    showSidebar.value = true
    showSearchPanel.value = false
  }

  function closeSidebar() {
    showSidebar.value = false
  }

  function toggleSidebar() {
    if (showSidebar.value)
      closeSidebar()
    else
      openSidebar()
  }

  function openSearch() {
    showSearchPanel.value = true
    showSidebar.value = false
  }

  function closeSearch() {
    showSearchPanel.value = false
  }

  function updateScroll() {
    scrollY.value = window.scrollY
  }

  if (import.meta.client && !scrollReady.value) {
    scrollReady.value = true
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
  }

  if (!bodyLockReady.value) {
    bodyLockReady.value = true
    watch(showSidebar, (open) => {
      if (!import.meta.client)
        return
      document.body.style.overflow = open ? 'hidden' : ''
    }, { immediate: true })
  }

  return {
    scrollTrigger: SCROLL_TRIGGER,
    scrollY,
    isScrolled,
    isMenuOpen,
    showSidebar,
    showSearchPanel,
    genderTabs,
    promoLink,
    menuItems,
    socials,
    bottomBarLinks,
    buildMenuItems,
    mapCategoriesToLinks,
    isLinkActive,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    openSearch,
    closeSearch,
    updateScroll,
  }
}
