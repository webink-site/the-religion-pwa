<template>
  <Teleport to="body">
    <Transition name="sidebar-slide">
      <div
        v-if="showSidebar"
        class="fixed inset-0 z-[45] bg-white"
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
      >
        <div
          class="h-full overflow-y-auto px-4 pb-28"
          :class="isNativeApp ? 'pt-28' : 'pt-20'"
        >
          <nav
            class="mb-4 flex gap-6"
            aria-label="Пол"
          >
            <NuxtLink
              v-for="tab in genderTabs"
              :key="tab.id"
              :to="tab.url"
              class="text-lg leading-[130%] tracking-ui transition-opacity"
              :class="isLinkActive(tab.url) ? 'text-ink' : 'text-muted hover:text-ink'"
              @click="closeSidebar"
            >
              {{ tab.title }}
            </NuxtLink>
          </nav>

          <NuxtLink
            :to="promoLink.url"
            class="mb-4 flex h-10 items-center gap-2 rounded-ui bg-[#F4F1E9] px-2 text-base leading-[140%] tracking-ui text-ink transition-opacity hover:opacity-80"
            @click="closeSidebar"
          >
            <Gift
              class="size-4 shrink-0"
              :stroke-width="1.4"
            />
            <span class="min-w-0 text-sm flex-1">
              {{ promoLink.title }}
            </span>
            <ChevronRight
              class="size-[18px] shrink-0"
              :stroke-width="1.4"
            />
          </NuxtLink>

          <ul class="space-y-0">
            <li
              v-for="item in items"
              :key="item.id"
            >
              <template v-if="item.children?.length">
                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-6 py-2 text-left"
                  :aria-expanded="isExpanded(item.id)"
                  :aria-controls="`nav-panel-${item.id}`"
                  @click="toggleExpanded(item.id)"
                >
                  <span class="text-base leading-[130%] tracking-ui text-ink">
                    {{ item.title }}
                  </span>
                  <IconsPlus
                    class="size-[18px] shrink-0 transition-transform duration-300"
                    :class="isExpanded(item.id) ? 'rotate-45' : ''"
                  />
                </button>

                <div
                  :id="`nav-panel-${item.id}`"
                  class="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  :class="isExpanded(item.id) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                >
                  <div class="min-h-0 overflow-hidden">
                    <ul class="flex flex-col gap-2 pb-3 pl-4 pt-1">
                      <li
                        v-for="child in item.children"
                        :key="child.id"
                      >
                        <NuxtLink
                          :to="child.url"
                          class="block py-0.5 text-sm leading-[130%] tracking-ui text-ink hover:opacity-60"
                          @click="closeSidebar"
                        >
                          {{ child.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>

              <NuxtLink
                v-else-if="item.url"
                :to="item.url"
                class="block py-2 text-base leading-[130%] tracking-ui text-ink hover:opacity-60"
                @click="closeSidebar"
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>

          <div class="mt-10 border-t border-line pt-8">
            <ul class="mb-6 space-y-3">
              <li
                v-for="item in socials"
                :key="item.id"
              >
                <a
                  :href="item.url"
                  class="block text-sm leading-[130%] tracking-ui text-ink hover:opacity-60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ item.title }}
                </a>
              </li>
            </ul>

            <div class="space-y-2">
              <UiButton
                title="Войти в личный кабинет"
                size="sm"
                block
                @click="goToProfile"
              />
              <UiButton
                title="Подписаться на рассылку"
                size="sm"
                block
                variant="transparent"
              />
            </div>

            <p class="caption-txt mt-6 text-muted">
              ® {{ year }} The Religion
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ChevronRight, Gift } from '@lucide/vue'

const { isNativeApp } = useNativeApp()
const {
  showSidebar,
  genderTabs,
  promoLink,
  socials,
  buildMenuItems,
  closeSidebar,
  isLinkActive,
} = useNav()

const categoryStore = useCategoryStore()
const year = new Date().getFullYear()
const expandedIds = ref<Set<string>>(new Set())

const items = computed(() => buildMenuItems(categoryStore.items))

function isExpanded(id: string) {
  return expandedIds.value.has(id)
}

function toggleExpanded(id: string) {
  const next = new Set(expandedIds.value)
  if (next.has(id))
    next.delete(id)
  else
    next.add(id)
  expandedIds.value = next
}

function goToProfile() {
  closeSidebar()
  navigateTo('/profile')
}

watch(showSidebar, (open) => {
  if (!open)
    expandedIds.value = new Set()
})
</script>

<style scoped>
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
