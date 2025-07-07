<script setup>
import { ref } from 'vue'

const name = ref('')
const contact = ref('')
const message = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)

const submitForm = () => {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true
    setTimeout(() => {
      isSubmitted.value = false
      name.value = ''
      contact.value = ''
      message.value = ''
    }, 5000)
  }, 1500)
}
</script>

<template>
  <section class="leadform">
    <div class="leadform__container container">
      <div class="leadform__header">
        <h2 class="leadform__title">Закажи сайт</h2>
        <p class="leadform__subtitle">Оставь заявку и получи коммерческое предложение в течение дня</p>
      </div>
      
      <div class="leadform__content">
        <div class="leadform__benefits">
          <div class="leadform-benefit">
            <div class="leadform-benefit__icon">🚀</div>
            <div class="leadform-benefit__content">
              <h3 class="leadform-benefit__title">Скорость</h3>
              <p class="leadform-benefit__desc">Лендинг за 3 дня, магазин за неделю</p>
            </div>
          </div>
          
          <div class="leadform-benefit">
            <div class="leadform-benefit__icon">💸</div>
            <div class="leadform-benefit__content">
              <h3 class="leadform-benefit__title">Без предоплаты</h3>
              <p class="leadform-benefit__desc">Оплата после принятия макета</p>
            </div>
          </div>
          
          <div class="leadform-benefit">
            <div class="leadform-benefit__icon">🛡️</div>
            <div class="leadform-benefit__content">
              <h3 class="leadform-benefit__title">Гарантия</h3>
              <p class="leadform-benefit__desc">Исправляем баги год бесплатно</p>
            </div>
          </div>
        </div>
        
        <div class="leadform__form">
          <div v-if="isSubmitted" class="leadform-success">
            <h3 class="leadform-success__title">Заявка отправлена!</h3>
            <p class="leadform-success__text">
              Скоро свяжемся с тобой. А пока можешь написать в Telegram для быстрого ответа:
            </p>
            <a 
              href="https://t.me/dozer_stoun" 
              class="button button--primary leadform-success__link"
              target="_blank"
            >
              ✈️ Написать в Telegram
            </a>
          </div>
          
          <form v-else @submit.prevent="submitForm" class="leadform-form">
            <div class="leadform-form__group">
              <input 
                type="text" 
                v-model="name"
                class="leadform-form__input"
                placeholder="Как тебя зовут?"
                required
              >
            </div>
            
            <div class="leadform-form__group">
              <input 
                type="text" 
                v-model="contact"
                class="leadform-form__input"
                placeholder="Телефон или Telegram"
                required
              >
            </div>
            
            <div class="leadform-form__group">
              <textarea 
                v-model="message"
                class="leadform-form__textarea"
                placeholder="Опиши кратко задачу..."
                rows="3"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              class="button button--primary button--lg leadform-form__button"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">Отправляем...</span>
              <span v-else>Получить предложение</span>
            </button>
            
            <div class="leadform-form__note">
              Нажимая кнопку, соглашаешься с нашей 
              <a href="#" class="leadform-form__link">политикой конфиденциальности</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.leadform {
  padding: 100px 0;
  background-color: #f9fafb;
}

.leadform__container {
  position: relative;
  z-index: 1;
}

.leadform__header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
}

.leadform__title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: var(--dark);
  font-weight: 700;
}

.leadform__subtitle {
  font-size: 1.2rem;
  color: var(--gray);
  margin-top: 10px;
}

.leadform__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.leadform__benefits {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 0;
}

.leadform-benefit {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.leadform-benefit__icon {
  font-size: 2.5rem;
  line-height: 1;
  min-width: 50px;
  color: var(--primary);
}

.leadform-benefit__title {
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: var(--dark);
  font-weight: 600;
}

.leadform-benefit__desc {
  color: var(--gray);
  line-height: 1.6;
}

.leadform__form {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid #e5e7eb;
}

.leadform-form__group {
  margin-bottom: 25px;
}

.leadform-form__input,
.leadform-form__textarea {
  width: 100%;
  padding: 16px 20px;
  border: 1px solid #e2e8f0;
  background: white;
  color: var(--dark);
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.leadform-form__input:focus,
.leadform-form__textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.leadform-form__input::placeholder,
.leadform-form__textarea::placeholder {
  color: #94a3b8;
}

.leadform-form__textarea {
  resize: vertical;
  min-height: 120px;
}

.leadform-form__button {
  width: 100%;
  padding: 16px;
  font-size: 1.1rem;
  margin-top: 10px;
  font-weight: 600;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.leadform-form__button:hover {
  background: var(--primary-dark);
}

.leadform-form__note {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--gray);
}

.leadform-form__link {
  color: var(--primary);
  text-decoration: none;
}

.leadform-form__link:hover {
  text-decoration: underline;
}

.leadform-success {
  text-align: center;
  padding: 30px;
}

.leadform-success__title {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: var(--primary);
  font-weight: 700;
}

.leadform-success__text {
  color: var(--gray);
  margin-bottom: 25px;
  line-height: 1.6;
  font-size: 1.1rem;
}

.leadform-success__link {
  display: inline-block;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.leadform-success__link:hover {
  background: var(--primary-dark);
}

@media (max-width: 992px) {
  .leadform__content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .leadform__benefits {
    padding: 0;
  }
}

@media (max-width: 576px) {
  .leadform {
    padding: 60px 0;
  }
  
  .leadform__header {
    margin-bottom: 40px;
  }
  
  .leadform__title {
    font-size: 2rem;
  }
  
  .leadform__form {
    padding: 25px;
  }
  
  .leadform-benefit {
    gap: 15px;
  }
  
  .leadform-benefit__icon {
    font-size: 2rem;
  }
}
</style>