<template>
  <UiAccordion
    :title="title"
    header-class="py-6"
    class="border-b border-line px-4 text-base"
  >
    <ul class="flex flex-col gap-2 pb-3 pl-4 pt-1">
      <li
        v-for="link in links"
        :key="link.id"
      >
        <NuxtLink
          :to="link.url"
          class="block py-0.5 text-sm leading-[130%] tracking-ui text-ink hover:opacity-60"
        >
          {{ link.title }}
        </NuxtLink>
      </li>
    </ul>
  </UiAccordion>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  links: { id: string, title: string, url: string }[]
}>()
</script>
