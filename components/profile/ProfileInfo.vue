<template>
  <div class="profile-info">
    <div class="profile-info__header">
      <h2 class="profile-info__title">Личные данные</h2>
      <button 
        v-if="!isEditing"
        class="button button--outline"
        @click="isEditing = true"
      >
        Редактировать
      </button>
      <div v-else class="profile-info__actions">
        <button 
          class="button button--outline"
          @click="cancelEdit"
        >
          Отмена
        </button>
        <button 
          class="button button--primary"
          :disabled="loading"
          @click="saveProfile"
        >
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>
    </div>
    
    <div v-if="!isEditing" class="profile-info__content">
      <div class="profile-info__item">
        <span class="profile-info__label">Имя:</span>
        <span class="profile-info__value">{{ user.name }}</span>
      </div>
      <div class="profile-info__item">
        <span class="profile-info__label">Email:</span>
        <span class="profile-info__value">{{ user.email }}</span>
      </div>
      <div class="profile-info__item">
        <span class="profile-info__label">Телефон:</span>
        <span class="profile-info__value">{{ user.phone }}</span>
      </div>
      <div class="profile-info__item">
        <span class="profile-info__label">Telegram:</span>
        <span class="profile-info__value">{{ user.telegram }}</span>
      </div>
      <div v-if="user.city" class="profile-info__item">
        <span class="profile-info__label">Город:</span>
        <span class="profile-info__value">{{ user.city }}</span>
      </div>
    </div>
    
    <form v-else class="profile-info__form" @submit.prevent="saveProfile">
      <div class="profile-info__form-group">
        <label class="profile-info__form-label">Имя</label>
        <input 
          v-model="tempUser.name"
          type="text" 
          class="profile-info__form-input"
        >
      </div>
      <div class="profile-info__form-group">
        <label class="profile-info__form-label">Email</label>
        <input 
          v-model="tempUser.email"
          type="email" 
          class="profile-info__form-input"
        >
      </div>
      <div class="profile-info__form-group">
        <label class="profile-info__form-label">Телефон</label>
        <input 
          v-model="tempUser.phone"
          type="tel" 
          class="profile-info__form-input"
        >
      </div>
      <div class="profile-info__form-group">
        <label class="profile-info__form-label">Telegram</label>
        <input 
          v-model="tempUser.telegram"
          type="text" 
          class="profile-info__form-input"
        >
      </div>
      <div class="profile-info__form-group">
        <label class="profile-info__form-label">Город</label>
        <input 
          v-model="tempUser.city"
          type="text" 
          class="profile-info__form-input"
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const isEditing = ref(false)
const loading = ref(false)

const user = ref({
  uid: null,
  name: '',
  username: '',
  email: '',
  phone: '',
  telegram: '',
  city: '',
  avatar: null
})
const tempUser = ref({ ...user.value })

// Маппер: нормализует ответ /user/me в поля, используемые компонентом
function mapUserFromApi(api = {}) {
  const digits = (api.phone || '').replace(/\D/g, '')
  const phone = (digits.length === 11 && digits.startsWith('7'))
    ? `+7 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9,11)}`
    : (api.phone || '')

  return {
    uid: api.uid || api.id || null,
    username: api.username || '',
    name: api.fullname || api.username || '',
    email: api.email || '',
    phone,
    telegram: api.tg || api.telegram || '',
    city: api.city || '',
    avatar: api.avatar || null,
    raw: api
  }
}

function cancelEdit() {
  tempUser.value = { ...user.value }
  isEditing.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    // опционально инициализируем токен/uid из localStorage (если нужен)
    if (typeof userStore.initFromStorage === 'function') {
      try { userStore.initFromStorage() } catch (e) { /* ignore */ }
    }

    // получаем профиль из стора
    const fetched = await userStore.fetchCurrentUser()
    const apiData = fetched || userStore.user || null
    if (apiData) {
      const normalized = mapUserFromApi(apiData)
      user.value = normalized
      tempUser.value = { ...normalized }
    }
  } catch (err) {
    console.error('Ошибка получения профиля:', err)
  } finally {
    loading.value = false
  }
})

async function saveProfile() {
  try {
    loading.value = true

    const payload = {
      fullname: tempUser.value.name,           // Важно: fullname, а не name
      email: tempUser.value.email,
      phone: (tempUser.value.phone || '').replace(/\D/g, ''), // сервер хранит цифры
      tg: tempUser.value.telegram,
      city: tempUser.value.city
      // при необходимости username/password и т.д.
    }

    // Обращаемся к action в стое (вставьте его, как выше)
    const updated = await userStore.updateProfile(payload)

    // Обновляем локальные данные
    const apiData = updated || userStore.user
    if (apiData) {
      // нормализуйте как вам нужно; пример простым присваиванием:
      user.value = {
        uid: apiData.uid,
        name: apiData.fullname || apiData.username || '',
        email: apiData.email || '',
        phone: apiData.phone || '',
        telegram: apiData.tg || '',
        city: apiData.city || ''
      }
      tempUser.value = { ...user.value }
      isEditing.value = false
    }
  } catch (err) {
    console.error('Ошибка сохранения профиля:', err)
    //alert(err.message || 'Ошибка сохранения профиля')
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.profile-info__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.profile-info__title {
  font-size: 1.8rem;
  color: var(--dark);
}

.profile-info__actions {
  display: flex;
  gap: 10px;
}

.profile-info__item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.profile-info__label {
  width: 150px;
  font-weight: 600;
  color: var(--dark);
}

.profile-info__value {
  flex: 1;
  color: var(--gray);
}

.profile-info__form-group {
  margin-bottom: 20px;
}

.profile-info__form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dark);
}

.profile-info__form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}
</style>
