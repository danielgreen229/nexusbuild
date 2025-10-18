<template>
  <div class="buy__container">
    <div class="wrapper">
      <!-- LEFT: информация о шаблоне и доступные опции -->
      <section class="card card__container">
        <div class="card__left">
          <h1 class="title">Сайт "{{ template.title }}"</h1>
          <h3 class="card__h3">Дополнительные опции</h3>
          <div class="extras">
            <label class="addon custom-switch">
              <input type="checkbox" v-model="addons.priority.enabled" />
              <span class="switch-track" aria-hidden>
                <span class="switch-thumb" />
              </span>
              <span class="label-text">Приоритетная доработка — {{ formatCurrency(addons.priority.price) }}</span>
            </label>
          </div>

          <h3 class="card__h3 domain__h3">Выберите домен</h3>
          <div class="domain__container">
            <div class="domain-scroll__container">
              <!-- DomainFinder эмитит 'select-domain' -->
              <DomainFinder @select-domain="onDomainSelected" />
            </div>
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

          <!-- INPUT для промокода прямо под промежуточной суммой -->
          <div class="line" style="flex-direction:column; align-items:stretch; gap:0.5rem; padding-top:0.5rem;">
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <input
                v-model="promoCodeInput"
                @keyup.enter="onApplyPromo"
                :disabled="codesStore.loading"
                placeholder="Введите промокод"
                class="promocode__input"
                style="flex:1;"
                aria-label="Промокод"
              />
              <button
                class="btn primary"
                @click="onApplyPromo"
                :disabled="codesStore.loading || !promoCodeInput"
                title="Нажмите, чтобы проверить и применить промокод"
              >
                {{ codesStore.loading ? 'Обработка…' : 'Применить' }}
              </button>
            </div>

            <!-- Ошибка / подсказка -->
            <div v-if="promoError" class="note" style="color: #b91c1c; margin-top:0.25rem;">
              {{ promoError }}
            </div>

            <!-- Информация об успешном применении -->
            <div v-if="promoAppliedExists" class="note" style="color: #064e3b; margin-top:0.25rem;">
              Промокод «{{ appliedPromoCode }}» успешно применён — скидка {{ formatCurrency(appliedPromoDiscount) }}.
            </div>
          </div>

          <!-- Превью промокода (не применён) - показываем также как линию скидки -->
          <div class="line discount" v-if="promoPreviewExists && !promoAppliedExists">
            <span>Промокод: {{ promoPreviewCode || promoCodeInput }}</span>
            <span>-{{ formatCurrency(promoPreviewDiscount) }}</span>
          </div>

          <!-- Окончательно применённый промокод -->
          <div class="line discount" v-if="promoAppliedExists">
            <span>Промокод: {{ appliedPromoCode }}</span>
            <span>-{{ formatCurrency(appliedPromoDiscount) }}</span>
          </div>

          <!-- Существующая скидка шаблона -->
          <div class="line discount" v-if="templateDiscountAmount > 0">
            <span>Скидка шаблона {{ discountLabel }}</span>
            <span>-{{ formatCurrency(templateDiscountAmount) }}</span>
          </div>

          <!-- Выбранный домен -->
          <div class="line" v-if="selectedDomain">
            <span>Выбран домен</span>
            <span style="display:flex; gap:0.5rem; align-items:center;">
              <strong>{{ selectedDomain }}</strong>
              <button class="btn ghost" @click="clearSelectedDomain" title="Сбросить выбор домена">Сбросить</button>
            </span>
          </div>

          <!-- Подсказка если домен не выбран -->
          <div class="line" v-if="!selectedDomain" style="color:#6b7280;">
            <span>Домен не выбран</span>
            <span>Пожалуйста, выберите домен в левом блоке</span>
          </div>

          <div class="line total">
            <strong>Итого</strong>
            <strong>{{ formatCurrency(finalTotal) }}</strong>
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

          <!-- Кнопка доступна только если пользователь авторизован и выбран домен -->
          <button class="btn primary" :disabled="placing || !canPlaceOrder" @click="placeOrder">
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
import { useCodesStore } from '~/stores/promocodes'
import LoginModal from '~/components/profile/Modals/LoginModal.vue'
import DomainFinder from '@/components/domain/domain-finder.vue'

const route = useRoute()
const router = useRouter()
const store = useTemplateStore()
const userStore = useUserStore()
const codesStore = useCodesStore()

const isLoginModalOpen = ref(false)
const startWithRegister = ref(false)

const id = route.params.id

onMounted(async () => {
  if (id) {
    try { await store.getTemplateById(id) } catch (e) {}
  }
  if (typeof userStore.init === 'function') {
    try { await userStore.init() } catch (e) {}
  }
})

function openLogin () { startWithRegister.value = false; isLoginModalOpen.value = true }
function openRegister () { startWithRegister.value = true; isLoginModalOpen.value = true }
function onLoginEvent(userData) { isLoginModalOpen.value = false }

/* New: выбранный домен */
const selectedDomain = ref(null)

function onDomainSelected(domain) {
  // Сохраняем выбранный домен, можно логировать
  selectedDomain.value = domain
  console.log('Selected domain:', domain)
}

/* Позволяет отозвать выбор домена */
function clearSelectedDomain() {
  selectedDomain.value = null
}

/* Сохранил остальную логику как в оригинале */
const template = computed(() => store.current || {
  id: null, title: '', price: 0, image: '', description: '', pages: [], preview: '', discount_percent: 0, discount_amount: 0
})

const basePrice = computed(() => Number(template.value.price || 0))

const addons = ref({
  extraPage: { enabled: false, price: 1000, count: 0 },
  customization: { enabled: false, pricePerHour: 500, hours: 0 },
  priority: { enabled: false, price: 3000 },
  hosting: { enabled: false, price: 1000 }
})

const selectedPages = ref([])
onMounted(() => {
  if (template.value.pages && template.value.pages.length) selectedPages.value = [...template.value.pages]
})
watch(() => template.value.pages, (pages) => {
  if (pages && selectedPages.value.length === 0) selectedPages.value = [...pages]
})

const buyer = ref({ name: '', contact: '' })
const placing = ref(false)

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
  const parts = [ basePrice.value, extraPagesCost.value, customizationCost.value, priorityCost.value, hostingCost.value ]
  return parts.reduce((acc, v) => acc + Number(v || 0), 0)
})

/* скидка шаблона */
const templateDiscountAmount = computed(() => {
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

/* promo: preview и applied (store хранит data) */
const promoPreviewExists = computed(() => !!codesStore.preview)
const promoPreviewDiscount = computed(() => Number(codesStore.preview?.discount || 0))
const promoPreviewFinal = computed(() => Number(codesStore.preview?.finalAmount ?? subtotal.value))
const promoPreviewCode = computed(() => codesStore.preview?.code || promoCodeInput.value)

const promoAppliedExists = computed(() => !!codesStore.lastApplied)
const appliedPromoDiscount = computed(() => Number(codesStore.lastApplied?.discount || 0))
const appliedPromoCode = computed(() => codesStore.lastApplied?.code || '')

const promoDiscountEffective = computed(() => {
  // если промокод окончательно применён — используем его
  const applied = Number(appliedPromoDiscount.value || 0)
  const preview = Number(promoPreviewDiscount.value || 0)

  if (promoAppliedExists.value) {
    return Math.min(applied, subtotal.value)
  }

  // если есть превью (пользователь ещё не применил/неавторизован) — учитываем превью
  if (promoPreviewExists.value) {
    return Math.min(preview, subtotal.value)
  }

  return 0
})

const totalDiscount = computed(() => {
  const tpl = Number(templateDiscountAmount.value || 0)
  const promo = promoDiscountEffective.value || 0
  // итоговая скидка не должна превосходить промежуточную сумму
  return Math.min(tpl + promo, subtotal.value)
})

const finalTotal = computed(() => {
  const t = subtotal.value - totalDiscount.value
  // округлим и защитимся от отрицательных значений
  return t > 0 ? Math.round(t) : 0
})

function formatCurrency(value) {
  try {
    const v = Number(value || 0)
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(Math.round(v))
  } catch (e) { return `${value} ₽` }
}

/* ---------------------------
   Promo code UI state & handlers (объединённая кнопка "Применить")
   --------------------------- */
const promoCodeInput = ref('')
const promoError = ref(null)

// очищаем локальную ошибку при изменении кода/суммы
watch(promoCodeInput, () => { promoError.value = null })
watch(subtotal, () => { promoError.value = null })

async function onApplyPromo() {
  promoError.value = null
  const code = (promoCodeInput.value || '').trim()
  if (!code) {
    promoError.value = 'Введите код промокода'
    return
  }

  // 1) сначала preview (показываем результат даже если неавторизован)
  const previewRes = await codesStore.previewPromocode(code, subtotal.value, 'RUB')
  if (!previewRes.success) {
    promoError.value = previewRes.message || 'Промокод недействителен'
    return
  }
}

/* ---------------------------
   ОФОРМЛЕНИЕ ЗАКАЗА
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
  return u.email || u.email_address || u.phone || ''
})
const userInfo = computed(() => userStore.user || {})

/* Новое: разрешение на оформление — пользователь авторизован И выбран домен */
const canPlaceOrder = computed(() => {
  return isAuthenticated.value && !!selectedDomain.value
})

watch(isAuthenticated, (val) => {
  if (val) {
    if (userName.value) buyer.value.name = userName.value
    if (userContact.value) buyer.value.contact = userContact.value
  }
})

async function placeOrder() {
  if (!isAuthenticated.value) {
    router.push({ path: '/login' })
    return
  }

  if (!selectedDomain.value) {
    alert('Пожалуйста, выберите домен перед оформлением заказа.')
    return
  }

  const orderBuyer = { name: userName.value || '', contact: userContact.value || '' }

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
      domain: selectedDomain.value || null, // добавлено поле домена
      subtotal: subtotal.value,
      discount: totalDiscount.value,
      total: finalTotal.value,
      buyer: orderBuyer,
      selectedPages: selectedPages.value,
      promocode: codesStore.lastApplied ? { code: codesStore.lastApplied.code || null, redemptionId: codesStore.lastApplied.redemptionId || null } : null,
      created_at: new Date().toISOString()
    }

    console.log('ORDER', order)
    alert('Заявка отправлена!\nИтог: ' + formatCurrency(finalTotal.value))
    resetSelections()
  } catch (e) {
    console.error(e)
    alert('Ошибка при оформлении заказа')
  } finally {
    placing.value = false
  }
}

/* ---------------------------
   Автозаполнение покупателя / пользователь
   --------------------------- */
function resetSelections() {
  addons.value.extraPage.enabled = false
  addons.value.extraPage.count = 0
  addons.value.customization.enabled = false
  addons.value.customization.hours = 0
  addons.value.priority.enabled = false
  addons.value.hosting.enabled = false
  selectedPages.value = template.value.pages ? [...template.value.pages] : []
  buyer.value = { name: '', contact: '' }
  selectedDomain.value = null
}
</script>


<style scoped>
.buy__container {
  padding: 1rem;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: #f8f9fb;
}

.wrapper {
  width: 100%;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  max-width: 1800px;
  margin: 0 auto;
}

.card {
  background: #ffffff;
  border: 0.0625rem solid #ececec;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.04);
}

.sidebar {
  flex: 0 0 26rem;
  min-width: 18rem;
  max-height: calc(100vh - 4rem);
  overflow: auto;
  position: sticky;
  top: 1rem;
}

.title {
  font-size: 1.5rem;
  margin: 0;
  line-height: 1.2;
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  color: #666666;
  margin-bottom: 0.625rem;
}

.price {
  font-weight: 700;
  color: #111111;
  font-size: 1rem;
}

.extras {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.addon {
  display: block;
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

/* ---------- Custom switch (toggle) styles ---------- */
.custom-switch {
  position: relative;
  padding: 1rem;
  background-color: var(--light-gray);
  border-radius: 0.5rem;
  cursor: pointer;
}

.custom-switch input[type="checkbox"] {
  /* keep input accessible and focusable, but visually hidden */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.switch-track {
  width: 2.25rem;
  height: 1.25rem;
  background: #a6a6a6;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  padding: 0.125rem;
  box-shadow: inset 0 0.0625rem 0.125rem rgba(15,23,42,0.03);
  transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  flex: 0 0 auto;
}

.switch-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0.125rem 0.25rem rgba(15,23,42,0.06);
  transform: translateX(0);
  transition: transform 0.18s cubic-bezier(.2,.9,.2,1), background 0.18s ease;
  display: inline-block;
}

.custom-switch input[type="checkbox"]:focus + .switch-track {
}

.custom-switch input[type="checkbox"]:checked + .switch-track {
  background: #2b8df7;
  transition: 0.3s ease all;
}

.custom-switch input[type="checkbox"]:checked + .switch-track .switch-thumb {
  transform: translateX(1rem);
  background: #ffffff;
}

.label-text {
  display: inline-block;
  color: #111;
}

/* ensure clicks on the visual track toggle the checkbox */
.custom-switch {     
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center; 
  width: 100%;
}

/* ---------- End custom switch ---------- */

.preview-link {
  margin-top: 1rem;
}

.preview-link a {
  font-size: 0.95rem;
  color: #0070f3;
  text-decoration: none;
}

.order-lines .line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0;
  font-size: 0.95rem;
}

.order-lines hr {
  border: none;
  border-top: 0.0625rem solid #ececec;
  margin: 0.625rem 0;
}

.total {
  font-size: 1.125rem;
}

.input {
  display: block;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.input input {
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 0.0625rem solid #dddddd;
  border-radius: 0.375rem;
  font-size: 1rem;
}

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

.promocode__input {
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 0.0625rem solid #e6e6e6;
  border-radius: 0.375rem;
  color: #111;
  font-size: 1rem;
  line-height: 1.2;
  min-height: 2.25rem;
  display: flex;
  align-items: center;
  background: white;
}

.promocode__input:focus, input:focus {
  outline: none;
  transition: 0.3s ease all;
}


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

.order-actions {
  margin-top: 0.875rem;
  display: flex;
  flex-direction: column;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.card__h3 {
  margin-top: 1rem;
}
.domain__h3 {
  margin-bottom: 1rem;
}

.btn.primary {
  background: #0070f3;
  color: #fff;
  box-shadow: 0 0.125rem 0.375rem rgba(0, 112, 243, 0.12);
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.ghost {
  background: transparent;
  border: 0.0625rem solid #dddddd;
}

.note {
  margin-top: 0.75rem;
  color: #666666;
  font-size: 0.875rem;
}

input:focus,
button:focus,
a:focus {
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

.card__right {}

@media (max-width: 64rem) {
  .sidebar {
    flex: 0 0 22rem;
  }
}

@media (max-width: 48rem) {
  .wrapper {
    flex-direction: column;
    gap: 0.875rem;
    align-items: stretch;
  }

  .sidebar {
    position: relative;
    top: 0;
    flex: 1 1 auto;
    max-height: none;
    min-width: 0;
  }

  .btn {
    padding: 0.75rem 0.875rem;
    font-size: 1.05rem;
  }

  .input input {
    padding: 0.625rem 0.75rem;
  }

  .readonly-field {
    padding: 0.625rem 0.75rem;
  }
}
.domain-scroll__container {
  overflow-y: scroll;
  height: 35rem;
}
.domain__container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  overflow: hidden;
}

@media (max-width: 32rem) {
  .title {
    font-size: 1.125rem;
  }
}
</style>