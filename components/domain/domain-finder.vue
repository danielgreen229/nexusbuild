<template>
  <div class="df-root">
    <header class="df-header">
      <div class="df-brand">
        <div class="df-logo">Reg<span>.ru</span></div>
        <div class="df-title">Поиск доменов — подбор и регистрация</div>
      </div>
    </header>

    <main class="df-container">
      <section class="df-search-card">
        <form @submit.prevent="onSearch" class="df-form">
          <div class="df-row">
            <label class="df-label">Ключевое слово</label>
            <input v-model="keyword" class="df-input" placeholder="Например: mybrand" />
          </div>

          <div class="df-row df-row--inline">
            <div class="df-col">
              <label class="df-label">TLDs (через запятую)</label>
              <input v-model="tldsInput" class="df-input" placeholder="ru,com,net,org,рф" />
            </div>

            <div class="df-col df-col--sm">
              <label class="df-label">Макс результатов</label>
              <input v-model.number="maxResults" type="number" min="10" class="df-input" />
            </div>

            <div class="df-actions">
              <button :disabled="loading" class="btn btn-primary" type="submit">
                <span v-if="!loading">Поиск</span>
                <span v-else>Идёт поиск...</span>
              </button>
              <button type="button" class="btn" @click="resetSearch">Сброс</button>
            </div>
          </div>
        </form>

        <div v-if="error" class="df-error">{{ error }}</div>
      </section>

      <section v-if="searchResults && searchResults.length" class="df-results">
        <div class="df-results-header">
          <div>Результаты подбора для «<strong>{{ lastKeyword }}</strong>» — {{ searchResults.length }}</div>
          <div class="df-results-actions">
            <button class="btn" @click="copyAvailableList">Копировать список доступных</button>
          </div>
        </div>

        <table class="df-table">
          <thead>
            <tr>
              <th>Домен</th>
              <th>Статус</th>
              <th>Цена</th>
              <th>ТLD</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in searchResults" :key="item.fqdn">
              <td class="td-domain">
                <div class="domain-name">{{ item.fqdn }}</div>
                <div class="domain-sub">{{ item.attrs?.raw?.fqdn || item.fqdn }}</div>
              </td>
              <td>
                <span :class="['badge', availabilityClass(item.available)]">{{ availabilityText(item.available) }}</span>
              </td>
              <td>
                <div v-if="item.price !== null && item.price !== undefined">{{ formatPrice(item.price, item.price_currency) }}</div>
                <div v-else class="muted">—</div>
              </td>
              <td>{{ item.tld || extractTld(item.fqdn) }}</td>
              <td class="td-actions">
                <button class="btn small" @click="openWhois(item.fqdn)">Whois</button>
                <button class="btn primary small" :disabled="!isAvailable(item.available)" @click="openDeployModal(item.fqdn)">Зарегистрировать</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-else class="df-empty" v-if="!loading">
        <div class="empty-illustration">🔎</div>
        <div class="empty-title">Ничего не найдено</div>
        <div class="empty-sub">Введите ключевое слово и нажмите «Поиск», чтобы подобрать похожие домены</div>
      </section>

      <section v-if="lastDeploy" class="df-deploy-result">
        <h3>Результат регистрации/деплоя</h3>
        <div class="deploy-grid">
          <div>Домен: <strong>{{ lastDeploy.domain }}</strong></div>
          <div v-if="lastDeploy.netlify_url">Netlify: <a :href="lastDeploy.netlify_url" target="_blank">открыть сайт</a></div>
          <div v-if="lastDeploy.admin_url">Admin: <a :href="lastDeploy.admin_url" target="_blank">админка</a></div>
          <div>DNS статус: <strong>{{ lastDeploy.dns_status || 'pending' }}</strong></div>
        </div>
      </section>
    </main>

    <!-- Deploy modal -->
    <div class="modal" v-if="showDeploy">
      <div class="modal-backdrop" @click="closeDeploy"></div>
      <div class="modal-body">
        <h4>Регистрация и деплой домена</h4>
        <div class="modal-row">
          <label>Домен</label>
          <input class="df-input" v-model="deployForm.domain" disabled />
        </div>
        <div class="modal-row">
          <label>Template ID</label>
          <input class="df-input" v-model="deployForm.templateId" placeholder="Введите templateId" />
        </div>
        <div class="modal-row inline">
          <label>Период (лет)</label>
          <input type="number" min="1" class="df-input" v-model.number="deployForm.period" />
          <label style="margin-left:8px">Проверять DNS</label>
          <input type="checkbox" v-model="deployForm.waitForDns" />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeDeploy">Отмена</button>
          <button class="btn btn-primary" :disabled="deploying" @click="performDeploy">
            <span v-if="!deploying">Запустить</span>
            <span v-else>Идет...</span>
          </button>
        </div>
        <div v-if="deployError" class="df-error">{{ deployError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDomainStore } from '~/stores/deploy'

const store = useDomainStore()

const keyword = ref('')
const tldsInput = ref('')
const maxResults = ref(50)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const searchResults = computed(() => store.searchResults)
const lastKeyword = computed(() => store.lastSearchKeyword)

const showDeploy = ref(false)
const deploying = ref(false)
const deployError = ref(null)
const lastDeploy = ref(null)

const deployForm = reactive({ domain: '', templateId: '', period: 1, waitForDns: true })

function resetSearch(){
  keyword.value = ''
  tldsInput.value = ''
  maxResults.value = 50
  store.resetSearch()
}

async function onSearch(){
  if (!keyword.value || !keyword.value.trim()) return
  const opts = { maxResults: maxResults.value }
  if (tldsInput.value && tldsInput.value.trim()) opts.tlds = tldsInput.value.split(',').map(s => s.trim()).filter(Boolean)
  try{
    await store.searchSimilarDomains(keyword.value.trim(), opts)
  }catch(err){
    // store.error already set
  }
}

function availabilityText(av){
  if (av === true || av === 'available' || (typeof av === 'string' && av.toLowerCase && av.toLowerCase().includes('свобод'))) return 'Свободен'
  if (av === false) return 'Занят'
  return 'Неизвестно'
}

function availabilityClass(av){
  if (av === true || av === 'available') return 'badge-available'
  if (av === false) return 'badge-taken'
  return 'badge-unknown'
}

function isAvailable(av){
  return av === true || av === 'available' || (typeof av === 'string' && av.toLowerCase && av.toLowerCase().includes('свобод'))
}

function formatPrice(price, cur){
  if (price === null || price === undefined) return '—'
  return `${price} ${cur || 'RUB'}`
}

function extractTld(fqdn){
  if (!fqdn) return ''
  const parts = fqdn.split('.')
  return parts.length ? parts[parts.length -1] : ''
}

function openWhois(fqdn){
  const url = `https://www.whois.com/whois/${encodeURIComponent(fqdn)}`
  window.open(url, '_blank')
}

function openDeployModal(fqdn){
  deployForm.domain = fqdn
  deployForm.templateId = ''
  deployForm.period = 1
  deployForm.waitForDns = true
  deployError.value = null
  showDeploy.value = true
}

function closeDeploy(){ showDeploy.value = false }

async function performDeploy(){
  if (!deployForm.templateId) { deployError.value = 'templateId обязателен' ; return }
  deploying.value = true
  deployError.value = null
  try{
    const resp = await store.deployWithDomain({ templateId: deployForm.templateId, domain: deployForm.domain, period: deployForm.period })
    lastDeploy.value = resp
    // optionally poll DNS
    if (deployForm.waitForDns){
      const domain = deployForm.domain
      let attempts = 0
      const maxAttempts = 12
      while(attempts < maxAttempts){
        attempts++
        await new Promise(r => setTimeout(r, 5000))
        try{
          const st = await store.checkDns(domain)
          const status = store.getDnsStatus(domain)
          if (status === 'verified' || (st && st.dns_status === 'verified')) break
        }catch(e){ /* ignore */ }
      }
    }
    showDeploy.value = false
  }catch(err){
    deployError.value = err.message || 'Ошибка при деплое'
    throw err
  }finally{
    deploying.value = false
  }
}

function copyAvailableList(){
  const list = (searchResults.value || []).filter(i => isAvailable(i.available)).map(i => i.fqdn).join('\n')
  if (!list) return alert('Нет доступных доменов для копирования')
  navigator.clipboard.writeText(list).then(()=> alert('Список скопирован'))
}
</script>

<style scoped>
.df-root{ font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#222 }
.df-header{ background: #f44336; padding:18px 24px; color:#fff }
.df-brand{ display:flex; align-items:center; gap:16px }
.df-logo{ font-weight:700; font-size:22px; background:#fff; color:#f44336; padding:4px 8px; border-radius:4px }
.df-logo span{ color:#f44336 }
.df-title{ font-size:16px }

.df-container{ max-width:1100px; margin:18px auto; padding:0 16px }
.df-search-card{ background:#fff; border:1px solid #ececec; padding:16px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.03) }
.df-form{ display:flex; flex-direction:column; gap:12px }
.df-row{ display:flex; flex-direction:column }
.df-row--inline{ display:flex; gap:12px; align-items:end }
.df-col{ flex:1 }
.df-col--sm{ width:160px }
.df-label{ font-size:13px; color:#666; margin-bottom:6px }
.df-input{ padding:8px 10px; border:1px solid #ddd; border-radius:6px; outline:none }
.df-input:focus{ border-color:#f44336; box-shadow:0 0 0 3px rgba(244,67,54,0.06) }

.btn{ background:#fff; border:1px solid #ddd; padding:8px 12px; border-radius:6px; cursor:pointer }
.btn:hover{ filter:brightness(.98) }
.btn.primary{ background:#f44336; color:#fff; border-color:#f44336 }
.btn.small{ padding:6px 8px; font-size:13px }
.btn:disabled{ opacity:.6; cursor:not-allowed }

.df-error{ margin-top:10px; background:#ffecec; color:#c0392b; padding:8px; border-radius:6px }

.df-results{ margin-top:16px }
.df-results-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:8px }
.df-table{ width:100%; border-collapse:collapse; background:#fff }
.df-table th, .df-table td{ padding:10px; border-bottom:1px solid #f0f0f0; text-align:left }
.td-domain .domain-name{ font-weight:600 }
.domain-sub{ color:#888; font-size:12px }
.badge{ padding:6px 10px; border-radius:16px; font-size:13px }
.badge-available{ background:#e9f7ef; color:#177a4a }
.badge-taken{ background:#fdecea; color:#a0231b }
.badge-unknown{ background:#f3f4f6; color:#666 }
.td-actions{ display:flex; gap:8px; justify-content:flex-end }

.df-empty{ text-align:center; padding:40px; color:#777 }
.empty-illustration{ font-size:40px }
.empty-title{ font-size:18px; margin-top:8px }

.modal{ position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:60 }
.modal-backdrop{ position:absolute; inset:0; background:rgba(0,0,0,0.45) }
.modal-body{ position:relative; background:#fff; padding:18px; border-radius:10px; width:420px; box-shadow:0 10px 30px rgba(0,0,0,0.2) }
.modal-row{ margin-top:10px }
.modal-row.inline{ display:flex; gap:10px; align-items:center }
.modal-actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:14px }
.df-deploy-result{ margin-top:18px; background:#fff; padding:12px; border-radius:8px }
.deploy-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:8px }
.muted{ color:#999 }
</style>
