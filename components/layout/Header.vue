<script setup>
import Button from '@/components/ui/Button.vue'

// Определяем маршруты
const navItems = [
  { name: 'Главная', path: '/' },
  { name: 'Шаблоны', path: '/portfolio' },
  { name: 'Тарифы', path: '/pricing' }
]
</script>

<template>
  <header class="header">
    <div class="header__container container">
      <div class="header__logo">NexusBuild</div>
      <nav class="header__nav">
        <ul class="nav">
          <li 
            v-for="item in navItems" 
            :key="item.path" 
            class="nav__item"
          >
            <NuxtLink 
              :to="item.path" 
              class="nav__link"
              active-class="nav__link--active"
              exact-active-class="nav__link--active"
            >
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <Button variant="primary">Заказать</Button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  background-color: var(--white);
  box-shadow: var(--shadow);
  z-index: 101;
}

.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.header__logo {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary);
}

.nav {
  display: flex;
  gap: 40px;
  list-style: none;
}

.nav__link {
  text-decoration: none;
  color: var(--gray);
  font-weight: 600;
  position: relative;
  padding: 5px 0;
  transition: color 0.3s ease;
}

.nav__link:hover {
  color: var(--primary);
}

.nav__link--active {
  color: var(--primary);
}

.nav__link--active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
  transition: 0.3s ease all;
  animation: underline 0.3s ease;
}

@keyframes underline {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>