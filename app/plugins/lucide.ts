import { LUCIDE_CONTEXT } from '@lucide/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(LUCIDE_CONTEXT, {
    size: 24,
    color: 'currentColor',
    strokeWidth: 1.25,
  })
})
