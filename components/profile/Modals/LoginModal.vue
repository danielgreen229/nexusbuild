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

          <h3 class="modal__title">Вход в аккаунт</h3>

          <form class="modal__form" @submit.prevent="submit">
            <div v-if="error" class="modal__error" role="alert">{{ error }}</div>

            <label class="modal__field">
              <span class="modal__label">Электронная почта</span>
              <input
                ref="emailInput"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                :disabled="loading"
              />
            </label>

            <label class="modal__field">
              <span class="modal__label">Пароль</span>
              <input
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                :disabled="loading"
              />
            </label>

            <div class="modal__links">
              <button
                type="button"
                class="button button--link"
                @click="onForgotPassword"
                :disabled="loading"
              >
                Забыли пароль?
              </button>

              <button
                type="button"
                class="button button--link"
                @click="onCreateUser"
                :disabled="loading"
              >
                Создать пользователя
              </button>
            </div>

            <div class="modal__actions">
              <button type="submit" class="button button--primary" :disabled="loading">
                <span v-if="!loading">Войти</span>
                <span v-else>Вход...</span>
              </button>

              <button type="button" class="button" @click="close" :disabled="loading">Отмена</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Встроенная регистрация: если родитель не подключил RegisterModal — она откроется отсюда -->
    <RegisterModal
      v-model:visible="isRegisterOpen"
      @register="onRegistered"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'
import RegisterModal from './RegisterModal.vue'
import { useUserStore } from '@/stores/user' // путь к стору — при необходимости поправь

const props = defineProps({
  visible: { type: Boolean, default: false },
  startWithRegister: { type: Boolean, default: false } // новый проп
})
const emit = defineEmits(['update:visible', 'login', 'create-user', 'forgot-password', 'register'])

const userStore = useUserStore()

const email = ref('')
const password = ref('')
const modal = ref(null)
const emailInput = ref(null)
const isRegisterOpen = ref(false)

// Используем состояние и ошибки из стора
const loading = computed(() => !!userStore.loading)
const error = computed(() => userStore.error)

function close() {
  if (loading.value) return
  emit('update:visible', false)
}

async function submit() {
  if (loading.value) return

  // Подготовим полезную полезную нагрузку, которую ожидает ваш API
  const payload = {
    email: (email.value || '').trim(),
    password: password.value
  }

  try {
    // Вызов action'а login стора
    await userStore.login(payload)

    // После успешного логина: пробросим событие и закроем модалку
    emit('login', userStore.user)
    emit('update:visible', false)

    // Сброс полей
    email.value = ''
    password.value = ''
  } catch (err) {
    // Ошибка уже лежит в userStore.error — форма показывает её через computed
    // Можно дополнительно логировать или показывать нативный toast
    // console.error(err)
  }
}

function openRegisterFromLogin() {
  // Повторяем поведение onCreateUser: закрываем логин и открываем встроенную регистрацию
  if (loading.value) return
  emit('create-user')
  emit('update:visible', false)
  // Небольшая задержка, чтобы анимации не наслаивались
  setTimeout(() => { isRegisterOpen.value = true }, 60)
}

function onCreateUser() {
  if (loading.value) return
  openRegisterFromLogin()
}

function onForgotPassword() {
  if (loading.value) return
  emit('forgot-password')
  emit('update:visible', false)
}

function onEsc() { close() }

function onRegistered(user) {
  emit('register', user)
  // при желании автоматически логинить — оставлено комментом
  // userStore.login({ email: user.email, password: user.password })
}

// Фокус при открытии — используем nextTick как раньше.
// Если пришёл флаг startWithRegister и модалка открывается — сразу переключаем на регистрацию
watch(() => props.visible, async (v) => {
  if (v) {
    await nextTick()
    if (props.startWithRegister) {
      // сразу открываем регистрацию вместо показа логина
      openRegisterFromLogin()
    } else {
      setTimeout(() => emailInput.value?.focus(), 50)
    }
  }
})

// Если компонент уже открыт на маунте и проп startWithRegister true — тоже откроем регистрацию
onMounted(() => {
  if (props.visible && props.startWithRegister) {
    // небольшой nextTick и таймаут для согласованности с анимацией
    nextTick(() => setTimeout(() => openRegisterFromLogin(), 20))
  }
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

// Доп. обработка клавиш
function onKeydown(e) {
  if (e.key === 'Escape') onEsc()
}
</script>

<style scoped>
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

.modal__actions { display: flex; gap: 0.625rem; justify-content: flex-end; margin-top: 0.375rem; }
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

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
