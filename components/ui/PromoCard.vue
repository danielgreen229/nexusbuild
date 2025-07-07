<script setup>
import Button from '@/components/ui/Button.vue'

defineProps({
  promo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="promo-card">
    <h3 class="promo-card__title">{{ promo.title }}</h3>
    <p class="promo-card__desc">{{ promo.desc }}</p>
    <div class="promo-card__deadline">{{ promo.deadline }}</div>
    <Button variant="outline">Подробнее</Button>
  </div>
</template>

<style scoped>
.promo-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 30px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.promo-card__title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--primary);
}

.promo-card__desc {
  color: var(--gray);
  margin-bottom: 20px;
  flex-grow: 1;
}

.promo-card__deadline {
  background: var(--secondary);
  color: var(--white);
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 25px;
}
</style>