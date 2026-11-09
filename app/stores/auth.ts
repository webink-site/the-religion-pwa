export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const loggedIn = computed(() => Boolean(token.value))

  function setToken(value: string | null) {
    token.value = value
  }

  function clear() {
    token.value = null
  }

  return {
    token,
    loggedIn,
    setToken,
    clear,
  }
}, {
  persist: {
    pick: ['token'],
  },
})
