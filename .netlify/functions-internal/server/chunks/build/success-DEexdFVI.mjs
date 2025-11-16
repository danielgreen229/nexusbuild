import { _ as _export_sfc, d as useOrdersStore, a as __nuxt_component_0$1 } from './server.mjs';
import { ref, watch, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "success",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b;
    const route = useRoute();
    useRouter();
    const ordersStore = (() => {
      try {
        return useOrdersStore();
      } catch (e) {
        return null;
      }
    })();
    const queryOrderId = ref(String((_b = (_a = route.query.orderId) != null ? _a : route.params.orderId) != null ? _b : "") || "");
    watch(() => route.query.orderId, (v) => {
      queryOrderId.value = String(v != null ? v : "");
    });
    const loading = ref(false);
    const error = ref(null);
    const orderLocal = ref({});
    computed(() => !!(orderLocal.value && orderLocal.value.id));
    const orderIdDisplay = computed(() => {
      var _a2;
      return queryOrderId.value || ((_a2 = orderLocal.value.id) != null ? _a2 : "\u2014");
    });
    watch(queryOrderId, (v, ov) => {
      if (v !== ov) loadOrder();
    });
    async function loadOrder() {
      var _a3, _b2;
      var _a2;
      const id = queryOrderId.value;
      error.value = null;
      orderLocal.value = {};
      if (!id) return;
      loading.value = true;
      try {
        let o = null;
        if (ordersStore && Array.isArray(ordersStore.orders)) {
          o = ordersStore.orders.find((x) => {
            var _a4, _b3;
            return String((_b3 = (_a4 = x.id) != null ? _a4 : x.order_id) != null ? _b3 : x._id) === String(id);
          });
        }
        if (!o && ordersStore && typeof ordersStore.fetchOrder === "function") {
          const res = await ordersStore.fetchOrder(id);
          if ((res == null ? void 0 : res.success) && res.data) o = res.data;
          else if (res == null ? void 0 : res.order) o = res.order;
          else if (res && res.id) o = res;
        }
        if (!o && ordersStore && typeof ordersStore.fetchUserOrders === "function") {
          const pageRes = await ordersStore.fetchUserOrders({ page: 1, perPage: 10 });
          if ((pageRes == null ? void 0 : pageRes.success) && Array.isArray((_a2 = pageRes.data) == null ? void 0 : _a2.rows)) {
            o = pageRes.data.rows.find((r) => {
              var _a4, _b3;
              return String((_b3 = (_a4 = r.id) != null ? _a4 : r.order_id) != null ? _b3 : r._id) === String(id);
            });
          }
        }
        if (!o) {
          error.value = "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u0437\u0430\u043A\u0430\u0437 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435.";
          orderLocal.value = {};
          return;
        }
        orderLocal.value = mapOrderForView(o);
      } catch (err) {
        console.error("success page loadOrder error", err);
        error.value = (_b2 = (_a3 = err == null ? void 0 : err.message) != null ? _a3 : String(err)) != null ? _b2 : "\u0421\u0435\u0442\u0435\u0432\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430";
        orderLocal.value = {};
      } finally {
        loading.value = false;
      }
    }
    function mapOrderForView(o) {
      var _a3, _b3, _c, _d, _e, _f, _g, _h;
      var _a2, _b2;
      if (!o) return {};
      const id = (_c = (_b3 = (_a3 = o.id) != null ? _a3 : o.order_id) != null ? _b3 : o._id) != null ? _c : null;
      const statusRaw = (_e = (_d = o.status) != null ? _d : o.state) != null ? _e : "\u2014";
      const statusCode = String(statusRaw).toLowerCase().replace(/\s+/g, "_") || "unknown";
      return {
        id,
        date: formatDate(o),
        template: (_h = (_g = (_f = (_a2 = o.template) == null ? void 0 : _a2.title) != null ? _f : (_b2 = o.template) == null ? void 0 : _b2.name) != null ? _g : o.template_title) != null ? _h : typeof o.template === "string" ? o.template : "\u2014",
        status: statusRaw,
        statusCode,
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
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "success-page" }, _attrs))} data-v-7662d048><main class="success-card" role="main" aria-labelledby="success-title" data-v-7662d048><div class="icon-wrap" aria-hidden="true" data-v-7662d048><svg viewBox="0 0 24 24" class="check-icon" data-v-7662d048><path d="M20 6L9 17l-5-5" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-7662d048></path></svg></div><h1 id="success-title" class="title" data-v-7662d048>\u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043F\u043E\u043A\u0443\u043F\u043A\u0443!</h1><p class="subtitle" data-v-7662d048> \u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 <span class="accent" data-v-7662d048>${ssrInterpolate(orderIdDisplay.value)}</span> \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D. </p><div class="controls" data-v-7662d048>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn btn-link",
        to: "/profile?tab=orders"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B`);
          } else {
            return [
              createTextVNode("\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const success = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7662d048"]]);

export { success as default };
//# sourceMappingURL=success-DEexdFVI.mjs.map
