<script setup>
defineProps({
  service: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="service-card">
    <div class="service-card__header">
      <h3 class="service-card__title">{{ service.title }}</h3>
      <div class="service-card__price">{{ service.price }}</div>
      <div v-if="service.popular" class="service-card__badge">Популярно</div>
    </div>
    <ul class="service-card__features">
      <li v-for="(feature, idx) in service.features" :key="idx" class="service-card__feature">
        {{ feature }}
      </li>
    </ul>
    <UiButton class="service-card__button" variant="primary">Заказать</UiButton>
  </div>
</template>

<style scoped>
.service-card {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-card__header {
  background: var(--primary);
  color: var(--white);
  padding: 25px 20px;
  position: relative;
}

.service-card__title {
  font-size: 1.5rem;
}

.service-card__price {
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 10px;
}

.service-card__badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--secondary);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.service-card__features {
  padding: 25px 20px;
  flex-grow: 1;
  list-style: none;
}

.service-card__feature {
  padding: 12px 0;
  border-bottom: var(--border);
}

.service-card__feature:last-child {
  border-bottom: none;
}

.service-card__button {
  margin: 20px;
}
</style>