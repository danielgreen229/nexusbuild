import { defineStore } from 'pinia'
import { API } from '~/config'

function buildQuery(params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return qs ? `?${qs}` : ''
}

export const useTemplateStore = defineStore('template', {
  state: () => ({
    loading: false,
    error: null,

    templates: [],
    current: null,

    total: 0,
    page: 1,
    perPage: 20,

    nextCursor: null,
    hasMore: true,

    testResult: null,
  }),
  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    templatesCount: (state) => state.templates.length,
    canLoadMore: (state) => state.hasMore,
    currentTemplate: (state) => state.current,
  },
  actions: {
    async _request({ method = 'GET', path = '', params = null, body = null } = {}) {
      this.loading = true
      this.error = null

      try {
        const qs = params ? buildQuery(params) : ''
        const url = `${API.fullUrl}/template${path}${qs}`

        const opts = { method, headers: {} }

        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          opts.headers['Content-Type'] = 'application/json'
          opts.body = JSON.stringify(body)
        }

        const res = await fetch(url, opts)

        let json = null
        try {
          json = await res.json()
        } catch (e) {
          if (!res.ok) throw new Error(res.statusText || 'Network error')
          return null
        }

        if (!res.ok) {
          const msg = (json && (json.description || json.data)) ? (json.description || json.data) : (res.statusText || `HTTP ${res.status}`)
          throw new Error(msg)
        }

        if (json && typeof json === 'object' && ('status' in json)) {
          if (String(json.status) === '200') return json.data
          const msg = json.description || json.data || 'Server error'
          throw new Error(msg)
        }

        return json
      } catch (error) {
        this.error = error.message || String(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /* TEST */
    async test() {
      const data = await this._request({ method: 'GET', path: '/test' })
      this.testResult = data
      return data
    },

    /* CREATE */
    async createTemplate(payload) {
      const created = await this._request({ method: 'POST', path: '/', body: payload })
      if (created) {
        if (created.id) {
          this.templates.unshift(created)
          this.total = Number(this.total || 0) + 1
        }
      }
      return created
    },

    /* READ by id / uid */
    async getTemplateById(id) {
      if (!id) throw new Error('id is required')
      const row = await this._request({ method: 'GET', path: `/${encodeURIComponent(id)}` })
      this.current = row
      return row
    },

    async getTemplateByUid(uid) {
      if (!uid) throw new Error('uid is required')
      const row = await this._request({ method: 'GET', path: `/uid/${encodeURIComponent(uid)}` })
      this.current = row
      return row
    },

    /* UPDATE */
    async updateTemplate(id, payload) {
      if (!id) throw new Error('id is required')
      const updated = await this._request({ method: 'PUT', path: `/${encodeURIComponent(id)}`, body: payload })
      if (updated) {
        const idx = this.templates.findIndex(t => t.id === updated.id)
        if (idx !== -1) {
          this.templates.splice(idx, 1, updated)
        }
        if (this.current && this.current.id === updated.id) {
          this.current = updated
        }
      }
      return updated
    },

    /* DELETE */
    async deleteTemplate(id) {
      if (!id) throw new Error('id is required')
      const res = await this._request({ method: 'DELETE', path: `/${encodeURIComponent(id)}` })
      const idx = this.templates.findIndex(t => t.id === Number(id))
      if (idx !== -1) {
        this.templates.splice(idx, 1)
        this.total = Math.max(0, (Number(this.total || 0) - 1))
      }
      if (this.current && this.current.id === Number(id)) {
        this.current = null
      }
      return res
    },

    /**
     * OFFSET pagination
     * Добавлены опции сортировки:
     *   sortBy - строка полей через запятую, например 'have_html,popular,created_at'
     *   order  - 'desc' или 'asc'
     *
     * Эти параметры попадут в query как sort_by и order.
     */
    async listTemplates({ page = 1, perPage = 20, filters = {}, append = false, sortBy = 'have_html,popular,created_at', order = 'desc' } = {}) {
      const params = {
        page,
        perPage,
        // фильтры сервера
        type: filters.type,
        popular: typeof filters.popular !== 'undefined' ? (filters.popular ? '1' : '0') : undefined,
        min_price: filters.min_price,
        max_price: filters.max_price,
        search: filters.search,
        uid: filters.uid,
        // явные параметры сортировки — сервер должен их обработать
        sort_by: sortBy,
        order: order
      }

      const result = await this._request({ method: 'GET', path: '/', params })

      // robust handling server shapes
      let rows = []
      let total = 0
      let respPage = page
      let respPerPage = perPage

      if (Array.isArray(result)) {
        rows = result
        total = result.length
      } else if (result && typeof result === 'object') {
        if (Array.isArray(result.rows)) {
          rows = result.rows
          total = Number(result.total ?? rows.length)
          respPage = Number(result.page ?? page)
          respPerPage = Number(result.perPage ?? perPage)
        } else if (result.data && typeof result.data === 'object') {
          const d = result.data
          if (Array.isArray(d.rows)) {
            rows = d.rows
            total = Number(d.total ?? rows.length)
            respPage = Number(d.page ?? page)
            respPerPage = Number(d.perPage ?? perPage)
          } else if (Array.isArray(d)) {
            rows = d
            total = d.length
          }
        } else {
          const firstArrayField = Object.values(result).find(v => Array.isArray(v))
          if (firstArrayField) {
            rows = firstArrayField
            total = Number(result.total ?? rows.length)
          }
        }
      }

      if (append) {
        const existingIds = new Set(this.templates.map(t => t.id))
        const newRows = rows.filter(r => !existingIds.has(r.id))
        this.templates = this.templates.concat(newRows)
      } else {
        this.templates = rows
      }

      this.total = Number(total || 0)
      this.page = respPage
      this.perPage = respPerPage

      this.hasMore = (this.templates.length < this.total)
      this.nextCursor = null

      return result
    },

    /**
     * loadMoreOffset теперь явно отправляет page и perPage и пробрасывает сорт-параметры.
     * Используйте loadMoreOffset({ filters, sortBy, order }) или оставьте пустым — применяются значения из state/perPage.
     */
    async loadMoreOffset({ filters = {}, sortBy = 'have_html,popular,created_at', order = 'desc' } = {}) {
      if (this.loading) return
      if (!this.hasMore) return

      const nextPage = (Number(this.page) || 1) + 1
      try {
        await this.listTemplates({ page: nextPage, perPage: this.perPage, filters, append: true, sortBy, order })
      } catch (err) {
        console.warn('[template.store] loadMoreOffset failed', err)
      }
    },

    /* INFINITE (cursor) pagination */
    async listTemplatesInfinite({ limit = 20, lastCreatedAt = null, lastId = null, order = 'desc', filters = {}, lastHaveHtml = undefined, lastPopular = undefined } = {}) {
      const params = {
        limit,
        lastCreatedAt,
        lastId,
        order,
        lastHaveHtml: typeof lastHaveHtml !== 'undefined' ? (lastHaveHtml ? '1' : '0') : undefined,
        lastPopular: typeof lastPopular !== 'undefined' ? (lastPopular ? '1' : '0') : undefined,
        type: filters.type,
        popular: typeof filters.popular !== 'undefined' ? (filters.popular ? '1' : '0') : undefined,
        min_price: filters.min_price,
        max_price: filters.max_price,
        search: filters.search,
        uid: filters.uid
      }

      const result = await this._request({ method: 'GET', path: '/infinite', params })
      const rows = (result && Array.isArray(result.rows)) ? result.rows : []
      const nextCursor = result && result.nextCursor ? result.nextCursor : null

      if (!lastCreatedAt && !lastId) {
        this.templates = rows
      } else {
        const existingIds = new Set(this.templates.map(t => t.id))
        const newRows = rows.filter(r => !existingIds.has(r.id))
        this.templates = this.templates.concat(newRows)
      }

      this.nextCursor = nextCursor
      this.hasMore = !!nextCursor && (rows.length > 0)
      return result
    },

    /* Search by title */
    async searchByTitle(q, limit = 20) {
      if (!q) throw new Error('query q is required')
      const params = { q, limit }
      const rows = await this._request({ method: 'GET', path: '/search/title', params })
      return rows
    },

    /* Utilities */
    clearError() {
      this.error = null
    },

    reset() {
      this.loading = false
      this.error = null
      this.templates = []
      this.current = null
      this.total = 0
      this.page = 1
      this.perPage = 20
      this.nextCursor = null
      this.hasMore = true
      this.testResult = null
    }
  }
})
