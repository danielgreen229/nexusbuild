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
              <!-- DomainFinder эмитит 'select-domain' (теперь объект item) -->
              <DomainFinder @select-domain="onDomainSelected" />
            </div>
          </div>
        </div>

        <!--<div class="card__right">
          <div class="meta">
            <span class="price">{{ formatCurrency(template.price) }}</span>
          </div>
        </div>-->
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

          <!-- Цена домена -->
          <div class="line" v-if="selectedDomain">
            <span>Домен ({{ selectedDomain.fqdn }})</span>
            <span>{{ formatCurrency(domainCost) }}</span>
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
                :disabled="codesStore.loading || applyingPromo"
                placeholder="Введите промокод"
                class="promocode__input"
                style="flex:1;"
                aria-label="Промокод"
              />
              <button
                class="btn primary"
                @click="onApplyPromo"
                :disabled="codesStore.loading || applyingPromo || !promoCodeTrimmed"
                title="Нажмите, чтобы проверить и применить промокод"
              >
                <span v-if="!applyingPromo">{{ codesStore.loading ? 'Обработка…' : 'Применить' }}</span>
                <span v-else>Применяется…</span>
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

          <!-- Выбранный домен (с кнопкой сброса) -->
          <div class="line" v-if="selectedDomain">
            <span>Выбран домен</span>
            <span style="display:flex; gap:0.5rem; align-items:center;">
              <strong>{{ selectedDomain.fqdn }}</strong>
              <button class="btn ghost" @click="clearSelectedDomain" title="Сбросить выбор домена">Сбросить</button>
            </span>
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
/* Full rewrite: Buy/order component with robust promo application & alert store integration */
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplateStore } from '~/stores/template'
import { useUserStore } from '~/stores/user'
import { useCodesStore } from '~/stores/promocodes'
import { useOrdersStore } from '~/stores/order'
import LoginModal from '~/components/profile/Modals/LoginModal.vue'
import DomainFinder from '@/components/domain/domain-finder.vue'
import { useAlertStore } from '~/stores/alert'

const route = useRoute()
const router = useRouter()
const templateStore = useTemplateStore()
const userStore = useUserStore()
const codesStore = useCodesStore()
const ordersStore = useOrdersStore()
const alertStore = useAlertStore()

/* UI state */
const isLoginModalOpen = ref(false)
const startWithRegister = ref(false)
const id = route.params.id

onMounted(async () => {
  if (id) {
    try { await templateStore.getTemplateById(id) } catch (e) { /* ignore */ }
  }
  if (typeof userStore.init === 'function') {
    try { await userStore.init() } catch (e) { /* ignore */ }
  }

  // Очистим возможный stale preview в codesStore, чтобы лишний preview не блокировал оформление
  try { await _clearCodesPreviewIfAny() } catch (e) { /* ignore */ }
})


function openLogin () { startWithRegister.value = false; isLoginModalOpen.value = true }
function openRegister () { startWithRegister.value = true; isLoginModalOpen.value = true }
function onLoginEvent(userData) { isLoginModalOpen.value = false }

/* Selected domain object */
const selectedDomain = ref(null)

function onDomainSelected(domainOrItem) {
  if (!domainOrItem) return
  if (typeof domainOrItem === 'string') {
    selectedDomain.value = { fqdn: domainOrItem, price: 0, price_currency: 'RUB', available: true }
  } else if (typeof domainOrItem === 'object') {
    selectedDomain.value = {
      fqdn: domainOrItem.fqdn,
      price: domainOrItem.price ?? 0,
      price_currency: domainOrItem.price_currency ?? (domainOrItem.priceCurrency ?? 'RUB'),
      available: domainOrItem.available,
      id: domainOrItem.id ?? domainOrItem.domainId ?? null,
      raw: domainOrItem
    }
  }
}

/* Utilities */
function clearSelectedDomain() { selectedDomain.value = null }
const domainCost = computed(() => Number(selectedDomain.value?.price || 0))

/* Template & pricing */
const template = computed(() => templateStore.current || {
  id: null, title: '', price: 0, image: '', description: '', pages: [], preview: '', discount_percent: 0, discount_amount: 0
})
const basePrice = computed(() => Number(template.value.price || 0))

const addons = ref({
  extraPage: { enabled: false, price: 1000, count: 0 },
  customization: { enabled: false, pricePerHour: 500, hours: 0 },
  priority: { enabled: false, price: 3000 },
  hosting: { enabled: false, price: 1000 }
})


const buyer = ref({ name: '', contact: '' })
const placing = ref(false)
const applyingPromo = ref(false)

const promoCodeTrimmed = computed(() => (promoCodeInput.value || '').trim())

/* Costs */
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
  const parts = [ basePrice.value, extraPagesCost.value, customizationCost.value, priorityCost.value, hostingCost.value, domainCost.value ]
  return parts.reduce((acc, v) => acc + Number(v || 0), 0)
})

/* Template discount */
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

/* Promo state (from codesStore) */
const promoPreviewExists = computed(() => !!codesStore.preview)
const promoPreviewDiscount = computed(() => Number(codesStore.preview?.discount || 0))
const promoPreviewFinal = computed(() => Number(codesStore.preview?.finalAmount ?? subtotal.value))
const promoPreviewCode = computed(() => codesStore.preview?.code || promoCodeInput.value)

const promoAppliedExists = computed(() => !!codesStore.lastApplied)
const appliedPromoDiscount = computed(() => Number(codesStore.lastApplied?.discount || 0))
const appliedPromoCode = computed(() => codesStore.lastApplied?.code || '')

const promoDiscountEffective = computed(() => {
  const applied = Number(appliedPromoDiscount.value || 0)
  const preview = Number(promoPreviewDiscount.value || 0)

  if (promoAppliedExists.value) {
    return Math.min(applied, subtotal.value)
  }

  if (promoPreviewExists.value) {
    return Math.min(preview, subtotal.value)
  }

  return 0
})

const totalDiscount = computed(() => {
  const tpl = Number(templateDiscountAmount.value || 0)
  const promo = promoDiscountEffective.value || 0
  return Math.min(tpl + promo, subtotal.value)
})

const finalTotal = computed(() => {
  const t = subtotal.value - totalDiscount.value
  return t > 0 ? Math.round(t) : 0
})

function formatCurrency(value) {
  try {
    const v = Number(value || 0)
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(Math.round(v))
  } catch (e) { return `${value} ₽` }
}

/* Promo UI */
const promoCodeInput = ref('')
const promoError = ref(null)


watch(promoCodeInput, () => { promoError.value = null })
watch(subtotal, () => { promoError.value = null })


/* ---------------------------
   Новый onApplyPromo + очистка preview в codesStore при ошибке
   --------------------------- */

async function _clearCodesPreviewIfAny() {
  const clearFns = ['clearPreview', 'clear', 'resetPreview', 'reset', 'clearApplied', 'clearAll']
  for (const fn of clearFns) {
    if (typeof codesStore[fn] === 'function') {
      try {
        await codesStore[fn]()
        return
      } catch (e) {
        // ignore and try next
      }
    }
  }
  // не трогаем promoCodeInput (пользовательский ввод), только стор
  try {
    if ('preview' in codesStore) codesStore.preview = null
    if ('lastApplied' in codesStore) codesStore.lastApplied = null
  } catch (_) {}
}

// helper
function _getUserUid() {
  const u = userStore.user || {}
  return u.uid || u.id || u.userId || null
}

function _friendlyPromoMessage(raw) {
  if (!raw) return 'Ошибка при проверке промокода'
  const s = String(raw)
  // убираем явные HTTP штуки
  if (/http\s*400|400/i.test(s)) return 'Промокод не применён — проверьте код и попробуйте снова.'
  if (/code\s+and\s+orderAmount|code и orderAmount|orderamount/i.test(s)) {
    return 'Невозможно проверить промокод: сумма заказа не указана. Пожалуйста, выберите домен/товары.'
  }
  return s.length < 140 ? s : 'Невозможно проверить промокод'
}

/* onApplyPromo */
async function onApplyPromo(item) {
  promoError.value = null
  const code = promoCodeTrimmed.value
  if (!code) {
    promoError.value = 'Введите код промокода'
    return
  }

  // если сумма нулевая — не стоит пытаться
  const orderAmount = Math.round(Number(subtotal.value || 0))
  if (orderAmount <= 0) {
    promoError.value = 'Выберите домен или добавьте опции, чтобы проверить промокод.'
    return
  }

  applyingPromo.value = true
  try {
    // явная очистка стора перед новой попыткой
    if (typeof codesStore.clearError === 'function') codesStore.clearError()
    if (typeof codesStore.clearPreview === 'function') codesStore.clearPreview()
    else codesStore.preview = null

    const previewRes = await codesStore.previewPromocode(code, orderAmount, 'RUB')

    if (!previewRes || previewRes.success === false) {
      promoError.value = _friendlyPromoMessage(previewRes?.message)
      return
    }
    // success -> preview установлен в стор, показываем подсказку (component уже делает это по computed)
    promoError.value = null
  } catch (e) {
    console.error('onApplyPromo error', e)
    promoError.value = _friendlyPromoMessage(e?.message || e)
  } finally {
    applyingPromo.value = false
  }
}

async function _ensurePromoAppliedBeforeOrder() {
  // если нет превью или уже применён — ок
  if (!promoPreviewExists.value || promoAppliedExists.value) return { success: true }

  const code = (promoPreviewCode.value || promoCodeInput.value || '').trim()

  // если превью есть, но код пустой — просто очистим стор и продолжим
  if (!code) {
    try { await _clearCodesPreviewIfAny() } catch (e) { /* ignore */ }
    return { success: true }
  }

  const uid = _getUserUid()
  // если для применения нужен uid, но его нет — не блокируем заказ, просто очистим preview
  if (!uid) {
    try { await _clearCodesPreviewIfAny() } catch (e) { /* ignore */ }
    return { success: true }
  }

  applyingPromo.value = true
  try {
    if (typeof codesStore.clearError === 'function') codesStore.clearError()

    const orderAmount = Math.round(Number(subtotal.value || 0))
    const res = await codesStore.applyPromocode({ code, uid, orderAmount, currency: 'RUB' })

    if (res && (res.success === true || res.data)) {
      return { success: true }
    }

    // неудача при apply — очистим preview, но не будем блокировать оформление
    const raw = res?.message || (res && res.data && (res.data.message || res.data.error)) || null
    const friendly = _friendlyPromoMessage(raw)
    try { await _clearCodesPreviewIfAny() } catch (e) { /* ignore */ }
    return { success: true, message: friendly }
  } catch (e) {
    console.error('_ensurePromoAppliedBeforeOrder error', e)
    try { await _clearCodesPreviewIfAny() } catch (ee) { /* ignore */ }
    return { success: true, message: 'Ошибка при применении промокода' }
  } finally {
    applyingPromo.value = false
  }
}

/**
 * Попытка очистить/подтвердить состояние промо в store после успешного заказа.
 */
async function _cleanupPromoStateAfterOrder() {
  const clearFns = [
    'consumeApplied',
    'consumePromocode',
    'clearApplied',
    'resetApplied',
    'clearPreview',
    'reset',
    'clear',
    'finalizePromo'
  ]

  for (const fn of clearFns) {
    if (typeof codesStore[fn] === 'function') {
      try {
        await codesStore[fn]()
        return
      } catch (e) {
        // ignore and continue
      }
    }
  }
}

/* ---------------------------
   Оформление заказа
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

const canPlaceOrder = computed(() => {
  return isAuthenticated.value && !!selectedDomain.value && !!selectedDomain.value.fqdn
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
    alertStore.showAlert({
      title: 'Выберите домен',
      message: 'Пожалуйста, выберите домен перед оформлением заказа.',
      type: 'warning',
      typeClass: 'alert-warning',
      background: '#fff3cd',
      color: '#856404',
      autoClose: { enabled: true, delay: 4000 }
    })
    return
  }

  placing.value = true

  try {
    // 1) если есть превью-промо и оно не применено — пробуем применить
    const ensure = await _ensurePromoAppliedBeforeOrder()
    if (ensure && ensure.message) {
      alertStore.showAlert({
        title: 'Промокод',
        message: ensure.message,
        type: 'warning',
        typeClass: 'alert-warning',
        background: '#fff3cd',
        color: '#856404',
        autoClose: { enabled: true, delay: 5000 }
      })
    }

    // 2) Формируем минимальный payload для API (store.createOrder)
    const payload = {
      templateId: template.value.id,
      price: finalTotal.value,
      paymentMethod: 'balance',
      // добавлено поле domain — сервер получит информацию о выбранном домене
      domain: {
        fqdn: selectedDomain.value.fqdn,
        price: Number(selectedDomain.value.price || 0),
        currency: selectedDomain.value.price_currency || selectedDomain.value.priceCurrency || 'RUB',
        available: !!selectedDomain.value.available,
        id: selectedDomain.value.id ?? null
      }
    }

    // Если есть применённый промокод — передаём данные как external, чтобы сервер мог создать запись order_externals
    if (promoAppliedExists.value || promoPreviewExists.value) {
      const code = appliedPromoCode.value || promoPreviewCode.value || promoCodeInput.value.trim()
      payload.external = {
        promocode: code || null,
        total_price: subtotal.value,
        price: finalTotal.value,
        discount: totalDiscount.value,
        user_uid: _getUserUid()
      }

      // если applied содержит redemptionId / uid — можно передать его как uid, сервер создаст/использует как нужно
      if (codesStore.lastApplied && codesStore.lastApplied.redemptionId) {
        payload.external.uid = codesStore.lastApplied.redemptionId
      }
    }

    // 3) Отправляем на сервер через ordersStore
    const res = await ordersStore.createOrder(payload)

    if (!res || res.success === false) {
      // show message from store if any, otherwise generic
      const msg = (res && res.message) ? res.message : 'Не удалось создать заказ'
      alertStore.showAlert({
        title: 'Ошибка',
        message: msg,
        type: 'error',
        typeClass: 'alert-error',
        background: '#f8d7da',
        color: '#721c24',
        autoClose: { enabled: true, delay: 6000 }
      })
      return
    }

    // success
    const created = res.data
    alertStore.showAlert({
      title: 'Заявка отправлена',
      message: `Итог: ${formatCurrency(finalTotal.value)}`,
      type: 'success',
      typeClass: 'alert-success',
      background: '#d4edda',
      color: '#155724',
      autoClose: { enabled: true, delay: 4000 }
    })

    // обновляем локальные списки (ordersStore уже добавляет локально в момент createOrder, но можно вызвать fetchUserOrders для синхронизации)
    
    try { 
      await ordersStore.fetchUserOrders({ page: 1, perPage: 20 }) 
    } 
    catch (e) { 
      console.log(e, 'error') 
    }

    // 4) clean-up promo в сторах (если store поддерживает)
    await _cleanupPromoStateAfterOrder()

    // 5) Сброс локальных полей
    await resetSelections()

    // Навигация на страницу заказа (если backend вернул id)
    if (created && created.id) {
      // используем router.push чтобы гарантировать навигацию в разных окружениях
      try { router.push({ path: '/profile', query: { tab: 'orders' } }) } catch (_) {}
    }
  } catch (e) {
    console.error(e)
    alertStore.showAlert({
      title: 'Ошибка',
      message: (e && e.message) ? e.message : 'Ошибка при оформлении заказа',
      type: 'error',
      typeClass: 'alert-error',
      background: '#f8d7da',
      color: '#721c24',
      autoClose: { enabled: true, delay: 5000 }
    })
  } finally {
    placing.value = false
  }
}

/* Сброс/очистка локального состояния + попытка очистить preview/lastApplied в codesStore */
async function resetSelections() {
  addons.value.extraPage.enabled = false
  addons.value.extraPage.count = 0
  addons.value.customization.enabled = false
  addons.value.customization.hours = 0
  addons.value.priority.enabled = false
  addons.value.hosting.enabled = false
  buyer.value = { name: '', contact: '' }
  selectedDomain.value = null

  // Очистим preview/lastApplied в codesStore если есть API
  const clearFns = ['clearPreview', 'clearApplied', 'resetApplied', 'reset', 'clear']
  for (const fn of clearFns) {
    if (typeof codesStore[fn] === 'function') {
      try { await codesStore[fn]() ; break } catch (e) { /* ignore */ }
    }
  }

  promoCodeInput.value = ''
  promoError.value = null
}
</script>

<style scoped>
.buy__container {
  padding: 1rem;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.wrapper {
  width: 100%;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  max-width: calc(2100px + -4rem);
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
