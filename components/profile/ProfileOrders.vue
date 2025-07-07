<script setup>
const orders = ref([
  {
    id: 'ORD-001',
    date: '15.07.2025',
    template: 'Стартап Лендинг',
    status: 'Завершен',
    price: '12 000 ₽'
  },
  {
    id: 'ORD-002',
    date: '10.07.2025',
    template: 'Корпоративный сайт',
    status: 'В разработке',
    price: '25 000 ₽'
  },
  {
    id: 'ORD-003',
    date: '05.07.2025',
    template: 'Интернет-магазин',
    status: 'Ожидает оплаты',
    price: '35 000 ₽'
  }
])
</script>

<template>
  <div class="profile-orders">
    <h2 class="profile-orders__title">Мои заказы</h2>
    
    <div class="profile-orders__table">
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
            `profile-orders__status--${order.status.toLowerCase()}`
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

.profile-orders__status--завершен {
  background: #dcfce7;
  color: #166534;
}

.profile-orders__status--в-разработке {
  background: #fffbeb;
  color: #854d0e;
}

.profile-orders__status--ожидает-оплаты {
  background: #fee2e2;
  color: #b91c1c;
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