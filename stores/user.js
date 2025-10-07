import { defineStore } from 'pinia'
import { API } from '~/config'

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false,
    error: null,
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token
  },

  actions: {
    async register(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/user/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          this.error = data.message || 'Ошибка регистрации'
          throw new Error(this.error)
        }

        // После успешной регистрации сразу логиним
        await this.login({
          email: payload.email,
          password: payload.password
        })

        return await res.json()
      } catch (err) {
        this.error = this.error || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/user/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          this.error = data.message || 'Ошибка авторизации'
          throw new Error(this.error)
        }

        const data = await res.json()
        this.user = data.user || null
        this.token = data.token || null

        // localStorage доступен только в браузере
        if (this.token && typeof window !== 'undefined') {
          try {
            localStorage.setItem('token', this.token)
          } catch (e) {
            // безопасно игнорируем ошибки записи (например, режим инкогнито)
            // можно логировать при необходимости
            console.warn('localStorage setItem failed', e)
          }
        }

        return data
      } catch (err) {
        this.error = this.error || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('token')
        } catch (e) {
          console.warn('localStorage removeItem failed', e)
        }
      }
    },

    async fetchCurrentUser() {
      if (!this.token) return

      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/me`, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          this.error = data.message || 'Не удалось получить данные пользователя'
          throw new Error(this.error)
        }

        this.user = await res.json()
      } catch (err) {
        this.error = this.error || err.message
        this.logout()
      } finally {
        this.loading = false
      }
    },

    async updateUser(payload) {
      if (!this.token) throw new Error('Не авторизован')

      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API.fullUrl}/update-user`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          this.error = data.message || 'Ошибка обновления данных'
          throw new Error(this.error)
        }

        this.user = await res.json()
        return this.user
      } catch (err) {
        this.error = this.error || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    // init() теперь выполняется только в клиенте (плагин вызывает его)
    async init() {
      if (typeof window === 'undefined') return // safety: не выполнять на сервере
      try {
        const token = localStorage.getItem('token')
        if (token) {
          this.token = token
          // попытка подгрузить текущего пользователя
          await this.fetchCurrentUser()
        }
      } catch (e) {
        // в случае ошибок localStorage или fetch — просто очищаем состояние
        console.warn('user.init error', e)
        this.logout()
      }
    }
  }
})
