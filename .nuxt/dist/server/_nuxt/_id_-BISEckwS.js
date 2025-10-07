import { computed, ref, watchEffect, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttr } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { u as useTemplateStore } from "./template-CzstXKle.js";
import { _ as _export_sfc } from "../server.mjs";
import "pinia";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/hookable/dist/index.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unctx/dist/index.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/h3/dist/index.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/defu/dist/defu.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/radix3/dist/index.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ufo/dist/index.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/klona/dist/index.mjs";
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
        return `${value} ₽`;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-af1d3939><div class="wrapper" data-v-af1d3939><section class="card main" data-v-af1d3939><h1 class="title" data-v-af1d3939>Сайт &quot;${ssrInterpolate(template.value.title)}&quot;</h1><div class="meta" data-v-af1d3939><span class="price" data-v-af1d3939>${ssrInterpolate(formatCurrency(template.value.price))}</span></div><div class="extras" data-v-af1d3939><h3 data-v-af1d3939>Дополнительные опции</h3><label class="addon" data-v-af1d3939><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.extraPage.enabled) ? ssrLooseContain(addons.value.extraPage.enabled, null) : addons.value.extraPage.enabled) ? " checked" : ""} data-v-af1d3939> Доп. страница — ${ssrInterpolate(formatCurrency(addons.value.extraPage.price))} / страница </label>`);
      if (addons.value.extraPage.enabled) {
        _push(`<div class="addon-ctrl" data-v-af1d3939><label data-v-af1d3939>Количество: <input type="number" min="0" step="1"${ssrRenderAttr("value", addons.value.extraPage.count)} data-v-af1d3939></label></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="addon" data-v-af1d3939><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.customization.enabled) ? ssrLooseContain(addons.value.customization.enabled, null) : addons.value.customization.enabled) ? " checked" : ""} data-v-af1d3939> Кастомизация — ${ssrInterpolate(formatCurrency(addons.value.customization.pricePerHour))} / час </label>`);
      if (addons.value.customization.enabled) {
        _push(`<div class="addon-ctrl" data-v-af1d3939><label data-v-af1d3939>Часы: <input type="number" min="0" step="1"${ssrRenderAttr("value", addons.value.customization.hours)} data-v-af1d3939></label></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="addon" data-v-af1d3939><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.priority.enabled) ? ssrLooseContain(addons.value.priority.enabled, null) : addons.value.priority.enabled) ? " checked" : ""} data-v-af1d3939> Приоритетная доработка — ${ssrInterpolate(formatCurrency(addons.value.priority.price))}</label><label class="addon" data-v-af1d3939><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(addons.value.hosting.enabled) ? ssrLooseContain(addons.value.hosting.enabled, null) : addons.value.hosting.enabled) ? " checked" : ""} data-v-af1d3939> Подключение и хостинг — ${ssrInterpolate(formatCurrency(addons.value.hosting.price))}</label></div>`);
      if (template.value.preview) {
        _push(`<div class="preview-link" data-v-af1d3939><a${ssrRenderAttr("href", template.value.preview)} target="_blank" rel="noopener" data-v-af1d3939>Открыть демо (preview)</a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><aside class="card sidebar" data-v-af1d3939><h2 data-v-af1d3939>Ваш заказ</h2><div class="order-lines" data-v-af1d3939><div class="line" data-v-af1d3939><span data-v-af1d3939>Базовая цена</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(basePrice.value))}</span></div>`);
      if (selectedPagesCount.value !== template.value.pages.length) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>Выбранные страницы</span><span data-v-af1d3939>${ssrInterpolate(selectedPagesCount.value)} / ${ssrInterpolate(template.value.pages.length)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.extraPage.enabled && addons.value.extraPage.count > 0) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>Доп. страницы (x${ssrInterpolate(addons.value.extraPage.count)})</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(extraPagesCost.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.customization.enabled && addons.value.customization.hours > 0) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>Кастомизация (${ssrInterpolate(addons.value.customization.hours)} ч)</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(customizationCost.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.priority.enabled) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>Приоритет</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(addons.value.priority.price))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (addons.value.hosting.enabled) {
        _push(`<div class="line" data-v-af1d3939><span data-v-af1d3939>Подключение / хостинг</span><span data-v-af1d3939>${ssrInterpolate(formatCurrency(addons.value.hosting.price))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<hr data-v-af1d3939><div class="line" data-v-af1d3939><strong data-v-af1d3939>Промежуточная сумма</strong><strong data-v-af1d3939>${ssrInterpolate(formatCurrency(subtotal.value))}</strong></div>`);
      if (appliedDiscount.value > 0) {
        _push(`<div class="line discount" data-v-af1d3939><span data-v-af1d3939>Скидка ${ssrInterpolate(discountLabel.value)}</span><span data-v-af1d3939>-${ssrInterpolate(formatCurrency(appliedDiscount.value))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="line total" data-v-af1d3939><strong data-v-af1d3939>Итого</strong><strong data-v-af1d3939>${ssrInterpolate(formatCurrency(total.value))}</strong></div></div><div class="order-actions" data-v-af1d3939><label class="input" data-v-af1d3939> Имя: <input${ssrRenderAttr("value", buyer.value.name)} placeholder="Иван Иванов" data-v-af1d3939></label><label class="input" data-v-af1d3939> Телефон / email: <input${ssrRenderAttr("value", buyer.value.contact)} placeholder="+7 900 000-00-00 или email@example.com" data-v-af1d3939></label><button class="btn primary"${ssrIncludeBooleanAttr(placing.value) ? " disabled" : ""} data-v-af1d3939>${ssrInterpolate(placing.value ? "Оформление…" : "Оформить заказ")}</button><button class="btn ghost" data-v-af1d3939>Сбросить</button><div class="note" data-v-af1d3939><small data-v-af1d3939>Нажимая «Оформить заказ», вы отправляете заявку. Реальная интеграция с оплатой/бекендом не включена в этот пример.</small></div></div></aside></div></div>`);
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
export {
  _id_ as default
};
//# sourceMappingURL=_id_-BISEckwS.js.map
