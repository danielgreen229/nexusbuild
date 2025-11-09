<template>
  <div class="app-header__profile" ref="profileRef">
    <!-- Если пользователь авторизован и есть данные - показываем профиль -->
    <div v-if="isAuthenticated && user">
      <button class="app-header__profile-toggle" @click="toggleUserMenu" :aria-expanded="isUserMenuOpen">
        <div class="app-header__avatar">
          <template v-if="avatarUrl">
            <img :src="avatarUrl" alt="avatar" class="app-header__avatar-img" />
          </template>
          <template v-else>
            {{ initials }}
          </template>
        </div>
        <span class="app-header__user-name">{{ displayName }}</span>
      </button>

      <div class="user-menu" v-if="isUserMenuOpen" role="menu" aria-label="Меню пользователя">
        <div class="user-menu__header">
          <div class="user-menu__avatar">{{ initials }}</div>
          <div class="user-menu__info">
            <div class="user-menu__name">{{ displayName }}</div>
            <div class="user-menu__email">{{ user.email }}</div>
          </div>
        </div>

        <ul class="user-menu__list">
          <li class="user-menu__item">
            <NuxtLink to="/profile?tab=orders" class="user-menu__link" @click="closeUserMenu">Мои заказы</NuxtLink>
          </li>
          <li class="user-menu__item">
            <NuxtLink to="/profile" class="user-menu__link" @click="closeUserMenu">Мой профиль</NuxtLink>
          </li>
          <li class="user-menu__item">
            <NuxtLink to="/profile?tab=settings" class="user-menu__link" @click="closeUserMenu">Настройки</NuxtLink>
          </li>
        </ul>

        <div class="user-menu__footer">
          <button class="user-menu__logout" @click="logout">Выйти из аккаунта</button>
        </div>
      </div>
    </div>

    <!-- Если данных пользователя нет - показываем кнопку входа -->
    <div v-else>
      <button class="button button--primary" @click="onOpenLogin" :class="{'main-button--primary': !isHome}">Войти</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '~/stores/user'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()

const emit = defineEmits(['open-login'])

const isHome = computed(() => route.path === '/')

const profileRef = ref(null)
const isUserMenuOpen = ref(false)
const userStore = useUserStore()
const router = useRouter()

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

function onOpenLogin() {
  emit('open-login')
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

function closeUserMenu() {
  isUserMenuOpen.value = false
}

function logout() {
  userStore.logout()
  isUserMenuOpen.value = false
  // router.push('/')
}

function onDocumentClick(e) {
  const el = profileRef.value
  if (!el) return
  // поддержка composedPath для порталов / shadowDOM
  const path = e.composedPath ? e.composedPath() : (e.path || [])
  const clickedOutside = path.length ? !path.includes(el) : !el.contains(e.target)
  if (clickedOutside && isUserMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (isUserMenuOpen.value) {
      isUserMenuOpen.value = false
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
/* Ваши стили (те же, что были) */
.app-header__profile { position: relative; }
.app-header__profile-toggle { display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; padding: 5px 10px; border-radius: 8px; transition: background 0.2s ease; }
.app-header__profile-toggle:hover { background: #f1f5f9; }
.app-header__avatar { width: 36px; height: 36px; border-radius: 50%; background: #e0f2fe; display: flex; align-items: center; justify-content: center; font-size: 1rem; overflow: hidden; }
.app-header__avatar-img { width: 100%; height: 100%; object-fit: cover; }
.app-header__user-name { font-weight: 600; color: var(--dark); }
.user-menu { position: absolute; top: 100%; right: 0; width: 280px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); margin-top: 10px; overflow: hidden; z-index: 100; }
.user-menu__header { padding: 20px; background: #f8fafc; display: flex; gap: 15px; align-items: center; }
.user-menu__avatar { width: 50px; height: 50px; border-radius: 50%; background: #e0f2fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.5rem; }
.user-menu__info { overflow: hidden; }
.user-menu__name { font-weight: 700; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-menu__email { font-size: 0.9rem; color: var(--gray); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-menu__list { padding: 10px 0; list-style: none; }
.user-menu__item { border-bottom: 1px solid #f1f5f9; }
.user-menu__link { display: block; padding: 12px 20px; text-decoration: none; color: var(--dark); transition: background 0.2s ease; font-weight: 500; }
.user-menu__link:hover { background: #f8fafc; color: var(--primary); }
.user-menu__footer { padding: 15px 20px; border-top: 1px solid #f1f5f9; }
.user-menu__logout { background: none; border: none; color: #ef4444; cursor: pointer; font-weight: 500; width: 100%; text-align: left; padding: 0; }
.user-menu__logout:hover { color: #dc2626; }

.button--primary {
  padding: 14px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  font-weight: 400;
  font-size: 1.5vw;
  letter-spacing: -0.03em;
  text-align: center;
  color: #fff;
  background: linear-gradient(133deg, #1c4eff 0%, #bfa1ff 100%);
  padding: 1vw 3vw;
  border: none;
  outline: none;
  border-radius: 5vw;
  line-height: 1;
  height: -moz-fit-content;
  height: fit-content;
  cursor: pointer;
}

.main-button--primary {
  padding: 1rem 3rem;
  margin: 0;
  font-size: 1.3rem;
  border-radius: 1.5rem;
}

@media (max-width: 768px) {
  .main-button--primary {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.8rem;
  }
}
</style>
