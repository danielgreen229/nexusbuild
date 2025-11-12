<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import NextCircle from '~/assets/icons/next-circle.svg'
import { usePaymentStore } from '~/stores/payment'
import { useUserStore } from '~/stores/user'
import { useOrdersStore } from '~/stores/order'
import { navigateTo } from '#app'
import openIcon from '@/assets/icons/open.svg'
const paymentStore = usePaymentStore()
const userStore = useUserStore()
const ordersStore = useOrdersStore()

/* states */
const orders = ref([]) // safe mapped orders
const loadingInitial = ref(false)
const loadingMore = ref(false)
const error = ref(null)

const page = ref(1)
const perPage = ref(20)
const totalCount = ref(null)
const noMore = ref(false)

const sentinel = ref(null)
let observer = null

const paymentLoading = ref(null) // order id currently loading payment
const paymentErrors = ref({})   // { [orderId]: message }

/* Helpers */
function goTo(path) { return navigateTo({ path }) }
function viewOrder(orderId) {
  if (!orderId) return
  return navigateTo({ path: `/profile/orders/${orderId}` })
}

function safeNumber(val) {
  if (typeof val === 'number' && !Number.isNaN(val)) return val
  if (typeof val === 'string' && val.trim() !== '') {
    const n = Number(val)
    return Number.isNaN(n) ? null : n
  }
  return null
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
  return d.toLocaleString('ru-RU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

function openLink (link) {
  if (typeof window === 'undefined') return
  if(!link) return 
  const features = 'noopener,noreferrer'
  let timedLink = link
  timedLink = link.replace('https://', '')
  timedLink = 'https://' + timedLink
  window.open(timedLink, '_blank', features)
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
    o.raw?.preview,
  ]
  for (const c of candidates) if (c && typeof c === 'string' && c.trim() !== '') return c
  return null
}

function statusCodeFrom(order) {
  const s = order?.status ?? order?.state ?? ''
  return String(s).toLowerCase().replace(/\s+/g, '_') || 'unknown'
}

function getDeployStatusTitle(status) {
  if (!status) return '—'
  if (status === 'pending_payment' || status === 'pending_yookassa_payment') return 'Ожидает оплаты'
  if (status === 'in_progress') return 'В разработке'
  if (status === 'deploying_domain') return 'Подключение домена'
  if (status === 'succeed') return 'Все готово'
  return 'В разработке'
}

function getStatusTitle(status) {
  if (!status) return '—'
  if (status === 'pending_payment' || status === 'pending_yookassa_payment') return 'Ожидает оплаты'
  if (status === 'in_progress') return 'В разработке'
  if (status === 'completed') return 'Оплачен'
  if (status === 'cancelled') return 'Отменен'
  return 'В разработке'
}

function formatPriceForDisplay(order) {
  const num = safeNumber(order.price ?? order.amount ?? order.total)
  const currency = order.currency ?? order.currency_code ?? 'RUB'
  if (num != null) {
    try { return new Intl.NumberFormat('ru-RU', { style: 'currency', currency }).format(num) }
    catch { return String(num) }
  }
  return order.price ?? '—'
}

/* Map + safety */
function mapOrderForView(o) {
  if (!o || typeof o !== 'object') {
    const fallbackId = `order-invalid-${Date.now()}-${Math.floor(Math.random()*1000)}`
    return {
      id: fallbackId,
      date: '',
      template: '—',
      status: '—',
      statusCode: 'unknown',
      price: '—',
      preview: null,
      raw: {}
    }
  }

  const id = o.id ?? o.order_id ?? o._id ?? (o.raw?.id) ?? (o.domain?.fqdn ? `order-${String(o.domain.fqdn)}` : `order-${String(o.template_id ?? o.templateId ?? Date.now())}`)
  const safeId = String(id)

  const priceVal = safeNumber(o.price ?? o.amount ?? o.total)
  return {
    id: safeId,
    date: formatDate(o),
    template: o.template?.title ?? o.template_name ?? o.template ?? '—',
    status: o.status ?? o.state ?? '—',
    statusCode: statusCodeFrom(o),
    price: priceVal != null ? priceVal : (o.price ?? o.amount ?? '—'),
    preview: getTemplatePreview(o),
    raw: o
  }
}

/* Loading orders */
async function loadOrdersPage(pageToLoad = 1, append = false) {
  if (pageToLoad === 1 && loadingInitial.value) return
  if (pageToLoad > 1 && (loadingMore.value || loadingInitial.value)) return
  if (noMore.value && pageToLoad > 1) return

  if (pageToLoad === 1) { loadingInitial.value = true; error.value = null }
  else loadingMore.value = true

  try {
    const res = await ordersStore.fetchUserOrders({ page: pageToLoad, perPage: perPage.value })
    if (!res || !res.success) {
      error.value = res?.message ?? 'Ошибка получения заказов'
      if (ordersStore.orders && Array.isArray(ordersStore.orders) && ordersStore.orders.length && !append) {
        orders.value = ordersStore.orders.filter(Boolean).map(mapOrderForView)
      }
      return
    }

    let rows = res.data?.rows ?? res.data ?? ordersStore.orders ?? []
    if (!Array.isArray(rows)) rows = []
    rows = rows.filter(r => r != null)

    const respPage = res.data?.page ?? pageToLoad
    const respPerPage = res.data?.perPage ?? perPage.value
    const respTotal = res.data?.totalCount ?? res.data?.total ?? null

    page.value = respPage
    perPage.value = respPerPage
    totalCount.value = respTotal != null ? Number(respTotal) : null

    const mapped = rows.map(mapOrderForView).filter(Boolean)

    if (append) {
      const existingIds = new Set(orders.value.map(o => String(o.id)))
      const toAdd = mapped.filter(m => !existingIds.has(String(m.id)))
      orders.value = orders.value.concat(toAdd)
    } else {
      orders.value = mapped
    }

    if (!rows || rows.length === 0 || rows.length < perPage.value || (totalCount.value != null && orders.value.length >= totalCount.value)) {
      noMore.value = true
      disconnectObserver()
    } else noMore.value = false

  } catch (err) {
    console.error('loadOrdersPage error', err)
    error.value = err?.message ?? 'Сетевая ошибка'
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

/* Pagination / Observer */
async function loadMore() {
  if (noMore.value) return
  if (loadingMore.value || loadingInitial.value) return
  const next = (page.value || 1) + 1
  await loadOrdersPage(next, true)
}

function createObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !loadingInitial.value && !loadingMore.value && !noMore.value) {
        await loadMore()
      }
    }
  }, { root: null, rootMargin: '200px', threshold: 0.1 })

  if (sentinel.value) observer.observe(sentinel.value)
}

function disconnectObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

/* lifecycle */
onMounted(async () => {
  await loadOrdersPage(1, false)
  await nextTick()
  createObserver()
})

watch(sentinel, (val) => {
  if (val) createObserver()
  else disconnectObserver()
})

onBeforeUnmount(() => disconnectObserver())

async function refresh() {
  noMore.value = false
  page.value = 1
  totalCount.value = null
  await loadOrdersPage(1, false)
  await nextTick()
  createObserver()
}

async function goToPayment(order) {
  if (!order || !order.id) return
  if (paymentLoading.value) return
  if (order.status === 'completed' || order.status === 'in_progress') {
    return viewOrder(order.id)
  }

  paymentLoading.value = order.id
  paymentErrors.value = { ...paymentErrors.value, [order.id]: null }

  try {
    const resp = await paymentStore.createYooKassaPayment(order.id)
    if (!resp.success) {
      paymentErrors.value = { ...paymentErrors.value, [order.id]: resp.error || 'Ошибка создания платежа' }
      return
    }

    const confirmationUrl = resp.confirmationUrl || resp.data?.confirmationUrl || resp.data?.confirmation_url || null

    // обновляем локальную запись
    const idx = orders.value.findIndex(o => String(o.id) === String(order.id))
    if (idx !== -1) {
      orders.value[idx].status = resp.data?.status ?? 'pending_yookassa_payment'
      orders.value[idx].statusCode = statusCodeFrom({ status: orders.value[idx].status })
    }

    if (confirmationUrl) {
      window.open(confirmationUrl, '_blank')
      setTimeout(() => { refresh().catch(()=>{}) }, 1200)
    } else {
      paymentErrors.value = { ...paymentErrors.value, [order.id]: 'Ссылка на оплату не получена' }
    }

  } catch (err) {
    paymentErrors.value = { ...paymentErrors.value, [order.id]: err?.message || 'Ошибка' }
  } finally {
    paymentLoading.value = null
  }
}
</script>

<template>
  <div class="profile-orders">
    <h2 class="profile-orders__title">Мои заказы</h2>

    <div v-if="loadingInitial" class="profile-orders__loading">Загрузка заказов...</div>

    <div v-else-if="error" class="profile-orders__loading">
      Ошибка: {{ error }}
      <div style="margin-top:12px;">
        <button class="primary__button" @click="refresh">Повторить</button>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="profile-orders__empty">
      У вас пока нет заказов
      <button class="primary__button" @click="goTo('/templates')">
        Купить сайт
        <NextCircle class="next-cirlce__svg" />
      </button>
    </div>

    <div v-else class="profile-orders__table" role="table" aria-label="Список заказов">
      <!-- header (визуальный) -->
      <div class="profile-orders__row profile-orders__row--header" role="row">
        <div class="profile-orders__cell">Дата</div>
        <div class="profile-orders__cell">Шаблон</div>
        <div class="profile-orders__cell">Статус разработки</div>
        <div class="profile-orders__cell">Статус</div>
        <div class="profile-orders__cell">Сумма</div>
        <div class="profile-orders__cell">Действия</div>
      </div>
      <template v-for="(order, idx) in orders" :key="order.id ?? `order-${idx}`">
        <!-- desktop / tablet: одна линия (grid) -->
        <div v-if="order" class="profile-orders__row profile-orders__row--data" role="row" :aria-label="`Заказ ${order.id}`">
          <div class="profile-orders__cell profile-orders__cell--date" :title="order.date">{{ order.date }}</div>

          <div class="profile-orders__cell profile-orders__cell--template">
            <div class="profile-orders__template">
              <img
                v-if="order.raw?.template?.preview"
                :src="order.raw.template.preview"
                class="profile-orders__thumb"
                @error="(e)=>{ e.target.style.display = 'none' }"
                :alt="order.template || 'preview'"
              />
              <div v-else class="profile-orders__thumb profile-orders__thumb--placeholder" />
              <div class="profile-orders__template-info" @click="openLink(order.raw?.domain?.fqdn)">
                <div class="profile-orders__template-title" :title="order.raw?.domain?.fqdn ?? order.template">
                  {{ order.raw?.domain?.fqdn ?? order.template }}
                </div>

                <openIcon class="open__svg"/>

              </div>
            </div>
          </div>
          <div class="profile-orders__cell profile-orders__cell--status" :title="getDeployStatusTitle(order.raw.deploy_status)">
            <span :class="['profile-orders__status', `profile-orders__status--${order.statusCode}`]">
              {{ getDeployStatusTitle(order.raw.deploy_status) }}
            </span>
          </div>

          <div class="profile-orders__cell profile-orders__cell--status" :title="getStatusTitle(order.status)">
            <span :class="['profile-orders__status', `profile-orders__status--${order.statusCode}`]">
              {{ getStatusTitle(order.status) }}
            </span>
          </div>

          <div class="profile-orders__cell profile-orders__cell--price" :title="formatPriceForDisplay(order)">{{ formatPriceForDisplay(order) }}</div>

          <div class="profile-orders__cell profile-orders__cell--actions">
            <button
              class="profile-orders__pay"
              v-if="!(paymentLoading === order.id || order.status === 'completed' || order.status === 'in_progress')"
              @click="goToPayment(order)"
            >
              <span v-if="paymentLoading === order.id">Переход к оплате...</span>
              <span v-else>Оплатить</span>
            </button>

            <button class="profile-orders__action" @click="viewOrder(order.id)">Подробнее</button>
          </div>
        </div>

        <!-- error row -->
        <div v-if="order && paymentErrors[order.id]" :key="`err-${order.id}`" class="profile-orders__row profile-orders__row--error" style="background:#fff7f7;">
          <div class="profile-orders__cell profile-orders__cell--error" style="grid-column:1 / -1; color:#b91c1c;">
            Ошибка оплаты ({{ order.id }}): {{ paymentErrors[order.id] }}
          </div>
        </div>
      </template>

      <div class="profile-orders__row profile-orders__row--footer" style="border-top:none;">
        <div class="profile-orders__cell" style="grid-column:1 / -1; display:flex; justify-content:center; padding:20px;">
          <div v-if="loadingMore" class="profile-orders__loading">Загрузка...</div>
          <div v-else-if="noMore" class="profile-orders__loading">Больше заказов нет</div>
        </div>
      </div>

      <div ref="sentinel" style="height:1px; width:100%"></div>
    </div>
  </div>
</template>

<style scoped>
.profile-orders__title { font-size: 1.8rem; margin-bottom: 20px; color: var(--dark); }

/* контейнер таблицы: при узком экране — горизонтальный скролл (если нужно),
   но для телефонной версии мы переключаемся на карточный вид */
.profile-orders__table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow-x: auto; /* horizontal scroll if needed on tablet/desktop */
  background: white;
}

/* desktop/tablet: grid строка с 6 колонками */
.profile-orders__row {
  display: grid;
  grid-template-columns: 14% 33% 13% 11% 10% 16%;
  align-items: center;
  gap: 12px;
  background-color: white;
  min-height: 64px;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 12px;
}

/* header */
.profile-orders__row--header {
  background: #f8fafc;
  font-weight: 600;
  color: var(--dark);
  padding: 12px;
}

/* разделители между строками */
.profile-orders__row:not(.profile-orders__row--header) { border-top: 1px solid #e2e8f0; }

/* ячейки: однострочные, обрезка с многоточием */
.profile-orders__cell {
  padding: 12px 8px;
  min-height: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.95rem;
  box-sizing: border-box;
  text-align: center;
}

/* шаблон: картинка + текст, текст ограничен и с ellipsis */
.profile-orders__cell--template .profile-orders__template {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.profile-orders__thumb {
  width: 30%;
  height: 7rem;
  object-fit: cover;
  border-radius: 8px;
  background: #f3f4f6;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(16,24,40,0.04);
}

.profile-orders__thumb--placeholder {
  display: inline-block;
  width: 84px;
  height: 56px;
  border-radius: 8px;
  background: linear-gradient(90deg,#f3f4f6,#eef2f6);
  flex-shrink: 0;
}

.nuxt-icon--fill, .nuxt-icon--fill * {
  fill: revert-layer;
}

.profile-orders__template-info {
  display: flex;
  flex-direction: row;
  gap: 6px;
  min-width: 0; /* для ellipsis */
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: 0.3s ease all;
}

.profile-orders__template-info:hover {

  .profile-orders__template-title, .open__svg {
    color: #2663eb !important;
  }
}

.profile-orders__template-title {
  font-weight: 700;
  color: var(--dark);
  font-size: 1rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  transition: 0.3s ease all;
}

/* статусы */
.profile-orders__status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-orders__status--completed { background: #dcfce7; color: #166534; }
.profile-orders__status--in_progress { background: #fffbeb; color: #854d0e; }
.profile-orders__status--pending_payment { background: #fee2e2; color: #b91c1c; }
.profile-orders__status--pending_yookassa_payment { background: #2663eb; color: #ffffff; }

/* загрузки и пустое состояние */
.profile-orders__loading, .profile-orders__empty {
  text-align:center;
  padding:40px;
  color:var(--gray);
  font-size:1.05rem;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  gap:1rem;
}

/* кнопки и действия */
.profile-orders__action { background:none; border:1px solid transparent; color:var(--primary); cursor:pointer; font-weight:600; padding:8px 12px; border-radius:8px; transition:background .15s ease; white-space:nowrap; }
.profile-orders__pay { padding:0.6rem 1.1rem; font-size:1rem; border-radius:1.5rem; font-weight:600; letter-spacing:-0.03em; text-align:center; color:#fff; background: linear-gradient(133deg, #1c4eff 0%, #bfa1ff 100%); border:none; outline:none; line-height:1; height:fit-content; cursor:pointer; white-space:nowrap; }
.profile-orders__pay[disabled] { opacity:0.7; cursor:not-allowed; filter:grayscale(0.03); }
.primary__button { background-color:var(--primary); color:var(--white); display:inline-block; padding:12px 28px; border-radius:8px; font-weight:600; cursor:pointer; transition:all 0.3s ease; border:none; font-size:1rem; }
.next-cirlce__svg { margin-bottom:0.1rem; }

.open__svg {
  width: 1rem;
  height: 1rem;
  margin: 0;
  transition: 0.3s ease all;
}

/* действия: не переносятся */
.profile-orders__cell--actions { display:flex; flex-direction:row; flex-wrap: wrap; gap:0.5rem; justify-content: center; }

/* сообщение об ошибке: другой фон */
.profile-orders__row--error { background: #fff7f7; }
.profile-orders__cell--error { color: #b91c1c; }

/* footer */
.profile-orders__row--footer { background: transparent; }

/* responsive: tablet */
@media (max-width:1200px) {
  .profile-orders__row { grid-template-columns: 14% 22% 20% 16% 11% 11%; }
  .profile-orders__thumb, .profile-orders__thumb--placeholder { width:72px; height:48px; }
  .profile-orders__cell { padding:10px; }
}

/* PHONE: <=700px — переключаемся на карточный (вертикальный) макет,
   чтобы всё было читаемо и ничего не "скрывалось" */
@media (max-width:768px) {
  .profile-orders__table { overflow-x: visible; padding:8px; }
  .profile-orders__row {
    display: block;
    padding: 12px;
    border-radius: 10px;
    margin: 8px 0;
    box-shadow: 0 1px 2px rgba(2,6,23,0.035);
    border: 1px solid #eef2f6;
  }

  .profile-orders__row--header { display: none; } /* header скрываем в карточном виде */

  .profile-orders__cell {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
    white-space: normal;
    overflow: visible;
  }

  .profile-orders__cell--template .profile-orders__template { gap:10px; }
  .profile-orders__thumb, .profile-orders__thumb--placeholder { width:72px; height:48px; flex-shrink:0; }

  /* расположение полей в карточке: дата + действия в верхнем ряду, затем шаблон и т.д. */
  .profile-orders__cell--date { font-size:0.95rem; color:var(--gray); font-weight:600; }
  .profile-orders__template-info { gap:4px; }
  .profile-orders__template-title { font-size:1rem; font-weight:700; line-height:1.1; }

  .profile-orders__cell--status,
  .profile-orders__cell--price {
    margin-top: 6px;
    display: flex;
    align-items: center;
  }

  .profile-orders__cell--actions {
    margin-top: 10px;
    justify-content: flex-start;
    gap: 8px;
  }

  .profile-orders__row--error { margin-top:6px; }
  .profile-orders__cell--error { padding:8px 0; display:block; color:#b91c1c; }
}
</style>
