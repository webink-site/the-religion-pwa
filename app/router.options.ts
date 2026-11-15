import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()

    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce('page:finish', () => {
        if (to.path === from.path || (savedPosition && to.path === '/catalog')) {
          resolve(false)
          return
        }

        resolve(savedPosition || { top: 0 })
      })
    })
  },
}
