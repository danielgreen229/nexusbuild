<template>
  <header ref="headerRef" class="app-header">
    <div class="container app-header__container">
      <!-- Верхняя часть с логотипом и основной навигацией -->
      <div class="app-header__top">
      	<corner class="mobile__corner" :top="null" :left="null" :rotation="'0'" :mobileLeft="'12'" :mobileTop="'0.75'"/>
        <NuxtLink to="/" class="app-header__logo">
          <logo class="app-header__logo-svg" filled/>
        </NuxtLink>
        <corner :rotation="'0'" :left="'0.75'" :top="'100%'"/>

        <nav class="app-nav app-nav--primary">
        	<corner :rotation="'0'" :left="'100%'" :top="'0.74'"/>
          <ul class="app-nav__list">
            <li v-for="page in primaryPages" :key="page.path" class="app-nav__item">
              <NuxtLink
                :to="page.path"
                class="app-nav__link"
                exact-active-class="app-nav__link--active"
              >
                {{ page.title }}
              </NuxtLink>
            </li>
          </ul>

        </nav>
        <div class="app-header__actions">
        	<corner :rotation="'90'" :left="'-2'" :top="'0.74'"/>
        	<NuxtLink :to="'/templates'" class="nuxt-link__a">
        		<div class="goto__template">заказать</div>
        	</NuxtLink>
        	<div class="burger-mobile__container" @click="toggleMobileMenu">
        		<div class="burger-stick"/>
        		<div class="burger-stick"/>
        		<div class="burger-stick"/>
        	</div>
        	<corner :rotation="'90'" :left="'11.8'" :top="'100%'" :mobileLeft="'11.8'"/>
        </div>
      </div>
    </div>

    <div class="app-mobile-menu" :class="{ 'app-mobile-menu--active': isMobileMenuOpen }">
      <div class="app-mobile-menu__content">
        <nav class="app-mobile-nav">
          <div class="app-mobile-nav__section">
            <h3 class="app-mobile-nav__title">Основные</h3>
            <ul class="app-mobile-nav__list">
              <li v-for="page in primaryPages" :key="page.path" class="app-mobile-nav__item">
                <NuxtLink
                  :to="page.path"
                  class="app-mobile-nav__link"
                  @click="closeMobileMenu"
                  exact-active-class="app-mobile-nav__link--active"
                >
                  {{ page.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="app-mobile-nav__section">
            <h3 class="app-mobile-nav__title">Дополнительные</h3>
            <ul class="app-mobile-nav__list">
              <li v-for="page in secondaryPages" :key="page.path" class="app-mobile-nav__item">
                <NuxtLink
                  :to="page.path"
                  class="app-mobile-nav__link"
                  @click="closeMobileMenu"
                  active-class="app-mobile-nav__link--active"
                >
                  {{ page.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!--<div class="app-mobile-nav__section">
            <ul class="app-mobile-nav__list">
              <li class="app-mobile-nav__item">
                <button class="app-mobile-nav__link" @click="onMobileLogin">Войти</button>
              </li>
            </ul>
          </div>-->
        </nav>
      </div>
    </div>

    <LoginModal v-model:visible="isLoginModalOpen" @login="onLoginEvent" />
  </header>
</template>

<script setup>
import IconClick from '~/assets/icons/icon-click.svg'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '~/stores/user'
import LoginModal from '~/components/profile/Modals/LoginModal.vue'
import corner from '~/components/ui/blocks/corner.vue'
import { useRouter } from 'vue-router'
import logo from '~/assets/icons/logo.svg'

const userStore = useUserStore()
const router = useRouter()

// refs / state
const headerRef = ref(null)
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isLoginModalOpen = ref(false)

const isAuthenticated = computed(() => !!userStore.isAuthenticated)
const user = computed(() => userStore.user || null)

const displayName = computed(() => {
  if (!user.value) return ''
  return user.value.fullname || user.value.username || (user.value.email ? user.value.email.split('@')[0] : '')
})

const initials = computed(() => {
  const name = displayName.value
  if (!name) return '👤'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase()
})

const avatarUrl = computed(() => {
  const av = user.value && user.value.avatar
  if (!av) return null
  if (typeof av === 'string') return av
  return null
})

function openLogin() {
  isLoginModalOpen.value = true
}

function onMobileLogin() {
  isLoginModalOpen.value = true
  closeMobileMenu()
}

function onLoginEvent(userData) {
  isLoginModalOpen.value = false
  isUserMenuOpen.value = false
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

function closeUserMenu() {
  isUserMenuOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function logout() {
  userStore.logout()
  isUserMenuOpen.value = false
  //router.push('/')
}

// Навигационные страницы
const primaryPages = [
  { path: '/templates', title: 'шаблоны' },
  { path: '/services', title: 'услуги' },
  { path: '/services', title: '3D-модели' }
]

const secondaryPages = [
  { path: '/contacts', title: 'Контакты' },
  { path: '/blog', title: 'Блог' },
]

/*
  Логика: при клике вне элемента header — закрываем открытые меню.
  Также закрываем по Escape.
  Используем capture (true), чтобы отлавливать клик до внутренних обработчиков (надёжнее).
*/
function onDocumentClick(e) {
  const el = headerRef.value
  if (!el) return
  // если клик снаружи header — закрыть меню(ы)
  if (!el.contains(e.target)) {
    if (isUserMenuOpen.value) isUserMenuOpen.value = false
    if (isMobileMenuOpen.value) isMobileMenuOpen.value = false
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (isUserMenuOpen.value || isMobileMenuOpen.value || isLoginModalOpen.value) {
      isUserMenuOpen.value = false
      isMobileMenuOpen.value = false
      isLoginModalOpen.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick, true)
  document.addEventListener('keydown', onKeyDown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick, true)
  document.removeEventListener('keydown', onKeyDown, true)
})
</script>
<style scoped>
.app-header {
  position: relative;
  top: 0;
  z-index: 1000;
  padding: 20px 20px 0 20px;
}

.app-header__container {
  display: flex;
  flex-direction: column;
  border-radius: 26px;
  padding: 0;
}

.app-header__top {
	display: flex;
	justify-content: flex-start;
	align-items: stretch;
	border-radius: 26px 26px 0px 0px;
	position: relative;
}

.app-header__bottom {
  border-top: 0.0625rem solid #e2e8f0;
  padding: 0.625rem 0;
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
  padding: 0.75rem 0.75rem;
  margin-left: 12px;
	background-color: white;
}

.app-header__logo-badge {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 1.25rem;
  position: relative;
  top: -0.3125rem;
  left: 0.3125rem;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 0.9375rem;
  padding: 0.75rem 0.75rem;
  background-color: white;
  margin-left: auto;
  border-radius: 0px 26px 0px 26px;
  position: relative;
}

.app-header__telegram {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.9375rem;
  text-decoration: none;
}

.app-header__telegram-icon {
  height: 1.625rem;
}

.app-header__telegram-img {
  height: 1.625rem;
  width: 1.75rem;
}

.app-header__profile {
  position: relative;
}

.app-header__profile-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3125rem 0.625rem;
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.app-header__profile-toggle:hover {
  background: #f1f5f9;
}

.app-header__avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  overflow: hidden;
}

.app-header__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-header__user-name {
  font-weight: 600;
  color: var(--dark);
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 17.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.625rem 1.5625rem rgba(0, 0, 0, 0.1);
  margin-top: 0.625rem;
  overflow: hidden;
  z-index: 100;
}

.user-menu__header {
  padding: 1.25rem;
  background: #f8fafc;
  display: flex;
  gap: 0.9375rem;
  align-items: center;
}

.user-menu__avatar {
  width: 3.125rem;
  height: 3.125rem;
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
  padding: 0.625rem 0;
  list-style: none;
}

.user-menu__item {
  border-bottom: 0.0625rem solid #f1f5f9;
}

.user-menu__link {
  display: block;
  padding: 0.75rem 1.25rem;
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
  padding: 0.9375rem 1.25rem;
  border-top: 0.0625rem solid #f1f5f9;
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
  width: 2rem;
  height: 2rem;
  position: relative;
  cursor: pointer;
}

.app-header__menu-icon {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 0.1875rem;
  background: var(--primary);
  border-radius: 0.125rem;
  transition: all 0.3s ease;
  transform: translateY(-50%);
}

.app-header__menu-icon::before,
.app-header__menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 0.1875rem;
  background: var(--primary);
  border-radius: 0.125rem;
  transition: all 0.3s ease;
}

.app-header__menu-icon::before {
  top: -0.5rem;
}

.app-header__menu-icon::after {
  top: 0.5rem;
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

.app-nav__list {
  display: flex;
  list-style: none;
  padding: 13px 32px;
  width: fit-content;
	align-items: flex-start;
	gap: 32px;
	border-radius: 26px;
	border: 1px solid #E2EEFA;
	background: #EFF4FF;
}

.app-nav__link {
  text-decoration: none;
  color: var(--dark);
  font-weight: 600;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  font-size: 1rem;
  color: #0040C1;
	text-align: center;
	font-family: Inter;
	font-size: 18px;
	font-style: normal;
	font-weight: 500;
	line-height: 18.2px;
	letter-spacing: -0.56px;
	text-transform: lowercase;
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
  height: 0.1875rem;
  background: var(--primary);
  border-radius: 0.125rem;
}

.app-nav--primary {
	width: fit-content;
  padding: 0.75rem 0.75rem;
  position: relative;
	background-color: white;
	border-radius: 0 0 26px 0;
}

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
  width: 20rem;
  background: white;
  padding: 1.25rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.app-mobile-menu--active .app-mobile-menu__content {
  transform: translateX(0);
}

.app-mobile-nav__section {
  margin-bottom: 1.5625rem;
}

.app-mobile-nav__title {
  font-size: 1.1rem;
  color: var(--gray);
  padding: 0.625rem 0;
  margin-bottom: 0.625rem;
  border-bottom: 0.0625rem solid #e2e8f0;
}

.app-mobile-nav__list {
  list-style: none;
}

.app-mobile-nav__item {
  margin-bottom: 0.3125rem;
}

.app-mobile-nav__link {
  display: block;
  padding: 0.75rem 0.9375rem;
  text-decoration: none;
  color: var(--dark);
  border-radius: 0.5rem;
  transition: background 0.2s ease;
}

.app-mobile-nav__link:hover,
.app-mobile-nav__link--active {
  background: #f1f5f9;
  color: var(--primary);
}


.app-header__logo-svg {
  width: 9.75rem;
  height: 2.125rem;
}
.goto__template {
	padding: 12px 41px;
	justify-content: center;
	color: #FFF;
	text-align: center;
	font-family: Inter;
	font-size: 18px;
	font-style: normal;
	height: 100%;
	font-weight: 600;
	line-height: normal;
	letter-spacing: -0.56px;
	cursor: pointer;
	align-items: center;
	gap: 10px;
	flex-shrink: 0;
	border-radius: 25px;
	background: var(--master, linear-gradient(133deg, #1C4EFF 15.35%, #BFA1FF 87.95%));
	display: flex;
}
.nuxt-link__a {
	text-decoration: none;
	height: 100%;
}

.mobile__corner {
	display: none;
}

@media (max-width: 1248px) { 
	.app-nav--primary, .app-nav--secondary, .b0__block-inside { 
		display: none; 
	} 

	.app-header__logo {
		border-radius: 26px 0 26px 0;
	}

	.mobile__corner {
		display: block;
	}
}

.burger-mobile__container {
	width: 32px;
	height: 20px;
	margin-right: 6px;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: space-between;
	cursor: pointer;
}
.burger-stick {
	width: 100%;
	height: 2px;
	border-radius: 31px;
	background: #4841E2;
}





</style>








