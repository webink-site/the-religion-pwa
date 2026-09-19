<template>
  <div>
    <div class="h-screen w-full flex justify-center items-end p-4 pb-20 relative">
      <img
        src="https://api.therlgn.com/storage/slider-attachments/01M00M4F8NJEHKHTE43DA9E6PB.jpg"
        alt="background"
        class="w-full h-full object-cover absolute top-0 left-0 z-0"
      >
      <div class="space-y-3 text-center relative">
        <img src="/img/logo/white_logo.svg" alt="logo" class="w-auto h-16 mx-auto">
        <p class="mb-8 text-white">Мы рады сообщить, что взялись за разработку мобильного приложения, совсем скоро вы сможете скачать его в App Store и Google Play</p>
        <button class="w-full bg-black text-white rounded-md py-3 px-6 text-lg" @click="installApp">
          Перейти в каталог
        </button>
      </div>
    </div>

    <!-- <div class="container mx-auto px-2 sm:px-0 pb-20 pt-4">
      <div class="grid grid-cols-2 gap-2 gap-y-8">
        <ShopProductCard />
        <ShopProductCard />
        <ShopProductCard />
        <ShopProductCard />
        <ShopProductCard />
        <ShopProductCard />
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  darkNav: true,
})

const installApp = () => {
  alert('А вот х*й тебе за щеку')
}
</script>
