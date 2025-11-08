<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTemplateStore } from '~/stores/template' // путь к стоору — скорректируйте если у вас другой
const templateStore = useTemplateStore()

const title = "Выберите подходящий шаблон"
const subtitle = ""

const search = ref('')
const debouncedTimer = ref(null)
const debounceMs = 300

// если нужно — при монтировании загрузим первые шаблоны
onMounted(async () => {
  try {
    // initial load (optional) — можно убрать если не нужен
    await templateStore.listTemplates({ page: 1, perPage: 12, filters: {} })
  } catch (e) {
    /* ignore */
  }
})

// Ввод с дебаунсом: при остановке ввода выполняем поиск (заменяет автоподгрузку)
watch(search, (val) => {
  if (debouncedTimer.value) clearTimeout(debouncedTimer.value)
  debouncedTimer.value = setTimeout(async () => {
    // если пустая строка — можно сбросить фильтр или загрузить дефолт
    if (!val || String(val).trim() === '') {
      // сброс — загрузим обычный список первой страницы
      await templateStore.listTemplates({ page: 1, perPage: 12, filters: {} })
      return
    }

    try {
      await templateStore.listTemplates({
        page: 1,
        perPage: 12,
        filters: { search: val }
      })
    } catch (e) {
      // error хранится в store
    }
  }, debounceMs)
})

// Нажатие Enter в инпуте или клик на кнопку — мгновенный поиск
async function submitSearch() {
  if (debouncedTimer.value) {
    clearTimeout(debouncedTimer.value)
    debouncedTimer.value = null
  }
  try {
    await templateStore.listTemplates({
      page: 1,
      perPage: 12,
      filters: { search: search.value }
    })
  } catch (e) {
    // error handled by store
  }
}

function clearSearch() {
  search.value = ''
  // загрузим дефолтный список
  templateStore.listTemplates({ page: 1, perPage: 12, filters: {} }).catch(()=>{})
}
</script>

<template>
  <section class="portfolio-hero">
    <div class="portfolio-hero__container container">
      <div class="portfolio-hero__content">
        <h1 class="portfolio-hero__title">{{ title }}</h1>
        <p class="portfolio-hero__subtitle">{{ subtitle }}</p>

        <form class="portfolio-hero__search" @submit.prevent="submitSearch" aria-label="Поиск шаблонов">
          <div class="search-wrap">
            <input
              v-model="search"
              @keyup.enter.prevent="submitSearch"
              type="search"
              placeholder="Найти шаблон..."
              class="portfolio-hero__input"
              aria-label="Поиск шаблонов"
            />
            <button type="submit" class="btn-search" :disabled="templateStore.loading">
              <span v-if="templateStore.loading">Поиск...</span>
              <span v-else>Найти</span>
            </button>
          </div>
        </form>

        <div class="portfolio-hero__meta" v-if="templateStore.templates && templateStore.templates.length >= 0">
          <span class="meta-count" v-if="templateStore.total && templateStore.templates.length > 0">
            Найдено: <strong>{{ templateStore.total ?? templateStore.templates.length }}</strong>
          </span>
          <span class="meta-loading" v-if="templateStore.loading"> · загружается…</span>
          <span class="meta-error" v-if="templateStore.error"> · Ошибка: {{ templateStore.error }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-hero {
  padding: 80px 0;
  background: linear-gradient(135deg, #2563eb 0%, #7da5e6 68%, #2563eb 85%);
  background: linear-gradient(135deg, #6A11CB 0%, #7da5e6 68%, #2575FC 85%);
  background: linear-gradient(135deg, #2575FC 0%, #6A11CB 85%);
  text-align: center;
  color: white;
}

.portfolio-hero__title {
  font-size: 2.8rem;
  margin-bottom: 8px;
  font-weight: 700;
}

.portfolio-hero__subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto 20px;
}

.portfolio-hero__search {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.search-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.08);
  padding: 8px;
  border-radius: 10px;
  backdrop-filter: blur(6px);
}

.portfolio-hero__input {
  min-width: 320px;
  max-width: 720px;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: rgba(255,255,255,0.12);
  color: white;
  outline: none;
  font-size: 1rem;
}

.portfolio-hero__input::placeholder {
  color: rgba(255,255,255,0.75);
}

.btn-search {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background: rgba(0,0,0,0.18);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-search[disabled] {
  opacity: 0.6;
  cursor: default;
}

.btn-clear {
  padding: 6px 8px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.portfolio-hero__meta {
  margin-top: 12px;
  font-size: 0.95rem;
  opacity: 0.92;
}

.meta-count strong {
  color: #fff;
}

/* ==========================
   Стили для белого крестика
   (WebKit: Chrome, Safari)
   ========================== */

/* Прямой селектор — для input внутри этого компонента */
.portfolio-hero__input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  cursor: pointer;
  border: none;
  padding: 0;
  background-color: transparent;

  /* SVG data-uri: stroke white (%23 == #) */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M6 6l12 12M18 6L6 18'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 14px 14px;
  opacity: 1;
}

/* Для случаев scoped + вложенные компоненты (если input находится внутри дочерних) */
::v-deep .portfolio-hero__input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  cursor: pointer;
  border: none;
  padding: 0;
  background-color: transparent;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M6 6l12 12M18 6L6 18'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 14px 14px;
  opacity: 1;
}

/* hover-эффект (опционально) */
.portfolio-hero__input::-webkit-search-cancel-button:hover,
::v-deep .portfolio-hero__input::-webkit-search-cancel-button:hover {
  transform: scale(1.05);
}

/* Убрать крестик в Edge/IE (если хотите использовать свой) */
.portfolio-hero__input::-ms-clear {
  display: none;
}
::v-deep .portfolio-hero__input::-ms-clear {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .portfolio-hero {
    padding: 60px 0;
    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  }

  .portfolio-hero__title {
    font-size: 2.2rem;
  }

  .portfolio-hero__subtitle {
    font-size: 1.0rem;
  }

  .portfolio-hero__input {
    min-width: 220px;
  }
}
</style>