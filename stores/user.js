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

        if (this.token) {
          localStorage.setItem('token', this.token)
          // Авто-подгрузка текущего пользователя не нужна, т.к. уже есть user
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
      localStorage.removeItem('token')
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

    // Новая функция для автоматической подгрузки токена и пользователя при старте
    async init() {
      const token = localStorage.getItem('token')
      console.log(token)
      if (token) {
        this.token = token
        await this.fetchCurrentUser()
      }
    }
  }
})
