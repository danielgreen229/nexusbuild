// stores/alert.js
import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alerts: []
  }),

  getters: {
    allAlerts: (state) => state.alerts
  },

  actions: {
    /**
     * Показывает алерт.
     * @param {Object} alert - { title, message, type, typeClass, background, color, autoClose, position }
     * @returns {string|number} id созданного алерта
     */
    showAlert(alert) {
      const id = Date.now() + Math.random();
      const alertWithId = { ...alert, id };

      // Добавляем алерт в state
      this.alerts.push(alertWithId);

      // Нативные таймауты только на клиенте (защита от SSR)
      if (process && process.client && alertWithId.autoClose?.enabled) {
        const delay = alertWithId.autoClose.delay ?? 3000;
        // Захватываем ссылку на стор в замыкании
        const self = this;
        const t = setTimeout(() => {
          // вызываем действие удаления через экземпляр стора
          try {
            self.removeAlert(id);
          } catch (e) {
            // на всякий случай — очистим таймаут если что-то пошло не так
            clearTimeout(t);
          }
        }, delay);

        // Храним id таймаута в объекте алерта (runtime-only)
        // Это не ломает реактивность — но учтите, что _timeout не сериализуем.
        alertWithId._timeout = t;
      }

      return id;
    },

    /**
     * Удаляет алерт по id.
     * Очищает таймаут если он был.
     */
    removeAlert(id) {
      const idx = this.alerts.findIndex(a => a.id === id);
      if (idx === -1) return;

      const a = this.alerts[idx];
      if (a && a._timeout) {
        clearTimeout(a._timeout);
      }

      this.alerts.splice(idx, 1);
    },

    removeAll() {
      // Очистим все таймауты и массив
      for (const a of this.alerts) {
        if (a && a._timeout) clearTimeout(a._timeout);
      }
      this.alerts = [];
    }
  }
});
