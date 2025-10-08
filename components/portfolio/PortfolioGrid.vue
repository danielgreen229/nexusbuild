<template>
  <section class="portfolio-grid" :aria-busy="isInitialLoad ? 'true' : 'false'">
    <div class="portfolio-grid__container container">
      <div class="portfolio-grid__header">
        <h2 class="portfolio-grid__title">
          <template v-if="isInitialLoad">… шаблонов</template>
          <template v-else>{{ displayCount }} {{ pluralTemplates(displayCount) }}</template>
          <span v-if="!isInitialLoad && activeFilter !== 'all'">
            в категории "{{ filters.find(f => f.id === activeFilter)?.name || activeFilter }}"
          </span>
          <span v-else-if="isInitialLoad && activeFilter !== 'all'">
            <small class="portfolio-grid__loading-hint">в категории «{{ filters.find(f => f.id === activeFilter)?.name || activeFilter }}»</small>
          </span>
        </h2>
      </div>

      <!-- initial skeletons -->
      <div v-if="isInitialLoad" class="portfolio-grid__content">
        <div
          v-for="n in skeletonCount"
          :key="'skeleton-init-' + n"
          class="skeleton-card"
          role="status"
          aria-label="Загрузка шаблона"
          :style="{ minHeight: cardHeight + 'px' }"
        >
          <div class="skeleton-card__thumb shimmer"></div>
          <div class="skeleton-card__body">
            <div class="skeleton-line skeleton-line--title shimmer"></div>
            <div class="skeleton-line skeleton-line--meta shimmer"></div>
            <div class="skeleton-line skeleton-line--meta short shimmer"></div>
          </div>
        </div>
      </div>

      <!-- error -->
      <div v-else-if="templateStore.error" class="portfolio-grid__empty">
        Ошибка: {{ templateStore.error }}
      </div>

      <!-- templates -->
      <div v-else class="portfolio-grid__content">
        <transition-group name="grid" tag="div" class="portfolio-grid__content-inner">
          <div
            v-for="(template, index) in filteredTemplates"
            :key="template.id"
            class="grid-item"
            :style="{ transitionDelay: `${Math.min(index, 20) * 30}ms` }"
          >
            <TemplateCard :template="template" />
          </div>

          <!-- load-more skeletons -->
          <div
            v-if="isLoadingMore"
            v-for="n in skeletonCount"
            :key="'skeleton-more-' + n"
            class="grid-item skeleton-placeholder"
            :style="{ height: cardHeight + 'px', transitionDelay: `${Math.min(filteredTemplates.length + n, 40) * 12}ms` }"
            aria-hidden="true"
          >
            <div class="skeleton-card__thumb shimmer"></div>
            <div class="skeleton-card__body">
              <div class="skeleton-line skeleton-line--title shimmer"></div>
              <div class="skeleton-line skeleton-line--meta shimmer"></div>
            </div>
          </div>
        </transition-group>

        <!-- sentinel -->
        <div ref="sentinel" class="infinite-sentinel" style="height:1px; width:100%"></div>

        <div v-if="templateStore.loading && !isInitialLoad" class="portfolio-grid__loading">Загрузка…</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TemplateCard from '@/components/portfolio/TemplateCard.vue'
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useTemplateStore } from '~/stores/template'

const props = defineProps({
  activeFilter: {
    type: String,
    required: true
  }
})

const templateStore = useTemplateStore()

// локальные фильтры
const filters = ref([{ id: 'all', name: 'Все шаблоны' }])

// pagination
const PER_PAGE = 12

// sorting params to send to server (explicit)
const SORT_BY = 'have_html,popular,created_at' // можно поменять по вашему API
const ORDER = 'desc' // или 'asc'

// observer sentinel
const sentinel = ref(null)
let observer = null

// flags
const isLoadingMore = ref(false)
const isInitialLoad = computed(() => templateStore.loading && (templateStore.templates.length === 0))

// card size placeholder
const cardHeight = ref(240)

// helpers
function buildFilters() {
  const f = {}
  if (props.activeFilter && props.activeFilter !== 'all') f.type = props.activeFilter
  return f
}

async function measureCardHeight() {
  await nextTick()
  try {
    const el = document.querySelector('.portfolio-grid__content .grid-item')
    if (el && el.offsetHeight) cardHeight.value = el.offsetHeight
  } catch (e) {}
}

/**
 * Explicit request to server with full params.
 * Always sends: page, perPage, sort_by, order, and filters (type/popular/etc if present)
 */
async function requestPage({ page = 1, perPage = PER_PAGE, filters = {}, append = false } = {}) {
  // Map local filter keys to server-expected ones if needed (here we forward 'popular' if set in filters)
  const serverFilters = { ...filters }
  // call store.listTemplates with explicit sortBy and order
  return templateStore.listTemplates({
    page,
    perPage,
    filters: serverFilters,
    append,
    sortBy: SORT_BY,
    order: ORDER
  })
}

// INITIAL load: explicit page=1
async function loadTemplates() {
  try {
    // ensure store.perPage matches
    templateStore.perPage = PER_PAGE
    const f = buildFilters()
    await requestPage({ page: 1, perPage: PER_PAGE, filters: f, append: false })
    await measureCardHeight()
  } catch (e) {
    console.error('Ошибка загрузки шаблонов:', e)
  }
}

// LOAD MORE: compute next page from store.page and explicitly request it
async function loadMore() {
  if (templateStore.loading || isLoadingMore.value) return
  if (!templateStore.hasMore) return

  isLoadingMore.value = true
  await measureCardHeight()

  try {
    const f = buildFilters()
    const nextPage = (Number(templateStore.page) || 1) + 1
    await requestPage({ page: nextPage, perPage: PER_PAGE, filters: f, append: true })
    await measureCardHeight()
  } catch (e) {
    console.warn('Ошибка подгрузки следующей страницы:', e)
  } finally {
    isLoadingMore.value = false
  }
}

// observer callback
const onIntersect = (entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) loadMore()
  }
}

function initObserver() {
  if (observer) {
    try {
      if (sentinel.value) observer.unobserve(sentinel.value)
      observer.disconnect()
    } catch (e) {}
    observer = null
  }

  observer = new IntersectionObserver(onIntersect, { root: null, rootMargin: '300px', threshold: 0.1 })
  nextTick(() => { if (sentinel.value) observer.observe(sentinel.value) })
}

onMounted(async () => {
  await loadTemplates()
  initObserver()
})

onBeforeUnmount(() => {
  if (observer) {
    try {
      if (sentinel.value) observer.unobserve(sentinel.value)
      observer.disconnect()
    } catch (e) {}
    observer = null
  }
})

// on filter change -> reload page 1 with same sort params
watch(() => props.activeFilter, async () => {
  await loadTemplates()
  initObserver()
})

// filteredTemplates uses server order (no local sorting)
const filteredTemplates = computed(() => {
  const items = templateStore.templates || []
  if (props.activeFilter === 'all') return items
  return items.filter(t => String(t.type) === String(props.activeFilter))
})

const skeletonCount = ref(PER_PAGE)

/* counter animation (kept) */
const displayCount = ref(0)
let rafId = null
let animStart = 0
let animFrom = 0
let animTo = 0
let animDuration = 600
const easeOutCubic = t => 1 - Math.pow(1 - t, 3)
function animateTo(target, duration = animDuration) {
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
  animStart = performance.now()
  animFrom = displayCount.value
  animTo = target
  animDuration = duration
  const step = (now) => {
    const elapsed = now - animStart
    const t = Math.min(1, elapsed / animDuration)
    const eased = easeOutCubic(t)
    displayCount.value = Math.round(animFrom + (animTo - animFrom) * eased)
    if (t < 1) rafId = requestAnimationFrame(step)
    else { rafId = null; displayCount.value = animTo }
  }
  rafId = requestAnimationFrame(step)
}

onBeforeUnmount(() => {
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
})

function pluralTemplates(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'шаблон'
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'шаблона'
  return 'шаблонов'
}

displayCount.value = templateStore.loading ? 0 : filteredTemplates.value.length

watch(() => filteredTemplates.value.length, (newCount) => {
  if (!templateStore.loading) animateTo(newCount)
})

watch(() => templateStore.loading, (isLoading, prev) => {
  if (prev === true && isLoading === false) animateTo(filteredTemplates.value.length)
})
</script>

<style scoped>
/* стили оставил без изменений, как в вашем исходнике */
.portfolio-grid { padding: 50px 0; }
.portfolio-grid__header { margin-bottom: 30px; }
.portfolio-grid__title { font-size: 1.8rem; color: var(--dark); font-weight:700; display:flex; align-items:baseline; gap:10px; }
.portfolio-grid__title span { color: var(--primary); }
.portfolio-grid__content { }
.portfolio-grid__content-inner { display:grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap:30px; }
.grid-item { will-change: transform, opacity; display:block; }
.skeleton-card { background:var(--card-bg,#fff); border-radius:12px; padding:16px; box-shadow:0 6px 18px rgba(30,30,30,0.04); display:flex; flex-direction:column; gap:12px; overflow:hidden; }
.skeleton-card__thumb { width:100%; height:140px; border-radius:8px; background:linear-gradient(90deg, rgba(200,200,200,0.12), rgba(200,200,200,0.08)); position:relative; }
.skeleton-card__body { display:flex; flex-direction:column; gap:8px; padding-top:4px; }
.skeleton-line { height:14px; border-radius:7px; background:linear-gradient(90deg, rgba(200,200,200,0.12), rgba(200,200,200,0.08)); width:100%; }
.skeleton-line--title { height:18px; border-radius:9px; width:70%; }
.skeleton-line--meta { height:12px; width:50%; }
.skeleton-line--meta.short { width:30%; }
.grid-enter-from { opacity:0; transform:translateY(8px) scale(0.997); }
.grid-enter-active { transition: transform 320ms cubic-bezier(.2,.9,.2,1), opacity 320ms cubic-bezier(.2,.9,.2,1); }
.grid-leave-to { opacity:0; transform:translateY(8px) scale(0.997); }
.grid-leave-active { transition: transform 320ms cubic-bezier(.2,.9,.2,1), opacity 320ms cubic-bezier(.2,.9,.2,1); }
.grid-move { transition: transform 320ms cubic-bezier(.2,.9,.2,1); }
.skeleton-placeholder .skeleton-card__thumb { background: linear-gradient(90deg, rgba(200,200,200,0.06), rgba(200,200,200,0.04)); }
@media (max-width:992px) { .portfolio-grid__content-inner { grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap:25px } .portfolio-grid__title { font-size:1.6rem } }
@media (max-width:576px) { .portfolio-grid__content-inner { grid-template-columns:1fr } .portfolio-grid__title { font-size:1.4rem } }
.portfolio-grid__loading, .portfolio-grid__empty { text-align:center; padding:60px 20px; color:var(--gray); font-size:1.2rem }
.portfolio-grid__loading-hint { display:inline-block; margin-left:12px; font-weight:500; color:var(--gray); font-size:0.95rem }
.infinite-sentinel { height:1px; }
</style>
