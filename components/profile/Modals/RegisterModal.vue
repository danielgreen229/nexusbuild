<template>
  <transition name="modal-fade">
    <div
      v-if="visible"
      class="modal-overlay"
      @click.self="close"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal" ref="modal" tabindex="-1">
        <button class="modal__close" @click="close" aria-label="Закрыть">✕</button>

        <h3 class="modal__title">Создать пользователя</h3>

        <form class="modal__form" @submit.prevent="submit">
          <!-- ФИО -->
          <label class="modal__field">
            <span class="modal__label">ФИО</span>
            <input v-model="fullname" type="text" required autocomplete="name" :disabled="loading" />
          </label>

          <!-- Город -->
          <label class="modal__field">
            <span class="modal__label">Город</span>
            <input v-model="city" type="text" required autocomplete="address-level2" :disabled="loading" />
          </label>

          <!-- Телефон -->
          <label class="modal__field">
            <span class="modal__label">Телефон</span>
            <client-only>
              <VueTelInput
                v-model="phone"
                :default-country="'RU'"
                :disabled="loading"
                placeholder="+7 ___ ___ __ __"
                @input="onPhoneInput"
              />
            </client-only>
            <div v-if="phoneError" class="field-error">{{ phoneError }}</div>
          </label>

          <!-- Логин -->
          <label class="modal__field">
            <span class="modal__label">Логин</span>
            <input v-model="username" type="text" required autocomplete="username" :disabled="loading" />
          </label>

          <!-- Электронная почта -->
          <label class="modal__field">
            <span class="modal__label">Электронная почта</span>
            <input v-model="email" type="email" required autocomplete="email" :disabled="loading" />
          </label>

          <!-- Пароль -->
          <label class="modal__field">
            <span class="modal__label">Пароль</span>
            <input v-model="password" type="password" required autocomplete="new-password" :disabled="loading" />
          </label>

          <!-- Действия -->
          <div class="modal__actions">
            <button type="submit" class="button button--primary" :disabled="loading">
              <span v-if="!loading">Создать</span>
              <span v-else>Создание...</span>
            </button>
            <button type="button" class="button" @click="close" :disabled="loading">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import 'vue3-tel-input/dist/vue3-tel-input.css'
import { VueTelInput } from 'vue3-tel-input'
import { useUserStore } from '~/stores/user'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])

const store = useUserStore()

const fullname = ref('')
const city = ref('')
const phone = ref('')
const phoneError = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const modal = ref(null)

function onPhoneInput(value) {
  if (typeof value === 'string') {
    const digits = value.replace(/\D/g, '')
    if (!digits.startsWith('7') || digits.length !== 11) {
      phoneError.value = 'Введите корректный российский номер (+7)'
    } else {
      phoneError.value = ''
      phone.value = digits
    }
  }
}

function close() {
  if (loading.value) return
  emit('update:visible', false)
}

function resetForm() {
  fullname.value = ''
  city.value = ''
  phone.value = ''
  phoneError.value = ''
  username.value = ''
  email.value = ''
  password.value = ''
}

async function submit() {
  if (loading.value) return
  if (!phone.value.startsWith('7') || phone.value.length !== 11) {
    phoneError.value = 'Пожалуйста, введите российский номер (+7).'
    return
  }

  loading.value = true
  try {
    await store.register({
      fullname: fullname.value,
      city: city.value,
      phone: phone.value,
      username: username.value,
      email: email.value,
      password: password.value
    })
    close()
    resetForm()
  } catch (err) {
    console.log(store.error || 'Ошибка при регистрации')
  } finally {
    loading.value = false
  }
}

// Escape / focus
function onEsc() { close() }
watch(() => props.visible, async (v) => {
  if (v) { await nextTick(); setTimeout(() => modal.value?.focus(), 50) }
})
function onKeydown(e) { if (e.key === 'Escape') onEsc() }
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>





<style scoped>
.vue-tel-input:focus-within {
	box-shadow: none;	
	border-radius: 0.5rem;
	border: 0.12rem solid var(--primary);
}
.vti__input {
	border-radius: 0.5rem;
}
.vue-tel-input {
	border: 0.12rem solid #e6eef5;
	border-radius: 0.5rem;
}
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1200; }
.modal { width: 26.25rem; max-width: calc(100% - 2.5rem); background: #fff; border-radius: 0.5rem; padding: 1rem; box-shadow: 0 1.25rem 3.125rem rgba(2,6,23,0.25); outline: none; position: relative; }
.modal__close { position: absolute; right: 1rem; top: 1rem; background: none; border: none; font-size: 1rem; cursor: pointer; }
.modal__title { margin: 0 0 0.5rem 0; font-size: 1.25rem; }
.modal__form { display: grid; gap: 0.5rem; }
.modal__field { display: flex; flex-direction: column; }
.modal__label { font-size: 0.85rem; margin-bottom: 0.375rem; color: var(--gray); }
.modal__field input { padding: 0.625rem 0.75rem; border-radius: 0.5rem; border: 0.0625rem solid #e6eef5; }
.field-error { color: #ef4444; font-size: 0.8rem; margin-top: 0.375rem; }
.modal__actions { display: flex; gap: 0.625rem; justify-content: flex-end; margin-top: 0.375rem; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
