<script setup>
import OpenNext from '~/assets/icons/open-next.svg'
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Button from '@/components/ui/Button.vue'
import { useUserStore } from '~/stores/user'

// Включите для подробного локального дебага
const DEBUG = false

const props = defineProps({
  template: { type: Object, required: true }
})
const emit = defineEmits(['view'])
const userStore = useUserStore()
const loading = ref(false)

// helpers
const round2 = (v) => { const n = Number(v) || 0; return Math.round((n + Number.EPSILON) * 100) / 100 }
const fmt = (v) => { const n = Number(v) || 0; return n.toLocaleString('ru-RU', { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 }) }

// NEW: have_html detection
const haveHtml = computed(() => {
  const t = props.template?.have_html ?? props.template?.haveHtml
  if (typeof t !== 'undefined') return Boolean(t)
  if (typeof window !== 'undefined') return Boolean(window?.have_html)
  return false
})

// price & discount (как было)
const price = computed(() => round2(props.template.price ?? props.template.price_cents ?? 0))
const discountPercent = computed(() => {
  const p = props.template.discount_percent ?? props.template.discountPercent ?? props.template.discount ?? 0
  return Number.isFinite(Number(p)) ? round2(Number(p)) : 0
})
const discountAmountFromField = computed(() => round2(props.template.discount_amount ?? props.template.discountAmount ?? props.template.discount_amount_cents ?? 0))
const computedDiscountAmount = computed(() => {
  if (discountAmountFromField.value > 0) return round2(discountAmountFromField.value)
  if (discountPercent.value > 0) return round2(price.value * discountPercent.value / 100)
  return 0
})
const finalPrice = computed(() => { const p = price.value - computedDiscountAmount.value; return round2(p > 0 ? p : 0) })

// purchase handlers (как было)
const buyTemplate = async (templateId) => {
  await navigateTo({ path: '/buy-template/' + templateId })
}

const viewTemplate = (url, event) => { 
  event?.stopPropagation?.(); 
  emit('view', props.template) 
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* -------------------------
   Анимация через object-position
   старт: 0% 0% -> 0% 100% -> возврат
   fallback: transform translateY для браузеров, где нужно
   Исправления для плавности и корректного поведения при быстром hover/unhover:
   - не менять transition каждый кадр
   - при повторном hover во время возврата — отменять возврат и начинать с 0%
   ------------------------- */
const imageRef = ref(null)
const imageWrapperRef = ref(null)

let rafId = null
let lastTs = 0
let translateY = 0      // px scrolled
let direction = 1       // 1 вниз, -1 вверх
let maxScroll = 0       // px
let animating = false
let pausedDueToInteractive = false
let returning = false   // true когда выполняется плавный возврат к 0%

const lastMouse = { x: null, y: null }
const SPEED_PX_PER_SEC = 40
const HORIZONTAL_POS = '0%'

const log = (...args) => { if (DEBUG) console.log('[tmpl-scroll]', ...args) }

// Рассчитываем реальную высоту отрисовки картинки при object-fit: cover
const updateBounds = () => {
  const img = imageRef.value; const wrapper = imageWrapperRef.value
  if (!img || !wrapper) { maxScroll = 0; return }
  const nw = img.naturalWidth || img.width
  const nh = img.naturalHeight || img.height
  const ww = wrapper.clientWidth
  const wh = wrapper.clientHeight
  if (!nw || !nh || !ww || !wh) { maxScroll = 0; return }
  const scale = Math.max(ww / nw, wh / nh)
  const displayedH = nh * scale
  maxScroll = Math.max(0, Math.round(displayedH - wh))
  log('updateBounds', { nw, nh, ww, wh, scale, displayedH, maxScroll })
  if (maxScroll <= 0) {
    translateY = 0
    // гарантируем стартовую позицию
    img.style.objectPosition = `${HORIZONTAL_POS} 0%`
    img.style.transform = ''
  }
}

// applyPosition: теперь НЕ трогаем transition — только позицию.
// это улучшает производительность и убирает "рывки" при быстром hover/unhover.
const applyPosition = (px) => {
  const img = imageRef.value
  if (!img) return
  if (maxScroll > 0) {
    const pct = Math.min(100, Math.max(0, (px / maxScroll) * 100))
    // Не устанавливаем transition здесь — он нужен только для RETURN.
    img.style.objectPosition = `${HORIZONTAL_POS} ${pct}%`
    // fallback (закомментирован): при проблемах с object-position можно раскомментировать.
    // img.style.transform = `translateY(${-Math.round(px)}px)`
  } else {
    img.style.objectPosition = `${HORIZONTAL_POS} 0%`
    img.style.transform = ''
  }
}

const step = (ts) => {
  if (!animating) return
  if (pausedDueToInteractive) { rafId = requestAnimationFrame(step); return }
  if (!lastTs) lastTs = ts
  const dt = ts - lastTs; lastTs = ts
  const delta = (SPEED_PX_PER_SEC * dt / 1000) * direction
  let newY = translateY + delta
  if (newY >= maxScroll) { newY = maxScroll; direction = -1 }
  else if (newY <= 0) { newY = 0; direction = 1 }
  translateY = newY
  applyPosition(translateY)
  rafId = requestAnimationFrame(step)
}

const isPointerOverInteractive = () => {
  try {
    const wrapper = imageWrapperRef.value
    if (!wrapper) return false
    if (lastMouse.x == null) return false
    const el = document.elementFromPoint(lastMouse.x, lastMouse.y)
    if (!el) return false
    const interactive = el.closest && el.closest('button, a, input, textarea, [role="button"], label')
    if (!interactive) return false
    // игнорируем нашу оверлей-кнопку
    if (interactive.classList && interactive.classList.contains('template-card__view-button')) return false
    return true
  } catch (e) { return false }
}

const onPointerMove = (e) => {
  lastMouse.x = e.clientX; lastMouse.y = e.clientY
  const overInteractive = isPointerOverInteractive()
  if (overInteractive && animating && !pausedDueToInteractive) { pausedDueToInteractive = true }
  else if (!overInteractive && pausedDueToInteractive) { pausedDueToInteractive = false; lastTs = 0 }
}

const startAnimation = async (event) => {
  // записываем координаты
  if (event && event.clientX != null) { lastMouse.x = event.clientX; lastMouse.y = event.clientY }
  await nextTick()
  updateBounds()
  const img = imageRef.value
  if (maxScroll <= 0) {
    if (img && !img.complete) {
      const onImgLoad = () => {
        img.removeEventListener('load', onImgLoad)
        updateBounds()
        if (maxScroll > 0 && imageWrapperRef.value && imageWrapperRef.value.matches(':hover')) {
          requestAnimationFrame(() => startAnimation())
        }
      }
      img.addEventListener('load', onImgLoad, { once: true })
    }
    return
  }

  // Отменяем любой текущий плавный возврат (если он есть)
  if (img) {
    if (img._tmpl_return_end) {
      img.removeEventListener('transitionend', img._tmpl_return_end)
      img._tmpl_return_end = null
    }
    // отключаем transition, чтобы убрать CSS-перемещения
    img.style.transition = 'none'
  }

  // КЛЮЧЕВОЕ: всегда стартуем с 0% (пользователь просил, чтобы новое наведение не "подхватывало" прошлую прокрутку)
  translateY = 0
  direction = 1
  applyPosition(0)

  pausedDueToInteractive = isPointerOverInteractive()

  // старт анимации RAF
  if (rafId) cancelAnimationFrame(rafId)
  animating = true
  lastTs = 0
  rafId = requestAnimationFrame(step)
  log('animation started (forced reset to 0%)')
}

const stopAnimationAndReturn = () => {
  // Останавливаем RAF и помечаем, что сейчас возвращаемся
  animating = false; pausedDueToInteractive = false
  if (rafId) { cancelAnimationFrame(rafId); rafId = null }
  const img = imageRef.value; if (!img) return

  // Если уже вверху — просто очистим стейт
  if (translateY === 0) {
    img.style.transition = ''
    img.style.willChange = ''
    translateY = 0; direction = 1; lastTs = 0
    returning = false
    return
  }

  returning = true

  // Плавный CSS-возврат
  img.style.transition = 'object-position 600ms cubic-bezier(.22,.9,.35,1), transform 600ms cubic-bezier(.22,.9,.35,1)'
  img.style.objectPosition = `${HORIZONTAL_POS} 0%`
  img.style.transform = ''

  // Удаляем старый обработчик, если есть
  if (img._tmpl_return_end) img.removeEventListener('transitionend', img._tmpl_return_end)

  const onEnd = (e) => {
    if (!e.propertyName || e.propertyName.includes('object') || e.propertyName.includes('transform')) {
      img.style.transition = ''
      img.style.willChange = ''
      translateY = 0; direction = 1; lastTs = 0
      returning = false
      img.removeEventListener('transitionend', onEnd)
      img._tmpl_return_end = null
      log('returned to top (transition end)')
    }
  }
  img._tmpl_return_end = onEnd
  img.addEventListener('transitionend', onEnd)
}

const onPointerEnter = (e) => startAnimation(e)
const onPointerLeave = () => stopAnimationAndReturn()

onMounted(() => {
  const img = imageRef.value; const wrapper = imageWrapperRef.value
  if (img) {
    img.style.objectPosition = `${HORIZONTAL_POS} 0%`
    img.style.willChange = 'object-position'
    // оставляем слушатель, он может сработать до hover
    if (!img.complete) img.addEventListener('load', updateBounds)
    else updateBounds()
  }
  if (wrapper) {
    wrapper.addEventListener('pointerenter', onPointerEnter)
    wrapper.addEventListener('pointerleave', onPointerLeave)
    wrapper.addEventListener('pointermove', onPointerMove)
  }
  window.addEventListener('resize', updateBounds)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  const img = imageRef.value; const wrapper = imageWrapperRef.value
  if (img) img.removeEventListener('load', updateBounds)
  if (wrapper) {
    wrapper.removeEventListener('pointerenter', onPointerEnter)
    wrapper.removeEventListener('pointerleave', onPointerLeave)
    wrapper.removeEventListener('pointermove', onPointerMove)
  }
  window.removeEventListener('resize', updateBounds)
})
</script>


<template>
  <div class="template-card" role="group" tabindex="0">
    <div class="template-card__image" ref="imageWrapperRef">
      <img ref="imageRef" :src="template.preview" :alt="template.title" loading="lazy" draggable="false" />

      <div class="template-card__badges">
        <div v-if="!haveHtml" class="template-card__badge template-card__badge--custom">Заказной</div>
        <div v-if="template.popular" class="template-card__badge template-card__badge--popular">Популярный</div>
      </div>

      <button 
        class="template-card__view-button" 
        type="button" 
        aria-label="Просмотреть шаблон" 
        @click.stop="viewTemplate(template.preview)"
      >
        Просмотреть 
        <OpenNext class="open-next__svg" />
      </button>
    </div>

    <div class="template-card__content">
      <div class="template-card__header">
        <h3 class="template-card__title">{{ template.title }}</h3>
        <div class="template-card__price" aria-live="polite">
          <template v-if="computedDiscountAmount > 0">
            <div style="text-align: right">
              <div style="font-size:0.9rem; color:#64748b; text-decoration: line-through;">{{ fmt(price) }} ₽</div>
              <div style="font-size:1.2rem; font-weight:700; color:#f97315;">{{ fmt(finalPrice) }} ₽</div>
              <div style="font-size:0.8rem; color:#065f46;">Скидка: <span v-if="discountPercent > 0"> {{ discountPercent }}%</span></div>
            </div>
          </template>
          <template v-else>{{ fmt(price) }} ₽</template>
        </div>
      </div>

      <p class="template-card__description">{{ template.description }}</p>
      <div class="template-card__features">
        <span v-for="(feature, idx) in template.features" :key="idx" class="template-card__feature">{{ feature }}</span>
      </div>

      <Button class="template-card__button button button--primary" :disabled="loading" @click="buyTemplate(template.id)">{{ loading ? 'Покупка...' : 'Купить шаблон' }}</Button>
    </div>
  </div>
</template>

<style scoped>
.template-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: transform 0.3s ease; height: 100%; cursor: default; outline: none }
.template-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.1) }
.template-card__image { position: relative; height: 220px; overflow: hidden; cursor: pointer }
.template-card__image img { width: 100%; height: 100%; object-fit: cover; object-position: 0% 0%; transition: object-position 600ms cubic-bezier(.22,.9,.35,1), transform 600ms cubic-bezier(.22,.9,.35,1); will-change: object-position; user-select: none; pointer-events: none; display: block }

/* Контейнер для бейджей: справа вверху, элементы располагаются слева->справа,
   поэтому сначала рендерим "Заказной", затем "Популярный" => заказной будет слева. */
.template-card__badges { position: absolute; top: 15px; right: 15px; display: flex; gap: 8px; align-items: center; z-index: 3 }

/* Одиночный бейдж — общий стиль */
.template-card__badge { background: #f97316; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; white-space: nowrap }

/* Модификаторы (если хотите разные цвета) */
.template-card__badge--custom { background: #2663eb } /* teal-ish для "Заказной" */
.template-card__badge--popular { background: #f97316 } /* оранжевый для "Популярный" */

.template-card__content { padding: 20px; display:flex; flex-direction: column; height: calc(100% - 220px) }
.template-card__header { display:flex; justify-content: space-between; align-items:flex-start; margin-bottom:15px }
.template-card__title { font-size: 1.25rem; font-weight:600; color:#1e293b; margin-right:10px }
.template-card__price { font-size:1.2rem; font-weight:700; color:#2563eb; white-space:nowrap }
.template-card__description { color:#64748b; margin-bottom:15px; line-height:1.5;  }
.template-card__features { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px }
.template-card__feature { background:#f1f5f9; padding:6px 12px; border-radius:6px; font-size:0.85rem; color:#475569 }
.template-card__button { width:100%; padding:12px; font-weight:600; border-radius:8px; margin-top: auto }
.template-card__view-button { display: flex; gap: 0.2rem; align-items: center; flex-direction: row; flex-wrap: nowrap; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); padding:10px 18px; border-radius:8px; border:none; background:rgba(0,0,0,0.55); color:#fff; font-weight:600; font-size:1rem; cursor:pointer; z-index:4; opacity:0; visibility:hidden; transition: opacity .25s ease, transform .25s ease, visibility .25s; pointer-events:auto }
.template-card:hover .template-card__view-button, .template-card:focus-within .template-card__view-button { opacity:1; visibility:visible; transform:translate(-50%,-50%) }
@media (max-width:576px) { .template-card__view-button { transform:translate(-50%,0); opacity:1; visibility:visible; background:rgba(0,0,0,0.45); pointer-events:auto } .template-card__header { flex-direction:row; align-items:flex-start; gap:5px } .template-card__price { font-size:1.1rem } }
.open-next__svg {margin: 0;}
</style>
