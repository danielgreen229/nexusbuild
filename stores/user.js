import { defineStore } from 'pinia'
import { API } from '@/config/index.js' // проверьте путь к конфигу

const LS_TOKEN_KEY = 'token'
const LS_UID_KEY = 'uid'

function _buildUrl(path) {
  // Убираем слэши дублирующие
  return `${API.fullUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

async function _parseJsonSafe(res) {
  try {
    return await res.json()
  } catch (e) {
    return {}
  }
}

function _extractMessageFromBody(body) {
  if (!body) return null
  return body.data || body.message || body.description || body.error || null
}

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false,
    error: null,
    user: null,
    token: null,
    uid: null,
    isAuthenticated: false
  }),

  actions: {
    // Внутренний HTTP POST хелпер
    async _post(path, body = {}, { includeAuth = false } = {}) {
      const url = _buildUrl(path)
      const headers = { 'Content-Type': 'application/json' }
      if (includeAuth && this.token) headers['Authorization'] = `Bearer ${this.token}`

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })
      const parsed = await _parseJsonSafe(res)
      return { res, parsed }
    },

    _saveAuthToStorage(token, uid) {
      if (token) localStorage.setItem(LS_TOKEN_KEY, token)
      else localStorage.removeItem(LS_TOKEN_KEY)

      if (uid) localStorage.setItem(LS_UID_KEY, uid)
      else localStorage.removeItem(LS_UID_KEY)
    },

    _syncFromUserObject(obj = {}) {
      // Поддерживаем варианты: obj может быть user, data, или { user: {...} }
      const maybe = obj.user || obj
      this.user = maybe
      this.token = maybe.token || this.token
      this.uid = maybe.uid || maybe.id || (maybe.user && maybe.user.uid) || this.uid
      this.isAuthenticated = !!(this.token && this.uid)
      this._saveAuthToStorage(this.token, this.uid)
    },

    initFromStorage() {
      try {
        const token = localStorage.getItem(LS_TOKEN_KEY)
        const uid = localStorage.getItem(LS_UID_KEY)
        if (token && uid) {
          this.token = token
          this.uid = uid
          this.isAuthenticated = true
        } else {
          this.token = null
          this.uid = null
          this.isAuthenticated = false
        }
      } catch (e) {
        // в окружениях без localStorage
        this.token = null
        this.uid = null
        this.isAuthenticated = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.uid = null
      this.isAuthenticated = false
      this.error = null
      try {
        localStorage.removeItem(LS_TOKEN_KEY)
        localStorage.removeItem(LS_UID_KEY)
      } catch (e) {
        // ignore
      }
    },

    async login(payload = {}) {
      this.loading = true
      this.error = null
      try {
        const { res, parsed } = await this._post('/user/login', payload)
        if (!res.ok) {
          const errMsg = _extractMessageFromBody(parsed) || 'Ошибка авторизации'
          this.error = errMsg
          if (res.status === 401) this.logout()
          throw new Error(errMsg)
        }

        const data = parsed.data || parsed
        if (!data) {
          this.error = 'Некорректный ответ сервера'
          throw new Error(this.error)
        }

        this._syncFromUserObject(data)
        return data
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка'
        this.isAuthenticated = !!(this.token && this.uid)
        throw err
      } finally {
        this.loading = false
      }
    },

    async register(payload = {}, { autologin = false } = {}) {
      this.loading = true
      this.error = null
      try {
        const { res, parsed } = await this._post('/user/register', payload)
        if (!res.ok) {
          const errMsg = _extractMessageFromBody(parsed) || 'Ошибка регистрации'
          this.error = errMsg
          throw new Error(errMsg)
        }

        const data = parsed.data || parsed
        if (!data) {
          this.error = 'Некорректный ответ сервера при регистрации'
          throw new Error(this.error)
        }

        // Сохраняем созданного пользователя (без автологина)
        this.user = data

        if (autologin) {
          this._syncFromUserObject(data)
        } else {
          // гарантируем, что сессия не установлена
          this.token = null
          this.uid = null
          this.isAuthenticated = false
          this._saveAuthToStorage(null, null)
        }

        return data
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка при регистрации'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchCurrentUser() {
      // Ничего не делаем если нет auth
      if (!this.token || !this.uid) return null

      this.loading = true
      this.error = null
      try {
        const payload = { token: this.token, uid: this.uid }
        const { res, parsed } = await this._post('/user/me', payload, { includeAuth: true })

        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || 'Не удалось получить данные пользователя'
          this.error = msg
          if (res.status === 401) this.logout()
          throw new Error(msg)
        }

        const user = parsed.data || parsed
        if (!user) {
          this.error = 'Некорректный ответ сервера при получении пользователя'
          throw new Error(this.error)
        }

        this.user = user
        // синхронизируем если сервер вернул свежие токен/uid
        if (user.token) this.token = user.token
        const newUid = user.uid || user.id || (user.user && user.user.uid)
        if (newUid) this.uid = newUid
        this.isAuthenticated = !!(this.token && this.uid)
        this._saveAuthToStorage(this.token, this.uid)

        return user
      } catch (err) {
        this.error = err.message || 'Ошибка при получении пользователя'
        this.logout()
        throw err
      } finally {
        this.loading = false
      }
    },

    async submit() {
      if (!this.token || !this.uid) {
        const msg = 'Требуется token и uid'
        this.error = msg
        throw new Error(msg)
      }

      this.loading = true
      this.error = null
      try {
        const payload = { token: this.token, uid: this.uid }
        const { res, parsed } = await this._post('/user/submit', payload, { includeAuth: true })

        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}: не удалось пометить пользователя`
          this.error = msg
          if (res.status === 401) this.logout()
          throw new Error(msg)
        }

        const data = parsed.data || parsed
        if (data && typeof data === 'object') {
          this._syncFromUserObject(data)
          return data
        }

        // если вернулся пустой ответ — попробуем обновить профиль
        return await this.fetchCurrentUser()
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка при пометке submitted'
        throw err
      } finally {
        this.loading = false
      }
    },

    async sendTokenEmail(payload = {}) {
      this.loading = true
      this.error = null
      try {
        const { res, parsed } = await this._post('/user/send-token-email', payload, { includeAuth: !!this.token })
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}: не удалось отправить письмо`
          this.error = msg
          if (res.status === 401) this.logout()
          throw new Error(msg)
        }
        return parsed.data || parsed || null
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка при отправке письма'
        throw err
      } finally {
        this.loading = false
      }
    },

    async sendResetPassword(payload = {}) {
      // Новый API ожидает { email } согласно бэку
      this.loading = true
      this.error = null
      try {
        const { res, parsed } = await this._post('/user/send-reset-password', payload, { includeAuth: !!this.token })
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}: не удалось отправить письмо для сброса пароля`
          this.error = msg
          if (res.status === 401) this.logout()
          throw new Error(msg)
        }
        return parsed.data || parsed || null
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка при отправке письма для сброса пароля'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Вставьте в actions вашего существующего defineStore('user', ...)
    async updateProfile(payload = {}) {
      // payload: { fullname, email, phone, tg, city, username, password, ... }
      this.loading = true
      this.error = null
      try {
        // Формируем URL: /user/update-user (через ваш _buildUrl helper)
        const url = _buildUrl('/user/update-user')

        // Заголовки: JSON + Authorization если token есть
        const headers = { 'Content-Type': 'application/json' }
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`

        // Обязательно передаём uid (сервер требует)
        const body = Object.assign({}, payload, { uid: this.uid })

        const res = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body)
        })

        const parsed = await _parseJsonSafe(res)

        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}`
          this.error = msg
          if (res.status === 401) this.logout()
          throw new Error(msg)
        }

        const data = parsed.data || parsed || null
        if (data && typeof data === 'object') {
          // Обновляем стор: если бэк вернул token/uid — _syncFromUserObject это обработает
          if (typeof this._syncFromUserObject === 'function') {
            this._syncFromUserObject(data)
          } else {
            if (data.token) this.token = data.token
            if (data.uid || data.id) this.uid = data.uid || data.id
            this.isAuthenticated = !!(this.token && this.uid)
            this._saveAuthToStorage(this.token, this.uid)
          }
          this.user = data
          return data
        }

        return parsed
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка при обновлении профиля'
        throw err
      } finally {
        this.loading = false
      }
    },

    async resetPassword({ uid, token, newPassword } = {}) {
      this.loading = true
      this.error = null
      if (!uid || !token || !newPassword) {
        const msg = 'Обязательные поля отсутствуют: uid, token, newPassword'
        this.error = msg
        this.loading = false
        throw new Error(msg)
      }
      try {
        const { res, parsed } = await this._post('/user/reset-password', { uid, token, newPassword }, { includeAuth: !!this.token })
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}: не удалось сбросить пароль`
          this.error = msg
          if (res.status === 401) this.logout()
          throw new Error(msg)
        }

        const data = parsed.data || parsed || null

        // если сервер вернул обновлённый профиль / token — синхронизируем
        if (data && typeof data === 'object') {
          if (data.token || data.uid || data.id || data.user) {
            this._syncFromUserObject(data)
          }
          // если data выглядит как пользователь — положим
          if (data.username || data.email || data.user) {
            this.user = data
            this.isAuthenticated = !!(this.token && this.uid)
          }
          return data
        }

        return data || true
      } catch (err) {
        this.error = err.message || 'Неизвестная ошибка при сбросе пароля'
        throw err
      } finally {
        this.loading = false
      }
    }


  }
})
