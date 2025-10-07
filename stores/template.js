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
    // статус загрузки / ошибки
    loading: false,
    error: null,

    // основной набор данных
    templates: [],        // массив шаблонов (для offset-пагинации и initial load)
    current: null,        // текущий шаблон (getTemplateById / getTemplateByUid)

    // offset pagination
    total: 0,
    page: 1,
    perPage: 20,

    // cursor (infinite) pagination
    nextCursor: null,     // { lastCreatedAt, lastId } или null
    hasMore: true,        // удобно для infinite scroll

    // тестовый маршрут ответ (если нужен)
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
    // Внутренняя общая функция запроса
    async _request({ method = 'GET', path = '', params = null, body = null } = {}) {
      this.loading = true
      this.error = null

      try {
        const qs = params ? buildQuery(params) : ''
        const url = `${API.fullUrl}/template${path}${qs}`

        const opts = {
          method,
          headers: {}
        }

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

    /* -------------------------
       Тест
    ------------------------- */
    async test() {
      const data = await this._request({ method: 'GET', path: '/test' })
      this.testResult = data
      return data
    },

    /* -------------------------
       CREATE
    ------------------------- */
    async createTemplate(payload) {
      const created = await this._request({ method: 'POST', path: '/', body: payload })
      // Добавляем новый шаблон в начало списка (чтобы был видим при offset-пагинации)
      if (created) {
        // Если сервер вернул объект шаблона в created
        if (created.id) {
          this.templates.unshift(created)
          this.total = Number(this.total || 0) + 1
        }
      }
      return created
    },

    /* -------------------------
       READ by id / uid
    ------------------------- */
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

    /* -------------------------
       UPDATE
    ------------------------- */
    async updateTemplate(id, payload) {
      if (!id) throw new Error('id is required')
      const updated = await this._request({ method: 'PUT', path: `/${encodeURIComponent(id)}`, body: payload })
      // Обновим список и current если нужно
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

    /* -------------------------
       DELETE
    ------------------------- */
    async deleteTemplate(id) {
      if (!id) throw new Error('id is required')
      const res = await this._request({ method: 'DELETE', path: `/${encodeURIComponent(id)}` })
      // Если удаление успешно — убираем из списка и уменьшаем total
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

    /* -------------------------
       OFFSET pagination
       options: { page, perPage, filters }
    ------------------------- */
    async listTemplates({ page = 1, perPage = 20, filters = {} } = {}) {
		  const params = {
		    page,
		    perPage,
		    type: filters.type,
		    popular: typeof filters.popular !== 'undefined' ? (filters.popular ? '1' : '0') : undefined,
		    min_price: filters.min_price,
		    max_price: filters.max_price,
		    search: filters.search,
		    uid: filters.uid
		  }

		  const result = await this._request({ method: 'GET', path: '/', params })

		  // ---- Robust handling of different server shapes ----
		  // Possible shapes:
		  // 1) { rows: [...], total, page, perPage }
		  // 2) { data: { rows: [...], total, page, perPage } }
		  // 3) [...] (simple array)
		  // 4) null / unexpected
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
		      // nested data
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
		      // maybe the server returned an object that is actually the array-like result
		      // try to find first array field
		      const firstArrayField = Object.values(result).find(v => Array.isArray(v))
		      if (firstArrayField) {
		        rows = firstArrayField
		        total = Number(result.total ?? rows.length)
		      }
		    }
		  }

		  // debug log (можно отключить в production)
		  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
		    // eslint-disable-next-line no-console
		    console.debug('[template.store] listTemplates result:', { raw: result, rowsCount: rows.length, total })
		  }

		  this.templates = rows
		  this.total = Number(total || 0)
		  this.page = respPage
		  this.perPage = respPerPage
		  // reset cursor-related state
		  this.nextCursor = null
		  this.hasMore = (this.templates.length < this.total)

		  return result
		},

    /* -------------------------
       INFINITE (cursor) pagination
       options: { limit, lastCreatedAt, lastId, order, filters }
       IMPORTANT: если lastCreatedAt/lastId не передать — будет начальный load (replace),
                  если передать — будет append (load more).
    ------------------------- */
    async listTemplatesInfinite({ limit = 20, lastCreatedAt = null, lastId = null, order = 'desc', filters = {} } = {}) {
      const params = {
        limit,
        lastCreatedAt,
        lastId,
        order,
        type: filters.type,
        popular: typeof filters.popular !== 'undefined' ? (filters.popular ? '1' : '0') : undefined,
        min_price: filters.min_price,
        max_price: filters.max_price,
        search: filters.search,
        uid: filters.uid
      }

      const result = await this._request({ method: 'GET', path: '/infinite', params })
      // result: { rows, nextCursor }

      const rows = (result && Array.isArray(result.rows)) ? result.rows : []
      const nextCursor = result && result.nextCursor ? result.nextCursor : null

      if (!lastCreatedAt && !lastId) {
        // initial load — replace array
        this.templates = rows
      } else {
        // load more — append
        this.templates = this.templates.concat(rows)
      }

      this.nextCursor = nextCursor
      this.hasMore = !!nextCursor && (rows.length > 0)
      return result
    },

    /* -------------------------
       Search by title
    ------------------------- */
    async searchByTitle(q, limit = 20) {
      if (!q) throw new Error('query q is required')
      const params = { q, limit }
      const rows = await this._request({ method: 'GET', path: '/search/title', params })
      // возвращаем результат не модифицируя основной templates, но можно по желанию сохранить
      return rows
    },

    /* -------------------------
       Утилиты: сброс состояния / очистка ошибок
    ------------------------- */
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
