<template>
  <header ref="headerRef" class="app-header">
    <div class="app-header__container">
      <!-- Верхняя часть с логотипом и основной навигацией -->
      <div class="app-header__top">
        <NuxtLink to="/" class="app-header__logo">
          <logo class="app-header__logo-svg" filled/>
        </NuxtLink>

        <nav class="app-nav app-nav--primary">
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
        	<NuxtLink :to="'/templates'" class="nuxt-link__a">
        		<div class="goto__template">заказать</div>
        	</NuxtLink>
        	<div class="burger-mobile__container" @click="toggleMobileMenu" role="button" aria-label="Открыть меню">
        		<div class="burger-stick"/>
        		<div class="burger-stick"/>
        		<div class="burger-stick"/>
        	</div>

        </div>
      </div>
    </div>

    <!-- Мобильное меню (объединяет обе навигации) -->
    <!-- Модальное окно входа -->
    <LoginModal v-model:visible="isLoginModalOpen" @login="onLoginEvent" />
  </header>

  <SideMenu
      v-model:visible="isMobileMenuOpen"
      :primary-pages="primaryPages"
      :secondary-pages="secondaryPages"
      @login="onMobileLogin"
    />
</template>

<script setup>
import IconClick from '~/assets/icons/icon-click.svg'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '~/stores/user'
import LoginModal from '~/components/profile/Modals/LoginModal.vue'
import SideMenu from '~/components/ui/Modal/SideMenu.vue'
import corner from '~/components/ui/blocks/corner.vue'
import { useRouter } from 'vue-router'
import logo from '~/assets/icons/logo.svg'
import IconTg from '~/assets/icons/tg.svg'

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
  padding: 1.4vw 0vw 0 2.4vw;
    margin: 0;
}

.app-header__container {
  display: flex;
  flex-direction: column;
  border-radius: 1.805556vw; /* 26px */
  margin: 0;
  padding: 1vw 1vw 1vw 0vw;
}

.app-header__top {
	display: flex;
	justify-content: flex-start;
	align-items: stretch;
	border-radius: 1.805556vw 1.805556vw 0 0; /* 26px */
	position: relative;
  padding: 0;
  margin: 0;
}

.app-header__bottom {
  border-top: 0.069444vw solid #e2e8f0; /* 1px */
  padding: 0.694444vw 0; /* 10px */
  background: #ffffff;
  display: flex;
}

.app-header__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 800;
  font-size: 2.000000vw; /* 1.8rem -> 28.8px -> 2vw */
  color: var(--primary);
  position: relative;
  margin: 0;
  padding: 0;
  height: fit-content;
  width: fit-content;
}

.app-header__logo-badge {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  font-size: 0.888889vw; /* 0.8rem -> 12.8px */
  font-weight: 700;
  padding: 0.138889vw 0.555556vw; /* 2px 8px */
  border-radius: 1.388889vw; /* 20px */
  position: relative;
  top: -0.347222vw; /* -5px */
  left: 0.347222vw; /* 5px */
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 1.041667vw; /* 15px */
  padding: 0.833333vw 0.833333vw; /* 12px */
  background-color: white;
  margin-left: auto;
  border-radius: 0 1.805556vw 0 1.805556vw; /* 26px */
  position: relative;
  background: none;
  margin-top: -1.1vw;
}

.app-header__telegram {
  display: flex;
  align-items: center;
  gap: 0.416667vw; /* 6px */
  padding: 0.555556vw 1.041667vw; /* 8px 15px */
  text-decoration: none;
}

.app-header__telegram-icon {
  height: 1.805556vw; /* 1.625rem -> 26px */
}

.app-header__telegram-img {
  height: 1.805556vw; /* 26px */
  width: 1.944444vw; /* 28px */
}

.app-header__profile {
  position: relative;
}

.app-header__profile-toggle {
  display: flex;
  align-items: center;
  gap: 0.555556vw; /* 8px */
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.347222vw 0.694444vw; /* 5px 10px */
  border-radius: 0.555556vw; /* 8px */
  transition: background 0.2s ease;
}

.app-header__profile-toggle:hover {
  background: #f1f5f9;
}

.app-header__avatar {
  width: 2.500000vw; /* 2.25rem -> 36px */
  height: 2.500000vw;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.111111vw; /* 1rem -> 16px */
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
  width: 19.444444vw; /* 17.5rem -> 280px */
  background: white;
  border-radius: 0.833333vw; /* 0.75rem -> 12px */
  box-shadow: 0 0.694444vw 1.736111vw rgba(0, 0, 0, 0.1); /* 0 10px 25px -> vw */
  margin-top: 0.694444vw; /* 10px */
  overflow: hidden;
  z-index: 100;
}

.user-menu__header {
  padding: 1.388889vw; /* 20px */
  background: #f8fafc;
  display: flex;
  gap: 1.041667vw; /* 15px */
  align-items: center;
}

.user-menu__avatar {
  width: 3.472222vw; /* 3.125rem -> 50px */
  height: 3.472222vw;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.666667vw; /* 1.5rem -> 24px */
}

.user-menu__info {
  overflow: hidden;
}

.user-menu__name {
  font-weight: 700;
  font-size: 1.222222vw; /* 1.1rem -> 17.6px */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu__email {
  font-size: 1.000000vw; /* 0.9rem -> 14.4px */
  color: var(--gray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu__list {
  padding: 0.694444vw 0; /* 0.625rem -> 10px */
  list-style: none;
}

.user-menu__item {
  border-bottom: 0.069444vw solid #f1f5f9; /* 1px */
}

.user-menu__link {
  display: block;
  padding: 0.833333vw 1.388889vw; /* 12px 20px */
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
  padding: 1.041667vw 1.388889vw; /* 15px 20px */
  border-top: 0.069444vw solid #f1f5f9; /* 1px */
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
  width: 2.222222vw; /* 2rem -> 32px */
  height: 2.222222vw;
  position: relative;
  cursor: pointer;
}

.app-header__menu-icon {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 0.208333vw; /* 0.1875rem -> 3px */
  background: var(--primary);
  border-radius: 0.138889vw; /* 0.125rem -> 2px */
  transition: all 0.3s ease;
  transform: translateY(-50%);
}

.app-header__menu-icon::before,
.app-header__menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 0.208333vw; /* 3px */
  background: var(--primary);
  border-radius: 0.138889vw; /* 2px */
  transition: all 0.3s ease;
}

.app-header__menu-icon::before {
  top: -0.555556vw; /* -0.5rem -> -8px */
}

.app-header__menu-icon::after {
  top: 0.555556vw; /* 8px */
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
  padding: 0.902778vw 2.222222vw; /* 13px 32px */
  width: fit-content;
	align-items: flex-start;
	border-radius: 1.805556vw; /* 26px */
	border: 0.069444vw solid #E2EEFA; /* 1px */
	background: #EFF4FF;

  padding: 1.3vw 3vw;
  gap: 4vw;
}

.app-nav__link {
  text-decoration: none;
  color: var(--dark);
  font-weight: 600;
  position: relative;
  padding: 0.555556vw 0; /* 0.5rem -> 8px */
  transition: color 0.2s ease;
  color: #0040C1;
	text-align: center;
	font-family: Inter;
	font-style: normal;
	font-weight: 500;
	line-height: 1.263889vw; /* 18.2px */
	letter-spacing: -0.038889vw; /* -0.56px */

  font-size: 1.5vw;
  padding: 0;
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
  height: 0.208333vw; /* 3px */
  background: var(--primary);
  border-radius: 0.138889vw; /* 2px */
}

.app-nav--primary {
	width: fit-content;
  position: relative;
	border-radius: 0 0 1.805556vw 0; /* 26px */


  border-radius: 0;
  margin: 0;
  height: fit-content;
  padding: 0;
  margin-left: 2.7vw;
  margin-top: -0.5vw;
}

.app-nav--secondary .app-nav__list {
  justify-content: center;
}

.app-nav--secondary .app-nav__link {
  font-weight: 500;
  font-size: 0.868056vw; /* 0.95rem -> ~15.2px */
  color: var(--gray);
}

.app-nav--secondary .app-nav__link:hover,
.app-nav--secondary .app-nav__link--active {
  color: var(--primary);
}

/* ========== мобильное меню — overlay + content ========== */
.app-mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(133deg, rgba(28, 78, 255, 0.30) 15.35%, rgba(191, 161, 255, 0.30) 87.95%);
    backdrop-filter: blur(2.5px);
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
  width: 22.222222vw; /* 20rem -> 320px */
  background: white;
  padding: 1.388889vw; /* 20px */
  transform: translateX(100%);
  background: #E7F0FF;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.app-mobile-menu--active .app-mobile-menu__content {
  transform: translateX(0);
}

.app-mobile-nav__section {
  margin-bottom: 1.736111vw; /* 1.5625rem -> 25px */
}

.app-mobile-nav__title {
  font-size: 1.222222vw; /* 1.1rem -> 17.6px */
  color: var(--gray);
  padding: 0.694444vw 0; /* 10px */
  margin-bottom: 0.694444vw; /* 10px */
  border-bottom: 0.069444vw solid #e2e8f0; /* 1px */
}

.app-mobile-nav__list {
  list-style: none;
}

.app-mobile-nav__item {
  margin-bottom: 0.347222vw; /* 5px */
}

.app-mobile-nav__link {
  display: block;
  padding: 0.833333vw 1.041667vw; /* 12px 15px */
  text-decoration: none;
  color: var(--dark);
  border-radius: 0.555556vw; /* 8px */
  transition: background 0.2s ease;
  color: #0040C1;
	text-align: left;
	font-family: Inter;
	font-size: 1.388889vw; /* 20px */
	font-style: normal;
	font-weight: 500;
	line-height: 1.263889vw; /* 18.2px */
	letter-spacing: -0.038889vw; /* -0.56px */
	text-transform: lowercase;

}

.app-mobile-nav__link:hover,
.app-mobile-nav__link--active {
  background: #f1f5f9;
  color: var(--primary);
}


.app-header__logo-svg {
  width: 14vw;
  height: unset;
  margin: 0;
  padding: 0;
}
.goto__template {
	padding: 1.2vw 2.9vw;
	justify-content: center;
	color: #FFF;
	text-align: center;
	font-family: Inter;
	font-size: 1.250000vw; /* 18px */
	font-style: normal;
	height: 100%;
	font-weight: 600;
	line-height: normal;
	letter-spacing: -0.038889vw; /* -0.56px */
	cursor: pointer;
	align-items: center;
	gap: 0.694444vw; /* 10px */
	flex-shrink: 0;
	border-radius: 1.736111vw; /* 25px */
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

/* ===== добавленные стили для мобильного хедера и футера панели ===== */
.app-mobile-menu__mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.833333vw; /* 12px */
  border-bottom: 0.069444vw solid #eef2f7; /* 1px */
  margin-bottom: 0.833333vw; /* 12px */
}
.app-mobile-menu__logo { display: flex; align-items: center; }
.app-mobile-menu__logo-svg { width: 8.333333vw; height: auto; display:block; } /* 7.5rem -> 120px */
.app-mobile-menu__close {
  background: none;
  border: none;
  font-size: 1.388889vw; /* 1.25rem -> 20px */
  cursor: pointer;
  padding: 0.416667vw; /* 6px */
  line-height: 1;
}

/* Футер */
.app-mobile-menu__footer {
  padding-top: 0.833333vw; /* 12px */
  border-top: 0.069444vw solid #eef2f7; /* 1px */
  display: flex;
  gap: 0.694444vw; /* 10px */
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
	flex-direction: column;
  width: 100%;
}
.app-mobile-menu__btn-order {
  flex: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.694444vw 0.833333vw; /* 10px 12px */
  border-radius: 3.611111vw; /* 52px */
  font-weight: 700;
  text-decoration: none;
  background: linear-gradient(133deg, #1C4EFF 15%, #BFA1FF 88%);
  color: #fff;
  width: 100%;
}
.app-mobile-menu__btn-tg {
  flex: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.694444vw 0.833333vw; /* 10px 12px */
  border-radius: 3.611111vw; /* 52px */
  font-weight: 700;
  text-decoration: none;
  border: 0.069444vw solid #e6e9ee; /* 1px */
  color: #4A63C4;
  background: rgba(12, 57, 97, 0.10);
  gap: 0.868056vw; /* 12.5px */
  text-wrap: nowrap;
  width: 100%;
}

/* Медиа правила — оставлены как в оригинале */
@media (max-width: 1248px) { 
	.app-nav--primary, .app-nav--secondary, .b0__block-inside { 
		
	} 

	.app-header__logo {
		border-radius: 26px 0 26px 0;
	}

	.mobile__corner {
		display: block;
	}
}

.burger-mobile__container {
	width: 2.222222vw; /* 32px */
	height: 1.388889vw; /* 20px */
	margin-right: 0.416667vw; /* 6px */
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: space-between;
	cursor: pointer;
}
.burger-stick {
	width: 100%;
	height: 0.138889vw; /* 2px */
	border-radius: 2.152778vw; /* 31px */
	background: #4841E2;

}
.tg__icon {
	width: 1.736111vw; /* 25px */
	height: 1.611111vw; /* 23.2px */

}
.app-header,
.app-header * {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

</style>
