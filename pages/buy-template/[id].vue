<template>
  <div class="buy__container">
    <div class="wrapper">
      <!-- LEFT: информация о шаблоне и доступные опции -->
      <section class="card card__container">
        <div class="card__left">
          <h1 class="title">Сайт "{{ template.title }}"</h1>
          <div class="extras">
            <h3>Дополнительные опции</h3>

            <label class="addon">
              <input type="checkbox" v-model="addons.priority.enabled" />
              Приоритетная доработка — {{ formatCurrency(addons.priority.price) }}
            </label>

            <label class="addon">
              <input type="checkbox" v-model="addons.hosting.enabled" />
              Подключение и хостинг — {{ formatCurrency(addons.hosting.price) }}
            </label>
          </div>

          <div class="preview-link" v-if="template.preview">
            <a :href="template.preview" target="_blank" rel="noopener">Открыть демо (preview)</a>
          </div>
        </div>
        <div class="card__right">
          <div class="meta">
            <span class="price">{{ formatCurrency(template.price) }}</span>
          </div>
        </div>
      </section>

      <!-- RIGHT: корзина / заказ -->
      <aside class="card sidebar">
        <h2>Ваш заказ</h2>

        <div class="order-lines">
          <div class="line">
            <span>Базовая цена</span>
            <span>{{ formatCurrency(basePrice) }}</span>
          </div>

          <div class="line" v-if="addons.priority.enabled">
            <span>Приоритет</span>
            <span>{{ formatCurrency(addons.priority.price) }}</span>
          </div>

          <div class="line" v-if="addons.hosting.enabled">
            <span>Подключение / хостинг</span>
            <span>{{ formatCurrency(addons.hosting.price) }}</span>
          </div>

          <hr />

          <div class="line">
            <strong>Промежуточная сумма</strong>
            <strong>{{ formatCurrency(subtotal) }}</strong>
          </div>

          <div class="line discount" v-if="appliedDiscount > 0">
            <span>Скидка {{ discountLabel }}</span>
            <span>-{{ formatCurrency(appliedDiscount) }}</span>
          </div>

          <div class="line total">
            <strong>Итого</strong>
            <strong>{{ formatCurrency(total) }}</strong>
          </div>
        </div>

        <div class="order-actions">
          <template v-if="isAuthenticated">
            <label class="input">
              ФИО:
              <div class="readonly-field" aria-live="polite">{{ userInfo.fullname || '—' }}</div>
            </label>
            <label class="input">
              Телефон:
              <div class="readonly-field" aria-live="polite">{{ userInfo.phone || '—' }}</div>
            </label>
            <label class="input">
              Почта:
              <div class="readonly-field" aria-live="polite">{{ userInfo.email || '—' }}</div>
            </label>
          </template>


          <template v-else>
            <div class="login-row">
              Необходимо 
              <button class="btn-link" @click="openLogin">Войти</button>
              или
              <button class="btn-link" @click="openRegister">Зарегистрироваться</button>
            </div>
          </template>

          <button class="btn primary" :disabled="placing || !isAuthenticated" @click="placeOrder">
            {{ placing ? 'Оформление…' : 'Оформить заказ' }}
          </button>

          <div class="note" aria-live="polite">
            <small>
              Нажимая «Оформить заказ», вы соглашаетесь с
              <a @click="openInNewTab('/terms')">условиями оферты</a>
              и
              <a @click="openInNewTab('/privacy')">политикой конфиденциальности</a>.
            </small>
          </div>
        </div>
      </aside>
    </div>

    <LoginModal 
      v-model:visible="isLoginModalOpen" 
      @login="onLoginEvent" 
      :startWithRegister="startWithRegister"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplateStore } from '~/stores/template'
import { useUserStore } from '~/stores/user'
import LoginModal from '~/components/profile/Modals/LoginModal.vue'

const items = ref([
  { label: 'Главная', to: '/' },
  { label: 'Шаблоны', to: '/templates' }
])

const route = useRoute()
const router = useRouter()
const store = useTemplateStore()
const userStore = useUserStore()
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isLoginModalOpen = ref(false)
const startWithRegister = ref(false)

const id = route.params.id

onMounted(async () => {
  if (id) {
    try {
      await store.getTemplateById(id)
    } catch (e) {
      // error stored in store
    }
  }

  // Инициализация userStore, если есть init
  if (typeof userStore.init === 'function') {
    try {
      await userStore.init()
    } catch (e) {
      // ignore
    }
  }
})

function openLogin () {
  startWithRegister.value = false
  isLoginModalOpen.value = true
}

function openRegister () {
  startWithRegister.value = true
  isLoginModalOpen.value = true
}

function onMobileLogin() {
  isLoginModalOpen.value = true
  closeMobileMenu()
}

function onLoginEvent(userData) {
  isLoginModalOpen.value = false
  isUserMenuOpen.value = false
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

function closeUserMenu() {
  isUserMenuOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function logout() {
  userStore.logout()
  isUserMenuOpen.value = false
  // После логаута можно перенаправить на главную или профиль
  //router.push('/')
}

function openInNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const template = computed(() => store.current || {
  id: null, title: '', price: 0, image: '', description: '', features: [], pages: [], technologies: [], screenshots: [], preview: '', discount_percent: 0, discount_amount: 0
})

const basePrice = computed(() => Number(template.value.price || 0))

const addons = ref({
  extraPage: { enabled: false, price: 1000, count: 0 },
  customization: { enabled: false, pricePerHour: 500, hours: 0 },
  priority: { enabled: false, price: 1000 },
  hosting: { enabled: false, price: 1000 }
})

const selectedPages = ref([])

onMounted(() => {
  if (template.value.pages && template.value.pages.length) {
    selectedPages.value = [...template.value.pages]
  }
})

watch(() => template.value.pages, (pages) => {
  if (pages && selectedPages.value.length === 0) {
    selectedPages.value = [...pages]
  }
})

// NOTE: buyer fields removed from UI when not authenticated, but we keep a small object
// to form the order for authenticated users (filled from userStore)
const buyer = ref({ name: '', contact: '' })
const placing = ref(false)

const selectedPagesCount = computed(() => selectedPages.value.length)

const extraPagesCost = computed(() => {
  const c = Number(addons.value.extraPage.count || 0)
  const price = Number(addons.value.extraPage.price || 0)
  return (addons.value.extraPage.enabled && c > 0) ? (c * price) : 0
})

const customizationCost = computed(() => {
  const h = Number(addons.value.customization.hours || 0)
  const rate = Number(addons.value.customization.pricePerHour || 0)
  return (addons.value.customization.enabled && h > 0) ? (h * rate) : 0
})

const priorityCost = computed(() => addons.value.priority.enabled ? Number(addons.value.priority.price || 0) : 0)
const hostingCost = computed(() => addons.value.hosting.enabled ? Number(addons.value.hosting.price || 0) : 0)

const subtotal = computed(() => {
  const parts = [
    basePrice.value,
    extraPagesCost.value,
    customizationCost.value,
    priorityCost.value,
    hostingCost.value
  ]
  return parts.reduce((acc, v) => acc + Number(v || 0), 0)
})

const appliedDiscount = computed(() => {
  const discAmount = Number(template.value.discount_amount || 0)
  const discPercent = Number(template.value.discount_percent || 0)

  if (discAmount > 0) return Math.min(discAmount, subtotal.value)
  if (discPercent > 0) return Math.min(Math.round((subtotal.value * discPercent) / 100), subtotal.value)
  return 0
})

const discountLabel = computed(() => {
  const discAmount = Number(template.value.discount_amount || 0)
  const discPercent = Number(template.value.discount_percent || 0)
  if (discAmount > 0) return `${formatCurrency(discAmount)}`
  if (discPercent > 0) return `${discPercent}%`
  return ''
})

const total = computed(() => {
  const t = subtotal.value - appliedDiscount.value
  return t > 0 ? t : 0
})

function formatCurrency(value) {
  try {
    const v = Number(value || 0)
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(Math.round(v))
  } catch (e) {
    return `${value} ₽`
  }
}

function resetSelections() {
  addons.value.extraPage.enabled = false
  addons.value.extraPage.count = 0
  addons.value.customization.enabled = false
  addons.value.customization.hours = 0
  addons.value.priority.enabled = false
  addons.value.hosting.enabled = false
  selectedPages.value = template.value.pages ? [...template.value.pages] : []
  buyer.value = { name: '', contact: '' }
}

async function placeOrder() {
  // Требуем, чтобы пользователь был залогинен — иначе перенаправляем на страницу логина
  if (!isAuthenticated.value) {
    // Можно показать уведомление и/или перейти на страницу логина
    router.push({ path: '/login' })
    return
  }

  // Собираем данные покупателя из userStore
  const orderBuyer = {
    name: userName.value || '',
    contact: userContact.value || ''
  }

  placing.value = true
  try {
    const order = {
      templateId: template.value.id,
      templateTitle: template.value.title,
      basePrice: basePrice.value,
      extras: {
        extraPages: addons.value.extraPage.enabled ? { count: addons.value.extraPage.count, unitPrice: addons.value.extraPage.price } : null,
        customization: addons.value.customization.enabled ? { hours: addons.value.customization.hours, rate: addons.value.customization.pricePerHour } : null,
        priority: addons.value.priority.enabled ? { price: addons.value.priority.price } : null,
        hosting: addons.value.hosting.enabled ? { price: addons.value.hosting.price } : null
      },
      subtotal: subtotal.value,
      discount: appliedDiscount.value,
      total: total.value,
      buyer: orderBuyer,
      selectedPages: selectedPages.value,
      created_at: new Date().toISOString()
    }

    console.log('ORDER', order)
    alert('Заявка отправлена!\nИтог: ' + formatCurrency(total.value))
    resetSelections()
  } catch (e) {
    console.error(e)
    alert('Ошибка при оформлении заказа')
  } finally {
    placing.value = false
  }
}

/* ---------------------------
   ПОДДЕРЖКА АВТОЗАПОЛНЕНИЯ ДЛЯ ЗАРЕГАННОГО ПОЛЬЗОВАТЕЛЯ
   --------------------------- */
const isAuthenticated = computed(() => !!userStore.isAuthenticated)

const userName = computed(() => {
  const u = userStore.user || {}
  if (u.name) return u.name
  const first = u.firstName || u.first_name || ''
  const last = u.lastName || u.last_name || ''
  const full = `${first} ${last}`.trim()
  return full || ''
})

const userContact = computed(() => {
  const u = userStore.user || {}
  return u.email || u.email_address || u.phone || u.telephone || u.mobile || ''
})

const userInfo = computed(() => {
  const u = userStore.user || {}
  return u
})

// при изменении статуса логина — обновляем локальные buyer, но поля ввода скрыты для гостей
watch(isAuthenticated, (val) => {
  if (val) {
    if (userName.value) buyer.value.name = userName.value
    if (userContact.value) buyer.value.contact = userContact.value
  }
})

function goToLogin() {
  router.push({ path: '/login' })
}
</script>

<style scoped>

/* Общие */
.buy__container {
  padding: 1rem;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #f8f9fb;
}

/* Обёртка с колонками */
.wrapper {
  width: 100%;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
	max-width: 1800px;
	margin: 0 auto;
}

/* Карточка */
.card {
  background: #ffffff;
  border: 0.0625rem solid #ececec;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.375rem rgba(0,0,0,0.04);
}

/* Основная колонка и сайдбар */
.sidebar { flex: 0 0 26rem; min-width: 18rem; max-height: calc(100vh - 4rem); overflow: auto; position: sticky; top: 1rem; }

.title { font-size: 1.25rem; margin: 0; line-height: 1.2; }
.meta { display:flex; justify-content:space-between; gap:0.75rem; color:#666666; margin-bottom:0.625rem; }
.price { font-weight:700; color:#111111; font-size:1rem; }

/* Блоки опций */
.extras { margin-top: 1rem; }
.addon { display:block; margin:0.5rem 0; font-size:0.95rem; }
.addon-ctrl { margin:0.375rem 0 0.75rem 1.25rem; }

/* Ссылки превью */
.preview-link { margin-top: 1rem; }
.preview-link a { font-size: 0.95rem; color: #0070f3; text-decoration: none; }

/* Корзина / линии */
.order-lines .line { display:flex; justify-content:space-between; align-items:center; padding:0.375rem 0; font-size:0.95rem; }
.order-lines hr { border: none; border-top: 0.0625rem solid #ececec; margin: 0.625rem 0; }
.total { font-size: 1.125rem; }

/* Формы и кнопки */
.input { display:block; margin: 0 0 1rem 0; font-size:0.95rem; }
.input input { width:100%; padding:0.5rem 0.625rem; border:0.0625rem solid #dddddd; border-radius:0.375rem; font-size:1rem; }

/* Стили для "readonly" отображения данных пользователя */
.readonly-field {
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 0.0625rem solid #e6e6e6;
  border-radius: 0.375rem;
  background: #fafafa;
  color: #111;
  font-size: 1rem;
  line-height: 1.2;
  min-height: 2.25rem;
  display: flex;
  align-items: center;
}

/* Текстовая кнопка "Войти" */
.btn-link {
  background: transparent;
  border: none;
  padding: 0;
  color: #0070f3;
  cursor: pointer;
  font-size: 0.95rem;
  text-decoration: underline;
}

.login-row {
  margin-bottom: 1rem;
}
/* order-actions */
.order-actions { margin-top: 0.875rem; display:flex; flex-direction:column; }
.btn { display:inline-flex; align-items:center; justify-content:center; padding:0.625rem 0.875rem; border-radius:0.5rem; border:none; cursor:pointer; font-size:1rem; }
.btn.primary { background:#0070f3; color:#fff; box-shadow: 0 0.125rem 0.375rem rgba(0,112,243,0.12); }
.btn.primary:disabled { opacity:0.6; cursor:not-allowed; }
.btn.ghost { background:transparent; border:0.0625rem solid #dddddd; }

/* Примечание */
.note { margin-top:0.75rem; color:#666666; font-size:0.875rem; }

/* Фокус для доступности */
input:focus, button:focus, a:focus { outline: 0.1875rem solid rgba(0,112,243,0.12); outline-offset: 0.125rem; }

.note {
  margin-top: 8px;
  text-align: left;
  color: #6b7280; 
}
.note small {
  font-size: 12px;
  line-height: 1.2;
}
.note a {
  text-decoration: underline;
  cursor: pointer;
}


.card__container {
  display: flex;
  width: 100%;
  gap: 0.5rem;
  align-items: flex-start;
}

.card__left {
  width: 100%;
}
.card__right {
  
}





/* Адаптив */
@media (max-width: 64rem) {
  .sidebar { flex: 0 0 22rem; }
}

@media (max-width: 48rem) {
  .wrapper { flex-direction: column; gap: 0.875rem; align-items: stretch; }
  .sidebar { position: relative; top: 0; flex: 1 1 auto; max-height: none; min-width: 0; }
  .btn { padding: 0.75rem 0.875rem; font-size: 1.05rem; }
  .input input { padding: 0.625rem 0.75rem; }
  .readonly-field { padding: 0.625rem 0.75rem; }
}

@media (max-width: 32rem) {
  .title { font-size: 1.125rem; }
}

/* Печать */
@media print {
  .sidebar { position: static; max-height: none; }
  .btn, input { box-shadow: none; outline: none; }
  .buy__container { background: #fff; padding: 0; }
}
</style>
