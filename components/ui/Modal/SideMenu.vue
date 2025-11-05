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

let _scrollY = 0

function close() {
  emit('update:visible', false)
}

function onLink() {
  close()
}

function onOrder() {
  close()
}

/**
 * Надежная блокировка скролла, совместимая с iOS/Safari:
 * - сохраняем scrollY
 * - фиксируем body (position: fixed; top: -scrollY)
 * - при закрытии восстанавливаем позицию
 */
function lockBody() {
  if (typeof document === 'undefined') return
  _scrollY = window.scrollY || document.documentElement.scrollTop || 0
  const body = document.body
  body.style.position = 'fixed'
  body.style.top = `-${_scrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  body.style.overscrollBehavior = 'contain' // помогает избежать "rubber band" в iOS
}

function unlockBody() {
  if (typeof document === 'undefined') return
  const body = document.body
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.width = ''
  body.style.overscrollBehavior = ''
  window.scrollTo(0, _scrollY)
}

watch(
  () => props.visible,
  (val) => {
    if (typeof document === 'undefined') return
    // Для современных браузеров простая overflow:hidden часто достаточна,
    // но на iOS Safari оно не всегда блокирует прокрутку — используем фиксирование.
    if (val) {
      lockBody()
      // небольшая safeguard — если что-то пойдет не так, оставляем запасной overflow:
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      unlockBody()
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  // если компонент удаляется, гарантируем восстановление
  unlockBody()
})
</script>

<style scoped>
/* ========== overlay + content (desktop default uses vw as before) ========== */
.app-mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.28s ease, visibility 0.28s ease;
  /* backdrop + gradient */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%),
              linear-gradient(133deg, rgba(28, 78, 255, 0.30) 15.35%, rgba(191, 161, 255, 0.30) 87.95%);
  -webkit-backdrop-filter: blur(2.5px);
  backdrop-filter: blur(2.5px);
  /* allow smooth touch scrolling on iOS inside the overlay (if needed) */
  -webkit-overflow-scrolling: touch;
}

/* active */
.app-mobile-menu--active {
  opacity: 1;
  visibility: visible;
  z-index: 1000;
}

/* drawer content */
.app-mobile-menu__content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 22.222222vw; /* desktop default (kept) */
  max-width: 480px;
  background: #E7F0FF;
  padding: 1.388889vw;
  transform: translateX(100%);
  transition: transform 0.28s ease;
  display: flex;
  flex-direction: column;
  will-change: transform;
  -webkit-transform: translateZ(0);
  /* protect from being covered by notch on iOS */
  padding-top: calc(1.388889vw + env(safe-area-inset-top));
  padding-bottom: calc(1.388889vw + env(safe-area-inset-bottom));
}

.app-mobile-menu--active .app-mobile-menu__content {
  transform: translateX(0);
}

/* content sections (desktop sizes kept) */
.app-mobile-nav__section { margin-bottom: 1.736111vw; }
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
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
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

/* header */
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

/* footer */
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
  white-space: nowrap;
  width: 100%;
}
.tg__icon { width: 1.736111vw; height: 1.611111vw; }

/* ================== адаптация для экранов < 768px ================== */
@media (max-width: 767.98px) {
  .app-mobile-menu__content {
    /* фиксированная ширина сайдера на мобилке + запас для notch */
    width: min(320px, 86vw);
    padding: 20px;
    padding-top: calc(20px + env(safe-area-inset-top));
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }

  .app-mobile-nav__section { margin-bottom: 16px; }
  .app-mobile-nav__title {
    font-size: 13px;
    padding: 8px 0;
    margin-bottom: 8px;
    border-bottom-width: 1px;
  }

  .app-mobile-nav__link {
    padding: 12px 14px;
    font-size: 16px;
    border-radius: 8px;
    line-height: 20px;
    letter-spacing: 0;
  }

  .app-mobile-menu__mobile-header {
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom-width: 1px;
  }

  .app-mobile-menu__logo-svg {
    width: 105px;
  }

  .app-mobile-menu__close {
    font-size: 20px;
    padding: 6px;
  }

  .app-mobile-menu__footer {
    padding-top: 12px;
    border-top-width: 1px;
    gap: 10px;
    flex-direction: column;
  }

  .app-mobile-menu__btn-order,
  .app-mobile-menu__btn-tg {
    padding: 12px;
    border-radius: 12px;
    font-size: 15px;
  }

  .tg__icon { width: 20px; height: 18px; }

  /* Safari / old WebKit fix: force compositor layer for smooth transform */
  .app-mobile-menu__content {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  /* ensure overlay uses plain rgba on old Safari that doesn't support backdrop-filter */
  .app-mobile-menu {
    background: rgba(0,0,0,0.2);
    -webkit-backdrop-filter: blur(2.5px);
    backdrop-filter: blur(2.5px);
  }
}

/* ================== Accessibility / small fixes ================== */
.app-mobile-menu__close:focus,
.app-mobile-nav__link:focus,
.app-mobile-menu__btn-order:focus,
.app-mobile-menu__btn-tg:focus {
  outline: 3px solid rgba(28,78,255,0.12);
  outline-offset: 2px;
}
</style>
