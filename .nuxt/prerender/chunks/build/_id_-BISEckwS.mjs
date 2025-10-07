import { computed, ref, watchEffect, mergeProps, useSSRContext } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttr } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue/server-renderer/index.mjs';
import { useRoute } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue-router/dist/vue-router.node.mjs';
import { u as useTemplateStore } from './template-CzstXKle.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/pinia/dist/pinia.prod.cjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/h3/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ufo/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/destr/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/hookable/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/node-mock-http/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ohash/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/klona/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/defu/dist/defu.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/scule/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unctx/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/pathe/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ipx/dist/index.mjs';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const store = useTemplateStore();
    route.params.id;
    const template = computed(() => store.current || {
      id: null,
      title: "",
      price: 0,
      image: "",
      description: "",
      features: [],
      pages: [],
      technologies: [],
      screenshots: [],
      preview: "",
      discount_percent: 0,
      discount_amount: 0
    });
    const basePrice = computed(() => Number(template.value.price || 0));
    const addons = ref({
      extraPage: { enabled: false, price: 1e3, count: 0 },
      customization: { enabled: false, pricePerHour: 500, hours: 0 },
      priority: { enabled: false, price: 2e3 },
      hosting: { enabled: false, price: 1e3 }
    });
    const selectedPages = ref([]);
    watchEffect(() => {
      if (template.value.pages && selectedPages.value.length === 0) {
        selectedPages.value = [...template.value.pages];
      }
    });
    const buyer = ref({ name: "", contact: "" });
    const placing = ref(false);
    const selectedPagesCount = computed(() => selectedPages.value.length);
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
      const parts = [
        basePrice.value,
        extraPagesCost.value,
        customizationCost.value,
        priorityCost.value,
        hostingCost.value
      ];
      return parts.reduce((acc, v) => acc + Number(v || 0), 0);
    });
    const appliedDiscount = computed(() => {
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
    const total = computed(() => {
      const t = subtotal.value - appliedDiscount.value;
      return t > 0 ? t : 0;
    });
    function formatCurrency(value) {
      try {
        const v = Number(value || 0);
        return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(Math.round(v));
      } catch (e) {
        return `${value} \u20BD`;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-af1d3939><div class="wrapper" data-v-af1d3939><section class="card main" data-v-af1d3939><h1 class="title" data-v-af1d3939>\u0421\u0430\u0439\u0442 &quot;${ssrInterpolate(template.value.title)}&quot;</h1><div class="meta" data-v-af1d3939><span class="price" data-v-af1d3939>${ssrInterpolate(formatCurrency(template.value.price))}</span></div><div class="extras" data-v-af1d3939><h3 data-v-af1d3939>\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043E\u043F\u0446\u0438\u0438</h3><label class="addon" data-v-af1d3939><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.extraPage.enabled) ? ssrLooseContain(addons.value.extraPage.enabled, null) : addons.value.extraPage.enabled) ? " checked" : ""} data-v-af1d3939> \u0414\u043E\u043F. \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u2014 ${ssrInterpolate(formatCurrency(addons.value.extraPage.price))} / \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 </label>`);
      if (addons.value.extraPage.enabled) {
        _push(`<div class="addon-ctrl" data-v-af1d3939><label data-v-af1d3939>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E: <input type="number" min="0" step="1"${ssrRenderAttr("value", addons.value.extraPage.count)} data-v-af1d3939></label></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="addon" data-v-af1d3939><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.customization.enabled) ? ssrLooseContain(addons.value.customization.enabled, null) : addons.value.customization.enabled) ? " checked" : ""} data-v-af1d3939> \u041A\u0430\u0441\u0442\u043E\u043C\u0438\u0437\u0430\u0446\u0438\u044F \u2014 ${ssrInterpolate(formatCurrency(addons.value.customization.pricePerHour))} / \u0447\u0430\u0441 </label>`);
      if (addons.value.customization.enabled) {
        _push(`<div class="addon-ctrl" data-v-af1d3939><label data-v-af1d3939>\u0427\u0430\u0441\u044B: <input type="number" min="0" step="1"${ssrRenderAttr("value", addons.value.customization.hours)} data-v-af1d3939></label></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="addon" data-v-af1d3939><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.priority.enabled) ? ssrLooseContain(addons.value.priority.enabled, null) : addons.value.priority.enabled) ? " checked" : ""} data-v-af1d3939> \u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u043D\u0430\u044F \u0434\u043E\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u2014 ${ssrInterpolate(formatCurrency(addons.value.priority.price))}</label><label class="addon" data-v-af1d3939><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.hosting.enabled) ? ssrLooseContain(addons.value.hosting.enabled, null) : addons.value.hosting.enabled) ? " checked" : ""} data-v-af1d3939> \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0438 \u0445\u043E\u0441\u0442\u0438\u043D\u0433 \u2014 ${ssrInterpolate(formatCurrency(addons.value.hosting.price))}</label></div>`);
      if (template.value.preview) {
        _push(`<div class="preview-link" data-v-af1d3939><a${ssrRenderAttr("href", template.value.preview)} target="_blank" rel="noopener" data-v-af1d3939>\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0434\u0435\u043C\u043E (preview)</a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><aside class="card sidebar" data-v-af1d3939><h2 data-v-af1d3939>\u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437</h2><div class="order-lines" data-v-af1d3939><div class="line" data-v-af1d3939><span data-v-af1d3939>\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u0446\u0435\u043D\u0430</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(basePrice.value))}</span></div>`);
      if (selectedPagesCount.value !== template.value.pages.length) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B</span><span data-v-af1d3939>${ssrInterpolate(selectedPagesCount.value)} / ${ssrInterpolate(template.value.pages.length)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.extraPage.enabled && addons.value.extraPage.count > 0) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>\u0414\u043E\u043F. \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B (x${ssrInterpolate(addons.value.extraPage.count)})</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(extraPagesCost.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.customization.enabled && addons.value.customization.hours > 0) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>\u041A\u0430\u0441\u0442\u043E\u043C\u0438\u0437\u0430\u0446\u0438\u044F (${ssrInterpolate(addons.value.customization.hours)} \u0447)</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(customizationCost.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.priority.enabled) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(addons.value.priority.price))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.hosting.enabled) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 / \u0445\u043E\u0441\u0442\u0438\u043D\u0433</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(addons.value.hosting.price))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<hr data-v-af1d3939><div class="line" data-v-af1d3939><strong data-v-af1d3939>\u041F\u0440\u043E\u043C\u0435\u0436\u0443\u0442\u043E\u0447\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430</strong><strong data-v-af1d3939>${ssrInterpolate(formatCurrency(subtotal.value))}</strong></div>`);
      if (appliedDiscount.value > 0) {
        _push(`<div class="line discount" data-v-af1d3939><span data-v-af1d3939>\u0421\u043A\u0438\u0434\u043A\u0430 ${ssrInterpolate(discountLabel.value)}</span><span data-v-af1d3939>-${ssrInterpolate(formatCurrency(appliedDiscount.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="line total" data-v-af1d3939><strong data-v-af1d3939>\u0418\u0442\u043E\u0433\u043E</strong><strong data-v-af1d3939>${ssrInterpolate(formatCurrency(total.value))}</strong></div></div><div class="order-actions" data-v-af1d3939><label class="input" data-v-af1d3939> \u0418\u043C\u044F: <input${ssrRenderAttr("value", buyer.value.name)} placeholder="\u0418\u0432\u0430\u043D \u0418\u0432\u0430\u043D\u043E\u0432" data-v-af1d3939></label><label class="input" data-v-af1d3939> \u0422\u0435\u043B\u0435\u0444\u043E\u043D / email: <input${ssrRenderAttr("value", buyer.value.contact)} placeholder="+7 900 000-00-00 \u0438\u043B\u0438 email@example.com" data-v-af1d3939></label><button class="btn primary"${ssrIncludeBooleanAttr(placing.value) ? " disabled" : ""} data-v-af1d3939>${ssrInterpolate(placing.value ? "\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435\u2026" : "\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437")}</button><button class="btn ghost" data-v-af1d3939>\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C</button><div class="note" data-v-af1d3939><small data-v-af1d3939>\u041D\u0430\u0436\u0438\u043C\u0430\u044F \xAB\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437\xBB, \u0432\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0435 \u0437\u0430\u044F\u0432\u043A\u0443. \u0420\u0435\u0430\u043B\u044C\u043D\u0430\u044F \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F \u0441 \u043E\u043F\u043B\u0430\u0442\u043E\u0439/\u0431\u0435\u043A\u0435\u043D\u0434\u043E\u043C \u043D\u0435 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u0432 \u044D\u0442\u043E\u0442 \u043F\u0440\u0438\u043C\u0435\u0440.</small></div></div></aside></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/buy-template/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-af1d3939"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-BISEckwS.mjs.map
