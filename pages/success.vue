<template>
  <div class="success-page">
    <main class="success-card" role="main" aria-labelledby="success-title">
      <div class="icon-wrap" aria-hidden="true">
        <svg viewBox="0 0 24 24" class="check-icon">
          <path d="M20 6L9 17l-5-5" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <h1 id="success-title" class="title">Спасибо за покупку!</h1>

      <p class="subtitle">
        Ваш заказ <span class="accent">{{ orderIdDisplay }}</span> успешно оформлен.
      </p>


      <div class="controls">
        <NuxtLink class="btn btn-link" to="/profile?tab=orders">Мои заказы</NuxtLink>
      </div>

      
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '~/stores/order' // если в проекте нет — просто будет игнорироваться

const route = useRoute()
const router = useRouter()
const ordersStore = (() => {
  try { return useOrdersStore() } catch (e) { return null }
})()

const queryOrderId = ref(String(route.query.orderId ?? route.params.orderId ?? '') || '')
watch(() => route.query.orderId, (v) => { queryOrderId.value = String(v ?? '') })

const loading = ref(false)
const error = ref(null)
const orderLocal = ref({})
const orderFound = computed(() => !!(orderLocal.value && orderLocal.value.id))

const orderIdDisplay = computed(() => queryOrderId.value || (orderLocal.value.id ?? '—'))

onMounted(() => {
  // если есть orderId в query — пытаемся загрузить заказ
  loadOrder()
})

watch(queryOrderId, (v, ov) => {
  if (v !== ov) loadOrder()
})

async function loadOrder() {
  const id = queryOrderId.value
  error.value = null
  orderLocal.value = {}
  if (!id) return

  loading.value = true
  try {
    let o = null

    // Пытаемся найти в store (если есть)
    if (ordersStore && Array.isArray(ordersStore.orders)) {
      o = ordersStore.orders.find(x => String(x.id ?? x.order_id ?? x._id) === String(id))
    }

    // Если не найдено и есть fetchOrder — вызываем
    if (!o && ordersStore && typeof ordersStore.fetchOrder === 'function') {
      const res = await ordersStore.fetchOrder(id)
      if (res?.success && res.data) o = res.data
      else if (res?.order) o = res.order
      else if (res && res.id) o = res
    }

    // Фоллбек — fetchUserOrders
    if (!o && ordersStore && typeof ordersStore.fetchUserOrders === 'function') {
      const pageRes = await ordersStore.fetchUserOrders({ page: 1, perPage: 10 })
      if (pageRes?.success && Array.isArray(pageRes.data?.rows)) {
        o = pageRes.data.rows.find(r => String(r.id ?? r.order_id ?? r._id) === String(id))
      }
    }

    if (!o) {
      // Если store отсутствует или не удалось найти — оставляем пустое, но не фатально
      error.value = 'Не удалось найти заказ в системе.'
      orderLocal.value = {}
      return
    }

    orderLocal.value = mapOrderForView(o)
  } catch (err) {
    console.error('success page loadOrder error', err)
    error.value = err?.message ?? String(err) ?? 'Сетевая ошибка'
    orderLocal.value = {}
  } finally {
    loading.value = false
  }
}

function mapOrderForView(o) {
  if (!o) return {}
  const id = o.id ?? o.order_id ?? o._id ?? null
  const statusRaw = o.status ?? o.state ?? '—'
  const statusCode = String(statusRaw).toLowerCase().replace(/\s+/g, '_') || 'unknown'
  return {
    id,
    date: formatDate(o),
    template: o.template?.title ?? o.template?.name ?? o.template_title ?? (typeof o.template === 'string' ? o.template : '—'),
    status: statusRaw,
    statusCode,
    price: formatPrice(o),
    preview: getTemplatePreview(o),
    raw: o
  }
}

function getTemplatePreview(o) {
  if (!o) return null
  const candidates = [
    o.preview,
    o.template?.image,
    o.template?.preview,
    o.template_image,
    o.template_preview,
    o.image,
    o.raw?.template?.image,
    o.raw?.template?.preview,
    o.raw?.template_image,
    o.raw?.preview
  ]
  for (const c of candidates) if (c && typeof c === 'string' && c.trim() !== '') return c
  return null
}

function formatPrice(o) {
  const priceVal = o.price ?? o.amount ?? o.total
  const currency = (o.currency ?? o.currency_code ?? 'RUB')
  if (typeof priceVal === 'number' && !Number.isNaN(priceVal)) {
    try {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency }).format(priceVal)
    } catch (e) {
      return String(priceVal)
    }
  }
  return priceVal ?? '—'
}

function formatDate(raw) {
  if (!raw) return ''
  const val = raw.created_at ?? raw.createdAt ?? raw.date ?? raw.order_date ?? raw.created ?? raw
  let d
  if (val instanceof Date) d = val
  else if (typeof val === 'number') {
    const ms = val < 1e12 ? (val < 1e10 ? val * 1000 : val) : val
    d = new Date(ms)
  } else d = new Date(String(val))
  if (Number.isNaN(d.getTime())) return String(val ?? '')
  return d.toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getStatusTitle(status) {
  if (status == 'pending_payment' || status == 'pending_yookassa_payment') return 'Ожидает оплаты'
  else if (status == 'in_progress') return 'В разработке'
  else if (status == 'completed') return 'Завершен'
  else if (status == 'cancelled') return 'Отменен'
  else return status ?? '—'
}

function onImgError(e){ e.target.style.display = 'none' }

function openOrder() {
  // если есть id — ведём на страницу заказа в профиле
  const id = orderLocal.value?.id ?? queryOrderId.value
  if (!id) return router.push({ path: '/profile?tab=orders' })
  router.push({ path: `/profile/orders/${id}` })
}

const formattedRaw = computed(() => {
  try { return JSON.stringify(orderLocal.value?.raw ?? {}, null, 2) }
  catch (e) { return String(orderLocal.value?.raw ?? '') }
})
</script>

<style scoped>
/* Все стили ручной работы, в rem */
:root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }

/* Страница */
.success-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Карточка */
.success-card {
  width: 100%;
  max-width: 820px;
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0.75rem 2rem rgba(6, 10, 20, 0.06);
  text-align: center;
  box-sizing: border-box;
}

/* Иконка */
.icon-wrap {
  width: 4.5rem;
  height: 4.5rem;
  margin: 0 auto;
  border-radius: 999px;
  background: linear-gradient(180deg,#16a34a,#059669);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-0.6rem);
  box-shadow: 0 6px 18px rgba(5,150,105,0.12);
}

.check-icon { width: 2.25rem; height: 2.25rem; display:block }

/* Заголовки и тексты */
.title { margin: -0.4rem 0 0.5rem; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.subtitle { margin: 0; color: #334155; font-size: 1rem; }
.accent { font-weight: 700; color: #0b1220; }

.note { margin-top: 0.6rem; color: #475569; font-size: 0.9rem; }

/* Кнопки */
.controls { margin-top: 1rem; display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:center; align-items:center; }
.btn {
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  background: none;
}
.btn:disabled { opacity: 0.6; cursor: default; }

.btn-primary {
  background: #0f172a;
  color: white;
  border-color: rgba(0,0,0,0.06);
  box-shadow: 0 6px 14px rgba(2,6,23,0.06);
}
.btn-outline {
  background: white;
  color: #0f172a;
  border: 1px solid #e6edf8;
}
.btn-link {
  background: transparent;
  color: #2563eb;
  border: none;
  text-decoration: underline;
}
.btn-inline {
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

/* Сообщения */
.message { margin-top: 1rem; color: #475569; font-size: 0.95rem; }
.message.error { color: #b91c1c; }

/* Блок заказа */
.order-block { margin-top: 1.25rem; text-align: left; border-top: 1px dashed #e6eef8; padding-top: 1rem; }
.order-heading { font-size: 1.05rem; margin: 0 0 0.75rem 0; color:#0f172a; font-weight:700; }

/* Верх блока */
.order-top { display:flex; gap:1rem; align-items:flex-start; }
.thumb {
  width: 8.5rem;
  height: 6rem;
  object-fit:cover;
  border-radius: 0.5rem;
  background: #f8fafc;
  flex-shrink:0;
  border: 1px solid #eef2ff;
}
.order-info { display:flex; flex-direction:column; gap:0.35rem; }
.order-title { font-size:1rem; font-weight:700; color:#0b1220; }
.order-meta { font-size:0.9rem; color:#475569; }
.order-price { margin-top:0.35rem; font-weight:800; font-size:1rem; color:#0b1220; }

/* Сетка деталей */
.order-grid { margin-top:0.9rem; display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem; }
.grid-item { background:#fbfdff; padding:0.6rem; border-radius:0.5rem; border:1px solid #f0f7ff; font-size:0.92rem; color:#0b1220; }

/* Рендер сырого JSON */
.raw-pre { max-height: 11rem; overflow:auto; background:#ffffff; padding:0.6rem; border-radius:0.4rem; border:1px solid #f1f5f9; font-size:0.82rem; white-space:pre-wrap; }

/* Статусы */
.status { display:inline-block; padding:0.25rem 0.6rem; border-radius:999px; font-weight:600; font-size:0.87rem; }
.status--completed { background:#dcfce7; color:#166534; }
.status--in_progress { background:#fffbeb; color:#854d0e; }
.status--pending_payment { background:#fee2e2; color:#b91c1c; }
.status--unknown { background:#f1f5f9; color:#334155; }

/* Responsive */
@media (max-width: 720px) {
  .success-card { padding: 1rem; border-radius: 0.75rem; }
  .order-top { flex-direction: column; align-items: center; text-align: center; }
  .order-info { align-items:center }
  .order-grid { grid-template-columns: 1fr; }
  .thumb { width: 7.5rem; height: 5.5rem; }
  .controls { gap: 0.4rem; }
}
</style>
