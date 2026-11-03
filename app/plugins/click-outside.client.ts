import type { DirectiveBinding } from 'vue'

type ClickOutsideEl = HTMLElement & {
  clickOutsideHandler?: (event: Event) => void
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    beforeMount(el: ClickOutsideEl, binding: DirectiveBinding) {
      el.clickOutsideHandler = (event: Event) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event)
        }
      }
      document.addEventListener('click', el.clickOutsideHandler)
    },
    unmounted(el: ClickOutsideEl) {
      if (el.clickOutsideHandler) {
        document.removeEventListener('click', el.clickOutsideHandler)
      }
    },
  })
})
