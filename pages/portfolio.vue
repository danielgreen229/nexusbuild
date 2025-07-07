<script setup>
import PortfolioHero from '@/components/portfolio/PortfolioHero.vue'
import PortfolioFilters from '@/components/portfolio/PortfolioFilters.vue'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid.vue'
import PortfolioCTA from '@/components/portfolio/PortfolioCTA.vue'

// Состояние фильтра (для примера, лучше использовать Pinia)
const activeFilter = ref('all')
</script>

<template>
  <div class="portfolio-page">
    <PortfolioHero />
    <PortfolioFilters v-model:active-filter="activeFilter" />
    <PortfolioGrid :active-filter="activeFilter" />
    <PortfolioCTA />
  </div>
</template>

<style scoped>
.portfolio-page {
  background: #f8fafc;
}
</style>