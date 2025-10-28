// stores/promocodes.js
import { defineStore } from 'pinia'
import { API } from '@/config/index.js'

const base = `${API.fullUrl}/promocode`

export const useCodesStore = defineStore('promocodes', {
  state: () => ({
    loading: false,
    error: null,
    // храним data от API прямо
    lastApplied: null, // data от /redeem
    preview: null,     // data от /by-code (или от preview endpoint)
  }),
  actions: {
    
    clearError() {
      this.error = null;
    },

    reset() {
      this.loading = false;
      this.error = null;
      this.lastApplied = null;
      this.preview = null;
    },

    // Вспомогательный парсер ответа: берем json.data если есть, иначе весь json
    _extractData(json) {
      if (!json) return null;
      return json.data ?? json;
    },

    /**
     * Получить промокод по коду (и вернуть data)
     * Возвращает { success: boolean, data|null, message? }
     */
    async getPromoByCode(code) {
      this.loading = true;
      this.error = null;
      try {
        if (!code) return { success: false, message: 'code is required', data: null };
        const res = await fetch(`${base}/by-code/${encodeURIComponent(code)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        const json = await res.json().catch(() => null);
        const data = this._extractData(json);

        if (!res.ok) {
          const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
          this.error = msg;
          return { success: false, message: data.data, data: null };
        }

        return { success: true, data };
      } catch (err) {
        console.error('getPromoByCode error', err);
        this.error = err.message || 'Network error';
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Локальный расчёт скидки (тот же алгоритм, что и на бэке)
     */
    calculateDiscountLocal(promo, orderAmount) {
      if (!promo) return { discount: 0, finalAmount: Number(orderAmount) };
      const type = (promo.discount_type || '').toLowerCase();
      const value = Number(promo.discount_value || 0);
      let discount = 0;
      if (type === 'percent') {
        discount = (Number(orderAmount) * value) / 100;
      } else {
        discount = value;
      }
      if (discount > Number(orderAmount)) discount = Number(orderAmount);
      discount = Math.round(discount * 100) / 100;
      const finalAmount = Math.round((Number(orderAmount) - discount) * 100) / 100;
      return { discount, finalAmount };
    },

    /**
     * Preview: получить data и посчитать возможную скидку без записи.
     * Возвращает { success, data, discount, finalAmount, message }
     */
    async previewPromocode(code, orderAmount, currency = 'RUB') {
      this.loading = true;
      this.error = null;
      this.preview = null;
      try {
        if (!code || typeof orderAmount === 'undefined') {
          const msg = 'code и orderAmount обязательны';
          this.error = msg;
          return { success: false, message: msg, data: null };
        }

        const got = await this.getPromoByCode(code);
        if (!got.success) {
          return { success: false, message: got.message || 'Промокод не найден', data: null };
        }

        const data = got.data;

        if (Number(orderAmount) < Number(data.minimum_order_amount || 0)) {
          const msg = `Минимальная сумма заказа ${data.minimum_order_amount || 0}`;
          this.preview = data;
          this.error = msg;
          return { success: false, message: msg, data };
        }

        const { discount, finalAmount } = this.calculateDiscountLocal(data, orderAmount);

        // Сохраняем preview как data + клиентские расчёты
        this.preview = { ...data, discount, finalAmount };

        return { success: true, data: this.preview, discount, finalAmount };
      } catch (err) {
        console.error('previewPromocode error', err);
        this.error = err.message || 'Ошибка превью';
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Применить промокод (POST /redeem)
     * Возвращает { success, data, message }
     */
    async applyPromocode({ code, uid, orderAmount, currency = 'USD', orderId = null }) {
      this.loading = true;
      this.error = null;
      try {
        if (!code || !uid || typeof orderAmount === 'undefined') {
          const msg = 'Обязательные поля: code, uid, orderAmount';
          this.error = msg;
          return { success: false, message: msg, data: null };
        }

        const payload = { code, uid, orderAmount, currency, orderId };

        const res = await fetch(`${base}/redeem`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => null);
        const data = this._extractData(json);

        if (!res.ok) {
          const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
          this.error = msg;
          return { success: false, message: msg, data: null };
        }

        // Сохраняем data как lastApplied. Если сервер не вернул сам code, добавим его.
        const normalized = { ...(data || {}), code: (data && data.code) ? data.code : code };
        this.lastApplied = normalized;

        return { success: true, data: normalized };
      } catch (err) {
        console.error('applyPromocode error', err);
        this.error = err.message || 'Ошибка при применении промокода';
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    }
  }
})
