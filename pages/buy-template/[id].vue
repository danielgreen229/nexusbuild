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
      </section>

      <!-- RIGHT: корзина / заказ -->
      <aside ref="sidebarRef" class="card sidebar">
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

          <div class="line" v-if="selectedDomain">
            <span>Домен ({{ selectedDomain.fqdn }})</span>
            <span>{{ formatCurrency(domainCost) }}</span>
          </div>

          <hr />

          <div class="line">
            <strong>Промежуточная сумма</strong>
            <strong>{{ formatCurrency(subtotalBeforeTemplate) }}</strong>
          </div>

          <div class="line discount" v-if="templateDiscountAmount > 0">
            <span>Скидка шаблона {{ discountLabel }}</span>
            <span>-{{ formatCurrency(templateDiscountAmount) }}</span>
          </div>

          <div class="line">
            <strong>Сумма после скидки шаблона</strong>
            <strong>{{ formatCurrency(subtotalAfterTemplate) }}</strong>
          </div>

          <!-- INPUT для промокода -->
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
                title="Проверить и применить промокод"
              >
                <span v-if="!applyingPromo">{{ codesStore.loading ? 'Обработка…' : 'Применить' }}</span>
                <span v-else>Применяется…</span>
              </button>
            </div>

            <div class="note" style="margin-top:0.25rem;">Промокод применяется к сумме <strong>после</strong> скидки шаблона.</div>

            <div v-if="promoError" class="note" style="color: #b91c1c; margin-top:0.25rem;">
              {{ promoError }}
            </div>

            <div v-if="promoPreviewExists && !promoAppliedExists" class="note" style="color:#064e3b; margin-top:0.25rem;">
              Промокод применен«{{ promoPreviewCode || promoCodeInput }}»: скидка составила {{ formatCurrency(promoPreviewDiscount) }}
            </div>

            <div v-if="promoAppliedExists" class="note" style="color:#064e3b; margin-top:0.25rem;">
              Промокод «{{ appliedPromoCode }}» применён — скидка {{ formatCurrency(appliedPromoDiscount) }}.
            </div>
          </div>

         

          <div class="line total">
            <strong>Итого к оплате</strong>
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
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemplateStore } from '~/stores/template'
import { useUserStore } from '~/stores/user'
import { useCodesStore } from '~/stores/promocodes'
import { useOrdersStore } from '~/stores/order'
import { useAlertStore } from '~/stores/alert'
import LoginModal from '~/components/profile/Modals/LoginModal.vue'
import DomainFinder from '@/components/domain/domain-finder.vue'

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
  if (id && typeof templateStore.getTemplateById === 'function') {
    try { await templateStore.getTemplateById(id) } catch (e) { /* ignore */ }
  }
  if (typeof userStore.init === 'function') {
    try { await userStore.init() } catch (e) { /* ignore */ }
  }

  try { await _clearCodesPreviewIfAny() } catch (e) { /* ignore */ }
})

function openLogin () { startWithRegister.value = false; isLoginModalOpen.value = true }
function openRegister () { startWithRegister.value = true; isLoginModalOpen.value = true }
function onLoginEvent () { isLoginModalOpen.value = false }

/* Selected domain */
const selectedDomain = ref(null)
const sidebarRef = ref(null)

function onDomainSelected (domainOrItem) {
  if (!domainOrItem) return
  if (typeof domainOrItem === 'string') {
    selectedDomain.value = { fqdn: domainOrItem, price: 0, price_currency: 'RUB', available: true }
  } else {
    selectedDomain.value = {
      fqdn: domainOrItem.fqdn,
      price: Number(domainOrItem.price || 0),
      price_currency: domainOrItem.price_currency || domainOrItem.priceCurrency || 'RUB',
      available: domainOrItem.available ?? true,
      id: domainOrItem.id ?? domainOrItem.domainId ?? null,
      raw: domainOrItem
    }
  }

  // Плавная прокрутка к сайдбару — только на мобильных (ширина экрана <= 768px)
  try {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      // Подождём обновления DOM (например, чтобы появился выбранный домен в сайдбаре)
      nextTick(() => {
        // Небольшая задержка чтобы гарантированно убрать фокус/клавиатуру на мобильных
        setTimeout(() => {
          if (sidebarRef.value && typeof sidebarRef.value.scrollIntoView === 'function') {
            // Прокрутка так, чтобы заголовок сайдбара был вверху экрана
            sidebarRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            // запасной вариант: прокрутить окно к координате сайдбара
            const el = sidebarRef.value && sidebarRef.value.$el ? sidebarRef.value.$el : sidebarRef.value
            if (el && el.getBoundingClientRect) {
              const top = (el.getBoundingClientRect().top + window.scrollY) - 12
              window.scrollTo({ top, behavior: 'smooth' })
            }
          }
        }, 120)
      })
    }
  } catch (e) {
    // игнорируем ошибки прокрутки
  }
}
function clearSelectedDomain () { selectedDomain.value = null }
const domainCost = computed(() => Number(selectedDomain.value?.price || 0))

/* Template & pricing */
const template = computed(() => templateStore.current || { id: null, title: '', price: 0, discount_percent: 0, discount_amount: 0 })
const basePrice = computed(() => Number(template.value.price || 0))

// Новое: человек жаловался на undefined — добавляем discountLabel
const discountLabel = computed(() => {
  const pct = Number(template.value.discount_percent || 0)
  const amt = Number(template.value.discount_amount || 0)
  if (pct > 0) return `${pct}%`
  if (amt > 0) return formatCurrency(amt)
  return ''
})

const addons = ref({
  extraPage: { enabled: false, price: 1000, count: 0 },
  customization: { enabled: false, pricePerHour: 500, hours: 0 },
  priority: { enabled: false, price: 3000 },
  hosting: { enabled: false, price: 1000 }
})

const buyer = ref({ name: '', contact: '' })
const placing = ref(false)
const applyingPromo = ref(false)

const promoCodeInput = ref('')
const promoError = ref(null)
const promoCodeTrimmed = computed(() => (promoCodeInput.value || '').trim())

/* Kosten */
const extraPagesCost = computed(() => {
  const c = Number(addons.value.extraPage.count || 0)
  return (addons.value.extraPage.enabled && c > 0) ? (c * Number(addons.value.extraPage.price || 0)) : 0
})
const customizationCost = computed(() => {
  const h = Number(addons.value.customization.hours || 0)
  return (addons.value.customization.enabled && h > 0) ? (h * Number(addons.value.customization.pricePerHour || 0)) : 0
})
const priorityCost = computed(() => addons.value.priority.enabled ? Number(addons.value.priority.price || 0) : 0)
const hostingCost = computed(() => addons.value.hosting.enabled ? Number(addons.value.hosting.price || 0) : 0)

/* Основная логика: считаем промо относительно суммы после скидки шаблона */
const subtotalBeforeTemplate = computed(() => {
  return [basePrice.value, extraPagesCost.value, customizationCost.value, priorityCost.value, hostingCost.value, domainCost.value]
    .reduce((s, v) => s + Number(v || 0), 0)
})

const templateDiscountAmount = computed(() => {
  const discAmount = Number(template.value.discount_amount || 0)
  const discPercent = Number(template.value.discount_percent || 0)
  if (discAmount > 0) return Math.min(discAmount, subtotalBeforeTemplate.value)
  if (discPercent > 0) return Math.min(Math.round((subtotalBeforeTemplate.value * discPercent) / 100), subtotalBeforeTemplate.value)
  return 0
})

const subtotalAfterTemplate = computed(() => {
  const v = subtotalBeforeTemplate.value - Number(templateDiscountAmount.value || 0)
  return v > 0 ? v : 0
})

/* Promo state from store */
const promoPreviewExists = computed(() => !!codesStore.preview)
const promoPreviewDiscount = computed(() => Number(codesStore.preview?.discount || 0))
const promoPreviewFinal = computed(() => Number(codesStore.preview?.finalAmount ?? subtotalAfterTemplate.value))
const promoPreviewCode = computed(() => codesStore.preview?.code || promoCodeInput.value)

const promoAppliedExists = computed(() => !!codesStore.lastApplied)
const appliedPromoDiscount = computed(() => Number(codesStore.lastApplied?.discount || 0))
const appliedPromoCode = computed(() => codesStore.lastApplied?.code || '')


/* promo effective: не больше суммы после скидки шаблона, округлённая */
const promoDiscountEffective = computed(() => {
  const applied = Math.round(Number(appliedPromoDiscount.value || 0))
  const preview = Math.round(Number(promoPreviewDiscount.value || 0))
  const cap = Math.round(Number(subtotalAfterTemplate.value || 0))

  if (promoAppliedExists.value) return Math.min(applied, cap)
  if (promoPreviewExists.value) return Math.min(preview, cap)
  return 0
})


const totalDiscount = computed(() => {
  const tpl = Math.round(Number(templateDiscountAmount.value || 0))
  const promo = Math.round(promoDiscountEffective.value || 0)
  const before = Math.round(Number(subtotalBeforeTemplate.value || 0))
  return Math.min(tpl + promo, before)
})

const finalTotal = computed(() => {
  // считаем на целых рублях
  const afterTpl = Math.round(Number(subtotalAfterTemplate.value || 0))
  const promo = Math.round(promoDiscountEffective.value || 0)
  const t = afterTpl - promo
  if (t <= 0) return 0
  // если остался дробный рубль (теоретически), но мы уже в целых — всё равно защита:
  if (t > 0 && t < 1) return 1
  return Math.round(t)
})

function formatCurrency (value) {
  try {
    const v = Number(value || 0)
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(Math.round(v))
  } catch (e) { return `${value} ₽` }
}

watch(promoCodeInput, () => { promoError.value = null })
watch(subtotalBeforeTemplate, () => { promoError.value = null })

/* Helpers to clear preview/applied in store (tolerant) */
async function _clearCodesPreviewIfAny () {
  const clearFns = ['clearPreview', 'clear', 'resetPreview', 'reset', 'clearApplied', 'clearAll']
  for (const fn of clearFns) {
    if (typeof codesStore[fn] === 'function') {
      try { await codesStore[fn](); return } catch (e) { /* ignore */ }
    }
  }
  try {
    if ('preview' in codesStore) codesStore.preview = null
    if ('lastApplied' in codesStore) codesStore.lastApplied = null
  } catch (e) { /* ignore */ }
}

function _getUserUid () {
  const u = userStore.user || {}
  return u.uid || u.id || u.userId || null
}

function _friendlyPromoMessage (raw) {
  if (!raw) return 'Ошибка при проверке промокода'
  const s = String(raw)
  if (/http\s*400|400/i.test(s)) return 'Промокод не применён — проверьте код и попробуйте снова.'
  if (/code\s+and\s+orderAmount|code и orderAmount|orderamount/i.test(s)) return 'Невозможно проверить промокод: сумма заказа не указана.'
  return s.length < 140 ? s : 'Невозможно проверить промокод'
}

/* onApplyPromo: всегда передаём сумму = subtotalAfterTemplate */
async function onApplyPromo () {
  promoError.value = null
  const code = promoCodeTrimmed.value
  if (!code) { promoError.value = 'Введите код промокода'; return }

  // Используем округлённую сумму после скидки шаблона
  const orderAmount = Math.round(Number(subtotalAfterTemplate.value || 0))
  if (orderAmount <= 0) {
    promoError.value = 'Сумма для промокода равна нулю. Добавьте домен или опции.'
    return
  }

  applyingPromo.value = true
  try {
    if (typeof codesStore.clearError === 'function') codesStore.clearError()
    if (typeof codesStore.clearPreview === 'function') await codesStore.clearPreview()
    else codesStore.preview = null

    // Передаём округлённую сумму
    const previewRes = await codesStore.previewPromocode(code, orderAmount, 'RUB')
    if (!previewRes || previewRes.success === false) {
      promoError.value = _friendlyPromoMessage(previewRes?.message)
      return
    }
    promoError.value = null
  } catch (e) {
    console.error('onApplyPromo error', e)
    promoError.value = _friendlyPromoMessage(e?.message || e)
  } finally {
    applyingPromo.value = false
  }
}


/* Перед заказом: если есть preview и пользователь залогинен — apply на сумму subtotalAfterTemplate */
async function _ensurePromoAppliedBeforeOrder () {
  if (!promoPreviewExists.value || promoAppliedExists.value) return { success: true }

  const code = (promoPreviewCode.value || promoCodeInput.value || '').trim()
  if (!code) { try { await _clearCodesPreviewIfAny() } catch (e) {} ; return { success: true } }

  const uid = _getUserUid()
  if (!uid) { try { await _clearCodesPreviewIfAny() } catch (e) {} ; return { success: true } }

  applyingPromo.value = true
  try {
    if (typeof codesStore.clearError === 'function') codesStore.clearError()
    const orderAmount = Math.round(Number(subtotalAfterTemplate.value || 0))
    const res = await codesStore.applyPromocode({ code, uid, orderAmount, currency: 'RUB' })
    if (res && (res.success === true || res.data)) return { success: true }

    const raw = res?.message || (res && res.data && (res.data.message || res.data.error)) || null
    const friendly = _friendlyPromoMessage(raw)
    try { await _clearCodesPreviewIfAny() } catch (e) {}
    return { success: true, message: friendly }
  } catch (e) {
    console.error('_ensurePromoAppliedBeforeOrder error', e)
    try { await _clearCodesPreviewIfAny() } catch (ee) {}
    return { success: true, message: 'Ошибка при применении промокода' }
  } finally { applyingPromo.value = false }
}

async function _cleanupPromoStateAfterOrder () {
  const clearFns = ['consumeApplied','consumePromocode','clearApplied','resetApplied','clearPreview','reset','clear','finalizePromo']
  for (const fn of clearFns) {
    if (typeof codesStore[fn] === 'function') {
      try { await codesStore[fn](); return } catch (e) { /* ignore */ }
    }
  }
}

/* Order */
const isAuthenticated = computed(() => !!userStore.isAuthenticated)
const userInfo = computed(() => userStore.user || {})
const canPlaceOrder = computed(() => isAuthenticated.value && !!selectedDomain.value && !!selectedDomain.value.fqdn)

watch(isAuthenticated, (v) => {
  if (v) {
    const u = userStore.user || {}
    if (u.name) buyer.value.name = u.name
    if (u.email) buyer.value.contact = u.email
  }
})

let _promoReapplyTimer = null
const PROMO_REAPPLY_DEBOUNCE_MS = 350

// единственная вспомогательная функция, вызываемая из watcher'а
async function _refreshPromoAfterPriceChange () {
  // если нет кода/нет preview и нет applied — ничего не делаем
  const hasPreview = promoPreviewExists.value
  const hasApplied = promoAppliedExists.value
  const code = (promoPreviewCode.value || promoCodeInput.value || appliedPromoCode.value || '').trim()
  if (!code || (!hasPreview && !hasApplied)) {
    // если промокод в сторе остался висеть, но кода нет — очистим preview
    try { await _clearCodesPreviewIfAny() } catch (e) { /* ignore */ }
    return
  }

  const orderAmount = Math.round(Number(subtotalAfterTemplate.value || 0))
  if (orderAmount <= 0) {
    // некорректная сумма — очищаем preview/applied аккуратно
    try { await _clearCodesPreviewIfAny() } catch (e) { /* ignore */ }
    return
  }

  applyingPromo.value = true
  try {
    // если промокод уже был применён — попробуем apply заново (для залогиненного пользователя)
    if (hasApplied) {
      const uid = _getUserUid()
      if (!uid) {
        // если пользователь вдруг разлогинился — очистим applied/preview
        try { await _clearCodesPreviewIfAny() } catch (e) {}
        return
      }
      // пробуем повторно применить на новую сумму
      if (typeof codesStore.clearError === 'function') codesStore.clearError()
      const res = await codesStore.applyPromocode({ code, uid, orderAmount, currency: 'RUB' })
      // если apply вернул видимую ошибку, очищаем и покажем friendly (но не блокируем оформление)
      if (!res || res.success === false) {
        // очищаем applied-preview — чтобы не было рассинхрона
        try { await _clearCodesPreviewIfAny() } catch (e) {}
        const friendly = _friendlyPromoMessage(res?.message || (res && res.data && (res.data.message || res.data.error)))
        // не показываем alert автоматически — оставляем сообщение в promoError, UI может показать
        promoError.value = friendly
      } else {
        // успех — чистим ошибки
        promoError.value = null
      }
      return
    }

    // иначе — у нас есть только preview, обновляем preview
    if (hasPreview) {
      if (typeof codesStore.clearError === 'function') codesStore.clearError()
      const previewRes = await codesStore.previewPromocode(code, orderAmount, 'RUB')
      if (!previewRes || previewRes.success === false) {
        // ошибка превью — очищаем preview и ставим сообщение
        try { await _clearCodesPreviewIfAny() } catch (e) {}
        promoError.value = _friendlyPromoMessage(previewRes?.message)
      } else {
        promoError.value = null
      }
    }
  } catch (e) {
    console.error('_refreshPromoAfterPriceChange error', e)
    promoError.value = _friendlyPromoMessage(e?.message || e)
  } finally {
    applyingPromo.value = false
  }
}

// watcher: следим за subtotalAfterTemplate, дебаунсим
watch(
  () => Math.round(Number(subtotalAfterTemplate.value || 0)),
  () => {
    // очистим предыдущее таймерное срабатывание
    if (_promoReapplyTimer) { clearTimeout(_promoReapplyTimer); _promoReapplyTimer = null }
    _promoReapplyTimer = setTimeout(() => {
      _refreshPromoAfterPriceChange().catch(e => { /* логируем в консоль, но не ломаем UI */ console.error(e) })
      _promoReapplyTimer = null
    }, PROMO_REAPPLY_DEBOUNCE_MS)
  }
)

// также следим за изменением аутентификации — если пользователь залогинился и есть preview,
// можно попытаться автоматически apply (поведение согласуется с вашим _ensurePromoAppliedBeforeOrder)
watch(isAuthenticated, (val) => {
  if (val && promoPreviewExists.value && promoCodeTrimmed.value) {
    // если пользователь только что залогинился и был preview — попробуем apply автоматически
    // (не ждем действия пользователя)
    if (_promoReapplyTimer) { clearTimeout(_promoReapplyTimer); _promoReapplyTimer = null }
    _promoReapplyTimer = setTimeout(() => {
      _refreshPromoAfterPriceChange().catch(e => console.error(e))
      _promoReapplyTimer = null
    }, 120) // короткая задержка после логина
  }
})

// очистка таймера при размонтировании компонента
onBeforeUnmount(() => {
  if (_promoReapplyTimer) { clearTimeout(_promoReapplyTimer); _promoReapplyTimer = null }
})

async function placeOrder () {
  if (!isAuthenticated.value) { router.push({ path: '/login' }); return }
  if (!selectedDomain.value) {
    alertStore.showAlert({ title: 'Выберите домен', message: 'Пожалуйста, выберите домен перед оформлением заказа.', type: 'warning', typeClass: 'alert-warning', background: '#fff3cd', color: '#856404', autoClose: { enabled: true, delay: 4000 } })
    return
  }

  placing.value = true
  try {
    const ensure = await _ensurePromoAppliedBeforeOrder()
    if (ensure && ensure.message) {
      alertStore.showAlert({ title: 'Промокод', message: ensure.message, type: 'warning', typeClass: 'alert-warning', background: '#fff3cd', color: '#856404', autoClose: { enabled: true, delay: 5000 } })
    }

    const payload = {
      templateId: template.value.id,
      price: finalTotal.value,
      paymentMethod: 'balance',
      domain: {
        fqdn: selectedDomain.value.fqdn,
        price: Number(selectedDomain.value.price || 0),
        currency: selectedDomain.value.price_currency || 'RUB',
        available: !!selectedDomain.value.available,
        id: selectedDomain.value.id ?? null
      }
    }

    if (promoAppliedExists.value || promoPreviewExists.value) {
      const code = appliedPromoCode.value || promoPreviewCode.value || promoCodeInput.value.trim()
      payload.external = {
        promocode: code || null,
        total_price: Math.round(Number(subtotalAfterTemplate.value || 0)),
        price: finalTotal.value,
        discount: totalDiscount.value,
        user_uid: _getUserUid()
      }

      if (codesStore.lastApplied && codesStore.lastApplied.redemptionId) payload.external.uid = codesStore.lastApplied.redemptionId
    }

    const res = await ordersStore.createOrder(payload)
    if (!res || res.success === false) {
      const msg = (res && res.message) ? res.message : 'Не удалось создать заказ'
      alertStore.showAlert({ title: 'Ошибка', message: msg, type: 'error', typeClass: 'alert-error', background: '#f8d7da', color: '#721c24', autoClose: { enabled: true, delay: 6000 } })
      return
    }

    alertStore.showAlert({ title: 'Заявка отправлена', message: `Итог: ${formatCurrency(finalTotal.value)}`, type: 'success', typeClass: 'alert-success', background: '#d4edda', color: '#155724', autoClose: { enabled: true, delay: 4000 } })

    try { await ordersStore.fetchUserOrders?.({ page: 1, perPage: 20 }) } catch (e) { /* ignore */ }

    await _cleanupPromoStateAfterOrder()
    await resetSelections()

    const created = res.data
    if (created && created.id) { try { router.push({ path: '/profile', query: { tab: 'orders' } }) } catch (e) {} }
  } catch (e) {
    console.error(e)
    alertStore.showAlert({ title: 'Ошибка', message: (e && e.message) ? e.message : 'Ошибка при оформлении заказа', type: 'error', typeClass: 'alert-error', background: '#f8d7da', color: '#721c24', autoClose: { enabled: true, delay: 5000 } })
  } finally { placing.value = false }
}

async function resetSelections () {
  addons.value.extraPage.enabled = false; addons.value.extraPage.count = 0
  addons.value.customization.enabled = false; addons.value.customization.hours = 0
  addons.value.priority.enabled = false; addons.value.hosting.enabled = false
  buyer.value = { name: '', contact: '' }
  selectedDomain.value = null

  const clearFns = ['clearPreview','clearApplied','resetApplied','reset','clear']
  for (const fn of clearFns) {
    if (typeof codesStore[fn] === 'function') { try { await codesStore[fn](); break } catch (e) { /* ignore */ } }
  }

  promoCodeInput.value = ''
  promoError.value = null
}
</script>

<style scoped>
/* стиль оставлен без изменений — см. ваш предыдущий CSS */
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
  min-height: 35rem;
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
