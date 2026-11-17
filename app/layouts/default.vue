<template>
  <div id="layout-div" class="pb-16 lg:pb-0">
    <LayoutMobileTopNav />
    <LayoutSidebar />
    <slot />
    <LayoutFooter />
    <LayoutBottomNav />
  </div>
</template>

<script setup lang="ts">
await useAppBootstrap()
</script>
