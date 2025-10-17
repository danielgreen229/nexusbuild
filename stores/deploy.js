import { defineStore } from 'pinia'
import { API } from '~/config'

export const useDomainStore = defineStore('domain', {
  state: () => ({
    loading: false,
    error: null,

    // Результаты поиска похожих доменов
    searchResults: [],
    lastSearchKeyword: null,

    // Деплой / регистрация
    lastDeploy: null,

    // Netlify
    netlifySites: [],
    siteInfo: null,

    // DNS статусы кэш (domain -> status)
    dnsStatuses: {}
  }),

  getters: {
    isLoading(state) {
      return state.loading
    },
    hasError(state) {
      return !!state.error
    },
    getDnsStatus: (state) => (domain) => {
      return state.dnsStatuses[domain] || null
    }
  },

  actions: {
    // Универсальный парсер ответа (совместим с вашим formResult)
    async parseResponse(res) {
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = (json && (json.data || json.description || json.message)) || res.statusText || 'Network error'
        throw new Error(msg)
      }
      if (json && (json.status === '200' || json.status === 200)) {
        return json.data
      }
      return json && json.data !== undefined ? json.data : json
    },

    /* ========== Search similar domains ========== */
    async searchSimilarDomains(keyword, opts = {}) {
      if (!keyword || typeof keyword !== 'string') throw new Error('keyword обязателен')
      this.loading = true
      this.error = null
      try {
        const payload = {
          keyword,
          ...(opts.tlds ? { tlds: opts.tlds } : {}),
          ...(opts.maxResults ? { maxResults: opts.maxResults } : {}),
          ...(opts.batchSize ? { batchSize: opts.batchSize } : {})
        }
        const res = await fetch(`${API.fullUrl}/deploy/search-similar-domains`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await this.parseResponse(res)
        // ожидаем объект { keyword, count, results }
        if (data && Array.isArray(data.results)) {
          this.searchResults = data.results
        } else if (Array.isArray(data)) {
          this.searchResults = data
        } else {
          this.searchResults = data ? (data.results || []) : []
        }
        this.lastSearchKeyword = keyword
        return this.searchResults
      } catch (err) {
        this.error = err.message || 'Ошибка поиска доменов'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ========== Deploy with domain (register + deploy) ========== */
    async deployWithDomain({ templateId, domain, period = 1 }) {
      if (!templateId || !domain) throw new Error('templateId и domain обязательны')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/deploy/deploy-with-domain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId, domain, period })
        })
        const data = await this.parseResponse(res)
        // Сохраним результат деплоя (raw)
        this.lastDeploy = data
        return data
      } catch (err) {
        this.error = err.message || 'Ошибка деплоя'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ========== Attach domain by siteId ========== */
    async attachDomain(siteId, domain) {
      if (!siteId || !domain) throw new Error('siteId и domain обязательны')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/deploy/attach-domain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteId, domain })
        })
        const data = await this.parseResponse(res)
        return data
      } catch (err) {
        this.error = err.message || 'Ошибка attach'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ========== Attach domain by site name ========== */
    async attachDomainByName(siteName, domain) {
      if (!siteName || !domain) throw new Error('siteName и domain обязательны')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/deploy/attach-domain-by-name`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteName, domain })
        })
        const data = await this.parseResponse(res)
        return data
      } catch (err) {
        this.error = err.message || 'Ошибка attach by name'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ========== Verify site (get site info) ========== */
    async verifySite(siteId) {
      if (!siteId) throw new Error('siteId обязателен')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/deploy/verify-site/${encodeURIComponent(siteId)}`)
        const data = await this.parseResponse(res)
        this.siteInfo = data
        return data
      } catch (err) {
        this.error = err.message || 'Ошибка verify'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ========== Fetch Netlify sites ========== */
    async fetchNetlifySites() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/deploy/netlify-sites`)
        const data = await this.parseResponse(res)
        this.netlifySites = Array.isArray(data) ? data : (data ? [data] : [])
        return this.netlifySites
      } catch (err) {
        this.error = err.message || 'Ошибка получения сайтов'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ========== Check DNS status ========== */
    async checkDns(domain) {
      if (!domain) throw new Error('domain обязателен')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/deploy/check-dns/${encodeURIComponent(domain)}`)
        const data = await this.parseResponse(res)
        // Ожидается { domain, dns_status }
        if (data && data.domain) {
          this.dnsStatuses[data.domain] = data.dns_status
        } else if (data && data.dns_status) {
          this.dnsStatuses[domain] = data.dns_status
        }
        return data
      } catch (err) {
        this.error = err.message || 'Ошибка проверки DNS'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* Утилитные методы */
    clearError() {
      this.error = null
    },
    resetSearch() {
      this.searchResults = []
      this.lastSearchKeyword = null
    }
  }
})
