<script setup>
import TemplateCard from '@/components/portfolio/TemplateCard.vue'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  activeFilter: {
    type: String,
    required: true
  }
})

const templates = ref([])
const loading = ref(false)

// Загружаем шаблоны при монтировании компонента
onMounted(async () => {
  await loadTemplates()
})

const loadTemplates = async () => {
  try {
    loading.value = true
    const response = await fetch(`${API.fullUrl}/templates`)
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        templates.value = data.data
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки шаблонов:', error)
  } finally {
    loading.value = false
  }
}

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
      
      <div v-if="loading" class="portfolio-grid__loading">
        Загрузка шаблонов...
      </div>
      
      <div v-else-if="filteredTemplates.length === 0" class="portfolio-grid__empty">
        Шаблоны не найдены
      </div>
      
      <div v-else class="portfolio-grid__content">
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

.portfolio-grid__loading,
.portfolio-grid__empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray);
  font-size: 1.2rem;
}
</style>