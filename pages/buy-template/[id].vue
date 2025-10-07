<template>
  <div class="container">
    <div class="wrapper">
      <!-- LEFT: информация о шаблоне и доступные опции -->
      <section class="card main">
        <h1 class="title">Сайт "{{ template.title }}"</h1>
        <div class="meta">
          <span class="price">{{ formatCurrency(template.price) }}</span>
        </div>

        <div class="extras">
          <h3>Дополнительные опции</h3>

          <label class="addon">
            <input type="checkbox" v-model="addons.extraPage.enabled" />
            Доп. страница — {{ formatCurrency(addons.extraPage.price) }} / страница
          </label>
          <div v-if="addons.extraPage.enabled" class="addon-ctrl">
            <label>Количество:
              <input type="number" min="0" step="1" v-model.number="addons.extraPage.count" />
            </label>
          </div>

          <label class="addon">
            <input type="checkbox" v-model="addons.customization.enabled" />
            Кастомизация — {{ formatCurrency(addons.customization.pricePerHour) }} / час
          </label>
          <div v-if="addons.customization.enabled" class="addon-ctrl">
            <label>Часы:
              <input type="number" min="0" step="1" v-model.number="addons.customization.hours" />
            </label>
          </div>

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
      </section>

      <!-- RIGHT: корзина / заказ -->
      <aside class="card sidebar">
        <h2>Ваш заказ</h2>

        <div class="order-lines">
          <div class="line">
            <span>Базовая цена</span>
            <span>{{ formatCurrency(basePrice) }}</span>
          </div>

          <div class="line" v-if="selectedPagesCount !== template.pages.length">
            <span>Выбранные страницы</span>
            <span>{{ selectedPagesCount }} / {{ template.pages.length }}</span>
          </div>

          <div class="line" v-if="addons.extraPage.enabled && addons.extraPage.count > 0">
            <span>Доп. страницы (x{{ addons.extraPage.count }})</span>
            <span>{{ formatCurrency(extraPagesCost) }}</span>
          </div>

          <div class="line" v-if="addons.customization.enabled && addons.customization.hours > 0">
            <span>Кастомизация ({{ addons.customization.hours }} ч)</span>
            <span>{{ formatCurrency(customizationCost) }}</span>
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
          <label class="input">
            Имя:
            <input v-model="buyer.name" placeholder="Иван Иванов" />
          </label>
          <label class="input">
            Телефон / email:
            <input v-model="buyer.contact" placeholder="+7 900 000-00-00 или email@example.com" />
          </label>

          <button class="btn primary" :disabled="placing" @click="placeOrder">
            {{ placing ? 'Оформление…' : 'Оформить заказ' }}
          </button>

          <button class="btn ghost" @click="resetSelections">Сбросить</button>

          <div class="note">
            <small>Нажимая «Оформить заказ», вы отправляете заявку. Реальная интеграция с оплатой/бекендом не включена в этот пример.</small>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useTemplateStore } from '~/stores/template'

const route = useRoute()
const store = useTemplateStore()
const id = route.params.id

onMounted(async () => {
  if (id) {
    try {
      await store.getTemplateById(id)
    } catch (e) {
      // error stored in store
    }
  }
})

const template = computed(() => store.current || {
  id: null, title: '', price: 0, image: '', description: '', features: [], pages: [], technologies: [], screenshots: [], preview: '', discount_percent: 0, discount_amount: 0
})

const basePrice = computed(() => Number(template.value.price || 0))

const addons = ref({
  extraPage: { enabled: false, price: 1000, count: 0 },
  customization: { enabled: false, pricePerHour: 500, hours: 0 },
  priority: { enabled: false, price: 2000 },
  hosting: { enabled: false, price: 1000 }
})

const selectedPages = ref([])

onMounted(() => {
  if (template.value.pages && template.value.pages.length) {
    selectedPages.value = [...template.value.pages]
  }
})

watchEffect(() => {
  if (template.value.pages && selectedPages.value.length === 0) {
    selectedPages.value = [...template.value.pages]
  }
})

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
  if (!buyer.value.name || !buyer.value.contact) {
    alert('Укажите имя и контакт для оформления заказа.')
    return
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
      buyer: buyer.value,
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
</script>

<style scoped>
/* Общие */
.container {
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
  gap: 1.25rem; /* ~20px */
  align-items: flex-start;
  padding: 0.5rem;
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
.main { flex: 1 1 40rem; min-width: 0; }
.sidebar { flex: 0 0 26rem; min-width: 18rem; max-height: calc(100vh - 4rem); overflow: auto; position: sticky; top: 1rem; }

/* Типографика */
.title { font-size: 1.25rem; margin: 0.75rem 0; line-height: 1.2; }
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
.input { display:block; margin:0.625rem 0; font-size:0.95rem; }
.input input { width:100%; padding:0.5rem 0.625rem; border:0.0625rem solid #dddddd; border-radius:0.375rem; font-size:1rem; }

.order-actions { margin-top: 0.875rem; display:flex; flex-direction:column; gap:0.5rem; }
.btn { display:inline-flex; align-items:center; justify-content:center; padding:0.625rem 0.875rem; border-radius:0.5rem; border:none; cursor:pointer; font-size:1rem; }
.btn.primary { background:#0070f3; color:#fff; box-shadow: 0 0.125rem 0.375rem rgba(0,112,243,0.12); }
.btn.primary:disabled { opacity:0.6; cursor:not-allowed; }
.btn.ghost { background:transparent; border:0.0625rem solid #dddddd; }

/* Примечание */
.note { margin-top:0.75rem; color:#666666; font-size:0.875rem; }

/* Фокус для доступности */
input:focus, button:focus, a:focus { outline: 0.1875rem solid rgba(0,112,243,0.12); outline-offset: 0.125rem; }

/* Адаптив */
@media (max-width: 64rem) {
  .sidebar { flex: 0 0 22rem; }
}

@media (max-width: 48rem) {
  .wrapper { flex-direction: column; gap: 0.875rem; align-items: stretch; }
  .sidebar { position: relative; top: 0; flex: 1 1 auto; max-height: none; min-width: 0; }
  .main { flex: 1 1 auto; }
  .btn { padding: 0.75rem 0.875rem; font-size: 1.05rem; }
  .input input { padding: 0.625rem 0.75rem; }
}

@media (max-width: 32rem) {
  .title { font-size: 1.125rem; }
}

/* Печать */
@media print {
  .sidebar { position: static; max-height: none; }
  .btn, input { box-shadow: none; outline: none; }
  .container { background: #fff; padding: 0; }
}
</style>
