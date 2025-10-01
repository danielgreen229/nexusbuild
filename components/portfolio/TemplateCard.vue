<script setup>
import Button from '@/components/ui/Button.vue'
import { useUserStore } from '~/stores/user'

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
})

const userStore = useUserStore()
const loading = ref(false)

const buyTemplate = async () => {
  if (!userStore.isAuthenticated) {
    alert('Для покупки шаблона необходимо войти в систему')
    return
  }

  if (!confirm(`Купить шаблон "${props.template.title}" за ${props.template.price.toLocaleString()} ₽?`)) {
    return
  }

  try {
    loading.value = true
    const response = await fetch(`${API.fullUrl}/purchase/template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        templateId: props.template.id,
        paymentMethod: 'balance'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        alert(`Заказ создан! ID: ${data.data.id}\nСтатус: ${data.data.statusText}`)
      }
    } else {
      const errorData = await response.json()
      alert(errorData.error || 'Ошибка создания заказа')
    }
  } catch (error) {
    console.error('Ошибка покупки шаблона:', error)
    alert('Ошибка покупки шаблона')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="template-card">
    <div class="template-card__image">
      <img :src="template.image" :alt="template.title" loading="lazy">
      <div v-if="template.popular" class="template-card__badge">Популярный</div>
    </div>
    
    <div class="template-card__content">
      <div class="template-card__header">
        <h3 class="template-card__title">{{ template.title }}</h3>
        <div class="template-card__price">{{ template.price.toLocaleString() }} ₽</div>
      </div>
      
      <p class="template-card__description">{{ template.description }}</p>
      
      <div class="template-card__features">
        <span 
          v-for="(feature, idx) in template.features" 
          :key="idx"
          class="template-card__feature"
        >
          {{ feature }}
        </span>
      </div>
      
      <Button 
        class="template-card__button button button--primary"
        :disabled="loading"
        @click="buyTemplate"
      >
        {{ loading ? 'Покупка...' : 'Купить шаблон' }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.template-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  height: 100%;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.template-card__image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.template-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.template-card:hover .template-card__image img {
  transform: scale(1.05);
}

.template-card__badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f97316;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.template-card__content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 220px);
}

.template-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.template-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-right: 10px;
}

.template-card__price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2563eb;
  white-space: nowrap;
}

.template-card__description {
  color: #64748b;
  margin-bottom: 15px;
  line-height: 1.5;
  flex-grow: 1;
}

.template-card__features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.template-card__feature {
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #475569;
}

.template-card__button {
  width: 100%;
  padding: 12px;
  font-weight: 600;
  border-radius: 8px;
}

@media (max-width: 576px) {
  .template-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .template-card__price {
    font-size: 1.1rem;
  }
}
</style>