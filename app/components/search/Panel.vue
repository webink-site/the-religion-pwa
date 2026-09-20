<template>
  <div class="h-screen w-screen fixed top-0 left-0 bg-white z-30 py-32 overflow-y-auto">
    <div class="custom-container">
      <div class="relative sm:w-3xl w-full mx-auto mb-8">
        <input
          ref="searchInputRef"
          v-model="searchValue"
          type="text"
          class="w-full border-b border-black py-3 pr-24 text-black !text-xs sm:text-sm outline-0 focus:placeholder:text-black transition-all"
          placeholder="ПОИСК..."
          @input="scheduleSearch"
        >
        <button
          type="submit"
          class="absolute right-0 top-0 h-full text-xs text-white hover:opacity-60 z-10"
          @click="closePanel"
        >
          <IconsClose class="stroke-black cursor-pointer" />
        </button>
      </div>
      <div
        v-if="results.length && !loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
      >
        <div
          v-for="item in results"
          :key="item.id"
        >
          <pre>{{ item }}</pre>
        </div>
      </div>
      <div v-if="!loading && !results.length">
        <p class="body-txt text-neutral-500 text-center">
          По вашему запросу ничего не найдено
        </p>
      </div>

      <div
        v-if="loading"
        class="flex justify-center items-center"
      >
        <UiLoader class="!size-8 !text-black" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['closePanel'])

// const $toast = useNuxtApp().$toast
const config = useRuntimeConfig()
const searchValue = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const results = ref<any[]>([])
const loading = ref(false)

const SEARCH_DEBOUNCE_MS = 800
let searchDebounceId: ReturnType<typeof setTimeout> | null = null

const scheduleSearch = () => {
  if (searchDebounceId !== null) {
    clearTimeout(searchDebounceId)
  }
  searchDebounceId = setTimeout(() => {
    searchDebounceId = null
    void startSearch()
  }, SEARCH_DEBOUNCE_MS)
}

const startSearch = async () => {
  loading.value = true
  if (searchValue.value.length < 1) {
    results.value = []
    loading.value = false
    return
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await $fetch<{ data: any }>(`${config.public.apiBase}/api/products`, {
      query: {
        search: searchValue.value,
        per_page: 100,
      },
    })
    results.value = data
  }
  catch {
    alert('Ошибка поиска')
    // $toast('Ошибка поиска', 'error')
  }
  finally {
    loading.value = false
  }
}

const closePanel = () => {
  if (searchDebounceId !== null) {
    clearTimeout(searchDebounceId)
    searchDebounceId = null
  }
  searchValue.value = ''
  loading.value = false
  results.value = []
  emit('closePanel')
}

onBeforeUnmount(() => {
  if (searchDebounceId !== null) {
    clearTimeout(searchDebounceId)
  }
})

onMounted(() => {
  searchInputRef.value?.focus()
  // закрывать панель по Escape
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Esc' || event.key === 'Escape') {
      closePanel()
    }
  })
})
</script>
