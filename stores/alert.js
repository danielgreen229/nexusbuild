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

      this.alerts.push(alertWithId);

      if (alertWithId.autoClose?.enabled) {
        const delay = alertWithId.autoClose.delay ?? 3000;
        const t = setTimeout(() => {
          try {
            this.removeAlert(id);
          } catch (e) {
            clearTimeout(t);
          }
        }, delay);

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
      if (a?._timeout) clearTimeout(a._timeout);

      this.alerts.splice(idx, 1);
    },

    removeAll() {
      for (const a of this.alerts) {
        if (a?._timeout) clearTimeout(a._timeout);
      }
      this.alerts = [];
    }
  }
});
