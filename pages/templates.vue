<script setup>
import PortfolioHero from '@/components/portfolio/PortfolioHero.vue'
import PortfolioFilters from '@/components/portfolio/PortfolioFilters.vue'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid.vue'


// Состояние фильтра (для примера, лучше использовать Pinia)
const activeFilter = ref('all')


useSEO({ 
  title: 'Шаблоны', 
  description: 'Адаптивные шаблоны для лендингов, магазинов и портфолио — быстрый запуск сайта, простая настройка и SEO-готовность.',
  image: 'https://sitebypro-server.ru/static/files/store/preview.png',
  url: 'https://sitebypro.com/templates'
})

</script>

<template>
  <div class="portfolio-page">
    <PortfolioHero />
    <PortfolioFilters v-model:active-filter="activeFilter" />
    <PortfolioGrid :active-filter="activeFilter" />
  </div>
</template>

<style scoped>
.portfolio-page {
  background: #f8fafc;
}
</style>