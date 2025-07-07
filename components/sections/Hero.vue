<script setup>
import Button from '@/components/ui/Button.vue'
</script>

<template>
  <section class="hero">
    <div class="hero__container container">
      <div class="hero__content">
        <h1 class="hero__title">
          Профессиональные сайты <br>
          <span class="text-accent">15 000 рублей</span>
        </h1>
        <p class="hero__subtitle">Разрабатываем продающие сайты за&nbsp;1&nbsp;день с&nbsp;гарантией 1&nbsp;год</p>
        <div class="hero__actions">
          <Button size="lg" variant="primary">Оставить заявку</Button>
          <Button size="lg" variant="outline">Заказать шаблон</Button>
        </div>
      </div>
      <div class="hero__image">
        <div class="mockup">
          <img class="mockup__screen" src="assets/images/landing/hero.jpeg"/>
          <div class="mockup__bar"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 100px 0 20px 0;
}

.hero__container {
  display: flex;
  align-items: center;
  gap: 60px;
}

.hero__content {
  flex: 1;
}

.hero__title {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 24px;
}

.hero__subtitle {
  font-size: 1.25rem;
  color: var(--gray);
  margin-bottom: 40px;
}

.hero__actions {
  display: flex;
  gap: 20px;
}

.hero__image {
  flex: 1;
}

.mockup {
  position: relative;
  background: var(--primary);
  border-radius: var(--radius);
  height: 400px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.mockup__screen {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 50px;
  border-radius: 8px;
  overflow: hidden;
  object-fit: cover;
  width: calc(100% - 40px);
}

.mockup__img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Заполняем область без искажений */
  display: block;
  transition: transform 0.5s ease; /* Плавное увеличение при наведении */
}

.mockup:hover .mockup__img {
  transform: scale(1.03); /* Эффект увеличения */
}
.mockup__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: var(--dark);
}

@media (max-width: 768px) {
  .hero__container {
    flex-direction: column;
  }
}
</style>