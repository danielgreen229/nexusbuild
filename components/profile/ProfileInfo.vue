<script setup>
const user = ref({
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  phone: '+7 (999) 123-45-67',
  telegram: '@ivanov'
})

const isEditing = ref(false)
const tempUser = ref({...user.value})

const saveProfile = () => {
  user.value = {...tempUser.value}
  isEditing.value = false
}
</script>

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
          @click="isEditing = false"
        >
          Отмена
        </button>
        <button 
          class="button button--primary"
          @click="saveProfile"
        >
          Сохранить
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
    </div>
    
    <form v-else class="profile-info__form">
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
    </form>
  </div>
</template>

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