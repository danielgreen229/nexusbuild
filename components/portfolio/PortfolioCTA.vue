<script setup>
const title = "Нужен уникальный дизайн?"
const subtitle = "Разработаем эксклюзивный сайт специально для вас"
</script>

<template>
  <section class="portfolio-cta">
    <div class="portfolio-cta__container container">
      <div class="portfolio-cta__content">
        <h2 class="portfolio-cta__title">{{ title }}</h2>
        <p class="portfolio-cta__subtitle">{{ subtitle }}</p>
        <button class="portfolio-cta__button button button--primary">
          Заказать дизайн
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-cta {
  padding: 80px 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  text-align: center;
}

.portfolio-cta__content {
  max-width: 700px;
  margin: 0 auto;
}

.portfolio-cta__title {
  font-size: 2.2rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.portfolio-cta__subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

.portfolio-cta__button {
  padding: 14px 40px;
  font-size: 1.1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .portfolio-cta {
    padding: 60px 0;
  }
  
  .portfolio-cta__title {
    font-size: 1.8rem;
  }
  
  .portfolio-cta__subtitle {
    font-size: 1.1rem;
  }
}
</style>