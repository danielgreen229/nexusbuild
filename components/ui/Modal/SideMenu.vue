<template>
  <teleport to="body">
    <div
      class="app-mobile-menu"
      :class="{ 'app-mobile-menu--active': visible }"
      @click.self="close"
    >
      <div class="app-mobile-menu__content" @click.stop>
        <!-- Мобильный хедер: логотип + крестик -->
        <div class="app-mobile-menu__mobile-header">
          <NuxtLink to="/" class="app-mobile-menu__logo" @click="close">
            <logo class="app-mobile-menu__logo-svg" filled/>
          </NuxtLink>
          <button class="app-mobile-menu__close" @click="close" aria-label="Закрыть меню">✕</button>
        </div>

        <nav class="app-mobile-nav">
          <div class="app-mobile-nav__section">
            <h3 class="app-mobile-nav__title">Основные</h3>
            <ul class="app-mobile-nav__list">
              <li v-for="page in primaryPages" :key="page.path" class="app-mobile-nav__item">
                <NuxtLink
                  :to="page.path"
                  class="app-mobile-nav__link"
                  @click="onLink"
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
                  @click="onLink"
                  active-class="app-mobile-nav__link--active"
                >
                  {{ page.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Футер -->
        <div class="app-mobile-menu__footer">
          <NuxtLink to="/templates" class="button button--primary app-mobile-menu__btn-order" @click="onOrder">Заказать</NuxtLink>
          <a
            href="https://t.me/dozer_stoun"
            target="_blank"
            rel="noopener noreferrer"
            class="button button--outline app-mobile-menu__btn-tg"
            @click="close"
          >
            <IconTg class="tg__icon"/>
            Написать в тг
          </a>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits, watch, onUnmounted } from 'vue'
import logo from '~/assets/icons/logo.svg'
import IconTg from '~/assets/icons/tg.svg'

const props = defineProps({
  visible: { type: Boolean, default: false },
  primaryPages: { type: Array, default: () => [] },
  secondaryPages: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:visible', 'login'])

function close() {
  emit('update:visible', false)
}

function onLink() {
  close()
}

function onOrder() {
  close()
}

// ====== Блокировка скролла на body ======
watch(
  () => props.visible,
  (val) => {
    if (typeof document === 'undefined') return
    const body = document.body
    if (val) {
      body.style.overflow = 'hidden'
      body.style.touchAction = 'none'
    } else {
      body.style.overflow = ''
      body.style.touchAction = ''
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  // если компонент удаляется, возвращаем scroll
  document.body.style.overflow = ''
  document.body.style.touchAction = ''
})
</script>

<style scoped>
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
  z-index: 1000;
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

/* остальной CSS без изменений */
.app-mobile-nav__section {
  margin-bottom: 1.736111vw;
}
.app-mobile-nav__title {
  font-size: 1.222222vw;
  color: var(--gray);
  padding: 0.694444vw 0;
  margin-bottom: 0.694444vw;
  border-bottom: 0.069444vw solid #e2e8f0;
}
.app-mobile-nav__list { list-style: none; padding: 0; margin: 0; }
.app-mobile-nav__item { margin-bottom: 0.347222vw; }
.app-mobile-nav__link {
  display: block;
  padding: 0.833333vw 1.041667vw;
  text-decoration: none;
  color: #0040C1;
  border-radius: 0.555556vw;
  transition: background 0.2s ease;
  font-family: Inter;
  font-size: 1.388889vw;
  font-weight: 500;
  line-height: 1.263889vw;
  letter-spacing: -0.038889vw;
  text-transform: lowercase;
}
.app-mobile-nav__link:hover,
.app-mobile-nav__link--active {
  background: #f1f5f9;
  color: var(--primary);
}
.app-mobile-menu__mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.833333vw;
  border-bottom: 0.069444vw solid #eef2f7;
  margin-bottom: 0.833333vw;
}
.app-mobile-menu__logo { display: flex; align-items: center; }
.app-mobile-menu__logo-svg { width: 8.333333vw; height: auto; display:block; }
.app-mobile-menu__close {
  background: none;
  border: none;
  font-size: 1.388889vw;
  cursor: pointer;
  padding: 0.416667vw;
  line-height: 1;
}
.app-mobile-menu__footer {
  padding-top: 0.833333vw;
  border-top: 0.069444vw solid #eef2f7;
  display: flex;
  gap: 0.694444vw;
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
  padding: 0.694444vw 0.833333vw;
  border-radius: 3.611111vw;
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
  padding: 0.694444vw 0.833333vw;
  border-radius: 3.611111vw;
  font-weight: 700;
  text-decoration: none;
  border: 0.069444vw solid #e6e9ee;
  color: #4A63C4;
  background: rgba(12, 57, 97, 0.10);
  gap: 0.868056vw;
  text-wrap: nowrap;
  width: 100%;
}
.tg__icon { width: 1.736111vw; height: 1.611111vw; }
</style>
