<script setup>
const balance = ref(7500)
const transactions = ref([
  {
    id: 'TRX-001',
    date: '10.07.2025',
    description: 'Пополнение баланса',
    amount: '+10 000 ₽',
    type: 'income'
  },
  {
    id: 'TRX-002',
    date: '05.07.2025',
    description: 'Оплата заказа ORD-003',
    amount: '-2 500 ₽',
    type: 'expense'
  },
  {
    id: 'TRX-003',
    date: '01.07.2025',
    description: 'Бонус за отзыв',
    amount: '+500 ₽',
    type: 'income'
  }
])
</script>

<template>
  <div class="profile-balance">
    <div class="profile-balance__header">
      <h2 class="profile-balance__title">Баланс</h2>
      <div class="profile-balance__amount">
        {{ balance.toLocaleString() }} ₽
      </div>
    </div>
    
    <button class="button button--primary profile-balance__button">
      Пополнить баланс
    </button>
    
    <div class="profile-balance__history">
      <h3 class="profile-balance__subtitle">История операций</h3>
      
      <div class="profile-balance__list">
        <div 
          v-for="trx in transactions"
          :key="trx.id"
          class="profile-balance__item"
        >
          <div class="profile-balance__info">
            <div class="profile-balance__date">{{ trx.date }}</div>
            <div class="profile-balance__desc">{{ trx.description }}</div>
          </div>
          <div 
            :class="[
              'profile-balance__sum',
              trx.type === 'income' ? 'profile-balance__sum--income' : 'profile-balance__sum--expense'
            ]"
          >
            {{ trx.amount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-balance__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.profile-balance__title {
  font-size: 1.8rem;
  color: var(--dark);
}

.profile-balance__amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.profile-balance__button {
  padding: 12px 30px;
  margin-bottom: 40px;
}

.profile-balance__subtitle {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: var(--dark);
}

.profile-balance__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f1f5f9;
}

.profile-balance__info {
  flex: 1;
}

.profile-balance__date {
  font-size: 0.9rem;
  color: var(--gray);
  margin-bottom: 5px;
}

.profile-balance__desc {
  font-weight: 500;
}

.profile-balance__sum {
  font-weight: 600;
}

.profile-balance__sum--income {
  color: #10b981;
}

.profile-balance__sum--expense {
  color: #ef4444;
}
</style>