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
        <span class="profile-info__value">{{ storeUser?.name }}</span>
      </div>
      <div class="profile-info__item">
        <span class="profile-info__label">Email:</span>
        <span class="profile-info__value">{{ storeUser?.email }}</span>
      </div>
      <div class="profile-info__item">
        <span class="profile-info__label">Телефон:</span>
        <span class="profile-info__value">{{ storeUser?.phone }}</span>
      </div>
      <div v-if="storeUser?.city" class="profile-info__item">
        <span class="profile-info__label">Город:</span>
        <span class="profile-info__value">{{ storeUser?.city }}</span>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const isEditing = ref(false)
const loading = ref(false)

// mapUserFromApi — нормализует ответ /user/me
function mapUserFromApi(api = {}) {
  const digits = (api.phone || '').replace(/\D/g, '')
  const phone = (digits.length === 11 && digits.startsWith('7'))
    ? `+7 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9,11)}`
    : (api.phone || '')

  // Ожидаем, что в userStore.user могут быть поля notifications/security (если бэк их возвращает)
  return {
    uid: api.uid || api.id || null,
    username: api.username || '',
    name: api.fullname || api.username || '',
    email: api.email || '',
    phone,
    telegram: api.tg || api.telegram || '',
    city: api.city || '',
    avatar: api.avatar || null,
    // дефолтные значения для настроек (если бэк не вернул — используем безопасные)
    notifications: {
      email: api.notifications?.email ?? true,
      telegram: api.notifications?.telegram ?? true,
      sms: api.notifications?.sms ?? false
    },
    security: {
      twoFactor: api.security?.twoFactor ?? false
    },
    raw: api
  }
}

// computed для отображаемого пользователя
const storeUser = computed(() => userStore.user ? mapUserFromApi(userStore.user) : null)

// tempUser — рабочая копия, которую редактируем и потом шлём на сервер
const tempUser = ref({
  uid: null, name: '', username: '', email: '', phone: '', telegram: '', city: '', avatar: null,
  notifications: { email: true, telegram: true, sms: false },
  security: { twoFactor: false },
  raw: null
})

watch(
  storeUser,
  (val) => {
    if (!val) {
      tempUser.value = {
        uid: null, name: '', username: '', email: '', phone: '', telegram: '', city: '', avatar: null,
        notifications: { email: true, telegram: true, sms: false },
        security: { twoFactor: false },
        raw: null
      }
    } else if (!isEditing.value) {
      // копируем из storeUser готовую нормализованную структуру
      tempUser.value = { ...val, notifications: { ...val.notifications }, security: { ...val.security } }
    }
  },
  { immediate: true }
)

function cancelEdit() {
  // сбрасываем tempUser к значению из стора
  if (storeUser.value) {
    tempUser.value = { ...storeUser.value, notifications: { ...storeUser.value.notifications }, security: { ...storeUser.value.security } }
  }
  isEditing.value = false
}

onMounted(async () => {
  // при необходимости можно загрузить профиль здесь, если store его ещё не содержит
  // например: if (!userStore.user) await userStore.fetchProfile()
})

async function saveProfile() {
  try {
    loading.value = true

    const payload = {
      fullname: tempUser.value.name,           // Важно: fullname, а не name
      email: tempUser.value.email,
      phone: (tempUser.value.phone || '').replace(/\D/g, ''), // сервер хранит цифры
      tg: tempUser.value.telegram,
      city: tempUser.value.city,
      // добавляем настройки — поменяйте ключи при необходимости под ваш API
      notifications: {
        email: !!tempUser.value.notifications.email,
        telegram: !!tempUser.value.notifications.telegram,
        sms: !!tempUser.value.notifications.sms
      },
      security: {
        twoFactor: !!tempUser.value.security.twoFactor
      }
    }

    // Обращаемся к action в стое (предположительно updateProfile возвращает обновлённый профиль)
    const updated = await userStore.updateProfile(payload)

    // Обновляем локальные данные в сторе — если updateProfile сам ничего не возвращает,
    // предполагаем, что сторь обновил state; на всякий случай поддерживаем оба варианта.
    const apiData = updated || userStore.user

    if (apiData) {
      // Если сторь не обновил автоматически, обновим руками
      // (если у вас другой API для установки user — замените присвоение на вызов метода стора)
      userStore.user = apiData

      // синхронизируем tempUser и закрываем редактирование
      tempUser.value = { ...mapUserFromApi(apiData) }
      isEditing.value = false
    }
  } catch (err) {
    console.error('Ошибка сохранения профиля:', err)
    // можно показать toast/alert если нужно
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-info {
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
}
/* ===== profile-info styles ===== */
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

/* ===== embedded settings styles (merged from your settings component) ===== */
.profile-settings {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e6eef7;
}

.profile-settings__title {
  font-size: 1.4rem;
  margin-bottom: 16px;
  color: var(--dark);
}

.profile-settings__section {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.profile-settings__subtitle {
  font-size: 1rem;
  margin-bottom: 12px;
  color: var(--dark);
}

.profile-settings__option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.profile-settings__option-info {
  flex: 1;
  margin-right: 20px;
}

.profile-settings__option-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.profile-settings__option-desc {
  font-size: 0.85rem;
  color: var(--gray);
}

.profile-settings__switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.profile-settings__switch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.profile-settings__switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 34px;
}

.profile-settings__switch-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.profile-settings__switch-input:checked + .profile-settings__switch-slider {
  background-color: var(--primary);
}

.profile-settings__switch-input:checked + .profile-settings__switch-slider:before {
  transform: translateX(24px);
}

/* Button danger (оставил на случай) */
.button--danger {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.button--danger:hover {
  background: #fee2e2;
}

@media (max-width: 768px) {
  .profile-info__header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: nowrap;
  }
}
</style>
