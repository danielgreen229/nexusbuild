<template>
  <header class="app-header">
    <div class="container app-header__container">
      <!-- Верхняя часть с логотипом и основной навигацией -->
      <div class="app-header__top">
        <NuxtLink to="/" class="app-header__logo">
          <span class="app-header__logo-text">SITE.BY</span>
          <span class="app-header__logo-badge">PRO</span>
        </NuxtLink>

        <nav class="app-nav app-nav--primary">
          <ul class="app-nav__list">
            <li v-for="page in primaryPages" :key="page.path" class="app-nav__item">
              <NuxtLink :to="page.path" class="app-nav__link" exact-active-class="app-nav__link--active">
                {{ page.title }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="app-header__actions">
          <a
            href="https://t.me/dozer_stoun"
            class="button button--outline app-header__telegram"
            target="_blank"
          >
            <span class="app-header__telegram-icon">
              <IconClick class="app-header__telegram-img" />
            </span>
            <span class="app-header__telegram-text">Купить в клик</span>
          </a>

          <!-- Если пользователь авторизован и есть имя - показываем профиль -->
          <div v-if="userToken && userData && userData.name" class="app-header__profile">
            <button class="app-header__profile-toggle" @click="isUserMenuOpen = !isUserMenuOpen">
              <div class="app-header__avatar">👤</div>
              <span class="app-header__user-name">{{ userData.name }}</span>
            </button>

            <div class="user-menu" v-if="isUserMenuOpen">
              <div class="user-menu__header">
                <div class="user-menu__avatar">👤</div>
                <div class="user-menu__info">
                  <div class="user-menu__name">{{ userData.name }}</div>
                  <div class="user-menu__email">{{ userData.email }}</div>
                </div>
              </div>

              <ul class="user-menu__list">
                <li class="user-menu__item">
                  <NuxtLink to="/profile" class="user-menu__link" @click="closeUserMenu">Мой профиль</NuxtLink>
                </li>
                <li class="user-menu__item">
                  <NuxtLink to="/profile?tab=orders" class="user-menu__link" @click="closeUserMenu">Мои заказы</NuxtLink>
                </li>
                <li class="user-menu__item">
                  <NuxtLink to="/profile?tab=balance" class="user-menu__link" @click="closeUserMenu">Баланс</NuxtLink>
                </li>
              </ul>

              <div class="user-menu__footer">
                <button class="user-menu__logout" @click="logout">Выйти из аккаунта</button>
              </div>
            </div>
          </div>

          <!-- Если данных пользователя нет - показываем кнопку входа -->
          <div v-else>
            <button class="button button--primary" @click="openLogin">Войти</button>
          </div>

          <button class="app-header__menu-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <span class="app-header__menu-icon" :class="{ 'app-header__menu-icon--active': isMobileMenuOpen }"></span>
          </button>
        </div>
      </div>

      <!-- Нижняя часть с дополнительной навигацией -->
      <div class="app-header__bottom">
        <nav class="app-nav app-nav--secondary">
          <ul class="app-nav__list">
            <li v-for="page in secondaryPages" :key="page.path" class="app-nav__item">
              <NuxtLink :to="page.path" class="app-nav__link" active-class="app-nav__link--active">
                {{ page.title }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Мобильное меню (объединяет обе навигации) -->
    <div class="app-mobile-menu" :class="{ 'app-mobile-menu--active': isMobileMenuOpen }">
      <div class="app-mobile-menu__content">
        <nav class="app-mobile-nav">
          <div class="app-mobile-nav__section">
            <h3 class="app-mobile-nav__title">Основные</h3>
            <ul class="app-mobile-nav__list">
              <li v-for="page in primaryPages" :key="page.path" class="app-mobile-nav__item">
                <NuxtLink :to="page.path" class="app-mobile-nav__link" @click="closeMobileMenu" exact-active-class="app-mobile-nav__link--active">
                  {{ page.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="app-mobile-nav__section">
            <h3 class="app-mobile-nav__title">Дополнительные</h3>
            <ul class="app-mobile-nav__list">
              <li v-for="page in secondaryPages" :key="page.path" class="app-mobile-nav__item">
                <NuxtLink :to="page.path" class="app-mobile-nav__link" @click="closeMobileMenu" active-class="app-mobile-nav__link--active">
                  {{ page.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="app-mobile-nav__section">
            <ul class="app-mobile-nav__list">
              <li class="app-mobile-nav__item">
                <button class="app-mobile-nav__link" @click="openLogin; closeMobileMenu()">Войти</button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>

    <!-- Модальное окно входа -->
    <LoginModal v-model:visible="isLoginModalOpen" @login="handleLogin" />
  </header>
</template>

<script setup>
import IconClick from '~/assets/icons/icon-click.svg'
import { ref } from 'vue'
import LoginModal from '~/components/profile/Modals/LoginModal.vue'

const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isLoginModalOpen = ref(false)

const userToken = ref(true)
const userData = ref({
  name: 'Иван Иванов',
  email: 'ivan@example.com'
})

function openLogin() { isLoginModalOpen.value = true }
function handleLogin(user) {
  userData.value = user
  userToken.value = true
}
function logout() {
  userData.value = {}
  userToken.value = false
  isUserMenuOpen.value = false
}
function closeUserMenu() { isUserMenuOpen.value = false }
function closeMobileMenu() { isMobileMenuOpen.value = false }

// Основные страницы
const primaryPages = [
  { path: '/', title: 'Главная' },
  { path: '/portfolio', title: 'Шаблоны' },
  { path: '/pricing', title: 'Цены' },
  { path: '/services', title: 'Услуги' },
]

// Дополнительные страницы
const secondaryPages = [
  { path: '/contacts', title: 'Контакты' },
  { path: '/blog', title: 'Блог' },
  { path: '/about', title: 'О нас' },
  { path: '/faq', title: 'FAQ' },
]
</script>
<style scoped>
.app-header {
  position: sticky;
  top: 0;
  background-color: var(--white);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.app-header__container {
  display: flex;
  flex-direction: column;
}

.app-header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.app-header__bottom {
  border-top: 1px solid #e2e8f0;
  padding: 10px 0;
  background: #ffffff;
  display: flex;
}

.app-header__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 800;
  font-size: 1.8rem;
  color: var(--primary);
  position: relative;
}

.app-header__logo-text {

}

.app-header__logo-badge {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  position: relative;
  top: -5px;
  left: 5px;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.app-header__telegram {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 15px;
  text-decoration: none
}

.app-header__telegram-icon {
  height: 26px;
}
.app-header__telegram-img {
  height: 26px;
  width: 28px;
}

.app-header__telegram-text {
  @media (max-width: 480px) {
    display: none;
  }
}

.app-header__profile {
  position: relative;
}

.app-header__profile-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.app-header__profile-toggle:hover {
  background: #f1f5f9;
}

.app-header__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.app-header__user-name {
  font-weight: 600;
  color: var(--dark);
  
  @media (max-width: 768px) {
    display: none;
  }
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  overflow: hidden;
  z-index: 100;
}

.user-menu__header {
  padding: 20px;
  background: #f8fafc;
  display: flex;
  gap: 15px;
  align-items: center;
}

.user-menu__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.5rem;
}

.user-menu__info {
  overflow: hidden;
}

.user-menu__name {
  font-weight: 700;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu__email {
  font-size: 0.9rem;
  color: var(--gray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu__list {
  padding: 10px 0;
  list-style: none;
}

.user-menu__item {
  border-bottom: 1px solid #f1f5f9;
}

.user-menu__link {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: var(--dark);
  transition: background 0.2s ease;
  font-weight: 500;
}

.user-menu__link:hover {
  background: #f8fafc;
  color: var(--primary);
}

.user-menu__footer {
  padding: 15px 20px;
  border-top: 1px solid #f1f5f9;
}

.user-menu__logout {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  text-align: left;
  padding: 0;
}

.user-menu__logout:hover {
  color: #dc2626;
}

.app-header__menu-toggle {
  display: none;
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  position: relative;
  cursor: pointer;
}

.app-header__menu-icon {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform: translateY(-50%);
}

.app-header__menu-icon::before,
.app-header__menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.app-header__menu-icon::before {
  top: -8px;
}

.app-header__menu-icon::after {
  top: 8px;
}

.app-header__menu-icon--active {
  background: transparent;
}

.app-header__menu-icon--active::before {
  top: 0;
  transform: rotate(45deg);
}

.app-header__menu-icon--active::after {
  top: 0;
  transform: rotate(-45deg);
}

/* Навигация - общие стили */
.app-nav__list {
  display: flex;
  gap: 25px;
  list-style: none;
}

.app-nav__link {
  text-decoration: none;
  color: var(--dark);
  font-weight: 600;
  position: relative;
  padding: 8px 0;
  transition: color 0.2s ease;
  font-size: 1rem;
}

.app-nav__link:hover,
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
  border-radius: 2px;
}

/* Основная навигация */
.app-nav--primary {
  flex: 1;
  margin: 0 30px;
}

/* Дополнительная навигация */
.app-nav--secondary .app-nav__list {
  justify-content: center;
}

.app-nav--secondary .app-nav__link {
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--gray);
}

.app-nav--secondary .app-nav__link:hover,
.app-nav--secondary .app-nav__link--active {
  color: var(--primary);
}

/* Мобильное меню */
.app-mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.app-mobile-menu--active {
  opacity: 1;
  visibility: visible;
}

.app-mobile-menu__content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background: white;
  padding: 20px;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.app-mobile-menu--active .app-mobile-menu__content {
  transform: translateX(0);
}

.app-mobile-nav__section {
  margin-bottom: 25px;
}

.app-mobile-nav__title {
  font-size: 1.1rem;
  color: var(--gray);
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.app-mobile-nav__list {
  list-style: none;
}

.app-mobile-nav__item {
  margin-bottom: 5px;
}

.app-mobile-nav__link {
  display: block;
  padding: 12px 15px;
  text-decoration: none;
  color: var(--dark);
  border-radius: 8px;
  transition: background 0.2s ease;
}

.app-mobile-nav__link:hover,
.app-mobile-nav__link--active {
  background: #f1f5f9;
  color: var(--primary);
}

/* Адаптив */
@media (max-width: 1024px) {
  .app-nav__list {
    gap: 15px;
  }
  
  .app-nav--primary {
    margin: 0 15px;
  }
}

@media (max-width: 900px) {
  .app-nav--primary,
  .app-nav--secondary {
    display: none;
  }
  
  .app-header__menu-toggle {
    display: block;
  }
  
  .app-header__top {
    padding: 15px 0;
  }
}

@media (max-width: 480px) {
  .app-header__telegram-text {
    display: none;
  }
  
  .app-header__telegram-icon {
    margin-right: 0;
  }
  
  .app-header__logo {
    font-size: 1.6rem;
  }
  
  .app-header__logo-badge {
    font-size: 0.7rem;
    padding: 1px 6px;
  }
}
</style>