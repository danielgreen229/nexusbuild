<script setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const orders = ref([])
const loading = ref(false)

// Загружаем заказы при монтировании компонента
onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  try {
    loading.value = true
    const response = await fetch(`${API.fullUrl}/user/orders`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        orders.value = data.data.map(order => ({
          id: order.id,
          date: new Date(order.createdAt).toLocaleDateString('ru-RU'),
          template: order.templateName,
          status: order.statusText,
          price: `${order.price.toLocaleString()} ₽`,
          statusCode: order.status
        }))
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-orders">
    <h2 class="profile-orders__title">Мои заказы</h2>
    
    <div v-if="loading" class="profile-orders__loading">
      Загрузка заказов...
    </div>
    
    <div v-else-if="orders.length === 0" class="profile-orders__empty">
      У вас пока нет заказов
    </div>
    
    <div v-else class="profile-orders__table">
      <div class="profile-orders__row profile-orders__row--header">
        <div class="profile-orders__cell">ID заказа</div>
        <div class="profile-orders__cell">Дата</div>
        <div class="profile-orders__cell">Шаблон</div>
        <div class="profile-orders__cell">Статус</div>
        <div class="profile-orders__cell">Сумма</div>
        <div class="profile-orders__cell">Действия</div>
      </div>
      
      <div 
        v-for="order in orders"
        :key="order.id"
        class="profile-orders__row"
      >
        <div class="profile-orders__cell">{{ order.id }}</div>
        <div class="profile-orders__cell">{{ order.date }}</div>
        <div class="profile-orders__cell">{{ order.template }}</div>
        <div class="profile-orders__cell">
          <span :class="[
            'profile-orders__status',
            `profile-orders__status--${order.statusCode}`
          ]">
            {{ order.status }}
          </span>
        </div>
        <div class="profile-orders__cell">{{ order.price }}</div>
        <div class="profile-orders__cell">
          <button class="profile-orders__action">
            Подробнее
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-orders__title {
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: var(--dark);
}

.profile-orders__table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.profile-orders__row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr;
  align-items: center;
}

.profile-orders__row--header {
  background: #f8fafc;
  font-weight: 600;
  color: var(--dark);
}

.profile-orders__row:not(.profile-orders__row--header) {
  border-top: 1px solid #e2e8f0;
}

.profile-orders__cell {
  padding: 15px;
}

.profile-orders__status {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.profile-orders__status--completed {
  background: #dcfce7;
  color: #166534;
}

.profile-orders__status--in_progress {
  background: #fffbeb;
  color: #854d0e;
}

.profile-orders__status--pending_payment {
  background: #fee2e2;
  color: #b91c1c;
}

.profile-orders__loading,
.profile-orders__empty {
  text-align: center;
  padding: 40px;
  color: var(--gray);
  font-size: 1.1rem;
}

.profile-orders__action {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .profile-orders__row {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 10px;
  }
  
  .profile-orders__cell:nth-child(1),
  .profile-orders__cell:nth-child(2),
  .profile-orders__cell:nth-child(4) {
    grid-row: 1;
  }
  
  .profile-orders__cell:nth-child(3),
  .profile-orders__cell:nth-child(5),
  .profile-orders__cell:nth-child(6) {
    grid-row: 2;
  }
  
  .profile-orders__cell:nth-child(3) {
    grid-column: span 2;
  }
}
</style>