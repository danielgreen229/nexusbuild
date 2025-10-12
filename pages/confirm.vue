<template>
  <div class="confirm-page">
    <div v-if="loading" class="card">
      <div class="spinner" aria-hidden="true"></div>
      <div class="text">Подтверждаем аккаунт, подождите...</div>
    </div>

    <div v-else-if="error" class="card error">
      <p class="text">Ошибка: {{ error }}</p>
      <div class="actions">
        <button @click="retry" class="btn">Повторить</button>
        <button @click="goLogin" class="btn secondary">Войти</button>
      </div>
    </div>

    <div v-else class="card success">
      <p class="text">Успешно! Сейчас вы будете перенаправлены в профиль.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const error = ref(null)

async function doSubmit(tokenRaw, uidRaw) {
  loading.value = true
  error.value = null

  try {
    // query может быть уже декодирован роутером, но на всякий случай декодируем.
    const token = tokenRaw ? decodeURIComponent(tokenRaw) : null
    const uid = uidRaw ? decodeURIComponent(uidRaw) : null

    if (!token || !uid) {
      throw new Error('В ссылке отсутствуют обязательные параметры token или uid.')
    }

    // Сохраняем в стор и localStorage — store.submit использует this.token/this.uid и добавляет Authorization.
    userStore.token = token
    userStore.uid = uid
    localStorage.setItem('token', token)
    localStorage.setItem('uid', uid)

    // Вызов submit (он сам обновит user/isAuthenticated или выбросит ошибку)
    await userStore.submit()

    // Успешно — переходим в профиль (replace, чтобы не оставлять confirm в истории)
    await router.replace('/profile')
  } catch (e) {
    // userStore.submit обычно проставляет logout() при 401 — оставляем это поведение.
    error.value = e?.message || String(e) || 'Неизвестная ошибка'
  } finally {
    loading.value = false
  }
}

function retry() {
  const { token, uid } = route.query
  doSubmit(token, uid)
}

function goLogin() {
  router.push('/login')
}

onMounted(() => {
  const { token, uid } = route.query
  doSubmit(token, uid)
})
</script>

<style scoped>
.confirm-page {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: inherit;
}

.card {
  width: 100%;
  max-width: 520px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(22, 27, 34, 0.08);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  background: white;
}

.spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid rgba(0,0,0,0.08);
  border-top-color: rgba(0,0,0,0.5);
  animation: spin 1s linear infinite;
  margin-bottom: 6px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.text {
  font-size: 15px;
  color: #111827;
}

.error { border: 1px solid #f1a4a4; }
.success { border: 1px solid #bfe6c7; }

.actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.btn {
  padding: 8px 14px;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn.secondary {
  background: transparent;
  color: #111827;
  border: 1px solid rgba(0,0,0,0.08);
}
</style>
