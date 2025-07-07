<script setup>
import ServiceCard from '@/components/ui/ServiceCard.vue'

const services = [
  {
    title: "Лендинг",
    price: "10 000 ₽",
    features: ["1 страница", "Адаптивный дизайн", "Форма заявки"],
    popular: true
  },
  {
    title: "Корпоративный сайт",
    price: "25 000 ₽",
    features: ["5-10 страниц", "CMS система", "SEO база"],
    popular: false
  },
  {
    title: "Интернет-магазин",
    price: "45 000 ₽",
    features: ["Каталог товаров", "Корзина и оплата", "Личный кабинет"],
    popular: true
  }
];
</script>

<template>
  <section class="services section">
    <div class="container">
      <h2 class="section__title">Что создаем</h2>
      <div class="services__grid">
        <ServiceCard 
          v-for="(service, index) in services"
          :key="index"
          :service="service"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.services__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}
</style>