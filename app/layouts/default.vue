<template>
  <div id="layout-div">
    <LayoutMobileTopNav />
    <LayoutSidebar />
    <slot />
    <LayoutBottomNav />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const categoryStore = useCategoryStore()

await callOnce('categories', () => categoryStore.load())

watch(() => authStore.token, async (token, previous) => {
  if (!token) {
    if (previous)
      wishlistStore.reset()
    return
  }

  await wishlistStore.load()
  await wishlistStore.flushPending()
}, { immediate: true })
</script>
