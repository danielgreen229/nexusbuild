import { defineStore } from 'pinia'
import { API } from '~/config'

export const useLandingStore = defineStore('landing', {
  state: () => ({
    loading: false,
    error: null,
    landings: [],
    landing: null
  }),

  getters: {
    isLoading(state) {
      return state.loading
    },
    hasError(state) {
      return !!state.error
    }
  },

  actions: {
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

    async addLandingSettings(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/landing/add-settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const created = await this.parseResponse(res)
        if (created) {
          const idx = this.landings.findIndex(l => (l.id && created.id && l.id === created.id) || (l.uid && created.uid && l.uid === created.uid))
          if (idx !== -1) this.landings.splice(idx, 1, created)
          else this.landings.unshift(created)
          this.landing = created
        }
        return created
      } catch (err) {
        this.error = err.message || 'Ошибка'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchLanding(id) {
      if (!id) throw new Error('id обязателен')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/landing/landing/${id}`)
        const data = await this.parseResponse(res)
        this.landing = data
        return data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchLandingByUid(uid) {
      if (!uid) throw new Error('uid обязателен')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/landing/landing-uid/${uid}`)
        const data = await this.parseResponse(res)
        this.landing = data
        return data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/landing/landings`)
        const data = await this.parseResponse(res)
        this.landings = Array.isArray(data) ? data : (data ? [data] : [])
        return this.landings
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateLanding(id, payload) {
      if (!id) throw new Error('id обязателен')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/landing/landing/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const updated = await this.parseResponse(res)
        if (updated) {
          const idx = this.landings.findIndex(l => l.id && updated.id && l.id === updated.id)
          if (idx !== -1) this.landings.splice(idx, 1, updated)
          this.landing = updated
        }
        return updated
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteLanding(id) {
      if (!id) throw new Error('id обязателен')
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/landing/landing/${id}`, { method: 'DELETE' })
        const deleted = await this.parseResponse(res)
        const idx = this.landings.findIndex(l => l.id && l.id === Number(id) || (l.id && l.id === id))
        if (idx !== -1) this.landings.splice(idx, 1)
        if (this.landing && (this.landing.id === id || this.landing.id === Number(id))) this.landing = null
        return deleted
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})