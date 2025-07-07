<script setup>
import PromoCard from '@/components/ui/PromoCard.vue'

const promos = [
  {
    title: "Сайт + домен в подарок",
    desc: "При заказе до конца месяца бесплатный домен на 1 год",
    deadline: "До 30 ноября"
  },
  {
    title: "SEO-продвижение в подарок",
    desc: "При заказе корпоративного сайта 3 месяца SEO бесплатно",
    deadline: "Осталось 12 мест"
  },
  {
    title: "Скидка 20% на второй сайт",
    desc: "При заказе двух сайтов скидка на второй проект",
    deadline: "Без ограничений"
  }
];
</script>

<template>
  <section class="promo section section--gray">
    <div class="container">
      <h2 class="section__title">Горячие предложения</h2>
      <div class="promo__grid">
        <PromoCard 
          v-for="(promo, index) in promos"
          :key="index"
          :promo="promo"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.promo__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}
</style>