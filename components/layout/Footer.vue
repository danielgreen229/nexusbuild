<template>
  <footer class="footer" role="contentinfo">
    <PortfolioCTA v-if="showCTA" />

    <div class="footer__container container">
      <div class="footer__brand">
        <NuxtLink to="/" class="app-header__logo" aria-label="Перейти на Главную страницу">
          <Logo class="app-header__logo-svg" filled />
        </NuxtLink>
        
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
      
      <!-- Центральный блок - Навигация -->
      <nav class="footer__nav" aria-label="Навигация по сайту в футере">
        <h3 class="footer__title">Навигация</h3>
        <ul class="footer__list">
          <li>
            <NuxtLink to="/" class="footer__link">Главная</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/templates" class="footer__link">Шаблоны</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="footer__link">Контакты</NuxtLink>
          </li>
        </ul>
      </nav>
      
      <!-- Правый блок - Услуги -->
      <section class="footer__services" aria-label="Услуги в футере">
        <h3 class="footer__title">Услуги</h3>
        <ul class="footer__list">
          <li>
            <NuxtLink to="/templates" class="footer__link">Лэндинги</NuxtLink>
          </li>
          <li>
            <NuxtLink @click="showForm = true" class="footer__link">Интернет-магазины</NuxtLink>
          </li>
          <li>
            <NuxtLink @click="showForm = true" class="footer__link">SEO-оптимизация</NuxtLink>
          </li>
        </ul>
      </section>

      <section class="footer__services" aria-label="Услуги в футере">
        <h3 class="footer__title">О нас</h3>
        <ul class="footer__list">
          <li>
            <NuxtLink to="/about" class="footer__link">Контакты</NuxtLink>
          </li>
          <li>
            <a href="https://vk.com/club233841249" 
               class="footer__link" 
               target="_blank" 
               rel="noopener noreferrer">
              группа ВК
            </a>
          </li>
          <li>
            <NuxtLink to="/acception" class="footer__link">Согласие<br>на обработку</NuxtLink>
          </li>
          
        </ul>
      </section>
    </div>
    
    <div class="footer__bottom">
      <div class="container">
        <div class="footer__copyright">
          &copy; 2020 sitebypro. Сайты на заказ.
        </div>
      </div>
    </div>
    <RequestModal v-model="showForm" @open="onOpen" @close="onClose" @opened="onOpened" @closed="onClosed" />
  </footer>
</template>


<script setup>
import PortfolioCTA from '@/components/portfolio/PortfolioCTA.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '~/assets/icons/logo.svg' 
import IconTg from '~/assets/icons/tg.svg'
import RequestModal from '@/components/ui/Modal/Request.vue'
const route = useRoute()

const showForm = ref(false)

function onOpen() {  }
function onClose() { showForm.value = false }   
function onOpened() {  }
function onClosed() {  }

const excludedPages = [
  '/login',
  '/thank-you',
  '/private/*',     // все пути, начинающиеся с /private/
]

// функция проверки, совпадает ли текущий маршрут с исключением
const isExcluded = (r) => {
  const path = r.path || ''
  const name = r.name != null ? String(r.name) : ''

  return excludedPages.some((pattern) => {
    if (!pattern) return false

    // совпадение по имени: 'name:SomeName'
    if (pattern.startsWith('name:')) {
      const expectedName = pattern.slice(5)
      return expectedName === name
    }

    // префикс с wildcard: '/some/path/*'
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1) // убираем последний символ '*'
      return path.startsWith(prefix)
    }

    // точное совпадение пути
    return path === pattern
  })
}

// showCTA = true если текущая страница НЕ в списке исключений
const showCTA = computed(() => !isExcluded(route))

const telegramLink = ref('https://t.me/dozer_stoun')
const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--dark);
  color: var(--light-gray);
  margin-top: auto;
}

.footer__container {
  padding-bottom: 40px;
  display: flex;
  gap: 13rem;
  padding-top: 50px;
  margin: auto;
  width: fit-content;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 1rem;
}

.footer__logo {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 15px;
  letter-spacing: -0.5px;
}

.footer__tagline {
  font-size: 1.1rem;
  margin-bottom: 25px;
  max-width: 300px;
  line-height: 1.6;
}

.footer__telegram {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #2AABEE 0%, #229ED9 100%);
  color: white;
  padding: 14px 25px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  max-width: fit-content;
}

.footer__telegram:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(42, 171, 238, 0.3);
}

.footer__telegram-icon {
  font-size: 1.4rem;
}

.footer__telegram-text {
  font-size: 1.1rem;
}

.footer__title {
  font-size: 1.3rem;
  color: var(--white);
  margin-bottom: 10px;
  position: relative;
  padding-bottom: 10px;
}

.footer__title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: var(--secondary);
  border-radius: 2px;
}

.footer__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer__link {
  color: var(--light-gray);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  font-size: 1.1rem;
  cursor: pointer;
}

.footer__link:hover {
  color: var(--secondary);
  transform: translateX(5px);
}

.footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
}

.footer__copyright {
  text-align: center;
  font-size: 0.95rem;
  color: white;
}

.footer__highlight {
  color: var(--secondary);
  font-weight: 600;
}

.app-header__logo-svg { 
  width:14vw; 
  height:auto; 
  background-color: white;
  border-radius: 9vw;
  padding: 0.7vw 1.5vw 1vw 2vw;
  width: fit-content;
}

.app-mobile-menu__btn-tg {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 1vw 2vw;
  border-radius: 3.611111vw; /* 52px */
  font-weight: 700;
  text-decoration: none;
  border: 0.069444vw solid #e6e9ee; /* 1px */
  color: #4A63C4;
  background: rgb(210 222 240);
  gap: 0.868056vw; /* 12.5px */
  text-wrap: nowrap;
  width: 100%;
}
.tg__icon {
  width: 1.736111vw; /* 25px */
  height: 1.611111vw; /* 23.2px */

}

@media (max-width: 768px) {
  .footer__container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .footer__container {
    flex-direction: column;
    margin: unset;
    width: 100%;
    padding: 12vw 10vw;
  }
  
  .footer__telegram {
    max-width: 100%;
  }
  .tg__icon {
    width: 3vw;
    height: 3vw;
  }
  .footer__brand {
    width: fit-content;
  }
}
</style>
