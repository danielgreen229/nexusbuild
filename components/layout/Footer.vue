<template>
  <footer class="footer">
    <!-- Показываем CTA только если showCTA = true -->
    <PortfolioCTA v-if="showCTA" />

    <div class="footer__container container">
      <!-- Левый блок - Лого и описание -->
      <div class="footer__brand">
        <div class="footer__logo">SiteByPro</div>
        <p class="footer__tagline">Быстрые сайты для быстрых денег</p>
        
        <!-- Telegram кнопка -->
        <a 
          :href="telegramLink" 
          class="footer__telegram"
          target="_blank"
          rel="noopener"
          aria-label="Наш Telegram"
        >
          <span class="footer__telegram-icon">✈️</span>
          <span class="footer__telegram-text">Пишите в Telegram</span>
        </a>
      </div>
      
      <!-- Центральный блок - Навигация -->
      <div class="footer__nav">
        <h4 class="footer__title">Навигация</h4>
        <ul class="footer__list">
          <li><a href="#" class="footer__link">Главная</a></li>
          <li><a href="#" class="footer__link">Портфолио</a></li>
          <li><a href="#" class="footer__link">Тарифы</a></li>
          <li><a href="#" class="footer__link">Блог</a></li>
        </ul>
      </div>
      
      <!-- Правый блок - Услуги -->
      <div class="footer__services">
        <h4 class="footer__title">Услуги</h4>
        <ul class="footer__list">
          <li><a href="#" class="footer__link">Лендинги</a></li>
          <li><a href="#" class="footer__link">Корпоративные сайты</a></li>
          <li><a href="#" class="footer__link">Интернет-магазины</a></li>
          <li><a href="#" class="footer__link">SEO-оптимизация</a></li>
        </ul>
      </div>
    </div>
    
    <!-- Нижний блок - Копирайт -->
    <div class="footer__bottom">
      <div class="container">
        <div class="footer__copyright">
          &copy; {{ currentYear }} sitebypro. Продажа сайтов. 
          <span class="footer__highlight">Быстрые сайты.</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import PortfolioCTA from '@/components/portfolio/PortfolioCTA.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ------------------------------------------------------------------
// Настройка: перечисли страницы, на которых НЕ должно быть PortfolioCTA
// Поддерживаемые форматы:
//   - Точный путь:           '/login'
//   - Префикс (startsWith):  '/portfolio/*'   (звёздочка в конце)
//   - По имени маршрута:     'name:Home'       (сравнивается с route.name)
// Примеры ниже — изменяй как нужно.
// ------------------------------------------------------------------
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
  margin-bottom: 25px;
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
  color: var(--gray);
}

.footer__highlight {
  color: var(--secondary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .footer__container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer__telegram {
    max-width: 100%;
  }
}
</style>
