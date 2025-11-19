import { b as buildAssetsURL } from '../nitro/nitro.mjs';
import { _ as _export_sfc, d as useOrdersStore, a as __nuxt_component_0$1 } from './server.mjs';
import { ref, watch, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import vector from './vector-right-DRGQ20Mc.mjs';
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

const _sfc_main$4 = {
  __name: "payments",
  __ssrInlineRender: true,
  props: {
    duration: { type: Number, default: 1100 },
    autoplay: { type: Boolean, default: true },
    loop: { type: Boolean, default: true },
    pingpong: { type: Boolean, default: true },
    delay: { type: Number, default: 0 }
  },
  setup(__props) {
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "aria-hidden": true,
        class: "payment-animated",
        ref: "root"
      }, _attrs))} data-v-84362868><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512" preserveAspectRatio="xMidYMid meet" style="${ssrRenderStyle({ "width": "100%", "height": "100%", "background": "transparent", "display": "block" })}" data-v-84362868><defs data-v-84362868><clipPath id="__lottie_element_22" data-v-84362868><rect width="512" height="512" x="0" y="0" data-v-84362868></rect></clipPath></defs><g clip-path="url(#__lottie_element_22)" data-v-84362868><g id="g_main_left" transform="matrix(1,0,0,1,54.76202392578125,164.43899536132812)" opacity="1" style="${ssrRenderStyle({ "display": "block" })}" data-v-84362868><g opacity="1" transform="matrix(1,0,0,1,220.85400390625,129.1739959716797)" data-v-84362868><path fill="rgb(81,18,215)" fill-opacity="1" d=" M177.03900146484375,128.9250030517578 C177.03900146484375,128.9250030517578 -177.03799438476562,128.9250030517578 -177.03799438476562,128.9250030517578 C-201.0989990234375,128.9250030517578 -220.60400390625,109.41999816894531 -220.60400390625,85.36000061035156 C-220.60400390625,85.36000061035156 -220.60400390625,-85.35900115966797 -220.60400390625,-85.35900115966797 C-220.60400390625,-109.41899871826172 -201.0989990234375,-128.9239959716797 -177.03799438476562,-128.9239959716797 C-177.03799438476562,-128.9239959716797 177.03900146484375,-128.9239959716797 177.03900146484375,-128.9239959716797 C201.10000610351562,-128.9239959716797 220.60499572753906,-109.41899871826172 220.60499572753906,-85.35900115966797 C220.60499572753906,-85.35900115966797 220.60400390625,85.36000061035156 220.60400390625,85.36000061035156 C220.60400390625,109.41999816894531 201.10000610351562,128.9250030517578 177.03900146484375,128.9250030517578z" data-v-84362868></path></g></g><g id="g_inner_white" transform="matrix(1,0,0,1,86.09302520751953,190.80599975585938)" opacity="1" style="${ssrRenderStyle({ "display": "block" })}" data-v-84362868><g opacity="1" transform="matrix(1,0,0,1,61.165000915527344,25.02899932861328)" data-v-84362868><path fill="rgb(255,255,255)" fill-opacity="1" d=" M47.30799865722656,24.77899932861328 C47.30799865722656,24.77899932861328 -47.30799865722656,24.77899932861328 -47.30799865722656,24.77899932861328 C-54.821998596191406,24.77899932861328 -60.915000915527344,18.687000274658203 -60.915000915527344,11.17199993133545 C-60.915000915527344,11.17199993133545 -60.915000915527344,-11.17199993133545 -60.915000915527344,-11.17199993133545 C-60.915000915527344,-18.687000274658203 -54.821998596191406,-24.77899932861328 -47.30799865722656,-24.77899932861328 C-47.30799865722656,-24.77899932861328 47.30799865722656,-24.77899932861328 47.30799865722656,-24.77899932861328 C54.823001861572266,-24.77899932861328 60.915000915527344,-18.687000274658203 60.915000915527344,-11.17199993133545 C60.915000915527344,-11.17199993133545 60.915000915527344,11.17199993133545 60.915000915527344,11.17199993133545 C60.915000915527344,18.687000274658203 54.823001861572266,24.77899932861328 47.30799865722656,24.77899932861328z" data-v-84362868></path></g></g><g transform="matrix(1,0,0,1,57.675994873046875,197.90199279785156)" opacity="1" style="${ssrRenderStyle({ "display": "block" })}" data-v-84362868><g opacity="1" transform="matrix(1,0,0,1,220.85400390625,129.1739959716797)" data-v-84362868><path fill="rgb(156,115,246)" fill-opacity="1" d=" M177.03900146484375,128.9239959716797 C177.03900146484375,128.9239959716797 -177.03900146484375,128.92300415039062 -177.03900146484375,128.92300415039062 C-201.0989990234375,128.92300415039062 -220.60400390625,109.41799926757812 -220.60400390625,85.35800170898438 C-220.60400390625,85.35800170898438 -220.60400390625,-85.35900115966797 -220.60400390625,-85.35900115966797 C-220.60400390625,-109.41899871826172 -201.0989990234375,-128.9239959716797 -177.03799438476562,-128.9239959716797 C-177.03799438476562,-128.9239959716797 177.03900146484375,-128.9239959716797 177.03900146484375,-128.9239959716797 C201.10000610351562,-128.9239959716797 220.60400390625,-109.41899871826172 220.60400390625,-85.35800170898438 C220.60400390625,-85.35800170898438 220.60400390625,85.35900115966797 220.60400390625,85.35900115966797 C220.60400390625,109.41899871826172 201.10000610351562,128.9239959716797 177.03900146484375,128.9239959716797z" data-v-84362868></path></g></g><g id="g_dot_a" transform="matrix(1,0,0,1,319.98199462890625,337.7619934082031)" opacity="1" style="${ssrRenderStyle({ "display": "block" })}" data-v-84362868><g opacity="1" transform="matrix(1,0,0,1,38.32699966430664,38.32699966430664)" data-v-84362868><path fill="rgb(95,52,186)" fill-opacity="1" d=" M37.86600112915039,0.382999986410141 C37.654998779296875,21.29599952697754 20.530000686645508,38.07699966430664 -0.382999986410141,37.86600112915039 C-21.295000076293945,37.654998779296875 -38.07699966430664,20.530000686645508 -37.86600112915039,-0.38199999928474426 C-37.654998779296875,-21.295000076293945 -20.530000686645508,-38.07699966430664 0.382999986410141,-37.8650016784668 C21.295000076293945,-37.65399932861328 38.07699966430664,-20.530000686645508 37.86600112915039,0.382999986410141z" data-v-84362868></path></g></g><g id="g_dot_b" transform="matrix(1,0,0,1,376.781005859375,338.33599853515625)" opacity="1" style="${ssrRenderStyle({ "display": "block" })}" data-v-84362868><g opacity="1" transform="matrix(1,0,0,1,38.32699966430664,38.32699966430664)" data-v-84362868><path fill="rgb(81,18,215)" fill-opacity="1" d=" M-37.86600112915039,-0.382999986410141 C-38.07699966430664,20.530000686645508 -21.295000076293945,37.65399932861328 -0.382999986410141,37.8650016784668 C20.530000686645508,38.07699966430664 37.654998779296875,21.295000076293945 37.8650016784668,0.38199999928474426 C38.07699966430664,-20.530000686645508 21.295000076293945,-37.654998779296875 0.382999986410141,-37.86600112915039 C-20.5310001373291,-38.07699966430664 -37.654998779296875,-21.29599952697754 -37.86600112915039,-0.382999986410141z" data-v-84362868></path></g></g><g transform="matrix(1,0,0,1,58.31298828125,241.26498413085938)" opacity="1" style="${ssrRenderStyle({ "display": "block" })}" data-v-84362868><g opacity="1" transform="matrix(1,0,0,1,219.87600708007812,24.878999710083008)" data-v-84362868><path fill="rgb(45,45,45)" fill-opacity="1" d=" M219.62600708007812,24.628000259399414 C219.62600708007812,24.628000259399414 -219.62600708007812,24.628000259399414 -219.62600708007812,24.628000259399414 C-219.62600708007812,24.628000259399414 -219.625,-24.628000259399414 -219.625,-24.628000259399414 C-219.625,-24.628000259399414 219.62600708007812,-24.628000259399414 219.62600708007812,-24.628000259399414 C219.62600708007812,-24.628000259399414 219.62600708007812,24.628000259399414 219.62600708007812,24.628000259399414z" data-v-84362868></path></g></g></g></svg></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/icons/payments.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const payment = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-84362868"]]);
const _imports_0$2 = "" + buildAssetsURL("coding.v5rNLOjs.mp4");
const _sfc_main$3 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-0eeb2f54><video autoplay muted loop class="img__video" playsinline data-v-0eeb2f54><source${ssrRenderAttr("src", _imports_0$2)} type="video/mp4" data-v-0eeb2f54></video></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/icons/coding.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const coding = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-0eeb2f54"]]);
const _imports_0$1 = "" + buildAssetsURL("domain.22L7smSX.mp4");
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-7e62d75c><video autoplay muted loop class="img__video" playsinline data-v-7e62d75c><source${ssrRenderAttr("src", _imports_0$1)} type="video/mp4" data-v-7e62d75c></video></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/icons/domain.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const domain = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-7e62d75c"]]);
const _imports_0 = "" + buildAssetsURL("succeed.CxV5e8yX.mp4");
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-ad3d0870><video autoplay muted loop class="img__video" playsinline data-v-ad3d0870><source${ssrRenderAttr("src", _imports_0)} type="video/mp4" data-v-ad3d0870></video></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/icons/succeed.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const succeed = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-ad3d0870"]]);
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
    function getDeployStatusTitle(status) {
      if (status == "pending_payment") return "\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B";
      else if (status == "pending_yookassa_payment") return "\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B";
      else if (status == "in_progress") return "\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435";
      else if (status == "deploying_domain") return "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0434\u043E\u043C\u0435\u043D\u0430";
      else if (status == "completed") return "\u041F\u0440\u043E\u0435\u043A\u0442 \u0437\u0430\u043F\u0443\u0449\u0435\u043D";
      else if (status == "cancelled") return "\u041E\u0442\u043C\u0435\u043D\u0435\u043D";
      else return "\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435";
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "od-page" }, _attrs))} data-v-cbf355b7><div class="od-container" data-v-cbf355b7>`);
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
        _push(`<div class="od-loading" data-v-cbf355b7>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0437\u0430\u043A\u0430\u0437\u0430...</div>`);
      } else if (error.value) {
        _push(`<div class="od-error" data-v-cbf355b7> \u041E\u0448\u0438\u0431\u043A\u0430: ${ssrInterpolate(error.value)} <div style="${ssrRenderStyle({ "margin-top": "1rem" })}" data-v-cbf355b7><button class="od-btn" data-v-cbf355b7>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button></div></div>`);
      } else if (!orderLocal.value || !orderLocal.value.id) {
        _push(`<div class="od-empty" data-v-cbf355b7>\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D</div>`);
      } else {
        _push(`<div class="od-card" data-v-cbf355b7><div class="od-top" data-v-cbf355b7>`);
        if (orderLocal.value.raw.template.preview) {
          _push(`<img${ssrRenderAttr("src", orderLocal.value.raw.template.preview)} class="od-thumb" alt="\u041F\u0440\u0435\u0432\u044C\u044E \u0448\u0430\u0431\u043B\u043E\u043D\u0430" data-v-cbf355b7>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="od-info" data-v-cbf355b7><h1 class="od-title" data-v-cbf355b7>${ssrInterpolate((_a2 = orderLocal.value.raw.domain.fqdn) != null ? _a2 : "\u2014")}</h1><div class="od-meta" data-v-cbf355b7>\u0414\u0430\u0442\u0430: ${ssrInterpolate(formatDate(orderLocal.value.raw))}</div><div class="order-status__container" data-v-cbf355b7><p data-v-cbf355b7>\u0421\u0442\u0430\u0442\u0443\u0441:</p><div class="${ssrRenderClass([[
          "profile-orders__status",
          `profile-orders__status--${orderLocal.value.raw.deploy_status}`
        ], "od-meta"])}" data-v-cbf355b7>${ssrInterpolate(getDeployStatusTitle(orderLocal.value.raw.deploy_status))}</div></div><div class="od-price" data-v-cbf355b7>${ssrInterpolate(orderLocal.value.price)}</div></div></div><section class="od-section" data-v-cbf355b7><h2 class="od-section-title" data-v-cbf355b7>\u0414\u0435\u0442\u0430\u043B\u0438 \u0437\u0430\u043A\u0430\u0437\u0430</h2><div class="od-grid" data-v-cbf355b7><div class="od-grid-item" data-v-cbf355b7><strong data-v-cbf355b7>ID</strong><div data-v-cbf355b7>${ssrInterpolate((_b2 = orderLocal.value.id) != null ? _b2 : "\u2014")}</div></div><div class="od-grid-item" data-v-cbf355b7><strong data-v-cbf355b7>\u0428\u0430\u0431\u043B\u043E\u043D</strong><div data-v-cbf355b7>${ssrInterpolate((_c = orderLocal.value.template) != null ? _c : "\u2014")}</div></div><div class="od-grid-item" data-v-cbf355b7><strong data-v-cbf355b7>\u0414\u043E\u043C\u0435\u043D</strong><div data-v-cbf355b7>${ssrInterpolate((_d = orderLocal.value.raw.domain.fqdn) != null ? _d : "\u2014")}</div></div><div class="od-grid-item" data-v-cbf355b7><strong data-v-cbf355b7>\u0421\u0443\u043C\u043C\u0430</strong><div data-v-cbf355b7>${ssrInterpolate(orderLocal.value.price)}</div></div></div></section><section class="od-section" data-v-cbf355b7><h2 class="od-section-title" data-v-cbf355b7>\u042D\u0442\u0430\u043F\u044B \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438</h2><div class="od-section__steps" data-v-cbf355b7><div class="${ssrRenderClass([{ "step-active": orderLocal.value.raw.deploy_status === "pending_payment" || orderLocal.value.raw.deploy_status === "pending_yookassa_payment" }, "payment__container"])}" data-v-cbf355b7><div class="info__block" data-v-cbf355b7>`);
        _push(ssrRenderComponent(payment, { class: "image__container" }, null, _parent));
        _push(`<div class="info__about" data-v-cbf355b7><h3 data-v-cbf355b7>\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B</h3><p data-v-cbf355b7>\u0417\u0430\u043A\u0430\u0437 \u0441\u043E\u0437\u0434\u0430\u043D, \u043D\u043E \u043E\u043F\u043B\u0430\u0442\u0430 \u0435\u0449\u0451 \u043D\u0435 \u043F\u0440\u043E\u0448\u043B\u0430</p></div></div>`);
        _push(ssrRenderComponent(unref(vector), { class: "vector-right__svg" }, null, _parent));
        _push(`</div><div class="${ssrRenderClass([{ "step-active": orderLocal.value.raw.deploy_status === "in_progress" }, "coding__container"])}" data-v-cbf355b7><div class="info__block" data-v-cbf355b7>`);
        _push(ssrRenderComponent(coding, { class: "image__container" }, null, _parent));
        _push(`<div class="info__about" data-v-cbf355b7><h3 data-v-cbf355b7>\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435</h3><p data-v-cbf355b7>\u041F\u0440\u043E\u0435\u043A\u0442 \u0432 \u0440\u0430\u0431\u043E\u0442\u0435 \u2014 \u043D\u0430\u0448\u0438 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0438 \u0433\u043E\u0442\u043E\u0432\u044F\u0442 \u0441\u0430\u0439\u0442</p></div></div>`);
        _push(ssrRenderComponent(unref(vector), { class: "vector-right__svg" }, null, _parent));
        _push(`</div><div class="${ssrRenderClass([{ "step-active": orderLocal.value.raw.deploy_status === "deploying_domain" }, "domain__container"])}" data-v-cbf355b7><div class="info__block" data-v-cbf355b7>`);
        _push(ssrRenderComponent(domain, { class: "image__container" }, null, _parent));
        _push(`<div class="info__about" data-v-cbf355b7><h3 data-v-cbf355b7>\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0434\u043E\u043C\u0435\u043D\u0430</h3><p data-v-cbf355b7>\u041F\u0440\u0438\u0432\u044F\u0437\u044B\u0432\u0430\u0435\u043C \u0434\u043E\u043C\u0435\u043D \u0438 \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0435\u043C \u0434\u043E\u0441\u0442\u0443\u043F \u043F\u043E \u0430\u0434\u0440\u0435\u0441\u0443</p></div></div>`);
        _push(ssrRenderComponent(unref(vector), { class: "vector-right__svg" }, null, _parent));
        _push(`</div><div class="${ssrRenderClass([{ "step-active": orderLocal.value.raw.deploy_status === "completed" || orderLocal.value.raw.deploy_status === "succeed" }, "succeed__container"])}" data-v-cbf355b7><div class="info__block" data-v-cbf355b7>`);
        _push(ssrRenderComponent(succeed, { class: "image__container" }, null, _parent));
        _push(`<div class="info__about" data-v-cbf355b7><h3 data-v-cbf355b7>\u0412\u0441\u0435 \u0433\u043E\u0442\u043E\u0432\u043E</h3><p data-v-cbf355b7>\u0421\u0430\u0439\u0442 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D \u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0432 \u0441\u0435\u0442\u0438</p></div></div></div></div></section><div class="od-actions" data-v-cbf355b7></div></div>`);
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
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cbf355b7"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-B9EO1xxJ.mjs.map
