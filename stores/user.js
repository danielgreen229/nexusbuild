// stores/user.js
import { defineStore } from 'pinia'
import { API } from '@/config/index.js' // проверь путь к конфигу

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false,
    error: null,
    user: null,
    token: null,
    uid: null,
    isAuthenticated: false
  }),

  // НЕ добавляем геттеры с теми же именами, чтобы не ломать прокси
  actions: {
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
          const body = await res.json().catch(() => ({}))
          const errorMsg = body.message || body.description || 'Ошибка авторизации'
          this.error = errorMsg
          throw new Error(errorMsg)
        }

        const parsed = await res.json().catch(() => ({}))
        const data = parsed.data || parsed

        if (!data) throw new Error('Некорректный ответ сервера')

        this.user = data
        this.token = data.token || null
        this.uid = data.uid || null
        this.isAuthenticated = true

        if (this.token && this.uid) {
          localStorage.setItem('token', this.token)
          localStorage.setItem('uid', this.uid)
        }

        return data
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка'
        this.isAuthenticated = false
        throw err
      } finally {
        this.loading = false
      }
    },

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
          const body = await res.json().catch(() => ({}))
          const errorMsg = body.message || body.description || 'Ошибка регистрации'
          this.error = errorMsg
          throw new Error(errorMsg)
        }

        const parsed = await res.json().catch(() => ({}))
        const data = parsed.data || parsed

        if (!data) throw new Error('Некорректный ответ сервера при регистрации')

        // Сохраняем данные и токен точно так же, как при логине
        this.user = data
        this.token = data.token || null
        this.uid = data.uid || null
        this.isAuthenticated = true

        if (this.token && this.uid) {
          localStorage.setItem('token', this.token)
          localStorage.setItem('uid', this.uid)
        }

        return data
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка при регистрации'
        throw err
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.uid = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('uid')
    },

    async fetchCurrentUser() {
      if (!this.token || !this.uid) return null

      this.loading = true
      this.error = null

      try {
        const payload = { token: this.token, uid: this.uid }
        const res = await fetch(`${API.fullUrl}/user/me`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          const message = body.message || body.description || 'Не удалось получить данные пользователя'
          this.error = message
          throw new Error(message)
        }

        const parsed = await res.json().catch(() => ({}))
        const user = parsed.data || parsed
        this.user = user
        this.isAuthenticated = true
        return user
      } catch (err) {
        this.error = err.message
        this.isAuthenticated = false
        this.logout()
        throw err
      } finally {
        this.loading = false
      }
    },

    initFromStorage() {
      const token = localStorage.getItem('token')
      const uid = localStorage.getItem('uid')
      if (token && uid) {
        this.token = token
        this.uid = uid
        this.isAuthenticated = true
      } else {
        this.isAuthenticated = false
      }
    }
  }
})
