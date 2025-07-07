<script setup>
import TemplateCard from '@/components/portfolio/TemplateCard.vue'
import { ref, computed } from 'vue'

const props = defineProps({
  activeFilter: {
    type: String,
    required: true
  }
})

const templates = ref([
  {
    id: 1,
    title: "Стартап Лендинг",
    type: "landing",
    price: 12000,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    description: "Современный лендинг для IT-стартапов и сервисов",
    features: ["Адаптивный", "Форма заявки", "Анимации", "SEO"],
    popular: true
  },
  {
    id: 2,
    title: "Корпоративный сайт",
    type: "corporate",
    price: 25000,
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80",
    description: "Профессиональный сайт для компаний и организаций",
    features: ["5+ страниц", "Блог", "Каталог услуг", "CMS"],
    popular: true
  },
  {
    id: 3,
    title: "Интернет-магазин",
    type: "shop",
    price: 35000,
    image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=800&q=80",
    description: "Полнофункциональный магазин с корзиной и оплатой",
    features: ["Каталог", "Фильтры", "Личный кабинет", "Оплата"],
    popular: false
  },
  {
    id: 4,
    title: "Блог платформа",
    type: "blog",
    price: 18000,
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=800&q=80",
    description: "Элегантный блог для контент-маркетинга",
    features: ["Категории", "Комментарии", "Подписка", "Поиск"],
    popular: true
  },
  {
    id: 5,
    title: "Лендинг услуг",
    type: "landing",
    price: 10000,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    description: "Продающий лендинг для услуг и сервисов",
    features: ["Портфолио", "Отзывы", "Калькулятор", "Тарифы"],
    popular: false
  },
  {
    id: 6,
    title: "Магазин электроники",
    type: "shop",
    price: 40000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    description: "Специализированный магазин техники и гаджетов",
    features: ["Фильтры", "Сравнение", "Акции", "Доставка"],
    popular: true
  },
  {
    id: 7,
    title: "Агентство недвижимости",
    type: "corporate",
    price: 28000,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    description: "Сайт для риэлторских услуг и агентств",
    features: ["Каталог", "Карта", "Фильтры", "Заявки"],
    popular: false
  },
  {
    id: 8,
    title: "Фотограф портфолио",
    type: "landing",
    price: 15000,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    description: "Стильный сайт-портфолио для фотографов",
    features: ["Галерея", "Цены", "Бронирование", "Отзывы"],
    popular: true
  },
  {
    id: 9,
    title: "Ресторан и доставка",
    type: "shop",
    price: 32000,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    description: "Сайт для ресторанов с онлайн-заказом еды",
    features: ["Меню", "Корзина", "Доставка", "Онлайн-оплата"],
    popular: true
  },
  {
    id: 10,
    title: "Фитнес клуб",
    type: "corporate",
    price: 22000,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    description: "Сайт для фитнес-центров и спортзалов",
    features: ["Расписание", "Тренеры", "Абонементы", "Запись"],
    popular: false
  },
  {
    id: 11,
    title: "Образовательная платформа",
    type: "corporate",
    price: 38000,
    image: "https://images.unsplash.com/photo-1522881193457-37ae97c905bf?auto=format&fit=crop&w=800&q=80",
    description: "Платформа для онлайн-курсов и обучения",
    features: ["Курсы", "Видеолекции", "Тесты", "Сертификаты"],
    popular: true
  },
  {
    id: 12,
    title: "Автосалон",
    type: "shop",
    price: 42000,
    image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80",
    description: "Сайт для автосалонов и продажи автомобилей",
    features: ["Каталог авто", "Фильтры", "Кредитный калькулятор", "Trade-in"],
    popular: true
  },
  {
    id: 13,
    title: "Медицинский центр",
    type: "corporate",
    price: 26000,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    description: "Сайт для клиник и медицинских услуг",
    features: ["Услуги", "Врачи", "Запись онлайн", "Отзывы"],
    popular: false
  },
  {
    id: 14,
    title: "Турагентство",
    type: "landing",
    price: 18000,
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80",
    description: "Продающий лендинг для туристических услуг",
    features: ["Туры", "Горящие предложения", "Онлайн-бронирование", "Отзывы"],
    popular: true
  },
  {
    id: 15,
    title: "Строительная компания",
    type: "corporate",
    price: 30000,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    description: "Сайт для строительных фирм и застройщиков",
    features: ["Проекты", "Услуги", "Портфолио", "Калькулятор"],
    popular: false
  },
  {
    id: 16,
    title: "Юридические услуги",
    type: "landing",
    price: 14000,
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80",
    description: "Лендинг для юридических компаний и адвокатов",
    features: ["Услуги", "Специалисты", "Отзывы", "Консультация"],
    popular: true
  }
])

const filteredTemplates = computed(() => {
  if (props.activeFilter === 'all') return templates.value
  return templates.value.filter(t => t.type === props.activeFilter)
})
</script>

<template>
  <section class="portfolio-grid">
    <div class="portfolio-grid__container container">
      <div class="portfolio-grid__header">
        <h2 class="portfolio-grid__title">
          {{ filteredTemplates.length }} шаблонов
          <span v-if="activeFilter !== 'all'">в категории "{{ filters.find(f => f.id === activeFilter)?.name }}"</span>
        </h2>
      </div>
      
      <div class="portfolio-grid__content">
        <TemplateCard 
          v-for="template in filteredTemplates" 
          :key="template.id"
          :template="template"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      filters: [
        { id: 'all', name: 'Все шаблоны' },
        { id: 'landing', name: 'Лендинги' },
        { id: 'corporate', name: 'Корпоративные' },
        { id: 'shop', name: 'Магазины' },
        { id: 'blog', name: 'Блоги' }
      ]
    }
  }
}
</script>

<style scoped>
.portfolio-grid {
  padding: 50px 0;
}

.portfolio-grid__header {
  margin-bottom: 30px;
}

.portfolio-grid__title {
  font-size: 1.8rem;
  color: var(--dark);
  font-weight: 700;
}

.portfolio-grid__title span {
  color: var(--primary);
}

.portfolio-grid__content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

@media (max-width: 992px) {
  .portfolio-grid__content {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  
  .portfolio-grid__title {
    font-size: 1.6rem;
  }
}

@media (max-width: 576px) {
  .portfolio-grid__content {
    grid-template-columns: 1fr;
  }
  
  .portfolio-grid__title {
    font-size: 1.4rem;
  }
}
</style>