<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import NextCircle from '~/assets/icons/next-circle.svg'

import { useUserStore } from '~/stores/user'
import { useOrdersStore } from '~/stores/order'
// В Nuxt / Nitro navigateTo обычно глобален, но импорт защищает от undefined в других средах
import { navigateTo } from '#app'

const userStore = useUserStore()
const ordersStore = useOrdersStore()

// локальные стейты
const orders = ref([])
const loadingInitial = ref(false)    // загрузка первой страницы
const loadingMore = ref(false)       // загрузка доп. страниц
const error = ref(null)
const page = ref(1)
const perPage = ref(20)
const totalCount = ref(null)
const noMore = ref(false)

// элемент-сентинел для intersection observer
const sentinel = ref(null)
let observer = null

function goTo(path) { return navigateTo({ path }) }
function viewOrder(orderId) {
  if (!orderId) return
  return navigateTo({ path: `/profile/orders/${orderId}` })
}

function formatDate(raw) {
  if (!raw) return ''

  // принимаем разные поля и сам объект/строку/число
  const val = raw.created_at ?? raw.createdAt ?? raw.date ?? raw.order_date ?? raw.created ?? raw

  let d
  if (val instanceof Date) {
    d = val
  } else if (typeof val === 'number') {
    // числа могут быть в секундах (Unix) или миллисекундах
    // если значение маленькое — предполагаем секунды и умножаем на 1000
    const ms = val < 1e12 ? (val < 1e10 ? val * 1000 : val) : val
    d = new Date(ms)
  } else {
    // строка или другой тип — пробуем создать Date из строки
    d = new Date(String(val))
  }

  if (Number.isNaN(d.getTime())) return String(val ?? '')

  // Показываем дату и точное время: DD MMM YYYY, HH:MM:SS (локаль ru-RU)
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}


function formatTemplate(order) {
  return order.template?.title
    ?? order.template?.name
    ?? order.template_title
    ?? order.templateName
    ?? (typeof order.template === 'string' ? order.template : null)
    ?? '—'
}

function formatStatus(order) {
  return order.status ?? order.state ?? '—'
}

function statusCodeFrom(order) {
  const s = order.status ?? order.state ?? ''
  return String(s).toLowerCase().replace(/\s+/g, '_') || 'unknown'
}

function formatPrice(order) {
  const priceVal = order.price ?? order.amount ?? order.total
  const currency = order.currency ?? order.currency_code ?? 'RUB'
  if (typeof priceVal === 'number' && !Number.isNaN(priceVal)) {
    try {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency }).format(priceVal)
    } catch (e) {
      return `${priceVal}`
    }
  }
  return priceVal ?? '—'
}

/**
 * Попытка достать картинку превью шаблона из разных полей строки (без ошибок).
 */
function getTemplatePreview(o) {
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
  ];
  for (const c of candidates) {
    if (c && typeof c === 'string' && c.trim() !== '') return c;
  }
  return null;
}

/**
 * Загрузка страницы заказов.
 * если append === true — добавляем к списку, иначе перезаписываем (для initial load / refresh).
 */
async function loadOrdersPage(pageToLoad = 1, append = false) {
  // предотвращаем двойной вызов
  if (pageToLoad === 1 && loadingInitial.value) return
  if (pageToLoad > 1 && (loadingMore.value || loadingInitial.value)) return
  if (noMore.value && pageToLoad > 1) return

  if (pageToLoad === 1) {
    loadingInitial.value = true
    error.value = null
  } else {
    loadingMore.value = true
  }

  try {
    const res = await ordersStore.fetchUserOrders({ page: pageToLoad, perPage: perPage.value })
    if (!res.success) {
      error.value = res.message || 'Ошибка получения заказов'
      // если store содержит что-то — используем его (fallback)
      if (ordersStore.orders && ordersStore.orders.length > 0 && !append) {
        orders.value = ordersStore.orders.map(mapOrderForView)
      }
      return
    }

    const rows = res.data?.rows ?? (res.data ?? []).rows ?? ordersStore.orders ?? []
    const respPage = res.data?.page ?? pageToLoad
    const respPerPage = res.data?.perPage ?? perPage.value
    const respTotal = res.data?.totalCount ?? res.data?.total ?? ordersStore.totalCount ?? null

    totalCount.value = respTotal !== undefined ? Number(respTotal) : null
    page.value = respPage
    perPage.value = respPerPage

    const mapped = (rows || []).map(mapOrderForView)

    if (append) {
      // убираем дубли по id
      const existingIds = new Set(orders.value.map(o => o.id))
      const toAdd = mapped.filter(m => !existingIds.has(m.id))
      orders.value = orders.value.concat(toAdd)
    } else {
      orders.value = mapped
    }

    // если получили меньше, чем perPage — дальше грузить не надо
    if (!rows || rows.length === 0 || (rows.length < perPage.value) || (totalCount.value !== null && orders.value.length >= totalCount.value)) {
      noMore.value = true
      // если достигли конца — отключаем observer
      disconnectObserver()
    } else {
      noMore.value = false
    }
  } catch (err) {
    console.error('loadOrdersPage error', err)
    error.value = err?.message ?? 'Сетевая ошибка'
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

function mapOrderForView(o) {
  return {
    id: o.id,
    date: formatDate(o),
    template: formatTemplate(o),
    status: formatStatus(o),
    statusCode: statusCodeFrom(o),
    price: formatPrice(o),
    preview: getTemplatePreview(o),
    raw: o
  }
}

/** Загрузить следующую страницу */
async function loadMore() {
  if (noMore.value) return
  if (loadingMore.value || loadingInitial.value) return
  const next = (page.value || 1) + 1
  await loadOrdersPage(next, true)
}

/** IntersectionObserver: когда sentinel виден — грузим следующую страницу */
function createObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        // если нет ошибок и не на начальной загрузке и не в процессе загрузки
        if (!loadingInitial.value && !loadingMore.value && !noMore.value) {
          await loadMore()
        }
      }
    }
  }, {
    root: null,
    rootMargin: '200px', // подгружаем чуть заранее
    threshold: 0.1
  })

  // наблюдаем за sentinel только если он уже привязан к DOM
  if (sentinel.value) observer.observe(sentinel.value)
}

function disconnectObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

onMounted(async () => {
  // первая загрузка
  await loadOrdersPage(1, false)

  // ждём первый рендер, чтобы ref sentinel гарантированно привязался
  await nextTick()
  // если sentinel уже есть — создаём observer, иначе watch ниже подхватит
  createObserver()
})

// если sentinel позже привяжется — автоматически подключаем observer
watch(sentinel, (val) => {
  if (val) {
    // небольшая защита — пересоздать observer когда появится элемент
    createObserver()
  } else {
    // если sentinel убрали с DOM — отключаем observer
    disconnectObserver()
  }
})

onBeforeUnmount(() => {
  disconnectObserver()
})

/** ручная перезагрузка (если нужно) */
async function refresh() {
  noMore.value = false
  page.value = 1
  totalCount.value = null
  await loadOrdersPage(1, false)
  await nextTick()
  createObserver()
}


function getStatusTitle (status) {
  if(status == 'pending_payment') return 'Ожидает оплаты'
  else if(status == 'pending_yookassa_payment') return 'Ожидает оплаты'
  else if(status == 'in_progress') return 'В разработке'
  else if(status == 'completed') return 'Завершен'
  else if(status == 'cancelled') return 'Отменен'
  else return status
}
</script>

<template>
  <div class="profile-orders">
    <h2 class="profile-orders__title">Мои заказы</h2>

    <div v-if="loadingInitial" class="profile-orders__loading">
      Загрузка заказов...
    </div>

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
        <NextCircle class="next-cirlce__svg"/>
      </button>
    </div>

    <div v-else class="profile-orders__table">
      <div class="profile-orders__row profile-orders__row--header">
        <div class="profile-orders__cell">Дата</div>
        <div class="profile-orders__cell">Шаблон</div>
        <div class="profile-orders__cell">Статус</div>
        <div class="profile-orders__cell">Сумма</div>
        <div class="profile-orders__cell">Действия</div>
      </div>

      <div
        v-for="order in orders"
        :key="order.id"
        class="profile-orders__row"
      >
        <div class="profile-orders__cell profile-orders__cell--date">{{ order.date }}</div>

        <!-- Превью + заголовок шаблона (увеличено) -->
        <div class="profile-orders__cell profile-orders__cell--template">
          <div class="profile-orders__template">
            <img
              v-if="order.raw.template.preview"
              :src="order.raw.template.preview"
              class="profile-orders__thumb"
              @error="(e) => { e.target.style.display = 'none' }"
            />
            <div v-else class="profile-orders__thumb profile-orders__thumb--placeholder" />
            <div class="profile-orders__template-info">
              <div class="profile-orders__template-title">{{ order.raw.domain.fqdn }}</div>
            </div>
          </div>
        </div>

        <div class="profile-orders__cell profile-orders__cell--status">
          <span :class="[
            'profile-orders__status',
            `profile-orders__status--${order.statusCode}`
          ]">
            {{ getStatusTitle(order.status) }}
          </span>
        </div>

        <div class="profile-orders__cell profile-orders__cell--price">{{ order.price }}</div>

        <div class="profile-orders__cell profile-orders__cell--actions">
          <button class="profile-orders__action" @click="viewOrder(order.id)">
            Подробнее
          </button>
        </div>
      </div>

      <!-- Индикатор загрузки и sentinel для observer -->
      <div class="profile-orders__row" style="border-top: none;">
        <div class="profile-orders__cell" style="grid-column: 1 / -1; display:flex; justify-content:center; padding:20px;">
          <div v-if="loadingMore" class="profile-orders__loading">Загрузка...</div>
          <div v-else-if="noMore" class="profile-orders__loading">Больше заказов нет</div>
        </div>
      </div>

      <!-- sentinel (невидимый блок внизу страницы для триггера) -->
      <div ref="sentinel" style="height:1px; width:100%;"></div>
    </div>
  </div>
</template>

<style scoped>
.profile-orders__title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: var(--dark);
}

.profile-orders__table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.profile-orders__row {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr 1fr 1fr; /* Date | Template (bigger) | Status | Price | Actions */
  align-items: center;
  gap: 12px;
  background-color: white;
}

.profile-orders__row--header {
  background: #f8fafc;
  font-weight: 600;
  color: var(--dark);
}

.profile-orders__row:not(.profile-orders__row--header) {
  border-top: 1px solid #e2e8f0;
}

.profile-orders__cell {
  padding: 14px;
  min-height: 1px;
  text-wrap: nowrap;
}

/* шаблонная ячейка: миниатюра + текст */
.profile-orders__cell--template .profile-orders__template {
  display: flex;
  align-items: center;
}

.profile-orders__thumb {
  width: 140px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 14px;
  background: #f3f4f6;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(16,24,40,0.04);
}

/* плейсхолдер, когда картинки нет */
.profile-orders__thumb--placeholder {
  display: inline-block;
  width: 140px;
  height: 100px;
  border-radius: 8px;
  background: linear-gradient(90deg,#f3f4f6,#eef2f6);
  margin-right: 14px;
  flex-shrink: 0;
}

.profile-orders__template-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-orders__template-title {
  font-weight: 700;
  color: var(--dark);
  font-size: 1rem;
  line-height: 1.2;
}

.profile-orders__status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.profile-orders__status--completed {
  background: #dcfce7;
  color: #166534;
}

.profile-orders__status--in_progress {
  background: #fffbeb;
  color: #854d0e;
}

.profile-orders__status--pending_payment {
  background: #fee2e2;
  color: #b91c1c;
}

.profile-orders__loading,
.profile-orders__empty {
  text-align: center;
  padding: 40px;
  color: var(--gray);
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
}

.profile-orders__action {
  background: none;
  border: 1px solid transparent;
  color: var(--primary);
  cursor: pointer;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background .15s ease;
}

.profile-orders__action:hover {
  background: rgba(59,130,246,0.06);
}

.primary__button {
  background-color: var(--primary);
  color: var(--white);
  display: inline-block;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.next-cirlce__svg {
  margin-bottom: 0.1rem;
}

/* responsive: планшет */
@media (max-width: 1200px) {
  .profile-orders__thumb,
  .profile-orders__thumb--placeholder {
    width: 120px;
    height: 86px;
  }
  .profile-orders__row {
    grid-template-columns: 1fr 2.5fr 1fr 1fr 1fr;
  }
}

/* responsive: мобильный — стекаем карточки */
@media (max-width: 900px) {
  .profile-orders__row {
    display: block;
    padding: 12px 14px;
  }

  .profile-orders__row--header {
    display: none; /* скрываем заголовок табличного вида на мобильных */
  }

  .profile-orders__cell {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border: none;
  }

  .profile-orders__cell--template {
    padding-bottom: 10px;
  }

  .profile-orders__cell--date {
    font-size: 0.95rem;
    color: var(--gray);
    margin-bottom: 6px;
  }

  .profile-orders__template {
    align-items: center;
  }

  .profile-orders__thumb,
  .profile-orders__thumb--placeholder {
    width: 96px;
    height: 68px;
  }

  .profile-orders__template-info {
    gap: 4px;
  }

  /* нижняя панель: статус, price, button — в строку */
  .profile-orders__cell--status,
  .profile-orders__cell--price,
  .profile-orders__cell--actions {
    margin-top: 8px;
  }

  .profile-orders__cell--status {
    justify-content: flex-start;
  }

  .profile-orders__cell--price {
    font-weight: 700;
  }

  .profile-orders__cell--actions {
    justify-content: flex-start;
  }

  .profile-orders__row:not(.profile-orders__row--header) {
    border-top: 1px solid #eef2f6;
  }
}
</style>
