<template>
  <div class="h-screen w-full flex justify-center items-center">
    <div class="space-y-3 text-center">
      <img src="/img/logo/dark_logo.svg" alt="logo" class="w-auto h-16 mx-auto">
      <p class="mb-8">Мы рады сообщить, что взялись за разработку мобильного приложения, совсем скоро вы сможете скачать его в App Store и Google Play</p>
      <button class="bg-black text-white rounded-md py-3 px-6 text-lg" @click="installApp">
        Установить приложение
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const installApp = () => {
  alert('А вот х*й тебе за щеку')
}
</script>
