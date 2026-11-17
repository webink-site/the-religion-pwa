<template>
  <div id="layout-div">
    <div class="hidden lg:block">
      <LayoutMobileTopNav />
      <LayoutSidebar />
    </div>
    <LayoutProductTopBar />
    <slot />
    <LayoutFooter class="hidden lg:block" />
  </div>
</template>

<script setup lang="ts">
await useAppBootstrap()

const sheetOpen = useProductSheetOpen()

let mobileQuery: MediaQueryList | null = null

function lockOnMobile() {
  document.body.style.overflow = mobileQuery?.matches ? 'hidden' : ''
}

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 1024px)')
  lockOnMobile()
  mobileQuery.addEventListener('change', lockOnMobile)
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', lockOnMobile)
  document.body.style.overflow = ''
  sheetOpen.value = false
})
</script>
