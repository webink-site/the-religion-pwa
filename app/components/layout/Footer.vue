<template>
  <footer class="mt-8 sm:mt-16 border-t border-line bg-page">
    <!-- mobile -->
    <div class="lg:hidden">
      <LayoutFooterAccordion
        title="Каталог"
        :links="catalogLinks"
      />
      <LayoutFooterAccordion
        title="Покупателям"
        :links="serviceLinks"
      />
      <LayoutFooterAccordion
        title="О компании"
        :links="companyLinks"
      />

      <div class="flex flex-col gap-5 px-4 py-6">
        <div class="grid grid-cols-2 gap-3">
          <UiButtonSecondary
            title="App Store"
            block
            size="sm"
          />
          <UiButtonSecondary
            title="Google Play"
            block
            size="sm"
          />
        </div>

        <UiButton
          title="Подписаться на рассылку"
          variant="transparent"
          block
        />
      </div>
    </div>

    <!-- desktop: 4 + 8 колонок, как 12-колоночная сетка 2MOOD -->
    <div class="hidden px-4 pt-16 lg:block">
      <div class="grid grid-cols-12">
        <div class="col-span-4 flex flex-col items-start gap-6 pr-6">
          <p class="max-w-xs text-md font-medium leading-[130%] text-ink">
            Скачайте приложение для <br> iOS или Android.
          </p>
          <img
            src="/img/qr.svg"
            alt="QR-код приложения"
            class="size-36"
          >
          <p class="caption-txt max-w-[220px] text-muted">
            Наведите камеру на QR-код, чтобы скачать его прямо сейчас
          </p>
        </div>

        <div class="col-span-8 grid grid-cols-3">
          <div class="flex flex-col gap-4 px-6">
            <span class="text-md font-medium text-ink">Каталог</span>
            <ul class="flex flex-col gap-2">
              <li
                v-for="link in catalogLinks"
                :key="link.id"
              >
                <NuxtLink
                  :to="link.url"
                  class="basic-link body-txt"
                >
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-4 px-6">
            <span class="text-md font-medium text-ink">Покупателям</span>
            <ul class="flex flex-col gap-2">
              <li
                v-for="link in serviceLinks"
                :key="link.id"
              >
                <NuxtLink
                  :to="link.url"
                  class="basic-link body-txt"
                >
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-4 px-6">
            <span class="text-md font-medium text-ink">О компании</span>
            <ul class="flex flex-col gap-2">
              <li
                v-for="link in companyLinks"
                :key="link.id"
              >
                <NuxtLink
                  :to="link.url"
                  class="basic-link body-txt"
                >
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex justify-end py-6">
        <UiButton
          title="Подписаться на рассылку"
          variant="transparent"
          size="md"
        />
      </div>
    </div>

    <div class="px-4 pb-8 lg:pb-10">
      <div class="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-y border-line py-4">
        <nav class="flex flex-wrap gap-x-6 gap-y-2">
          <NuxtLink
            v-for="link in legalLinks"
            :key="link.id"
            :to="link.url"
            class="basic-link text-xs"
          >
            {{ link.title }}
          </NuxtLink>
        </nav>
        <div class="flex shrink-0 gap-5">
          <NuxtLink
            v-for="social in socials"
            :key="social.id"
            :to="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="basic-link text-xs"
          >
            {{ social.title }}
          </NuxtLink>
        </div>
      </div>

      <div class="flex gap-3 flex-wrap pt-5">
        <span class="caption-txt text-muted">© {{ year }} The Religion</span>
        <span class="caption-txt text-muted">ИП Кузнев Григорий Дмитриевич</span>
        <span class="caption-txt text-muted">ИНН: 773773563754 · ОГРНИП: 325774600065028</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { socials } = useNav()
const year = new Date().getFullYear()

const catalogLinks = [
  { id: 'cat-new', title: 'Новая коллекция', url: '/catalog?new_collection=1' },
  { id: 'cat-all', title: 'Все товары', url: '/catalog' },
  { id: 'cat-fw26', title: 'Fall-Winter 26', url: `/catalog?collection_code=${encodeURIComponent('F/W 26')}` },
  { id: 'cat-ss26', title: 'Spring-Summer 26', url: `/catalog?collection_code=${encodeURIComponent('S/S 26')}` },
  { id: 'cat-men', title: 'Мужское', url: '/catalog?sex=male' },
  { id: 'cat-women', title: 'Женское', url: '/catalog?sex=female' },
]

const serviceLinks = [
  { id: 'srv-delivery', title: 'Доставка', url: '/client-service/delivery' },
  { id: 'srv-refund', title: 'Возврат', url: '/client-service/refund' },
  { id: 'srv-loyalty', title: 'Программа лояльности', url: '/client-service/loyalty' },
  { id: 'srv-preorder', title: 'Предзаказ', url: '/client-service/preorder' },
]

const legalLinks = [
  { id: 'legal-policy', title: 'Политика безопасности', url: '/client-service/policy' },
  { id: 'legal-offer', title: 'Публичная оферта', url: '/client-service/public-offer' },
  { id: 'legal-org', title: 'Данные об организации', url: '/client-service/organization' },
]

const companyLinks = [
  { id: 'cmp-about', title: 'О нас', url: '/about' },
  { id: 'cmp-contacts', title: 'Контакты', url: '/contacts' },
  { id: 'cmp-lookbook-ss', title: 'Lookbook SS26', url: '/spring-summer-2026' },
  { id: 'cmp-lookbook-fw', title: 'Lookbook FW26', url: '/fall-winter-2026' },
  { id: 'cmp-running', title: 'Running Club', url: '/running-club' },
]
</script>
