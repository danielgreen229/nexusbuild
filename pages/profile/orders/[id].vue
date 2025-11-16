<template>
  <div class="od-page">
    <div class="od-container">
      <NuxtLink to="/profile?tab=orders" class="od-back">&larr; Мои заказы</NuxtLink>

      <div v-if="loading" class="od-loading">Загрузка заказа...</div>

      <div v-else-if="error" class="od-error">
        Ошибка: {{ error }}
        <div style="margin-top: 1rem;"><button class="od-btn" @click="loadOrder">Повторить</button></div>
      </div>
      
      <div v-else-if="!orderLocal || !orderLocal.id" class="od-empty">Заказ не найден</div>
      
      <div v-else class="od-card">
        <div class="od-top">
          <img
            v-if="orderLocal.raw.template.preview"
            :src="orderLocal.raw.template.preview"
            class="od-thumb"
            @error="onImgError"
            alt="Превью шаблона"
          />
          <div class="od-info">
            <h1 class="od-title">{{ orderLocal.raw.domain.fqdn ?? '—' }}</h1>
            <div class="od-meta">Дата: {{ formatDate(orderLocal.raw) }}</div>
            <div class="order-status__container">
              <p>Статус:</p>
              <div class="od-meta" :class="[
  	            'profile-orders__status',
  	            `profile-orders__status--${orderLocal.raw.deploy_status}`
  	          ]">{{ getDeployStatusTitle(orderLocal.raw.deploy_status) }}</div>
            </div>
            <div class="od-price">{{ orderLocal.price }}</div>
          </div>
        </div>
        <section class="od-section">
          <h2 class="od-section-title">Детали заказа</h2>

          <div class="od-grid">
            <div class="od-grid-item"><strong>ID</strong><div>{{ orderLocal.id ?? '—' }}</div></div>
            <div class="od-grid-item"><strong>Шаблон</strong><div>{{ orderLocal.template ?? '—' }}</div></div>
            <div class="od-grid-item"><strong>Домен</strong><div>{{ orderLocal.raw.domain.fqdn ?? '—' }}</div></div>
            <div class="od-grid-item"><strong>Сумма</strong><div>{{ orderLocal.price }}</div></div>
          </div>


        </section>

        <section class="od-section">
          <h2 class="od-section-title">Этапы разработки</h2>
          <div class="od-section__steps">

            <div class="payment__container" :class="{'step-active': orderLocal.raw.deploy_status === 'pending_payment' || orderLocal.raw.deploy_status === 'pending_yookassa_payment'}">
              <div class="info__block">
                <payment class="image__container"/>
                <div class="info__about">
                  <h3>Ожидает оплаты</h3>
                  <p>Заказ создан, но оплата ещё не прошла</p>
                </div>
              </div>
              <vector class="vector-right__svg"/>
            </div>

            <div class="coding__container" :class="{'step-active': orderLocal.raw.deploy_status === 'in_progress'}">
              <div class="info__block">
                <coding class="image__container"/>
                <div class="info__about">
                  <h3>В разработке</h3>
                  <p>Проект в работе — наши разработчики готовят сайт</p>
                </div>
              </div>
              <vector class="vector-right__svg"/>
            </div>

            <div class="domain__container" :class="{'step-active': orderLocal.raw.deploy_status === 'deploying_domain'}">
              <div class="info__block">
                <domain class="image__container"/>
                <div class="info__about">
                  <h3>Подключение домена</h3>
                  <p>Привязываем домен и настраиваем доступ по адресу</p>
                </div>
              </div>

              <vector class="vector-right__svg"/>
            </div>

            <div class="succeed__container" :class="{'step-active': orderLocal.raw.deploy_status === 'completed' || orderLocal.raw.deploy_status === 'succeed'}">
              <div class="info__block">
                <succeed class="image__container"/>
                <div class="info__about">
                  <h3>Все готово</h3>
                  <p>Сайт опубликован и доступен в сети</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        
        <div class="od-actions">
          <!--<button class="od-btn od-btn--primary" @click="openOrderPage">Открыть страницу заказа (полный экран)</button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '~/stores/order'

import payment from '@/components/ui/icons/payments.vue';
import coding from '@/components/ui/icons/coding.vue';
import domain from '@/components/ui/icons/domain.vue';
import succeed from '@/components/ui/icons/succeed.vue';
import vector from '@/assets/icons/vector-right.svg';

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

const idParam = ref(route.params.id ?? route.params.orderId ?? null)
const loading = ref(false)
const error = ref(null)
const orderLocal = ref({})

watch(() => route.params.id, (v) => { idParam.value = v })

onMounted(async () => {
  await loadOrder()
})

watch(idParam, async (v, oldV) => {
  if (v !== oldV) await loadOrder()
})


function getStatusTitle (status) {
  if(status == 'pending_payment') return 'Ожидает оплаты'
  else if(status == 'pending_yookassa_payment') return 'Ожидает оплаты'
  else if(status == 'in_progress') return 'В разработке'
  else if(status == 'deploying_domain') return 'Подключение домена'
  else if(status == 'completed') return 'Проект запущен'
  else if(status == 'cancelled') return 'Отменен'
  else return 'В разработке'
}

function getDeployStatusTitle(status) {
  if(status == 'pending_payment') return 'Ожидает оплаты'
  else if(status == 'pending_yookassa_payment') return 'Ожидает оплаты'
  else if(status == 'in_progress') return 'В разработке'
  else if(status == 'deploying_domain') return 'Подключение домена'
  else if(status == 'completed') return 'Проект запущен'
  else if(status == 'cancelled') return 'Отменен'
  else return 'В разработке'
}

async function loadOrder() {
  const id = idParam.value
  if (!id) {
    error.value = 'Не указан ID заказа'
    orderLocal.value = {}
    return
  }

  loading.value = true
  error.value = null

  try {
    // сначала ищем в store
    let o = null
    if (Array.isArray(ordersStore.orders)) {
      o = ordersStore.orders.find(x => String(x.id ?? x.order_id ?? x._id) === String(id))
    }

    // если не нашли — пробуем fetchOrder (если есть)
    if (!o && typeof ordersStore.fetchOrder === 'function') {
      const res = await ordersStore.fetchOrder(id)
      if (res && res.success && res.data) o = res.data
      else if (res && res.order) o = res.order
      else if (res && res.data === undefined && res.success) o = res // в некоторых реализациях возвращается объект заказа напрямую
    }

    if (!o) {
      // пробуем запросить через fetchUserOrders как fallback (по одной записи)
      if (typeof ordersStore.fetchUserOrders === 'function') {
        const pageRes = await ordersStore.fetchUserOrders({ page: 1, perPage: 1 })
        if (pageRes && pageRes.success && Array.isArray(pageRes.data?.rows) && pageRes.data.rows.length > 0) {
          o = pageRes.data.rows.find(r => String(r.id ?? r.order_id ?? r._id) === String(id))
        }
      }
    }

    if (!o) {
      // окончательный фейл
      error.value = 'Не удалось найти заказ'
      orderLocal.value = {}
      return
    }

    orderLocal.value = mapOrderForView(o)
  } catch (err) {
    console.error('OrderDetailsPage loadOrder error', err)
    error.value = err?.message ?? 'Сетевая ошибка'
    orderLocal.value = {}
  } finally {
    loading.value = false
  }
}

function mapOrderForView(o) {
  if (!o) return {}
  return {
    id: o.id ?? o.order_id ?? o._id ?? null,
    date: formatDate(o),
    template: o.template?.title ?? o.template?.name ?? o.template_title ?? o.templateName ?? (typeof o.template === 'string' ? o.template : null) ?? '—',
    status: o.status ?? o.state ?? '—',
    statusCode: String(o.status ?? o.state ?? '').toLowerCase().replace(/\s+/g, '_') || 'unknown',
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
  const currency = o.currency ?? o.currency_code ?? 'RUB'
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


function onImgError(e) { e.target.style.display = 'none' }

function goBack() { router.push({ path: '/profile?tab=orders' }) }

function openOrderPage() {
  // этот компонент уже и есть страница; но сохраняем совместимость с возможным "полноэкранным" роутом
  const id = orderLocal.value?.id
  if (!id) return
  router.push({ path: `/profile/orders/${id}` })
}

const formattedRaw = computed(() => {
  try { return JSON.stringify(orderLocal.value?.raw ?? {}, null, 2) }
  catch (e) { return String(orderLocal.value?.raw ?? '') }
})
</script>

<style scoped>
/* Все в rem */
.od-page { padding: 0rem 1rem; min-height: 100vh; max-width: 2100px; margin: 0 auto; }
.od-container { margin: 0 auto; }

.od-back { text-decoration: none;     display: block; background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer;     font-size: 1.3rem;
    padding: 0rem 0.5rem 1rem 0.5rem; }

.od-card { background: #fff; border-radius: 0.5rem; padding: 1.25rem; box-shadow: 0 0.5rem 1rem rgba(2,6,23,0.06); }

.od-top { display: flex; gap: 1rem; align-items: flex-start; }
.od-thumb { width: 9rem; height: 6.5rem; object-fit: cover; border-radius: 0.5rem; background: #f3f4f6; flex-shrink: 0 }
.od-info { display: flex; flex-direction: column; gap: 0.4rem }
.od-title { font-size: 1.25rem; margin: 0; font-weight: 700 }
.od-meta { font-size: 0.9375rem; color: #374151 }
.od-price { margin-top: 0.5rem; font-weight: 700; font-size: 1rem }

.od-section { margin-top: 1rem }
.od-section-title { font-size: 1rem; margin: 0 0 0.5rem 0 }
.od-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem }
.od-grid-item { font-size: 0.9375rem }

.od-raw { margin-top: 1rem }
.od-pre { max-height: 18rem; overflow: auto; padding: 0.75rem; background: #fafafa; border-radius: 0.375rem }

.od-actions { display: flex; gap: 0.5rem; margin-top: 1rem; justify-content: flex-end }
.od-btn { padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid transparent; background: none; cursor: pointer; font-weight: 600 }
.od-btn--primary { background: var(--primary); color: var(--white); border: none }

.od-loading, .od-error, .od-empty { padding: 1.25rem; text-align: center; font-size: 1rem }

.profile-orders__status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
	width: fit-content;
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

.profile-orders__status { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.9rem; font-weight: 500; }
.profile-orders__status--succeed { background: #dcfce7; color: #166534; }
.profile-orders__status--completed { background: #dcfce7; color: #4c3ce1; }
.profile-orders__status--in_progress { background: #fffbeb; color: #854d0e; }
.profile-orders__status--pending_payment { background: #fee2e2; color: #b91c1c; }
.profile-orders__status--pending_yookassa_payment { background: #2663eb; color: #ffffff; }
.profile-orders__status--deploying_domain { background: #9256da; color: #ffffff; }

.payment__container, .succeed__container, .domain__container, .coding__container {
  width: 25%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  opacity: 0.4;
}

.image__container {
  z-index: -1;
}
.od-section__steps {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}

.step-active {
  opacity: 1;
}

.vector-right__svg {
  min-width: 3rem;
  min-height: 3rem;
}
.info__block {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: nowrap;
  z-index: 1;
}

.profile-orders__status--completed { background: #dcfce7; color: #166534; }
.profile-orders__status--succeed { background: #dcfce7; color: #166534; }
.profile-orders__status--in_progress {     background: #7cbeff;
    color: #ffffff; }
.profile-orders__status--pending_payment { background: #ff714c; color: white; }
.profile-orders__status--pending_yookassa_payment { background: #ff714c; color: #ffffff; }
.profile-orders__status--deploying_domain { background: #628dff; color: #ffffff; }


.order-status__container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 0.5rem;
  align-items: center;
}

@media (max-width: 768px) {
  .od-top { flex-direction: column }
  .od-thumb { width: 7.5rem; height: 5.25rem }
  .od-container {
    padding-top: 1rem;
  }
  .od-section__steps {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    width: 100%;
    gap: 1rem;
  }
  .payment__container, .succeed__container, .domain__container, .coding__container {
    display: flex;
    width: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 1rem;
  }
  .info__block > .image__container {
    width: 50%;
    margin: 0 auto;
  }
  .info__block {
    width: 100%;
  }
  .vector-right__svg {
    transform: rotate(90deg);
  }
}
</style>
