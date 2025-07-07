<template>
  <section class="features section">
    <div class="container">
      <h2 class="section__title">Почему мы</h2>
      <ul class="features__list">
        <li class="feature">
          <div class="feature__icon">🚀</div>
          <h3 class="feature__title">Скорость</h3>
          <p class="feature__desc">Сайт за 5 рабочих дней</p>
        </li>
        <li class="feature">
          <div class="feature__icon">🛡️</div>
          <h3 class="feature__title">Гарантия</h3>
          <p class="feature__desc">1 год технической поддержки</p>
        </li>
        <li class="feature">
          <div class="feature__icon">💼</div>
          <h3 class="feature__title">Опыт</h3>
          <p class="feature__desc">120+ проектов за 3 года</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.features__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  text-align: center;
  list-style: none;
}

.feature {
  padding: 30px;
  border-radius: var(--radius);
  background: var(--white);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-10px);
}

.feature__icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature__title {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.feature__desc {
  color: var(--gray);
}
</style>