import { defineStore } from 'pinia';
import { A as API, c as useUserStore } from './server.mjs';

const base = `${API.fullUrl}/order`;
function safeParseInt(v, fallback = null) {
  const n = Number(v);
  return Number.isInteger(n) ? n : fallback;
}
function normalizeOrderUpdate(body = {}) {
  const map = {
    paymentMethod: "payment_method",
    payment_method: "payment_method",
    netlifyUrl: "netlify_url",
    netlify_url: "netlify_url",
    adminUrl: "admin_url",
    admin_url: "admin_url",
    completedAt: "completed_at",
    completed_at: "completed_at",
    price: "price",
    status: "status",
    orderExternalUid: "order_externals_uid",
    order_externals_uid: "order_externals_uid"
  };
  const out = {};
  Object.keys(body).forEach((k) => {
    if (map[k]) out[map[k]] = body[k];
  });
  return out;
}
const useOrdersStore = defineStore("orders", {
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
    lastCreated: null
  }),
  actions: {
    clearError() {
      this.error = null;
    },
    reset() {
      this.loading = false;
      this.error = null;
      this.orders = [];
      this.page = 1;
      this.perPage = 20;
      this.totalCount = 0;
      this.currentOrder = null;
      this.adminOrders = [];
      this.adminStats = null;
      this.lastCreated = null;
    },
    _extractData(json) {
      var _a;
      if (!json) return null;
      return (_a = json.data) != null ? _a : json;
    },
    /**
     * _doFetch: всегда добавляет поле user:
     * - для GET: добавляет query param `user=<encoded JSON>`
     * - для non-GET: добавляет в тело поле `user` (если FormData — добавляет как JSON строку)
     *
     * Не использует credentials (credentials: 'omit'), но при наличии токена ставит Authorization.
     */
    async _doFetch(url, opts = {}) {
      this.loading = true;
      this.error = null;
      try {
        const userStore = useUserStore();
        const user = userStore && userStore.user ? userStore.user : false ? JSON.parse(localStorage.getItem("user") || "null") : null;
        const token = userStore && userStore.token ? userStore.token : false ? localStorage.getItem("token") : null;
        const method = (opts.method || "GET").toUpperCase();
        const headers = Object.assign({}, opts.headers || {});
        const fetchOpts = Object.assign({}, opts, { method, headers, credentials: "omit" });
        let finalUrl = url;
        if (method === "GET" && user) {
          const userParam = encodeURIComponent(JSON.stringify(user));
          finalUrl += (finalUrl.includes("?") ? "&" : "?") + `user=${userParam}`;
        }
        if (method !== "GET") {
          let body = fetchOpts.body;
          if (body instanceof FormData) {
            if (user) body.append("user", JSON.stringify(user));
            delete fetchOpts.headers["Content-Type"];
            fetchOpts.body = body;
          } else {
            let parsed = null;
            if (typeof body === "string" && body.length > 0) {
              try {
                parsed = JSON.parse(body);
              } catch (e) {
                parsed = null;
              }
            } else if (typeof body === "object" && body !== null) {
              parsed = body;
            } else {
              parsed = {};
            }
            if (user) parsed.user = user;
            fetchOpts.headers["Content-Type"] = fetchOpts.headers["Content-Type"] || "application/json";
            fetchOpts.body = JSON.stringify(parsed);
          }
        }
        if (token && !fetchOpts.headers.Authorization) {
          fetchOpts.headers.Authorization = `Bearer ${token}`;
        }
        if (!fetchOpts.headers.Accept) fetchOpts.headers.Accept = "application/json";
        const res = await fetch(finalUrl, fetchOpts);
        const text = await res.text().catch(() => null);
        let json = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (e) {
          json = null;
        }
        const data = this._extractData(json);
        if (!res.ok) {
          const msg = data && (data.message || data.error) || `HTTP ${res.status}`;
          this.error = msg;
          return { success: false, status: res.status, data: null, message: msg, raw: json != null ? json : text };
        }
        return { success: true, status: res.status, data, raw: json != null ? json : text };
      } catch (err) {
        console.error("_doFetch error", err);
        this.error = err.message || "Network error";
        return { success: false, data: null, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    /* ---------------- API methods ---------------- */
    async fetchUserOrders(options = {}) {
      var _a, _b, _c, _d, _e, _f, _g;
      this.loading = true;
      this.error = null;
      try {
        const page = safeParseInt(options.page, 1) || 1;
        const perPage = safeParseInt(options.perPage, 20) || 20;
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("perPage", String(perPage));
        if (options.status) params.set("status", options.status);
        if (options.joinExternal) params.set("joinExternal", "1");
        console.log(params, "paramsZXC");
        const got = await this._doFetch(`${base}?${params.toString()}`, { method: "GET" });
        if (!got.success)
          return {
            success: false,
            message: got.data || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u043E\u0432",
            data: null
          };
        const payload = (_a = got.data) != null ? _a : got.raw;
        const rows = (_c = (_b = payload.rows) != null ? _b : payload.orders) != null ? _c : [];
        const respPage = (_d = payload.page) != null ? _d : page;
        const respPerPage = (_e = payload.perPage) != null ? _e : perPage;
        const respTotal = (_g = (_f = payload.totalCount) != null ? _f : payload.total) != null ? _g : 0;
        this.orders = rows;
        this.page = respPage;
        this.perPage = respPerPage;
        this.totalCount = respTotal;
        return { success: true, data: { rows, page: respPage, perPage: respPerPage, totalCount: respTotal } };
      } catch (err) {
        console.error("fetchUserOrders error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async fetchOrderById(orderId, options = {}) {
      if (!orderId) return { success: false, message: "orderId required", data: null };
      this.loading = true;
      this.error = null;
      try {
        const params = new URLSearchParams();
        if (options.joinExternal) params.set("joinExternal", "1");
        const q = params.toString() ? `?${params.toString()}` : "";
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}${q}`, { method: "GET" });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u0430", data: null };
        this.currentOrder = got.data;
        return { success: true, data: got.data };
      } catch (err) {
        console.error("fetchOrderById error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async createOrder(payload = {}) {
      var _a, _b, _c, _d;
      this.loading = true;
      this.error = null;
      try {
        if (!payload.templateId || isNaN(Number(payload.templateId))) {
          const msg = "templateId required";
          this.error = msg;
          return { success: false, message: msg, data: null };
        }
        if (typeof payload.price === "undefined" || isNaN(Number(payload.price))) {
          const msg = "price required";
          this.error = msg;
          return { success: false, message: msg, data: null };
        }
        const body = {
          templateId: Number(payload.templateId),
          price: Number(payload.price),
          payment_method: (_b = (_a = payload.paymentMethod) != null ? _a : payload.payment_method) != null ? _b : "balance",
          status: (_c = payload.status) != null ? _c : "pending_payment"
        };
        if (payload.external && typeof payload.external === "object") body.external = payload.external;
        else if (payload.order_externals_uid || payload.orderExternalUid) body.order_externals_uid = (_d = payload.order_externals_uid) != null ? _d : payload.orderExternalUid;
        const got = await this._doFetch(base, { method: "POST", body: JSON.stringify(body) });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F", data: null };
        const data = got.data;
        this.lastCreated = data;
        if (data) this.orders = [data, ...this.orders];
        return { success: true, data };
      } catch (err) {
        console.error("createOrder error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async updateOrder(orderId, body = {}) {
      if (!orderId) return { success: false, message: "orderId required", data: null };
      const update = normalizeOrderUpdate(body);
      if (Object.keys(update).length === 0) return { success: false, message: "No fields to update", data: null };
      this.loading = true;
      this.error = null;
      try {
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}`, { method: "PUT", body: JSON.stringify(update) });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F", data: null };
        const data = got.data;
        if (this.currentOrder && this.currentOrder.id === data.id) this.currentOrder = data;
        this.orders = this.orders.map((r) => r.id === data.id ? data : r);
        this.adminOrders = this.adminOrders.map((r) => r.id === data.id ? data : r);
        return { success: true, data };
      } catch (err) {
        console.error("updateOrder error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async updateOrderStatus(orderId, { status, completedAt = null } = {}) {
      if (!orderId) return { success: false, message: "orderId required", data: null };
      if (!status) return { success: false, message: "status required", data: null };
      this.loading = true;
      this.error = null;
      try {
        const payload = { status };
        if (completedAt) payload.completedAt = completedAt;
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}/status`, { method: "PATCH", body: JSON.stringify(payload) });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0441\u0442\u0430\u0442\u0443\u0441\u0430", data: null };
        const data = got.data;
        if (this.currentOrder && this.currentOrder.id === data.id) this.currentOrder = data;
        this.orders = this.orders.map((r) => r.id === data.id ? data : r);
        this.adminOrders = this.adminOrders.map((r) => r.id === data.id ? data : r);
        return { success: true, data };
      } catch (err) {
        console.error("updateOrderStatus error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async deleteOrder(orderId) {
      var _a;
      if (!orderId) return { success: false, message: "orderId required", data: null };
      this.loading = true;
      this.error = null;
      try {
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}`, { method: "DELETE" });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F", data: null };
        this.orders = this.orders.filter((r) => r.id !== orderId);
        this.adminOrders = this.adminOrders.filter((r) => r.id !== orderId);
        if (this.currentOrder && this.currentOrder.id === orderId) this.currentOrder = null;
        return { success: true, data: (_a = got.data) != null ? _a : got.raw };
      } catch (err) {
        console.error("deleteOrder error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async fetchAdminAll(options = {}) {
      var _a, _b, _c, _d;
      this.loading = true;
      this.error = null;
      try {
        const params = new URLSearchParams();
        if (options.status) params.set("status", options.status);
        if (options.userId) params.set("userId", options.userId);
        if (options.userUid) params.set("userUid", options.userUid);
        if (options.templateId) params.set("templateId", options.templateId);
        if (options.dateFrom) params.set("dateFrom", options.dateFrom);
        if (options.dateTo) params.set("dateTo", options.dateTo);
        if (typeof options.limit !== "undefined") params.set("limit", String(options.limit));
        if (options.joinExternal) params.set("joinExternal", "1");
        const url = `${base}/admin/all?${params.toString()}`;
        const got = await this._doFetch(url, { method: "GET" });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0430\u0434\u043C\u0438\u043D-\u0441\u043F\u0438\u0441\u043A\u0430", data: null };
        const payload = (_a = got.data) != null ? _a : got.raw;
        this.adminOrders = (_c = (_b = payload.orders) != null ? _b : payload.rows) != null ? _c : [];
        this.totalCount = (_d = payload.totalCount) != null ? _d : this.totalCount;
        return { success: true, data: { orders: this.adminOrders, totalCount: this.totalCount } };
      } catch (err) {
        console.error("fetchAdminAll error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async fetchAdminStats() {
      var _a, _b, _c;
      this.loading = true;
      this.error = null;
      try {
        const got = await this._doFetch(`${base}/admin/stats`, { method: "GET" });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438", data: null };
        const payload = (_a = got.data) != null ? _a : got.raw;
        this.adminStats = (_b = payload.stats) != null ? _b : payload;
        this.totalCount = (_c = payload.totalCount) != null ? _c : this.totalCount;
        return { success: true, data: { totalCount: this.totalCount, stats: this.adminStats } };
      } catch (err) {
        console.error("fetchAdminStats error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async linkOrderToExternal(orderId, externalUid) {
      if (!orderId) return { success: false, message: "orderId required", data: null };
      if (!externalUid) return { success: false, message: "externalUid required", data: null };
      this.loading = true;
      this.error = null;
      try {
        const got = await this._doFetch(`${base}/${encodeURIComponent(orderId)}/link-external`, {
          method: "POST",
          body: JSON.stringify({ externalUid })
        });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438", data: null };
        const data = got.data;
        if (this.currentOrder && this.currentOrder.id === data.id) this.currentOrder = data;
        this.orders = this.orders.map((r) => r.id === data.id ? data : r);
        this.adminOrders = this.adminOrders.map((r) => r.id === data.id ? data : r);
        return { success: true, data };
      } catch (err) {
        console.error("linkOrderToExternal error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async fetchAdminExternal(uid) {
      if (!uid) return { success: false, message: "uid required", data: null };
      this.loading = true;
      this.error = null;
      try {
        const got = await this._doFetch(`${base}/admin/external/${encodeURIComponent(uid)}`, { method: "GET" });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F external", data: null };
        return { success: true, data: got.data };
      } catch (err) {
        console.error("fetchAdminExternal error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async createAdminExternal(payload = {}) {
      this.loading = true;
      this.error = null;
      try {
        const body = { ...payload };
        const got = await this._doFetch(`${base}/admin/external`, { method: "POST", body: JSON.stringify(body) });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F external", data: null };
        return { success: true, data: got.data };
      } catch (err) {
        console.error("createAdminExternal error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async updateAdminExternal(uid, payload = {}) {
      if (!uid) return { success: false, message: "uid required", data: null };
      this.loading = true;
      this.error = null;
      try {
        const body = { ...payload };
        const got = await this._doFetch(`${base}/admin/external/${encodeURIComponent(uid)}`, { method: "PUT", body: JSON.stringify(body) });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F external", data: null };
        return { success: true, data: got.data };
      } catch (err) {
        console.error("updateAdminExternal error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    async deleteAdminExternal(uid) {
      var _a;
      if (!uid) return { success: false, message: "uid required", data: null };
      this.loading = true;
      this.error = null;
      try {
        const got = await this._doFetch(`${base}/admin/external/${encodeURIComponent(uid)}`, { method: "DELETE" });
        if (!got.success) return { success: false, message: got.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F external", data: null };
        return { success: true, data: (_a = got.data) != null ? _a : got.raw };
      } catch (err) {
        console.error("deleteAdminExternal error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    }
  }
});

export { useOrdersStore as u };
//# sourceMappingURL=order-Bw7cn7lw.mjs.map
