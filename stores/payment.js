// stores/payment.js
import { defineStore } from 'pinia'
import { API } from '~/config'
import { useUserStore } from '~/stores/user'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    loading: false,
    error: null
  }),

  actions: {
    /**
     * Создать платёж. Отправляет в body.user.uid — чтобы ваш сервер мог взять uid.
     * Возвращает { success, data, confirmationUrl, usedEndpoint, raw, error }
     */
    async createYooKassaPayment(orderId) {
      this.error = null
      if (!orderId) {
        this.error = 'orderId required'
        return { success: false, error: this.error }
      }
      this.loading = true

      try {
        const userStore = useUserStore()
        // Попытка найти uid в сторе: поля, которые обычно бывают
        const uid = userStore?.userId ?? userStore?.id ?? userStore?.uid ?? userStore?.profile?.id ?? null

        // целевой бэкенд (у тебя backend слушает на localhost:3000)
        const base = API.fullUrl.replace(/\/$/, '')
        const url = `${base}/payment/orders/${encodeURIComponent(orderId)}/payment/yookassa`

        const body = {
          // сервер ожидает body.user.uid — строго так формируем
          user: { uid: uid ? String(uid) : '' },
          // ты можешь положить сюда дополнительные поля если нужно
        }

        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        // если у тебя есть jwt token, можно дополнительно подставить Authorization:
        if (userStore?.token) headers['Authorization'] = `Bearer ${userStore.token}`

        const resp = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          // не ставим credentials автоматически — сервер по body авторизует
          // если позже захочешь использовать сессии, добавь credentials: 'include'
        })

        const text = await resp.text()
        let parsed = null
        try { parsed = text ? JSON.parse(text) : null } catch (e) { parsed = text }

        if (!resp.ok) {
          const msg = (parsed && (parsed.message || parsed.error || parsed.description)) || text || `HTTP ${resp.status}`
          this.error = msg
          return { success: false, status: resp.status, error: msg, raw: parsed }
        }

        const payload = parsed?.data ?? parsed ?? {}
        const confirmationUrl = payload.confirmationUrl || payload.confirmation_url || payload.confirmation?.confirmation_url || null

        return { success: true, data: payload, confirmationUrl, usedEndpoint: url, raw: parsed }
      } catch (err) {
        this.error = err?.message || String(err)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
