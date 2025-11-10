// stores/order.js
import { defineStore } from 'pinia'
import { API } from '@/config/index.js'
import { useUserStore } from '~/stores/user'

const base = `${API.fullUrl}/order`

function safeParseInt(v, fallback = null) {
  const n = Number(v)
  return Number.isInteger(n) ? n : fallback
}

function normalizeOrderUpdate(body = {}) {
  const map = {
    paymentMethod: 'payment_method', payment_method: 'payment_method',
    netlifyUrl: 'netlify_url', netlify_url: 'netlify_url',
    adminUrl: 'admin_url', admin_url: 'admin_url',
    completedAt: 'completed_at', completed_at: 'completed_at',
    price: 'price', status: 'status',
    orderExternalUid: 'order_externals_uid', order_externals_uid: 'order_externals_uid'
  }
  const out = {}
  Object.keys(body).forEach(k => { if (map[k]) out[map[k]] = body[k] })
  return out
}

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    loading: false,
    error: null,

    orders: [],
    page: 1,
    perPage: 20,
    totalCount: 0,
    currentOrder: null,

    adminOrders: [],
    adminStats: null,

    lastCreated: null,
  }),

  actions: {
    /**
     * Отправка простой заявки/контактной формы.
     * Ожидаемый payload: { fio, company, email, phone, description }
     *
     * Возвращает { success: true, data } при успехе.
     * В случае ошибки бросает Error с текстом (чтобы компонент мог поймать).
     */
    async sendRequest(payload = {}) {
      this.loading = true
      this.error = null
      try {
        // Простая валидация на стороне стора (дополнительно к проверкам в компоненте)
        if (!payload || typeof payload !== 'object') {
          const msg = 'Неверные данные заявки'
          this.error = msg
          throw new Error(msg)
        }
        if (!payload.email) {
          const msg = 'Email обязателен'
          this.error = msg
          throw new Error(msg)
        }
        if (!payload.description || String(payload.description).trim().length < 3) {
          const msg = 'Короткое описание заявки'
          this.error = msg
          throw new Error(msg)
        }

        // Подготовка тела — просто пробрасываем пришедшие поля
        const body = { ...payload }

        // Отправляем на endpoint /order/request — если API у вас другой, поправьте путь
        const got = await this._doFetch(`${base}/request`, {
          method: 'POST',
          body: JSON.stringify(body)
        })

        if (!got.success) {
          const msg = got.message || 'Ошибка отправки заявки'
          this.error = msg
          // бросаем Error чтобы компонент попал в catch
          throw new Error(msg)
        }

        const data = got.data ?? got.raw ?? null
        // Сохраняем последний созданный/отправленный объект для возможного использования
        this.lastCreated = data

        return { success: true, data }
      } catch (err) {
        console.error('sendRequest error', err)
        this.error = err?.message || 'Сетевая ошибка'
        // пробрасываем дальше
        throw err
      } finally {
        this.loading = false
      }
    },

    clearError() { this.error = null },

    reset() {
      this.loading = false
      this.error = null
      this.orders = []
      this.page = 1
      this.perPage = 20
      this.totalCount = 0
      this.currentOrder = null
      this.adminOrders = []
      this.adminStats = null
      this.lastCreated = null
    },

    _extractData(json) {
      if (!json) return null
      return json.data ?? json
    },

    /**
     * _doFetch: всегда добавляет поле user:
     * - для GET: добавляет query param `user=<encoded JSON>`
     * - для non-GET: добавляет в тело поле `user` (если FormData — добавляет как JSON строку)
     *
     * Не использует credentials (credentials: 'omit'), но при наличии токена ставит Authorization.
     */
    async _doFetch(url, opts = {}) {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const user = (userStore && userStore.user) ? userStore.user : (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null)
        const token = (userStore && userStore.token) ? userStore.token : (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

        const method = (opts.method || 'GET').toUpperCase()

        // Clone headers/options so we don't mutate caller object
        const headers = Object.assign({}, opts.headers || {})
        const fetchOpts = Object.assign({}, opts, { method, headers, credentials: 'omit' })

        // If GET — attach user as query param (encoded JSON)
        let finalUrl = url
        if (method === 'GET' && user) {
          const userParam = encodeURIComponent(JSON.stringify(user))
          finalUrl += (finalUrl.includes('?') ? '&' : '?') + `user=${userParam}`
        }

        // For non-GET: attach user into body
        if (method !== 'GET') {
          let body = fetchOpts.body

          // If FormData -> append user as JSON string
          if (body instanceof FormData) {
            if (user) body.append('user', JSON.stringify(user))
            // let browser set Content-Type (multipart boundary)
            delete fetchOpts.headers['Content-Type']
            fetchOpts.body = body
          } else {
            // If body is string, try parse; else ensure object
            let parsed = null
            if (typeof body === 'string' && body.length > 0) {
              try { parsed = JSON.parse(body) } catch (e) { parsed = null }
            } else if (typeof body === 'object' && body !== null) {
              parsed = body
            } else {
              parsed = {}
            }

            // attach user (if exists)
            if (user) parsed.user = user

            // set Content-Type
            fetchOpts.headers['Content-Type'] = fetchOpts.headers['Content-Type'] || 'application/json'
            fetchOpts.body = JSON.stringify(parsed)
          }
        }

        // Attach Authorization header if token present and not already set
        if (token && !fetchOpts.headers.Authorization) {
          fetchOpts.headers.Authorization = `Bearer ${token}`
        }

        // Default Accept header
        if (!fetchOpts.headers.Accept) fetchOpts.headers.Accept = 'application/json'

        const res = await fetch(finalUrl, fetchOpts)
        const text = await res.text().catch(() => null)
        let json = null
        try { json = text ? JSON.parse(text) : null } catch (e) { json = null }
        const data = this._extractData(json)

        if (!res.ok) {
          const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`
          this.error = msg
          return { success: false, status: res.status, data: null, message: msg, raw: json ?? text }
        }

        return { success: true, status: res.status, data, raw: json ?? text }
      } catch (err) {
        console.error('_doFetch error', err)
        this.error = err.message || 'Network error'
        return { success: false, data: null, message: this.error }
      } finally {
        this.loading = false
      }
    },

    /* ---------------- API methods ---------------- */

    async fetchUserOrders(options = {}) {
      this.loading = true
      this.error = null
      try {
        const page = safeParseInt(options.page, 1) || 1
        const perPage = safeParseInt(options.perPage, 20) || 20
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('perPage', String(perPage))
        if (options.status) params.set('status', options.status)
        if (options.joinExternal) params.set('joinExternal', '1')
        const got = await this._doFetch(`${base}?${params.toString()}`, { method: 'GET' })
        if (!got.success) 
          return { 
            success: false, 
            message: got.data || 'Ошибка получения заказов', 
            data: null 
          }

        const payload = got.data ?? got.raw
        const rows = payload.rows ?? payload.orders ?? []
        const respPage = payload.page ?? page
        const respPerPage = payload.perPage ?? perPage
        const respTotal = payload.totalCount ?? payload.total ?? 0

        this.orders = rows
        this.page = respPage
        this.perPage = respPerPage
        this.totalCount = respTotal

        return { success: true, data: { rows, page: respPage, perPage: respPerPage, totalCount: respTotal } }
      } catch (err) {
        console.error('fetchUserOrders error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async fetchOrderById(orderId, options = {}) {
      if (!orderId) return { success: false, message: 'orderId required', data: null }
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams()
        if (options.joinExternal) params.set('joinExternal', '1')
        const q = params.toString() ? `?${params.toString()}` : ''
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}${q}`, { method: 'GET' })
        if (!got.success) return { success: false, message: got.message || 'Ошибка получения заказа', data: null }
        this.currentOrder = got.data
        return { success: true, data: got.data }
      } catch (err) {
        console.error('fetchOrderById error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async createOrder(payload = {}) {
      this.loading = true
      this.error = null


      try {
        if (!payload.templateId || isNaN(Number(payload.templateId))) {
          const msg = 'templateId required'
          this.error = msg
          return { success: false, message: msg, data: null }
        }
        if (typeof payload.price === 'undefined' || isNaN(Number(payload.price))) {
          const msg = 'price required'
          this.error = msg
          return { success: false, message: msg, data: null }
        }

        const body = {
          templateId: Number(payload.templateId),
          price: Number(payload.price),
          payment_method: payload.paymentMethod ?? payload.payment_method ?? 'yookassa',
          status: payload.status ?? 'pending_payment'
        }

        // Обработка external / order_externals_uid (как раньше)
        if (payload.external && typeof payload.external === 'object') body.external = payload.external
        else if (payload.order_externals_uid || payload.orderExternalUid) body.order_externals_uid = payload.order_externals_uid ?? payload.orderExternalUid

        // === НОВОЕ: добавляем domain в тело запроса ===
        // Поддерживаем разные форматы: string (fqdn) или object { fqdn, price, currency, available, id, ... }
        body.domain = payload.domain
        // === конец: добавление domain ===

        const got = await this._doFetch(base, { method: 'POST', body: JSON.stringify(body) })
        if (!got.success) return { success: false, message: got.message || 'Ошибка создания', data: null }

        const data = got.data
        this.lastCreated = data
        if (data) this.orders = [data, ...this.orders]
        return { success: true, data }
      } catch (err) {
        console.error('createOrder error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async updateOrder(orderId, body = {}) {
      if (!orderId) return { success: false, message: 'orderId required', data: null }
      const update = normalizeOrderUpdate(body)
      if (Object.keys(update).length === 0) return { success: false, message: 'No fields to update', data: null }

      this.loading = true
      this.error = null
      try {
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}`, { method: 'PUT', body: JSON.stringify(update) })
        if (!got.success) return { success: false, message: got.message || 'Ошибка обновления', data: null }
        const data = got.data
        if (this.currentOrder && this.currentOrder.id === data.id) this.currentOrder = data
        this.orders = this.orders.map(r => (r.id === data.id ? data : r))
        this.adminOrders = this.adminOrders.map(r => (r.id === data.id ? data : r))
        return { success: true, data }
      } catch (err) {
        console.error('updateOrder error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(orderId, { status, completedAt = null } = {}) {
      if (!orderId) return { success: false, message: 'orderId required', data: null }
      if (!status) return { success: false, message: 'status required', data: null }

      this.loading = true
      this.error = null
      try {
        const payload = { status }
        if (completedAt) payload.completedAt = completedAt
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}/status`, { method: 'PATCH', body: JSON.stringify(payload) })
        if (!got.success) return { success: false, message: got.message || 'Ошибка обновления статуса', data: null }
        const data = got.data
        if (this.currentOrder && this.currentOrder.id === data.id) this.currentOrder = data
        this.orders = this.orders.map(r => (r.id === data.id ? data : r))
        this.adminOrders = this.adminOrders.map(r => (r.id === data.id ? data : r))
        return { success: true, data }
      } catch (err) {
        console.error('updateOrderStatus error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async deleteOrder(orderId) {
      if (!orderId) return { success: false, message: 'orderId required', data: null }
      this.loading = true
      this.error = null
      try {
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}`, { method: 'DELETE' })
        if (!got.success) return { success: false, message: got.message || 'Ошибка удаления', data: null }
        this.orders = this.orders.filter(r => r.id !== orderId)
        this.adminOrders = this.adminOrders.filter(r => r.id !== orderId)
        if (this.currentOrder && this.currentOrder.id === orderId) this.currentOrder = null
        return { success: true, data: got.data ?? got.raw }
      } catch (err) {
        console.error('deleteOrder error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async fetchAdminAll(options = {}) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams()
        if (options.status) params.set('status', options.status)
        if (options.userId) params.set('userId', options.userId)
        if (options.userUid) params.set('userUid', options.userUid)
        if (options.templateId) params.set('templateId', options.templateId)
        if (options.dateFrom) params.set('dateFrom', options.dateFrom)
        if (options.dateTo) params.set('dateTo', options.dateTo)
        if (typeof options.limit !== 'undefined') params.set('limit', String(options.limit))
        if (options.joinExternal) params.set('joinExternal', '1')

        const url = `${base}/admin/all?${params.toString()}`
        const got = await this._doFetch(url, { method: 'GET' })
        if (!got.success) return { success: false, message: got.message || 'Ошибка получения админ-списка', data: null }

        const payload = got.data ?? got.raw
        this.adminOrders = payload.orders ?? payload.rows ?? []
        this.totalCount = payload.totalCount ?? this.totalCount
        return { success: true, data: { orders: this.adminOrders, totalCount: this.totalCount } }
      } catch (err) {
        console.error('fetchAdminAll error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async fetchAdminStats() {
      this.loading = true
      this.error = null
      try {
        const got = await this._doFetch(`${base}/admin/stats`, { method: 'GET' })
        if (!got.success) return { success: false, message: got.message || 'Ошибка получения статистики', data: null }
        const payload = got.data ?? got.raw
        this.adminStats = payload.stats ?? payload
        this.totalCount = payload.totalCount ?? this.totalCount
        return { success: true, data: { totalCount: this.totalCount, stats: this.adminStats } }
      } catch (err) {
        console.error('fetchAdminStats error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async linkOrderToExternal(orderId, externalUid) {
      if (!orderId) return { success: false, message: 'orderId required', data: null }
      if (!externalUid) return { success: false, message: 'externalUid required', data: null }

      this.loading = true
      this.error = null
      try {
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}/link-external`, {
          method: 'POST',
          body: JSON.stringify({ externalUid })
        })
        if (!got.success) return { success: false, message: got.message || 'Ошибка привязки', data: null }
        const data = got.data
        if (this.currentOrder && this.currentOrder.id === data.id) this.currentOrder = data
        this.orders = this.orders.map(r => (r.id === data.id ? data : r))
        this.adminOrders = this.adminOrders.map(r => (r.id === data.id ? data : r))
        return { success: true, data }
      } catch (err) {
        console.error('linkOrderToExternal error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async fetchAdminExternal(uid) {
      if (!uid) return { success: false, message: 'uid required', data: null }
      this.loading = true
      this.error = null
      try {
        const got = await this._doFetch(`${base}/admin/external/${encodeURIComponent(uid)}`, { method: 'GET' })
        if (!got.success) return { success: false, message: got.message || 'Ошибка получения external', data: null }
        return { success: true, data: got.data }
      } catch (err) {
        console.error('fetchAdminExternal error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async createAdminExternal(payload = {}) {
      this.loading = true
      this.error = null
      try {
        const body = { ...payload }
        const got = await this._doFetch(`${base}/admin/external`, { method: 'POST', body: JSON.stringify(body) })
        if (!got.success) return { success: false, message: got.message || 'Ошибка создания external', data: null }
        return { success: true, data: got.data }
      } catch (err) {
        console.error('createAdminExternal error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async updateAdminExternal(uid, payload = {}) {
      if (!uid) return { success: false, message: 'uid required', data: null }
      this.loading = true
      this.error = null
      try {
        const body = { ...payload }
        const got = await this._doFetch(`${base}/admin/external/${encodeURIComponent(uid)}`, { method: 'PUT', body: JSON.stringify(body) })
        if (!got.success) return { success: false, message: got.message || 'Ошибка обновления external', data: null }
        return { success: true, data: got.data }
      } catch (err) {
        console.error('updateAdminExternal error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    },

    async deleteAdminExternal(uid) {
      if (!uid) return { success: false, message: 'uid required', data: null }
      this.loading = true
      this.error = null
      try {
        const got = await this._doFetch(`${base}/admin/external/${encodeURIComponent(uid)}`, { method: 'DELETE' })
        if (!got.success) return { success: false, message: got.message || 'Ошибка удаления external', data: null }
        return { success: true, data: got.data ?? got.raw }
      } catch (err) {
        console.error('deleteAdminExternal error', err)
        this.error = err.message || 'Ошибка'
        return { success: false, message: this.error, data: null }
      } finally {
        this.loading = false
      }
    }
  }
})
