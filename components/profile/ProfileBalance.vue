<script setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const balance = ref(0)
const transactions = ref([])
const loading = ref(false)

// Загружаем данные при монтировании компонента
onMounted(async () => {
  await loadBalance()
  await loadTransactions()
})

const loadBalance = async () => {
  try {
    const response = await fetch(`${API.fullUrl}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        balance.value = data.data.balance || 0
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки баланса:', error)
  }
}

const loadTransactions = async () => {
  try {
    loading.value = true
    const response = await fetch(`${API.fullUrl}/user/transactions`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        transactions.value = data.data.map(trx => ({
          id: trx.id,
          date: new Date(trx.createdAt).toLocaleDateString('ru-RU'),
          description: trx.description,
          amount: `${trx.amount > 0 ? '+' : ''}${trx.amount.toLocaleString()} ₽`,
          type: trx.type
        }))
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки транзакций:', error)
  } finally {
    loading.value = false
  }
}

const topupBalance = async () => {
  const amount = prompt('Введите сумму для пополнения:')
  if (!amount || isNaN(amount) || amount <= 0) {
    alert('Введите корректную сумму')
    return
  }

  try {
    loading.value = true
    const response = await fetch(`${API.fullUrl}/user/balance/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ amount: parseInt(amount) })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        alert('Баланс успешно пополнен!')
        await loadBalance()
        await loadTransactions()
      }
    } else {
      const errorData = await response.json()
      alert(errorData.error || 'Ошибка пополнения баланса')
    }
  } catch (error) {
    console.error('Ошибка пополнения баланса:', error)
    alert('Ошибка пополнения баланса')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-balance">
    <div class="profile-balance__header">
      <h2 class="profile-balance__title">Баланс</h2>
      <div class="profile-balance__amount">
        {{ balance.toLocaleString() }} ₽
      </div>
    </div>
    
    <button 
      class="button button--primary profile-balance__button"
      :disabled="loading"
      @click="topupBalance"
    >
      {{ loading ? 'Пополнение...' : 'Пополнить баланс' }}
    </button>
    
    <div class="profile-balance__history">
      <h3 class="profile-balance__subtitle">История операций</h3>
      
      <div v-if="loading" class="profile-balance__loading">
        Загрузка операций...
      </div>
      
      <div v-else-if="transactions.length === 0" class="profile-balance__empty">
        У вас пока нет операций
      </div>
      
      <div v-else class="profile-balance__list">
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

.profile-balance__loading,
.profile-balance__empty {
  text-align: center;
  padding: 20px;
  color: var(--gray);
  font-size: 1rem;
}
</style>