<script setup>
import TemplateCard from '@/components/portfolio/TemplateCard.vue'
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useTemplateStore } from '~/stores/template'

const props = defineProps({
  activeFilter: {
    type: String,
    required: true
  }
})

const templateStore = useTemplateStore()

// локальные фильтры (можно расширить)
const filters = ref([
  { id: 'all', name: 'Все шаблоны' },
])

// Загрузка шаблонов (offset-пагинация, первая страница)
const loadTemplates = async () => {
  try {
    const filtersObj = {}
    if (props.activeFilter && props.activeFilter !== 'all') {
      filtersObj.type = props.activeFilter
    }
    await templateStore.listTemplates({ page: 1, perPage: 12, filters: filtersObj })
  } catch (e) {
    // ошибка уже хранится в store (templateStore.error)
    console.error('Ошибка загрузки шаблонов:', e)
  }
}

// загрузим при монтировании
onMounted(async () => {
  await loadTemplates()
})

// если внешний activeFilter изменился — перезагрузим список
watch(() => props.activeFilter, async () => {
  await loadTemplates()
})

// вычисляемый список уже отфильтрованных шаблонов (по type)
const filteredTemplates = computed(() => {
  const items = templateStore.templates || []
  if (props.activeFilter === 'all') return items
  return items.filter(t => String(t.type) === String(props.activeFilter))
})

// сколько скелетонов показывать во время загрузки / при пустом результате
const skeletonCount = 12

/* ---------------------------
   АНИМАЦИЯ СЧЁТЧИКА
   --------------------------- */
const displayCount = ref(0)               // видимое число (анимируемое)
let rafId = null                          // id requestAnimationFrame для отмены
let animStart = 0
let animFrom = 0
let animTo = 0
let animDuration = 600                    // длительность анимации в мс (подкорректируйте)

const easeOutCubic = t => 1 - Math.pow(1 - t, 3)

// функция запускает анимацию от текущего displayCount до target
function animateTo(target, duration = animDuration) {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  animStart = performance.now()
  animFrom = displayCount.value
  animTo = target
  animDuration = duration

  const step = (now) => {
    const elapsed = now - animStart
    const t = Math.min(1, elapsed / animDuration)
    const eased = easeOutCubic(t)
    const value = Math.round(animFrom + (animTo - animFrom) * eased)
    displayCount.value = value
    if (t < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      rafId = null
      displayCount.value = animTo // гарантированно выставим точное значение
    }
  }
  rafId = requestAnimationFrame(step)
}

// Отменяем анимацию при размонтировании
onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})

// вспомогательная функция для правильного склонения "шаблон(ов)"
function pluralTemplates(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'шаблон'
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'шаблона'
  return 'шаблонов'
}

/* Логика: если идёт загрузка — показываем "… шаблонов".
   После окончания загрузки (templateStore.loading -> false) — анимируем до текущего filteredTemplates.length.
   Также анимируем при изменении filteredTemplates.length (если не в состоянии загрузки). */

// Инициализация начального значения (если не в загрузке — устанавливаем сразу)
if (!templateStore.loading) {
  displayCount.value = filteredTemplates.value.length
} else {
  displayCount.value = 0
}

// следим за изменением количества шаблонов (и за состоянием загрузки)
watch(
  () => filteredTemplates.value.length,
  (newCount, oldCount) => {
    // если в момент изменения не идёт загрузка — анимируем
    if (!templateStore.loading) {
      animateTo(newCount)
    }
  }
)

watch(
  () => templateStore.loading,
  (isLoading, prev) => {
    // когда загрузка завершилась (true -> false) — анимируем до актуального количества
    if (prev === true && isLoading === false) {
      const target = filteredTemplates.value.length
      animateTo(target)
    }
    // если начали загрузку — можно временно обнулить или оставить текущее. Оставим отображать "…" в шаблоне.
  }
)
</script>

<template>
  <section class="portfolio-grid" :aria-busy="templateStore.loading ? 'true' : 'false'">
    <div class="portfolio-grid__container container">
      <div class="portfolio-grid__header">
        <h2 class="portfolio-grid__title">
          <template v-if="templateStore.loading">… шаблонов</template>
          <template v-else>{{ displayCount }} {{ pluralTemplates(displayCount) }}</template>
          <span v-if="!templateStore.loading && activeFilter !== 'all'">
            в категории "{{ filters.find(f => f.id === activeFilter)?.name || activeFilter }}"
          </span>
          <span v-else-if="templateStore.loading && activeFilter !== 'all'">
            <small class="portfolio-grid__loading-hint">в категории «{{ filters.find(f => f.id === activeFilter)?.name || activeFilter }}»</small>
          </span>
        </h2>
      </div>

      <!-- Показываем скелетоны когда идёт загрузка -->
      <div v-if="templateStore.loading" class="portfolio-grid__content">
        <div
          v-for="n in skeletonCount"
          :key="'skeleton-loading-' + n"
          class="skeleton-card"
          role="status"
          aria-label="Загрузка шаблона"
        >
          <div class="skeleton-card__thumb shimmer"></div>
          <div class="skeleton-card__body">
            <div class="skeleton-line skeleton-line--title shimmer"></div>
            <div class="skeleton-line skeleton-line--meta shimmer"></div>
            <div class="skeleton-line skeleton-line--meta short shimmer"></div>
          </div>
        </div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="templateStore.error" class="portfolio-grid__empty">
        Ошибка: {{ templateStore.error }}
      </div>

      <!-- Если результатов нет — не показываем текст "Шаблоны не найдены",
           а выводим тот же набор карточек-заглушек (скелетонов) вместо изображений -->
      <div v-else-if="filteredTemplates.length === 0" class="portfolio-grid__content">
        <div
          v-for="n in skeletonCount"
          :key="'skeleton-empty-' + n"
          class="skeleton-card"
          role="status"
          aria-label="Пустая карта шаблона — заглушка"
        >
          <div class="skeleton-card__thumb shimmer"></div>
          <div class="skeleton-card__body">
            <div class="skeleton-line skeleton-line--title shimmer"></div>
            <div class="skeleton-line skeleton-line--meta shimmer"></div>
            <div class="skeleton-line skeleton-line--meta short shimmer"></div>
          </div>
        </div>
      </div>

      <!-- Нормальный список шаблонов -->
      <div v-else class="portfolio-grid__content">
        <TemplateCard 
          v-for="template in filteredTemplates" 
          :key="template.id"
          :template="template"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-grid {
  padding: 50px 0;
}

.portfolio-grid__header {
  margin-bottom: 30px;
}

.portfolio-grid__title {
  font-size: 1.8rem;
  color: var(--dark);
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.portfolio-grid__title span {
  color: var(--primary);
}

.portfolio-grid__content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

/* Скелетонная карточка — визуально похожа на TemplateCard */
.skeleton-card {
  background: var(--card-bg, #fff);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(30,30,30,0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  overflow: hidden;
}

/* блок изображения */
.skeleton-card__thumb {
  width: 100%;
  height: 140px;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(200,200,200,0.12), rgba(200,200,200,0.08));
  position: relative;
}

/* тело */
.skeleton-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

/* линии (title / meta) */
.skeleton-line {
  height: 14px;
  border-radius: 7px;
  background: linear-gradient(90deg, rgba(200,200,200,0.12), rgba(200,200,200,0.08));
  width: 100%;
}

/* более толстая линия для названия */
.skeleton-line--title {
  height: 18px;
  border-radius: 9px;
  width: 70%;
}

/* мета линии */
.skeleton-line--meta {
  height: 12px;
  width: 50%;
}

.skeleton-line--meta.short {
  width: 30%;
}

/* shimmer animation */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0));
  animation: shimmer 1.2s ease-in-out infinite;
}

/* responsive adjustments */
@media (max-width: 992px) {
  .portfolio-grid__content {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  
  .portfolio-grid__title {
    font-size: 1.6rem;
  }
}

@media (max-width: 576px) {
  .portfolio-grid__content {
    grid-template-columns: 1fr;
  }
  
  .portfolio-grid__title {
    font-size: 1.4rem;
  }
}

.portfolio-grid__loading,
.portfolio-grid__empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray);
  font-size: 1.2rem;
}

.portfolio-grid__loading-hint {
  display: inline-block;
  margin-left: 12px;
  font-weight: 500;
  color: var(--gray);
  font-size: 0.95rem;
}
</style>
