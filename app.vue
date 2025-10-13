<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { useUserStore } from '~/stores/user' // оставил твой alias - подгони, если нужно

const userStore = useUserStore()

// Если нужно где-то локально использовать данные пользователя:
const isAuthenticated = computed(() => !!userStore.isAuthenticated)
const currentUser = computed(() => userStore.user || null)

onMounted(async () => {
  // viewport / zoom
  /*document.querySelector('meta[name="viewport"]')?.setAttribute(
    'content',
    'width=device-width, initial-scale=0.8'
  )
  document.body.style.zoom = '80%'
  */

  try {
    // Инициализация: прочитать токен/uid из localStorage в стор
    userStore.initFromStorage()

    // Если токен/uid есть — подгружаем данные пользователя с сервера
    if (userStore.token && userStore.uid) {
      await userStore.fetchCurrentUser()
      console.log('User initialized from token:', userStore.user)
    } else {
      console.log('No token/uid in storage — user not authenticated')
    }
  } catch (err) {
    // Логируем ошибку. Стор сам выставит userStore.error
    console.error('Error initializing user:', err)
  }
})
</script>

<template>
  <div class="main__container">
    <Header />
    <NuxtPage class="main__body"/>
    <Footer />
  </div>
</template>

<style>
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --dark: #1e293b;
  --gray: #64748b;
  --light-gray: #f1f5f9;
  --white: #ffffff;
  --danger: #ef4444;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --border: 1px solid #e2e8f0;
  --radius: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--dark);
  line-height: 1.5;
  background-color: var(--white);
}

.container {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
}

.button {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.button--primary {
  background-color: var(--primary);
  color: var(--white);
}

.button--primary:hover {
  background-color: var(--primary-dark);
}

.button--outline {
  background-color: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.button--outline:hover {
  background-color: var(--primary);
  color: var(--white);
}

.section {
  padding: 80px 0;
}

.section--gray {
  background-color: var(--light-gray);
}

.section__title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 60px;
  position: relative;
}

.section__title::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--primary);
  border-radius: 2px;
}
.main__container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
}
.main__body {
  width: 100%;
}
html, body, #__nuxt {
  height: 100%;
}
</style>
