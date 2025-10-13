<template>
  <div class="auth-page">
    <main class="auth-card" role="main">
      <h1 class="auth-title">Сброс пароля</h1>

      <div v-if="error" class="auth-error" role="alert">{{ error }}</div>
      <div v-if="missingToken" class="auth-error" role="alert">
        Невозможно выполнить сброс
      </div>

      <form class="auth-form" @submit.prevent="onSubmit" v-if="!success && !missingToken" novalidate>
        <label class="auth-field">
          <span class="auth-label">Новый пароль</span>
          <input
            ref="passwordInput"
            v-model="password"
            type="password"
            required
            autocomplete="new-password"
            :disabled="loading"
            @keydown.enter.prevent
            minlength="8"
          />
        </label>

        <label class="auth-field">
          <span class="auth-label">Подтвердите пароль</span>
          <input
            v-model="passwordConfirm"
            type="password"
            required
            autocomplete="new-password"
            :disabled="loading"
            @keydown.enter.prevent
            minlength="8"
          />
        </label>

        <div class="auth-actions">
          <button
            type="submit"
            class="button button--primary"
            :disabled="!canSubmit"
            :aria-disabled="!canSubmit"
          >
            <span v-if="!loading">Сохранить новый пароль</span>
            <span v-else>Сохранение...</span>
          </button>


          <button type="button" class="button" @click="onCancel" :disabled="loading">Отмена</button>
        </div>
      </form>

      <div v-if="success" class="auth-success">
        Пароль успешно изменён. Вы будете перенаправлены на страницу входа.
        <div style="margin-top:0.5rem">
          <button class="button button--primary" @click="goToLogin">Перейти к входу</button>
        </div>
      </div>

      <div class="auth-field__hint" v-if="passwordTooShort">Пароль должен быть не менее 8 символов.</div>
      <div class="auth-field__hint" v-if="passwordsMismatch">Пароли не совпадают.</div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const passwordInput = ref(null)

// Query helpers
function getQueryParam(name) {
  const v = route.query[name]
  if (Array.isArray(v)) return v[0]
  return v ?? null
}
const token = computed(() => getQueryParam('token') || getQueryParam('resetToken'))
const uid = computed(() => getQueryParam('uid') || getQueryParam('user') || getQueryParam('uidb64'))
const missingToken = computed(() => !token.value || !uid.value)

// Live validation computed props
const pwd = computed(() => (password.value ?? '').trim())
const pwd2 = computed(() => (passwordConfirm.value ?? '').trim())

const passwordTooShort = computed(() => pwd.value.length > 0 && pwd.value.length < 8)
const passwordsEmpty = computed(() => !pwd.value || !pwd2.value)
const passwordsMismatch = computed(() => !!pwd.value && !!pwd2.value && pwd.value !== pwd2.value)

// control when submit button is enabled
const canSubmit = computed(() => {
  return !loading.value
    && !missingToken.value
    && !passwordsEmpty.value
    && !passwordTooShort.value
    && !passwordsMismatch.value
})

// helpers
function clearError() { error.value = null }

// submit
async function onSubmit() {
  if (!canSubmit.value) {
    // покажем причину — если нужно, можно детальнее
    if (missingToken.value) error.value = 'Отсутствует token или uid в query-параметрах.'
    else if (passwordsEmpty.value) error.value = 'Заполните оба поля.'
    else if (passwordTooShort.value) error.value = 'Пароль должен содержать минимум 8 символов.'
    else if (passwordsMismatch.value) error.value = 'Пароли не совпадают.'
    return
  }

  clearError()
  loading.value = true

  try {
    const payload = { uid: uid.value, token: token.value, newPassword: pwd.value } // << отправляем newPassword - если бэкенд требует другое имя, поменяйте
    if (userStore && typeof userStore.resetPassword === 'function') {
      await userStore.resetPassword(payload)
    } else {
      await $fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
    }

    success.value = true
    password.value = ''
    passwordConfirm.value = ''

    // редирект (можно убрать)
    setTimeout(async () => await navigateTo({ path: '/' }), 1200)
  } catch (err) {
    error.value = err?.data?.message || err?.message || 'Ошибка при сбросе пароля. Проверьте ссылку или попробуйте позже.'
  } finally {
    loading.value = false
  }
}

async function onCancel() { await navigateTo({ path: '/' }) }
async function goToLogin() { await navigateTo({ path: '/profile' }) }

onMounted(() => {
  if (!missingToken.value) setTimeout(() => passwordInput.value?.focus(), 50)
})

// сбрасываем ошибки по мере ввода
watch([pwd, pwd2], () => {
  if (error.value) clearError()
})
</script>


<style scoped>
/* Простая стилизация, созвучная вашей модальной верстке */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  padding: 2rem;
}

.auth-card {
  width: 28rem;
  max-width: calc(100% - 2rem);
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1.25rem 3.125rem rgba(2,6,23,0.08);
}

.auth-title { margin: 0 0 0.5rem 0; font-size: 1.25rem; }
.auth-form { display: grid; gap: 0.5rem; }
.auth-field { display: flex; flex-direction: column; }
.auth-label { font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--gray); }
.auth-field input { padding: 0.625rem 0.75rem; border-radius: 0.5rem; border: 0.0625rem solid #e6eef5; }

.auth-actions { display: flex; gap: 0.625rem; justify-content: flex-end; margin-top: 0.375rem; }

.button--primary { background: var(--primary); color: #fff; border: none; padding: 0.5rem 0.75rem; border-radius: 0.375rem; cursor: pointer; }
.button {  border: none; padding: 0.5rem 0.75rem; border-radius: 0.375rem; cursor: pointer; }

.auth-error { background: #fff5f5; color: #a00; border: 1px solid rgba(170,0,0,0.08); padding: 0.5rem; border-radius: 0.375rem; font-size: 0.9rem; }
.auth-success { background: #f6ffef; color: #1f6a2b; border: 1px solid rgba(20,120,60,0.08); padding: 0.5rem; border-radius: 0.375rem; font-size: 0.95rem; }

.auth-hint { margin-top: 0.75rem; font-size: 0.85rem; color: var(--gray); }
.button[disabled] { opacity: 0.6; cursor: not-allowed; pointer-events: auto; } /* pointer-events:auto, т.к. disabled уже блокирует клики */
.auth-field__hint {
  color: red;
  margin-top: 0.5rem;
}
</style>
