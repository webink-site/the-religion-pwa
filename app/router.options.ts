import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path)
      return false

    if (savedPosition && to.path === '/catalog')
      return false

    if (savedPosition)
      return savedPosition

    return { top: 0 }
  },
}
