<script setup>
const notifications = ref({
  email: true,
  telegram: true,
  sms: false
})

const security = ref({
  twoFactor: false
})
</script>

<template>
  <div class="profile-settings">
    <h2 class="profile-settings__title">Настройки</h2>
    
    <div class="profile-settings__section">
      <h3 class="profile-settings__subtitle">Уведомления</h3>
      
      <div class="profile-settings__option">
        <div class="profile-settings__option-info">
          <div class="profile-settings__option-title">Email уведомления</div>
          <div class="profile-settings__option-desc">Получать новости и обновления на почту</div>
        </div>
        <label class="profile-settings__switch">
          <input 
            type="checkbox" 
            v-model="notifications.email"
            class="profile-settings__switch-input"
          >
          <span class="profile-settings__switch-slider"></span>
        </label>
      </div>
      
      <div class="profile-settings__option">
        <div class="profile-settings__option-info">
          <div class="profile-settings__option-title">Telegram уведомления</div>
          <div class="profile-settings__option-desc">Получать важные уведомления в Telegram</div>
        </div>
        <label class="profile-settings__switch">
          <input 
            type="checkbox" 
            v-model="notifications.telegram"
            class="profile-settings__switch-input"
          >
          <span class="profile-settings__switch-slider"></span>
        </label>
      </div>
      
      <div class="profile-settings__option">
        <div class="profile-settings__option-info">
          <div class="profile-settings__option-title">SMS уведомления</div>
          <div class="profile-settings__option-desc">Получать важные уведомления по SMS</div>
        </div>
        <label class="profile-settings__switch">
          <input 
            type="checkbox" 
            v-model="notifications.sms"
            class="profile-settings__switch-input"
          >
          <span class="profile-settings__switch-slider"></span>
        </label>
      </div>
    </div>
    
    <div class="profile-settings__section">
      <h3 class="profile-settings__subtitle">Безопасность</h3>
      
      <div class="profile-settings__option">
        <div class="profile-settings__option-info">
          <div class="profile-settings__option-title">Двухфакторная аутентификация</div>
          <div class="profile-settings__option-desc">Дополнительная защита вашего аккаунта</div>
        </div>
        <label class="profile-settings__switch">
          <input 
            type="checkbox" 
            v-model="security.twoFactor"
            class="profile-settings__switch-input"
          >
          <span class="profile-settings__switch-slider"></span>
        </label>
      </div>
    </div>
    
    <div class="profile-settings__section">
      <h3 class="profile-settings__subtitle">Удаление аккаунта</h3>
      <button class="button button--danger">
        Удалить аккаунт
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-settings__title {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: var(--dark);
}

.profile-settings__section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f1f5f9;
}

.profile-settings__subtitle {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: var(--dark);
}

.profile-settings__option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.profile-settings__option-info {
  flex: 1;
  margin-right: 20px;
}

.profile-settings__option-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.profile-settings__option-desc {
  font-size: 0.9rem;
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

.button--danger {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.button--danger:hover {
  background: #fee2e2;
}
</style>