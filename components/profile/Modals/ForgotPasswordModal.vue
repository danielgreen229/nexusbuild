<template>
  <div>
    <transition name="modal-fade">
      <div
        v-if="visible"
        class="modal-overlay"
        @click.self="close"
        role="dialog"
        aria-modal="true"
        @keydown.esc.prevent="onEsc"
      >
        <div class="modal" ref="modal" tabindex="-1">
          <button class="modal__close" @click="close" aria-label="Закрыть">✕</button>

          <h3 class="modal__title">Восстановление пароля</h3>

          <form class="modal__form" @submit.prevent="submit">
            <div v-if="displayError" class="modal__error" role="alert">{{ displayError }}</div>

            <div v-if="!success">
              <label class="modal__field">
                <span class="modal__label">Электронная почта</span>
                <input
                  ref="emailInput"
                  v-model="email"
                  type="email"
                  required
                  autocomplete="email"
                  :disabled="loading"
                  @input="clearLocalError"
                />
              </label>

              <div class="modal__actions">
                <button
                  type="submit"
                  class="button button--primary"
                  :disabled="loading || !isEmailValid"
                >
                  <span v-if="!loading">Отправить ссылку</span>
                  <span v-else>Отправка...</span>
                </button>

                <button type="button" class="button" @click="close" :disabled="loading">Отмена</button>
              </div>
            </div>

            <div v-else class="modal__success" role="status" aria-live="polite">
              <p>Мы отправили письмо с инструкцией по восстановлению пароля на <strong>{{ email }}</strong> (проверьте папку «Спам»).</p>

              <div class="modal__actions">
                <button type="button" class="button button--primary" @click="close">Закрыть</button>
                <button type="button" class="button" @click="onBackToLogin">Вернуться к входу</button>
              </div>

              <div class="modal__links" style="margin-top:0.5rem;">
                <button type="button" class="button button--link" @click="resend" :disabled="loading">Отправить снова</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import { useUserStore } from '@/stores/user' // поправь путь если нужно

const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'back-to-login', 'create-user', 'password-reset-requested'])

const userStore = useUserStore()

const email = ref('')
const modal = ref(null)
const emailInput = ref(null)
const success = ref(false)
const localError = ref(null)

// вычисляемые состояния
const loading = computed(() => !!userStore.loading)
const storeError = computed(() => userStore.error)
const displayError = computed(() => localError.value || storeError.value || null)

// Простая проверка email (не обязательна, но полезна UX)
const isEmailValid = computed(() => {
  const val = (email.value || '').trim()
  // простой regex — достаточно для клиентской валидации
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
})

function clearLocalError() {
  localError.value = null
  // не трогаем userStore.error — оно очищается при закрытии или при следующем успешном запросе в сторе
}

function clearAllErrors() {
  localError.value = null
  try { userStore.error = null } catch (e) { /* если store защищён — игнорируем */ }
}

function close() {
  if (loading.value) return
  clearAllErrors()
  success.value = false
  emit('update:visible', false)
}

async function submit() {
  if (loading.value) return
  clearLocalError()
  success.value = false

  const raw = (email.value || '').trim()
  if (!raw) {
    localError.value = 'Введите, пожалуйста, электронную почту.'
    return
  }
  if (!isEmailValid.value) {
    localError.value = 'Введите, пожалуйста, корректный адрес электронной почты.'
    return
  }

  try {
    // Используем метод из store: sendResetPassword({ email })
    await userStore.sendResetPassword({ email: raw })
    // Если сюда попали — запрос успешен
    success.value = true
    emit('password-reset-requested', raw)
  } catch (err) {
    // Ошибка уже установлена в userStore.error (store) — показываем её через computed displayError
    // Если нужно — можно выставить локальную подсказку:
    if (!userStore.error) {
      localError.value = err?.message || 'Не удалось отправить письмо'
    }
  }
}

async function resend() {
  if (loading.value) return
  // оставляем email прежним
  await submit()
}

function onBackToLogin() {
  if (loading.value) return
  clearAllErrors()
  // НЕ закрываем модалку — внешний обработчик покажет логин
  emit('back-to-login')
  success.value = false
}

function onCreateUser() {
  if (loading.value) return
  clearAllErrors()
  emit('create-user')
}

function onEsc() { close() }

watch(() => props.visible, async (v) => {
  if (v) {
    clearAllErrors()
    success.value = false
    await nextTick()
    // небольшой таймаут чтобы гарантированно сфокусировать
    setTimeout(() => emailInput.value?.focus(), 50)
  }
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

function onKeydown(e) {
  if (e.key === 'Escape') onEsc()
}
</script>

<style scoped>
/* оставил твои стили без изменений */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}

.modal {
  width: 26.25rem; /* 420px */
  max-width: calc(100% - 2.5rem);
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1.25rem 3.125rem rgba(2,6,23,0.25);
  outline: none;
  position: relative;
}

.modal__close {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.modal__title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.modal__form { display: grid; gap: 0.5rem; }
.modal__field { display: flex; flex-direction: column; }
.modal__label { font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--gray); }
.modal__field input { padding: 0.625rem 0.75rem; border-radius: 0.5rem; border: 0.0625rem solid #e6eef5; }

.modal__actions { display: flex; gap: 0.625rem; justify-content: flex-end; margin-top: 2rem; }
.modal__links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.button--link {
  background: none;
  border: none;
  color: var(--primary);
  padding: 0;
  font-weight: 100;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
}

.modal__error {
  background: #fff5f5;
  color: #a00;
  border: 1px solid rgba(170,0,0,0.08);
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.9rem;
}

.modal__success {
  background: #f6fffa;
  color: #064e3b;
  border: 1px solid rgba(6,78,59,0.08);
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.95rem;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
