import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { u as useTemplateStore } from './template-B72Yob-U.mjs';
import { _ as _export_sfc, e as useUserStore, d as useOrdersStore, c as useAlertStore, L as LoginModal, A as API } from './server.mjs';
import { defineStore } from 'pinia';
import { D as DomainFinder } from './domain-finder-ChJnUISW.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'ipx';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';

const base = `${API.fullUrl}/promocode`;
const useCodesStore = defineStore("promocodes", {
  state: () => ({
    loading: false,
    error: null,
    // храним data от API прямо
    lastApplied: null,
    // data от /redeem
    preview: null
    // data от /by-code (или от preview endpoint)
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
      var _a;
      if (!json) return null;
      return (_a = json.data) != null ? _a : json;
    },
    /**
     * Получить промокод по коду (и вернуть data)
     * Возвращает { success: boolean, data|null, message? }
     */
    async getPromoByCode(code) {
      this.loading = true;
      this.error = null;
      try {
        if (!code) return { success: false, message: "code is required", data: null };
        const res = await fetch(`${base}/by-code/${encodeURIComponent(code)}`, {
          method: "GET",
          headers: { "Accept": "application/json" }
        });
        const json = await res.json().catch(() => null);
        const data = this._extractData(json);
        if (!res.ok) {
          const msg = data && (data.message || data.error) || `HTTP ${res.status}`;
          this.error = msg;
          return { success: false, message: data.data, data: null };
        }
        return { success: true, data };
      } catch (err) {
        console.error("getPromoByCode error", err);
        this.error = err.message || "Network error";
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
      const type = (promo.discount_type || "").toLowerCase();
      const value = Number(promo.discount_value || 0);
      let discount = 0;
      if (type === "percent") {
        discount = Number(orderAmount) * value / 100;
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
    async previewPromocode(code, orderAmount, currency = "RUB") {
      this.loading = true;
      this.error = null;
      this.preview = null;
      try {
        if (!code || typeof orderAmount === "undefined") {
          const msg = "code \u0438 orderAmount \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B";
          this.error = msg;
          return { success: false, message: msg, data: null };
        }
        const got = await this.getPromoByCode(code);
        if (!got.success) {
          return { success: false, message: got.message || "\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", data: null };
        }
        const data = got.data;
        if (Number(orderAmount) < Number(data.minimum_order_amount || 0)) {
          const msg = `\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u0437\u0430\u043A\u0430\u0437\u0430 ${data.minimum_order_amount || 0}`;
          this.preview = data;
          this.error = msg;
          return { success: false, message: msg, data };
        }
        const { discount, finalAmount } = this.calculateDiscountLocal(data, orderAmount);
        this.preview = { ...data, discount, finalAmount };
        return { success: true, data: this.preview, discount, finalAmount };
      } catch (err) {
        console.error("previewPromocode error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0435\u0432\u044C\u044E";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    },
    /**
     * Применить промокод (POST /redeem)
     * Возвращает { success, data, message }
     */
    async applyPromocode({ code, uid, orderAmount, currency = "USD", orderId = null }) {
      this.loading = true;
      this.error = null;
      try {
        if (!code || !uid || typeof orderAmount === "undefined") {
          const msg = "\u041E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u044F: code, uid, orderAmount";
          this.error = msg;
          return { success: false, message: msg, data: null };
        }
        const payload = { code, uid, orderAmount, currency, orderId };
        const res = await fetch(`${base}/redeem`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => null);
        const data = this._extractData(json);
        if (!res.ok) {
          const msg = data && (data.message || data.error) || `HTTP ${res.status}`;
          this.error = msg;
          return { success: false, message: msg, data: null };
        }
        const normalized = { ...data || {}, code: data && data.code ? data.code : code };
        this.lastApplied = normalized;
        return { success: true, data: normalized };
      } catch (err) {
        console.error("applyPromocode error", err);
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u0438\u0438 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u0430";
        return { success: false, message: this.error, data: null };
      } finally {
        this.loading = false;
      }
    }
  }
});
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const templateStore = useTemplateStore();
    const userStore = useUserStore();
    const codesStore = useCodesStore();
    useOrdersStore();
    useAlertStore();
    const isLoginModalOpen = ref(false);
    const startWithRegister = ref(false);
    route.params.id;
    function onLoginEvent(userData) {
      isLoginModalOpen.value = false;
    }
    const selectedDomain = ref(null);
    function onDomainSelected(domainOrItem) {
      var _a, _b, _c, _d, _e;
      if (!domainOrItem) return;
      if (typeof domainOrItem === "string") {
        selectedDomain.value = { fqdn: domainOrItem, price: 0, price_currency: "RUB", available: true };
      } else if (typeof domainOrItem === "object") {
        selectedDomain.value = {
          fqdn: domainOrItem.fqdn,
          price: (_a = domainOrItem.price) != null ? _a : 0,
          price_currency: (_c = domainOrItem.price_currency) != null ? _c : (_b = domainOrItem.priceCurrency) != null ? _b : "RUB",
          available: domainOrItem.available,
          id: (_e = (_d = domainOrItem.id) != null ? _d : domainOrItem.domainId) != null ? _e : null,
          raw: domainOrItem
        };
      }
    }
    const domainCost = computed(() => {
      var _a;
      return Number(((_a = selectedDomain.value) == null ? void 0 : _a.price) || 0);
    });
    const template = computed(() => templateStore.current || {
      id: null,
      title: "",
      price: 0,
      image: "",
      description: "",
      pages: [],
      preview: "",
      discount_percent: 0,
      discount_amount: 0
    });
    const basePrice = computed(() => Number(template.value.price || 0));
    const addons = ref({
      extraPage: { enabled: false, price: 1e3, count: 0 },
      customization: { enabled: false, pricePerHour: 500, hours: 0 },
      priority: { enabled: false, price: 3e3 },
      hosting: { enabled: false, price: 1e3 }
    });
    const buyer = ref({ name: "", contact: "" });
    const placing = ref(false);
    const applyingPromo = ref(false);
    const promoCodeTrimmed = computed(() => (promoCodeInput.value || "").trim());
    const extraPagesCost = computed(() => {
      const c = Number(addons.value.extraPage.count || 0);
      const price = Number(addons.value.extraPage.price || 0);
      return addons.value.extraPage.enabled && c > 0 ? c * price : 0;
    });
    const customizationCost = computed(() => {
      const h = Number(addons.value.customization.hours || 0);
      const rate = Number(addons.value.customization.pricePerHour || 0);
      return addons.value.customization.enabled && h > 0 ? h * rate : 0;
    });
    const priorityCost = computed(() => addons.value.priority.enabled ? Number(addons.value.priority.price || 0) : 0);
    const hostingCost = computed(() => addons.value.hosting.enabled ? Number(addons.value.hosting.price || 0) : 0);
    const subtotal = computed(() => {
      const parts = [basePrice.value, extraPagesCost.value, customizationCost.value, priorityCost.value, hostingCost.value, domainCost.value];
      return parts.reduce((acc, v) => acc + Number(v || 0), 0);
    });
    const templateDiscountAmount = computed(() => {
      const discAmount = Number(template.value.discount_amount || 0);
      const discPercent = Number(template.value.discount_percent || 0);
      if (discAmount > 0) return Math.min(discAmount, subtotal.value);
      if (discPercent > 0) return Math.min(Math.round(subtotal.value * discPercent / 100), subtotal.value);
      return 0;
    });
    const discountLabel = computed(() => {
      const discAmount = Number(template.value.discount_amount || 0);
      const discPercent = Number(template.value.discount_percent || 0);
      if (discAmount > 0) return `${formatCurrency(discAmount)}`;
      if (discPercent > 0) return `${discPercent}%`;
      return "";
    });
    const promoPreviewExists = computed(() => !!codesStore.preview);
    const promoPreviewDiscount = computed(() => {
      var _a;
      return Number(((_a = codesStore.preview) == null ? void 0 : _a.discount) || 0);
    });
    computed(() => {
      var _a2;
      var _a;
      return Number((_a2 = (_a = codesStore.preview) == null ? void 0 : _a.finalAmount) != null ? _a2 : subtotal.value);
    });
    const promoPreviewCode = computed(() => {
      var _a;
      return ((_a = codesStore.preview) == null ? void 0 : _a.code) || promoCodeInput.value;
    });
    const promoAppliedExists = computed(() => !!codesStore.lastApplied);
    const appliedPromoDiscount = computed(() => {
      var _a;
      return Number(((_a = codesStore.lastApplied) == null ? void 0 : _a.discount) || 0);
    });
    const appliedPromoCode = computed(() => {
      var _a;
      return ((_a = codesStore.lastApplied) == null ? void 0 : _a.code) || "";
    });
    const promoDiscountEffective = computed(() => {
      const applied = Number(appliedPromoDiscount.value || 0);
      const preview = Number(promoPreviewDiscount.value || 0);
      if (promoAppliedExists.value) {
        return Math.min(applied, subtotal.value);
      }
      if (promoPreviewExists.value) {
        return Math.min(preview, subtotal.value);
      }
      return 0;
    });
    const totalDiscount = computed(() => {
      const tpl = Number(templateDiscountAmount.value || 0);
      const promo = promoDiscountEffective.value || 0;
      return Math.min(tpl + promo, subtotal.value);
    });
    const finalTotal = computed(() => {
      const t = subtotal.value - totalDiscount.value;
      return t > 0 ? Math.round(t) : 0;
    });
    function formatCurrency(value) {
      try {
        const v = Number(value || 0);
        return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(Math.round(v));
      } catch (e) {
        return `${value} \u20BD`;
      }
    }
    const promoCodeInput = ref("");
    const promoError = ref(null);
    watch(promoCodeInput, () => {
      promoError.value = null;
    });
    watch(subtotal, () => {
      promoError.value = null;
    });
    const isAuthenticated = computed(() => !!userStore.isAuthenticated);
    const userName = computed(() => {
      const u = userStore.user || {};
      if (u.name) return u.name;
      const first = u.firstName || u.first_name || "";
      const last = u.lastName || u.last_name || "";
      const full = `${first} ${last}`.trim();
      return full || "";
    });
    const userContact = computed(() => {
      const u = userStore.user || {};
      return u.email || u.email_address || u.phone || "";
    });
    const userInfo = computed(() => userStore.user || {});
    const canPlaceOrder = computed(() => {
      return isAuthenticated.value && !!selectedDomain.value && !!selectedDomain.value.fqdn;
    });
    watch(isAuthenticated, (val) => {
      if (val) {
        if (userName.value) buyer.value.name = userName.value;
        if (userContact.value) buyer.value.contact = userContact.value;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "buy__container" }, _attrs))} data-v-c59628c8><div class="wrapper" data-v-c59628c8><section class="card card__container" data-v-c59628c8><div class="card__left" data-v-c59628c8><h1 class="title" data-v-c59628c8>\u0421\u0430\u0439\u0442 &quot;${ssrInterpolate(template.value.title)}&quot;</h1><h3 class="card__h3" data-v-c59628c8>\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043E\u043F\u0446\u0438\u0438</h3><div class="extras" data-v-c59628c8><label class="addon custom-switch" data-v-c59628c8><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.priority.enabled) ? ssrLooseContain(addons.value.priority.enabled, null) : addons.value.priority.enabled) ? " checked" : ""} data-v-c59628c8><span class="switch-track" aria-hidden data-v-c59628c8><span class="switch-thumb" data-v-c59628c8></span></span><span class="label-text" data-v-c59628c8>\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u043D\u0430\u044F \u0434\u043E\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u2014 ${ssrInterpolate(formatCurrency(addons.value.priority.price))}</span></label></div><h3 class="card__h3 domain__h3" data-v-c59628c8>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u043E\u043C\u0435\u043D</h3><div class="domain__container" data-v-c59628c8><div class="domain-scroll__container" data-v-c59628c8>`);
      _push(ssrRenderComponent(DomainFinder, { onSelectDomain: onDomainSelected }, null, _parent));
      _push(`</div></div></div></section><aside class="card sidebar" data-v-c59628c8><h2 data-v-c59628c8>\u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437</h2><div class="order-lines" data-v-c59628c8><div class="line" data-v-c59628c8><span data-v-c59628c8>\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u0446\u0435\u043D\u0430</span><span data-v-c59628c8>${ssrInterpolate(formatCurrency(basePrice.value))}</span></div>`);
      if (addons.value.priority.enabled) {
        _push(`<div class="line" data-v-c59628c8><span data-v-c59628c8>\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442</span><span data-v-c59628c8>${ssrInterpolate(formatCurrency(addons.value.priority.price))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.hosting.enabled) {
        _push(`<div class="line" data-v-c59628c8><span data-v-c59628c8>\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 / \u0445\u043E\u0441\u0442\u0438\u043D\u0433</span><span data-v-c59628c8>${ssrInterpolate(formatCurrency(addons.value.hosting.price))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (selectedDomain.value) {
        _push(`<div class="line" data-v-c59628c8><span data-v-c59628c8>\u0414\u043E\u043C\u0435\u043D (${ssrInterpolate(selectedDomain.value.fqdn)})</span><span data-v-c59628c8>${ssrInterpolate(formatCurrency(domainCost.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<hr data-v-c59628c8><div class="line" data-v-c59628c8><strong data-v-c59628c8>\u041F\u0440\u043E\u043C\u0435\u0436\u0443\u0442\u043E\u0447\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430</strong><strong data-v-c59628c8>${ssrInterpolate(formatCurrency(subtotal.value))}</strong></div><div class="line" style="${ssrRenderStyle({ "flex-direction": "column", "align-items": "stretch", "gap": "0.5rem", "padding-top": "0.5rem" })}" data-v-c59628c8><div style="${ssrRenderStyle({ "display": "flex", "gap": "0.5rem", "align-items": "center" })}" data-v-c59628c8><input${ssrRenderAttr("value", promoCodeInput.value)}${ssrIncludeBooleanAttr(unref(codesStore).loading || applyingPromo.value) ? " disabled" : ""} placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434" class="promocode__input" style="${ssrRenderStyle({ "flex": "1" })}" aria-label="\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434" data-v-c59628c8><button class="btn primary"${ssrIncludeBooleanAttr(unref(codesStore).loading || applyingPromo.value || !promoCodeTrimmed.value) ? " disabled" : ""} title="\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0438 \u043F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434" data-v-c59628c8>`);
      if (!applyingPromo.value) {
        _push(`<span data-v-c59628c8>${ssrInterpolate(unref(codesStore).loading ? "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430\u2026" : "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C")}</span>`);
      } else {
        _push(`<span data-v-c59628c8>\u041F\u0440\u0438\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F\u2026</span>`);
      }
      _push(`</button></div>`);
      if (promoError.value) {
        _push(`<div class="note" style="${ssrRenderStyle({ "color": "#b91c1c", "margin-top": "0.25rem" })}" data-v-c59628c8>${ssrInterpolate(promoError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (promoAppliedExists.value) {
        _push(`<div class="note" style="${ssrRenderStyle({ "color": "#064e3b", "margin-top": "0.25rem" })}" data-v-c59628c8> \u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434 \xAB${ssrInterpolate(appliedPromoCode.value)}\xBB \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0440\u0438\u043C\u0435\u043D\u0451\u043D \u2014 \u0441\u043A\u0438\u0434\u043A\u0430 ${ssrInterpolate(formatCurrency(appliedPromoDiscount.value))}. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (promoPreviewExists.value && !promoAppliedExists.value) {
        _push(`<div class="line discount" data-v-c59628c8><span data-v-c59628c8>\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434: ${ssrInterpolate(promoPreviewCode.value || promoCodeInput.value)}</span><span data-v-c59628c8>-${ssrInterpolate(formatCurrency(promoPreviewDiscount.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (promoAppliedExists.value) {
        _push(`<div class="line discount" data-v-c59628c8><span data-v-c59628c8>\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434: ${ssrInterpolate(appliedPromoCode.value)}</span><span data-v-c59628c8>-${ssrInterpolate(formatCurrency(appliedPromoDiscount.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (templateDiscountAmount.value > 0) {
        _push(`<div class="line discount" data-v-c59628c8><span data-v-c59628c8>\u0421\u043A\u0438\u0434\u043A\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0430 ${ssrInterpolate(discountLabel.value)}</span><span data-v-c59628c8>-${ssrInterpolate(formatCurrency(templateDiscountAmount.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (selectedDomain.value) {
        _push(`<div class="line" data-v-c59628c8><span data-v-c59628c8>\u0412\u044B\u0431\u0440\u0430\u043D \u0434\u043E\u043C\u0435\u043D</span><span style="${ssrRenderStyle({ "display": "flex", "gap": "0.5rem", "align-items": "center" })}" data-v-c59628c8><strong data-v-c59628c8>${ssrInterpolate(selectedDomain.value.fqdn)}</strong><button class="btn ghost" title="\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u044B\u0431\u043E\u0440 \u0434\u043E\u043C\u0435\u043D\u0430" data-v-c59628c8>\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C</button></span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="line total" data-v-c59628c8><strong data-v-c59628c8>\u0418\u0442\u043E\u0433\u043E</strong><strong data-v-c59628c8>${ssrInterpolate(formatCurrency(finalTotal.value))}</strong></div></div><div class="order-actions" data-v-c59628c8>`);
      if (isAuthenticated.value) {
        _push(`<!--[--><label class="input" data-v-c59628c8> \u0424\u0418\u041E: <div class="readonly-field" aria-live="polite" data-v-c59628c8>${ssrInterpolate(userInfo.value.fullname || "\u2014")}</div></label><label class="input" data-v-c59628c8> \u0422\u0435\u043B\u0435\u0444\u043E\u043D: <div class="readonly-field" aria-live="polite" data-v-c59628c8>${ssrInterpolate(userInfo.value.phone || "\u2014")}</div></label><label class="input" data-v-c59628c8> \u041F\u043E\u0447\u0442\u0430: <div class="readonly-field" aria-live="polite" data-v-c59628c8>${ssrInterpolate(userInfo.value.email || "\u2014")}</div></label><!--]-->`);
      } else {
        _push(`<div class="login-row" data-v-c59628c8> \u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E <button class="btn-link" data-v-c59628c8>\u0412\u043E\u0439\u0442\u0438</button> \u0438\u043B\u0438 <button class="btn-link" data-v-c59628c8>\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F</button></div>`);
      }
      _push(`<button class="btn primary"${ssrIncludeBooleanAttr(placing.value || !canPlaceOrder.value) ? " disabled" : ""} data-v-c59628c8>${ssrInterpolate(placing.value ? "\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435\u2026" : "\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437")}</button><div class="note" aria-live="polite" data-v-c59628c8><small data-v-c59628c8> \u041D\u0430\u0436\u0438\u043C\u0430\u044F \xAB\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437\xBB, \u0432\u044B \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u0435\u0442\u0435\u0441\u044C \u0441 <a data-v-c59628c8>\u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438 \u043E\u0444\u0435\u0440\u0442\u044B</a> \u0438 <a data-v-c59628c8>\u043F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438</a>. </small></div></div></aside></div>`);
      _push(ssrRenderComponent(LoginModal, {
        visible: isLoginModalOpen.value,
        "onUpdate:visible": ($event) => isLoginModalOpen.value = $event,
        onLogin: onLoginEvent,
        startWithRegister: startWithRegister.value
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/buy-template/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c59628c8"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-DZtv1EOn.mjs.map
