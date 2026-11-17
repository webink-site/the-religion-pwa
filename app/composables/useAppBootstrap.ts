export async function useAppBootstrap() {
  const authStore = useAuthStore()
  const wishlistStore = useWishlistStore()
  const categoryStore = useCategoryStore()

  watch(() => authStore.token, async (token, previous) => {
    if (!token) {
      if (previous)
        wishlistStore.reset()
      return
    }

    await wishlistStore.load()
    await wishlistStore.flushPending()
  }, { immediate: true })

  await callOnce('categories', () => categoryStore.load())
}
