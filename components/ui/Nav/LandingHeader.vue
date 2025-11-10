<template>
  <header ref="headerRef" class="app-header" :class="{'main-header': !isHome}">
    <div class="app-header__container" :class="{'main-header__container': !isHome}">
      <div class="app-header__top">
        <NuxtLink to="/" class="app-header__logo" :class="{'main-header__logo': !isHome}" aria-label="Перейти на Главную страницу">
          <Logo class="app-header__logo-svg" filled :class="{'main-header__logo-svg': !isHome}"/>
        </NuxtLink>

        <nav class="app-nav app-nav--primary" aria-label="Главное меню" :class="{'main-nav--primary': !isHome}">
          <ul class="app-nav__list" :class="{'main-nav__list': !isHome}">
            <li v-for="page in primaryPages" :key="page.path" class="app-nav__item">
              <NuxtLink
                :to="page.path"
                class="app-nav__link"
                exact-active-class="app-nav__link--active"
                :aria-label="`Перейти на страницу ${page.title}`"
                :aria-current="$route.path === page.path ? 'page' : null"

                :class="{'main-nav__link': !isHome}"
              >
                {{ page.title }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="app-header__actions" :class="{'main-header__actions': !isHome}">
          <a
            v-if="isHome"
            href="#"
            class="nuxt-link__a"
            @click.prevent="scrollTo({ offset: 0 })"
            aria-label="Перейти к форме заказа"
          >
            <div class="goto__template">заказать</div>
          </a>

          <ProfileHeader v-if="!isHome" @open-login="openLogin" />

          <div
            class="burger-mobile__container"
            :class="{'main-burger-mobile__container': !isHome}"
            @click="toggleMobileMenu"
            role="button"
            aria-label="Открыть меню"
          >
            <div class="burger-stick"></div>
            <div class="burger-stick"></div>
            <div class="burger-stick"></div>
          </div>

        </div>
      </div>
    </div>

    <!-- Модальное окно входа (открывается при событии из ProfileHeader или других мест) -->
    <teleport to="body">
      <LoginModal v-model:visible="isLoginModalOpen" @login="onLoginEvent" />
    </teleport>
  </header>

  <!-- Сайд-меню (мобильное) -->
  <SideMenu
    v-model:visible="isMobileMenuOpen"
    :primary-pages="primaryPages"
    :secondary-pages="secondaryPages"
    @login="onMobileLogin"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

import SideMenu from '~/components/ui/Modal/SideMenu.vue'
import LoginModal from '~/components/profile/Modals/LoginModal.vue'
import ProfileHeader from '~/components/profile/ProfileHeader.vue'
import Logo from '~/assets/icons/logo.svg' 

const router = useRouter()
const route = useRoute()

const isHome = computed(() => route.path === '/')



// refs / state (шапка)
const headerRef = ref(null)
const isMobileMenuOpen = ref(false)
const isLoginModalOpen = ref(false)

// открывает модалку входа (слушается <ProfileHeader @open-login>)
function openLogin() {
  isLoginModalOpen.value = true
}

// вызывается из SideMenu (мобильное)
function onMobileLogin() {
  isLoginModalOpen.value = true
  closeMobileMenu()
}

function onLoginEvent(userData) {
  isLoginModalOpen.value = false
  // ничего не делаем с меню профиля — ProfileHeader управляет своим состоянием
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

// Навигационные страницы — поправил дублирование путей
const primaryPages = [
  { path: '/templates', title: 'шаблоны' },
  { path: '/services', title: 'услуги' },
  { path: '/services', title: '3D-модели' } // исправленный путь
]

const secondaryPages = [
  { path: '/contacts', title: 'Контакты' },
  { path: '/blog', title: 'Блог' }
]


function scrollTo({ offset = 0, behavior = 'smooth' } = {}) {
  if (typeof window === 'undefined') return false;
  const el = document.querySelector('.b3__form');
  if (!el) return false;

  try {
    el.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });

    if (offset) {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const elCenterY = rect.top + rect.height / 2 + window.scrollY;
        const target = elCenterY - window.innerHeight / 2 - offset;
        window.scrollTo({ top: Math.max(0, Math.round(target)), behavior });
      });
    }
    return true;
  } catch (err) {
    const rect = el.getBoundingClientRect();
    const elCenterY = rect.top + rect.height / 2 + window.scrollY;
    const target = elCenterY - window.innerHeight / 2 - offset;
    window.scrollTo({ top: Math.max(0, Math.round(target)), behavior });
    return true;
  }
}

function onDocumentClick(e) {
  const el = headerRef.value
  if (!el) return
  if (!el.contains(e.target)) {
    if (isMobileMenuOpen.value) isMobileMenuOpen.value = false
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (isMobileMenuOpen.value || isLoginModalOpen.value) {
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

.app-header { position: relative; top: 0; z-index: 1000; padding: 1.4vw 0 0 2.4vw; margin: 0; }
.app-header__container { display: flex; flex-direction: column; border-radius: 1.805556vw; margin: 0; padding: 1vw 1vw 1vw 0; }
.app-header__top { display:flex; justify-content:flex-start; align-items:center; border-radius:1.805556vw 1.805556vw 0 0; position:relative; padding:0; margin:0; }
.app-header__logo { display:flex; align-items:center; text-decoration:none; font-weight:800; font-size:2.000000vw; color:var(--primary); position:relative; margin:0; padding:0; height:fit-content; width:fit-content; margin-top:-1.2vw; }
.app-header__logo-svg { width:14vw; height:auto; }
.app-header__actions { display:flex; align-items:center; gap:1.041667vw; padding:0.833333vw; background:none; margin-left:auto; border-radius:0 1.805556vw 0 1.805556vw; position:relative; margin-top:-1.1vw; }
.burger-mobile__container { width:2.222222vw; height:1.388889vw; margin-right:0.416667vw; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; }
.burger-stick { width:100%; height:0.138889vw; border-radius:2.152778vw; background:#4841E2; }
.nuxt-link__a { text-decoration:none; height:100%; }
.goto__template { padding:1.2vw 2.9vw; justify-content:center; color:#FFF; text-align:center; font-family:Inter; font-size:1.25vw; font-weight:600; border-radius:1.736111vw; background: linear-gradient(133deg,#1C4EFF 15.35%,#BFA1FF 87.95%); display:flex; align-items:center; gap:0.694444vw; }
.app-nav__list { display:flex; list-style:none; padding:1.3vw 3vw; gap:4vw; width:fit-content; align-items:flex-start; border-radius:1.805556vw; border:0.069444vw solid #E2EEFA; background:#EFF4FF; }
.app-nav__link { text-decoration:none; color:#0040C1; font-weight:500; font-size:1.5vw; padding:0; text-align:center; font-family:Inter; }
@media (max-width:768px) { .app-nav--primary { display:none; } .app-header__logo-svg { width:31vw; } .burger-mobile__container { width:8vw; margin-right:1vw; height:5vw; } .goto__template { font-size:3.5vw; padding:2.3vw 7.5vw; border-radius:5vw; } }


.app-header {
  position: relative;
  top: 0;
  z-index: 1000;
  padding: 1.4vw 0vw 0 2.4vw;
  margin: 0;
}
.app-header > * {
  transition: background 0s ease, all 0.3s ease;
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
	align-items: center;
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
  margin-top: -1.2vw;
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
  opacity: 0.8
}

.app-nav__link--active::after {
  /*content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.208333vw; 
  background: var(--primary);
  border-radius: 0.138889vw; 
  */
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
  margin-top: -1vw;
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


.main-header {
  padding: 1rem 2rem;
  padding: 1rem 1rem;
  max-width: 2100px;
  width: 100%;
  margin: 0 auto;
}

.main-header__container {
  background-color: white;
  padding: 1rem 1.5rem;
  height: fit-content;
  border-radius: 2.2rem;
}

.main-nav__link {
  font-size: 1.3rem;
}

.main-nav__list {
  padding: 1rem 2.5rem;
  margin: 0;
  gap: 2rem;
}

.main-header__actions {
  margin: 0;
  margin-left: auto;
  padding: 0rem;
}

.main-nav--primary {
  margin: 0;
  margin-left: 2rem;
}
.main-header__logo {
  margin-top: -0.5rem;
}

.main-header__logo-svg {
  width: 11rem;
  height: auto;
}

.main-burger-mobile__container {
  width: 1.8rem;
  height: 1.3rem;
}

@media (max-width: 1248px) { 
  .app-nav__list {
    padding: 0.6vw 3vw;
  }
}


@media (max-width: 768px) {
  .app-nav--primary {
    display: none;
  }
  .app-header__logo {
    margin-top: -3vw;
  }
  .app-header {
    padding: 3vw 3vw 0 4.5vw;
  }
  .app-header__container {
    padding: 0;
  }
  .app-header__logo-svg {
    width: 31vw;
  }
  .goto__template {
    font-size: 3.5vw;
    padding: 2.3vw 7.5vw;
    border-radius: 5vw;
  }
  .burger-mobile__container {
    width: 8vw;
    margin-right: 1vw;
    height: 5vw;
  }
  .app-header__actions {
    gap: 3vw;
    margin-top: -1vw;
  }
  .burger-stick {
    height: 0.5vw;
    border-radius: 5vw;
  }
  .main-header__container {
    padding: 1.2rem 0.8rem 1rem 1rem;
    border-radius: 1.5rem;
  }
}

</style>








