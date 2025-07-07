<script setup>
const title = "Готовые шаблоны сайтов"
const subtitle = "Выбери шаблон и получи сайт за 24 часа"
</script>

<template>
  <section class="portfolio-hero">
    <div class="portfolio-hero__container container">
      <div class="portfolio-hero__content">
        <h1 class="portfolio-hero__title">{{ title }}</h1>
        <p class="portfolio-hero__subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-hero {
  padding: 80px 0;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  text-align: center;
  color: white;
}

.portfolio-hero__title {
  font-size: 2.8rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.portfolio-hero__subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .portfolio-hero {
    padding: 60px 0;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  }
  
  .portfolio-hero__title {
    font-size: 2.2rem;
  }
  
  .portfolio-hero__subtitle {
    font-size: 1.1rem;
  }
}
</style>