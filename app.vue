<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <div>
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>


<style scoped>
.app-header {
  position: sticky;
  top: 0;
  background-color: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
  padding: 15px 0;
}

.app-header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header__logo {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary);
}

.app-nav {
  display: flex;
  gap: 30px;
  list-style: none;
}

.app-nav__link {
  text-decoration: none;
  color: var(--gray);
  font-weight: 600;
  position: relative;
  padding: 5px 0;
  transition: color 0.2s ease;
}

.app-nav__link--active {
  color: var(--primary);
}

.app-nav__link--active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary);
}

.app-header__telegram {
  padding: 8px 20px;
}
</style>