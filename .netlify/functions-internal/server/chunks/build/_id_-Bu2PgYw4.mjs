import { _ as _export_sfc, d as useOrdersStore, a as __nuxt_component_0$1 } from './server.mjs';
import { ref, watch, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
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
import 'pinia';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b;
    const route = useRoute();
    useRouter();
    const ordersStore = useOrdersStore();
    const idParam = ref((_b = (_a = route.params.id) != null ? _a : route.params.orderId) != null ? _b : null);
    const loading = ref(false);
    const error = ref(null);
    const orderLocal = ref({});
    watch(() => route.params.id, (v) => {
      idParam.value = v;
    });
    watch(idParam, async (v, oldV) => {
      if (v !== oldV) await loadOrder();
    });
    function getStatusTitle(status) {
      if (status == "pending_payment") return "\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B";
      else if (status == "pending_yookassa_payment") return "\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B";
      else if (status == "in_progress") return "\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435";
      else if (status == "completed") return "\u041E\u043F\u043B\u0430\u0447\u0435\u043D";
      else if (status == "cancelled") return "\u041E\u0442\u043C\u0435\u043D\u0435\u043D";
      else return status;
    }
    async function loadOrder() {
      var _a3;
      var _a2;
      const id = idParam.value;
      if (!id) {
        error.value = "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D ID \u0437\u0430\u043A\u0430\u0437\u0430";
        orderLocal.value = {};
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        let o = null;
        if (Array.isArray(ordersStore.orders)) {
          o = ordersStore.orders.find((x) => {
            var _a4, _b2;
            return String((_b2 = (_a4 = x.id) != null ? _a4 : x.order_id) != null ? _b2 : x._id) === String(id);
          });
        }
        if (!o && typeof ordersStore.fetchOrder === "function") {
          const res = await ordersStore.fetchOrder(id);
          if (res && res.success && res.data) o = res.data;
          else if (res && res.order) o = res.order;
          else if (res && res.data === void 0 && res.success) o = res;
        }
        if (!o) {
          if (typeof ordersStore.fetchUserOrders === "function") {
            const pageRes = await ordersStore.fetchUserOrders({ page: 1, perPage: 1 });
            if (pageRes && pageRes.success && Array.isArray((_a2 = pageRes.data) == null ? void 0 : _a2.rows) && pageRes.data.rows.length > 0) {
              o = pageRes.data.rows.find((r) => {
                var _a4, _b2;
                return String((_b2 = (_a4 = r.id) != null ? _a4 : r.order_id) != null ? _b2 : r._id) === String(id);
              });
            }
          }
        }
        if (!o) {
          error.value = "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u0437\u0430\u043A\u0430\u0437";
          orderLocal.value = {};
          return;
        }
        orderLocal.value = mapOrderForView(o);
      } catch (err) {
        console.error("OrderDetailsPage loadOrder error", err);
        error.value = (_a3 = err == null ? void 0 : err.message) != null ? _a3 : "\u0421\u0435\u0442\u0435\u0432\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430";
        orderLocal.value = {};
      } finally {
        loading.value = false;
      }
    }
    function mapOrderForView(o) {
      var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      var _a2, _b2;
      if (!o) return {};
      return {
        id: (_c = (_b3 = (_a3 = o.id) != null ? _a3 : o.order_id) != null ? _b3 : o._id) != null ? _c : null,
        date: formatDate(o),
        template: (_h = (_g = (_f = (_e = (_d = (_a2 = o.template) == null ? void 0 : _a2.title) != null ? _d : (_b2 = o.template) == null ? void 0 : _b2.name) != null ? _e : o.template_title) != null ? _f : o.templateName) != null ? _g : typeof o.template === "string" ? o.template : null) != null ? _h : "\u2014",
        status: (_j = (_i = o.status) != null ? _i : o.state) != null ? _j : "\u2014",
        statusCode: String((_l = (_k = o.status) != null ? _k : o.state) != null ? _l : "").toLowerCase().replace(/\s+/g, "_") || "unknown",
        price: formatPrice(o),
        preview: getTemplatePreview(o),
        raw: o
      };
    }
    function getTemplatePreview(o) {
      var _a2, _b2, _c, _d, _e, _f, _g, _h;
      if (!o) return null;
      const candidates = [
        o.preview,
        (_a2 = o.template) == null ? void 0 : _a2.image,
        (_b2 = o.template) == null ? void 0 : _b2.preview,
        o.template_image,
        o.template_preview,
        o.image,
        (_d = (_c = o.raw) == null ? void 0 : _c.template) == null ? void 0 : _d.image,
        (_f = (_e = o.raw) == null ? void 0 : _e.template) == null ? void 0 : _f.preview,
        (_g = o.raw) == null ? void 0 : _g.template_image,
        (_h = o.raw) == null ? void 0 : _h.preview
      ];
      for (const c of candidates) if (c && typeof c === "string" && c.trim() !== "") return c;
      return null;
    }
    function formatPrice(o) {
      var _a2, _b2, _c, _d;
      const priceVal = (_b2 = (_a2 = o.price) != null ? _a2 : o.amount) != null ? _b2 : o.total;
      const currency = (_d = (_c = o.currency) != null ? _c : o.currency_code) != null ? _d : "RUB";
      if (typeof priceVal === "number" && !Number.isNaN(priceVal)) {
        try {
          return new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(priceVal);
        } catch (e) {
          return String(priceVal);
        }
      }
      return priceVal != null ? priceVal : "\u2014";
    }
    function formatDate(raw) {
      var _a2, _b2, _c, _d, _e;
      if (!raw) return "";
      const val = (_e = (_d = (_c = (_b2 = (_a2 = raw.created_at) != null ? _a2 : raw.createdAt) != null ? _b2 : raw.date) != null ? _c : raw.order_date) != null ? _d : raw.created) != null ? _e : raw;
      let d;
      if (val instanceof Date) d = val;
      else if (typeof val === "number") {
        const ms = val < 1e12 ? val < 1e10 ? val * 1e3 : val : val;
        d = new Date(ms);
      } else d = new Date(String(val));
      if (Number.isNaN(d.getTime())) return String(val != null ? val : "");
      return d.toLocaleString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }
    computed(() => {
      var _a3, _b3;
      var _a2, _b2;
      try {
        return JSON.stringify((_a3 = (_a2 = orderLocal.value) == null ? void 0 : _a2.raw) != null ? _a3 : {}, null, 2);
      } catch (e) {
        return String((_b3 = (_b2 = orderLocal.value) == null ? void 0 : _b2.raw) != null ? _b3 : "");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c, _d;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "od-page" }, _attrs))} data-v-72d170a4><div class="od-container" data-v-72d170a4>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/profile?tab=orders",
        class: "od-back"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 \u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B`);
          } else {
            return [
              createTextVNode("\u2190 \u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (loading.value) {
        _push(`<div class="od-loading" data-v-72d170a4>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0437\u0430\u043A\u0430\u0437\u0430...</div>`);
      } else if (error.value) {
        _push(`<div class="od-error" data-v-72d170a4> \u041E\u0448\u0438\u0431\u043A\u0430: ${ssrInterpolate(error.value)} <div style="${ssrRenderStyle({ "margin-top": "1rem" })}" data-v-72d170a4><button class="od-btn" data-v-72d170a4>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button></div></div>`);
      } else if (!orderLocal.value || !orderLocal.value.id) {
        _push(`<div class="od-empty" data-v-72d170a4>\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D</div>`);
      } else {
        _push(`<div class="od-card" data-v-72d170a4><div class="od-top" data-v-72d170a4>`);
        if (orderLocal.value.raw.template.preview) {
          _push(`<img${ssrRenderAttr("src", orderLocal.value.raw.template.preview)} class="od-thumb" alt="\u041F\u0440\u0435\u0432\u044C\u044E \u0448\u0430\u0431\u043B\u043E\u043D\u0430" data-v-72d170a4>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="od-info" data-v-72d170a4><h1 class="od-title" data-v-72d170a4>${ssrInterpolate((_a2 = orderLocal.value.raw.domain.fqdn) != null ? _a2 : "\u2014")}</h1><div class="od-meta" data-v-72d170a4>\u0414\u0430\u0442\u0430: ${ssrInterpolate(formatDate(orderLocal.value.raw))}</div><div class="${ssrRenderClass([[
          "profile-orders__status",
          `profile-orders__status--${orderLocal.value.statusCode}`
        ], "od-meta"])}" data-v-72d170a4>\u0421\u0442\u0430\u0442\u0443\u0441: ${ssrInterpolate(getStatusTitle(orderLocal.value.status))}</div><div class="od-price" data-v-72d170a4>${ssrInterpolate(orderLocal.value.price)}</div></div></div><section class="od-section" data-v-72d170a4><h2 class="od-section-title" data-v-72d170a4>\u0414\u0435\u0442\u0430\u043B\u0438 \u0437\u0430\u043A\u0430\u0437\u0430</h2><div class="od-grid" data-v-72d170a4><div class="od-grid-item" data-v-72d170a4><strong data-v-72d170a4>ID</strong><div data-v-72d170a4>${ssrInterpolate((_b2 = orderLocal.value.id) != null ? _b2 : "\u2014")}</div></div><div class="od-grid-item" data-v-72d170a4><strong data-v-72d170a4>\u0428\u0430\u0431\u043B\u043E\u043D</strong><div data-v-72d170a4>${ssrInterpolate((_c = orderLocal.value.template) != null ? _c : "\u2014")}</div></div><div class="od-grid-item" data-v-72d170a4><strong data-v-72d170a4>\u0414\u043E\u043C\u0435\u043D</strong><div data-v-72d170a4>${ssrInterpolate((_d = orderLocal.value.raw.domain.fqdn) != null ? _d : "\u2014")}</div></div><div class="od-grid-item" data-v-72d170a4><strong data-v-72d170a4>\u0421\u0443\u043C\u043C\u0430</strong><div data-v-72d170a4>${ssrInterpolate(orderLocal.value.price)}</div></div></div></section><div class="od-actions" data-v-72d170a4></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/orders/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-72d170a4"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-Bu2PgYw4.mjs.map
