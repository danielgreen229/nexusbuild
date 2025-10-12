<template>
  <div class="submit__container">
    <p>На вашу почту отправлено письмо.</p>
    <p>Пожалуйста, перейдите по ссылке в письме, чтобы подтвердить email.</p>

    <div class="big-email__container">
      <BigEmail class="big-email" />
    </div>

    <div class="resend-container" aria-live="polite">
      <p class="hint">Если письмо не пришло — вы можете отправить его повторно.</p>

      <div class="buttons">
        <button
          class="btn resend"
          :disabled="loading"
          @click="resend"
          title="Переотправить письмо используя uid"
        >
          {{ loading ? 'Отправка...' : 'Отправить письмо заново' }}
        </button>
      </div>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
  <PortfolioCTA />
</template>

<script>
import PortfolioCTA from '@/components/portfolio/PortfolioCTA.vue'
import BigEmail from '~/assets/icons/big-email.svg'
import { useUserStore } from '~/stores/user'

export default {
  components: { PortfolioCTA, BigEmail },
  data() {
    return {
      loading: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  computed: {
    // теперь только по uid
    hasUid() {
      const store = useUserStore()
      const uid = store.uid || localStorage.getItem('uid')
      return Boolean(uid)
    }
  },
  mounted() {
    // подтягиваем uid (и token если нужно) из localStorage в стор (без логина)
    const store = useUserStore()
    if (typeof store.initFromStorage === 'function') {
      store.initFromStorage()
    }
  },
  methods: {
    async resend() {
      this.loading = true
      this.successMessage = ''
      this.errorMessage = ''

      const store = useUserStore()

      try {
        // требуем только uid
        const uid = store.uid || localStorage.getItem('uid')
        if (!uid) {
          this.errorMessage = 'Повторная отправка невозможна. Обратитесь в поддержку.'
          return
        }

        // Попытка вызвать экшен стора несколькими вариантами, чтобы быть совместимым с разными реализациями

        if (typeof store.sendTokenEmail === 'function') {
          try {
            await store.sendTokenEmail({uid: uid})
          } catch (callErr) {
            console.log(callErr)
          	throw new Error('Ошибка отправки письма')  
          }
        } else {
          throw new Error('Действие для повторной отправки не найдено в сторе.')
        }

        this.successMessage = 'Письмо отправлено повторно. Проверьте почту (включая папку Спам).'
      } catch (err) {
        // аккуратно читаем сообщение ошибки
        if (err && err.response && err.response.data && err.response.data.message) {
          this.errorMessage = err.response.data.message
        } else if (err && err.message) {
          this.errorMessage = err.message
        } else {
          this.errorMessage = 'Ошибка при отправке письма'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.resend-container {
  margin-top: 12rem; /* чтобы блок не налезал на иконку */
  text-align: center;
  padding: 1rem;
}
.hint {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #444;
}

.email-input {
  margin: 0.5rem auto;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.email-input input {
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.buttons {
  margin-top: 0.75rem;
}
.btn {
  padding: 0.65rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn.resend {
  background: #2663eb;
  color: white;
  border-radius: 0.5rem;
  font-weight: bold;
}

.success {
  color: #116530;
  margin-top: 0.75rem;
}
.error {
  color: #9b2c2c;
  margin-top: 0.75rem;
}
</style>

<style>
.big-email__container {
    width: 10rem;
    height: 12rem;
    transform: translateX(-50%);
    left: 50%;
    position: absolute;
    margin-top: 0rem;
}
.big-email, .big-email * {
	fill: revert-layer;
	width: 100%;
	height: 100%;
}
</style>
<style scoped>
.submit__container {
	max-width: 1800px;
	margin: auto;
	padding: 20px 20px;
	margin-top: 5rem;
	min-height: 70vh;
}
.submit__container p {
	font-size: 1.5rem;
	text-align: center;
}
</style>
