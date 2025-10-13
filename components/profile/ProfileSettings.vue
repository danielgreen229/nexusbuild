<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user' // поправь путь при необходимости

const userStore = useUserStore()

// Признак: профиль загружен
const hasUser = computed(() => !!userStore.user)

// Мэппинг: email_access (1|0) <-> булево для v-model
const emailAccess = computed({
  get() {
    if (!userStore.user) return false
    return Number(userStore.user.email_access) === 1
  },
  set(val) {
    if (!userStore.user) return
    const numeric = val ? 1 : 0
    userStore.user.email_access = numeric
    if (userStore.isAuthenticated) {
      userStore.updateProfile({ email_access: numeric }).catch(async () => {
        try { await userStore.fetchCurrentUser() } catch (e) { /* игнор */ }
      })
    }
  }
})

const tgAccess = computed({
  get() {
    if (!userStore.user) return false
    return Number(userStore.user.tg_access) === 1
  },
  set(val) {
    if (!userStore.user) return
    const numeric = val ? 1 : 0
    userStore.user.tg_access = numeric
    if (userStore.isAuthenticated) {
      userStore.updateProfile({ tg_access: numeric }).catch(async () => {
        try { await userStore.fetchCurrentUser() } catch (e) { /* игнор */ }
      })
    }
  }
})

// Функция привязки Telegram (точно как ты просил)
function connectTelegram() {
  if (!userStore.user || !userStore.user.uid) return
  const payload = {
    uid: userStore.user.uid
  }
  const startParam = btoa(JSON.stringify(payload))
  const tgBotLink = `https://t.me/sitebypro_official_bot?start=${startParam}`
  window.open(tgBotLink, '_blank')
}
</script>

<template>
  <div class="profile-settings">
    <h2 class="profile-settings__title">Настройки</h2>
    
    <div class="profile-settings__section">
      <h3 class="profile-settings__subtitle">Уведомления</h3>
      
      <div class="profile-settings__option">
        <div class="profile-settings__option-info">
          <div class="profile-settings__option-title">Email уведомления</div>
          <div class="profile-settings__option-desc">
            Получать новости и обновления на почту с ваших сайтов
          </div>
        </div>
        <label class="profile-settings__switch" :title="hasUser ? '' : 'Профиль не загружен'">
          <input 
            type="checkbox" 
            v-model="emailAccess"
            class="profile-settings__switch-input"
            :disabled="!hasUser || userStore.loading"
          >
          <span class="profile-settings__switch-slider"></span>
        </label>
      </div>
      
      <div class="profile-settings__option">
        <div class="profile-settings__option-info">
          <div class="profile-settings__option-title">Telegram уведомления</div>
          <div class="profile-settings__option-desc">
            Получать важные уведомления в Telegram с ваших сайтов
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <button
            class="profile-settings__connect-btn"
            @click="connectTelegram"
            :disabled="!hasUser || userStore.loading"
            type="button"
          >
            Привязать Telegram
          </button>
          <label class="profile-settings__switch" :title="hasUser ? '' : 'Профиль не загружен'">
            <input 
              type="checkbox" 
              v-model="tgAccess"
              class="profile-settings__switch-input"
              :disabled="!hasUser || userStore.loading"
            >
            <span class="profile-settings__switch-slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* исходные стили оставлены без изменений */
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

/* Стили кнопки привязки Telegram */
.profile-settings__connect-btn {
  font-size: 0.9rem;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--primary);
  background: transparent;
  cursor: pointer;
}
.profile-settings__connect-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
