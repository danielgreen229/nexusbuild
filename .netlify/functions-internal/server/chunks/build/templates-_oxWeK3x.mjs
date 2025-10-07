import { ref, mergeProps, unref, isRef, watch, computed, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { u as useTemplateStore } from './template-CzstXKle.mjs';
import { _ as _export_sfc, u as useUserStore, n as navigateTo } from './server.mjs';
import OpenNext from './open-next-BTngSjB-.mjs';
import { B as Button } from './Button-BkOV6FTV.mjs';
import 'pinia';
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
import 'vue-router';

const title$1 = "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0448\u0430\u0431\u043B\u043E\u043D";
const subtitle$1 = "";
const debounceMs = 300;
const _sfc_main$5 = {
  __name: "PortfolioHero",
  __ssrInlineRender: true,
  setup(__props) {
    const templateStore = useTemplateStore();
    const search = ref("");
    const debouncedTimer = ref(null);
    watch(search, (val) => {
      if (debouncedTimer.value) clearTimeout(debouncedTimer.value);
      debouncedTimer.value = setTimeout(async () => {
        if (!val || String(val).trim() === "") {
          await templateStore.listTemplates({ page: 1, perPage: 12, filters: {} });
          return;
        }
        try {
          await templateStore.listTemplates({
            page: 1,
            perPage: 12,
            filters: { search: val }
          });
        } catch (e) {
        }
      }, debounceMs);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-hero" }, _attrs))} data-v-9aae542a><div class="portfolio-hero__container container" data-v-9aae542a><div class="portfolio-hero__content" data-v-9aae542a><h1 class="portfolio-hero__title" data-v-9aae542a>${ssrInterpolate(title$1)}</h1><p class="portfolio-hero__subtitle" data-v-9aae542a>${ssrInterpolate(subtitle$1)}</p><form class="portfolio-hero__search" aria-label="\u041F\u043E\u0438\u0441\u043A \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432" data-v-9aae542a><div class="search-wrap" data-v-9aae542a><input${ssrRenderAttr("value", search.value)} type="search" placeholder="\u041D\u0430\u0439\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D..." class="portfolio-hero__input" aria-label="\u041F\u043E\u0438\u0441\u043A \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432" data-v-9aae542a><button type="submit" class="btn-search"${ssrIncludeBooleanAttr(unref(templateStore).loading) ? " disabled" : ""} data-v-9aae542a>`);
      if (unref(templateStore).loading) {
        _push(`<span data-v-9aae542a>\u041F\u043E\u0438\u0441\u043A...</span>`);
      } else {
        _push(`<span data-v-9aae542a>\u041D\u0430\u0439\u0442\u0438</span>`);
      }
      _push(`</button></div></form>`);
      if (unref(templateStore).templates && unref(templateStore).templates.length >= 0) {
        _push(`<div class="portfolio-hero__meta" data-v-9aae542a><span class="meta-count" data-v-9aae542a> \u041D\u0430\u0439\u0434\u0435\u043D\u043E: <strong data-v-9aae542a>${ssrInterpolate((_a = unref(templateStore).total) != null ? _a : unref(templateStore).templates.length)}</strong></span>`);
        if (unref(templateStore).loading) {
          _push(`<span class="meta-loading" data-v-9aae542a> \xB7 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442\u0441\u044F\u2026</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(templateStore).error) {
          _push(`<span class="meta-error" data-v-9aae542a> \xB7 \u041E\u0448\u0438\u0431\u043A\u0430: ${ssrInterpolate(unref(templateStore).error)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/PortfolioHero.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const PortfolioHero = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-9aae542a"]]);
const _sfc_main$4 = {
  __name: "PortfolioFilters",
  __ssrInlineRender: true,
  props: {
    activeFilter: {
      type: String,
      required: true
    }
  },
  emits: ["update:activeFilter"],
  setup(__props, { emit: __emit }) {
    const filters = ref([
      { id: "all", name: "\u0412\u0441\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-filters" }, _attrs))} data-v-4e78344b><div class="portfolio-filters__container container" data-v-4e78344b><div class="portfolio-filters__wrapper" data-v-4e78344b><!--[-->`);
      ssrRenderList(unref(filters), (filter) => {
        _push(`<button class="${ssrRenderClass(["portfolio-filters__button", { "portfolio-filters__button--active": __props.activeFilter === filter.id }])}" data-v-4e78344b>${ssrInterpolate(filter.name)}</button>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/PortfolioFilters.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const PortfolioFilters = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-4e78344b"]]);
const _sfc_main$3 = {
  __name: "TemplateCard",
  __ssrInlineRender: true,
  props: {
    template: { type: Object, required: true }
  },
  emits: ["view"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useUserStore();
    const loading = ref(false);
    const round2 = (v) => {
      const n = Number(v) || 0;
      return Math.round((n + Number.EPSILON) * 100) / 100;
    };
    const fmt = (v) => {
      const n = Number(v) || 0;
      return n.toLocaleString("ru-RU", { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });
    };
    const inlineBuild = computed(() => {
      var _a2;
      var _a, _b;
      const t = (_a2 = (_a = props.template) == null ? void 0 : _a.inline_build) != null ? _a2 : (_b = props.template) == null ? void 0 : _b.inlineBuild;
      if (typeof t !== "undefined") return Boolean(t);
      return false;
    });
    const price = computed(() => {
      var _a, _b;
      return round2((_b = (_a = props.template.price) != null ? _a : props.template.price_cents) != null ? _b : 0);
    });
    const discountPercent = computed(() => {
      var _a, _b, _c;
      const p = (_c = (_b = (_a = props.template.discount_percent) != null ? _a : props.template.discountPercent) != null ? _b : props.template.discount) != null ? _c : 0;
      return Number.isFinite(Number(p)) ? round2(Number(p)) : 0;
    });
    const discountAmountFromField = computed(() => {
      var _a, _b, _c;
      return round2((_c = (_b = (_a = props.template.discount_amount) != null ? _a : props.template.discountAmount) != null ? _b : props.template.discount_amount_cents) != null ? _c : 0);
    });
    const computedDiscountAmount = computed(() => {
      if (discountAmountFromField.value > 0) return round2(discountAmountFromField.value);
      if (discountPercent.value > 0) return round2(price.value * discountPercent.value / 100);
      return 0;
    });
    const finalPrice = computed(() => {
      const p = price.value - computedDiscountAmount.value;
      return round2(p > 0 ? p : 0);
    });
    const buyTemplate = async (templateId) => {
      await navigateTo({ path: "/buy-template/" + templateId });
    };
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "template-card",
        role: "group",
        tabindex: "0"
      }, _attrs))} data-v-3f299b97><div class="template-card__image" data-v-3f299b97><img${ssrRenderAttr("src", __props.template.image)}${ssrRenderAttr("alt", __props.template.title)} loading="lazy" draggable="false" data-v-3f299b97><div class="template-card__badges" data-v-3f299b97>`);
      if (!inlineBuild.value) {
        _push(`<div class="template-card__badge template-card__badge--custom" data-v-3f299b97>\u0417\u0430\u043A\u0430\u0437\u043D\u043E\u0439</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.template.popular) {
        _push(`<div class="template-card__badge template-card__badge--popular" data-v-3f299b97>\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0439</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="template-card__view-button" type="button" aria-label="\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D" data-v-3f299b97> \u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C `);
      _push(ssrRenderComponent(unref(OpenNext), { class: "open-next__svg" }, null, _parent));
      _push(`</button></div><div class="template-card__content" data-v-3f299b97><div class="template-card__header" data-v-3f299b97><h3 class="template-card__title" data-v-3f299b97>${ssrInterpolate(__props.template.title)}</h3><div class="template-card__price" aria-live="polite" data-v-3f299b97>`);
      if (computedDiscountAmount.value > 0) {
        _push(`<div style="${ssrRenderStyle({ "text-align": "right" })}" data-v-3f299b97><div style="${ssrRenderStyle({ "font-size": "0.9rem", "color": "#64748b", "text-decoration": "line-through" })}" data-v-3f299b97>${ssrInterpolate(fmt(price.value))} \u20BD</div><div style="${ssrRenderStyle({ "font-size": "1.2rem", "font-weight": "700", "color": "#f97315" })}" data-v-3f299b97>${ssrInterpolate(fmt(finalPrice.value))} \u20BD</div><div style="${ssrRenderStyle({ "font-size": "0.8rem", "color": "#065f46" })}" data-v-3f299b97>\u0421\u043A\u0438\u0434\u043A\u0430: `);
        if (discountPercent.value > 0) {
          _push(`<span data-v-3f299b97>${ssrInterpolate(discountPercent.value)}%</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!--[-->${ssrInterpolate(fmt(price.value))} \u20BD<!--]-->`);
      }
      _push(`</div></div><p class="template-card__description" data-v-3f299b97>${ssrInterpolate(__props.template.description)}</p><div class="template-card__features" data-v-3f299b97><!--[-->`);
      ssrRenderList(__props.template.features, (feature, idx) => {
        _push(`<span class="template-card__feature" data-v-3f299b97>${ssrInterpolate(feature)}</span>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(Button, {
        class: "template-card__button button button--primary",
        disabled: loading.value,
        onClick: ($event) => buyTemplate(__props.template.id)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(loading.value ? "\u041F\u043E\u043A\u0443\u043F\u043A\u0430..." : "\u041A\u0443\u043F\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D")}`);
          } else {
            return [
              createTextVNode(toDisplayString(loading.value ? "\u041F\u043E\u043A\u0443\u043F\u043A\u0430..." : "\u041A\u0443\u043F\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/TemplateCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const TemplateCard = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3f299b97"]]);
const skeletonCount = 12;
const _sfc_main$2 = {
  __name: "PortfolioGrid",
  __ssrInlineRender: true,
  props: {
    activeFilter: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const templateStore = useTemplateStore();
    const filters = ref([
      { id: "all", name: "\u0412\u0441\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B" }
    ]);
    const loadTemplates = async () => {
      try {
        const filtersObj = {};
        if (props.activeFilter && props.activeFilter !== "all") {
          filtersObj.type = props.activeFilter;
        }
        await templateStore.listTemplates({ page: 1, perPage: 12, filters: filtersObj });
      } catch (e) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432:", e);
      }
    };
    watch(() => props.activeFilter, async () => {
      await loadTemplates();
    });
    const filteredTemplates = computed(() => {
      const items = templateStore.templates || [];
      if (props.activeFilter === "all") return items;
      return items.filter((t) => String(t.type) === String(props.activeFilter));
    });
    const displayCount = ref(0);
    let rafId = null;
    let animStart = 0;
    let animFrom = 0;
    let animTo = 0;
    let animDuration = 600;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    function animateTo(target, duration = animDuration) {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      animStart = performance.now();
      animFrom = displayCount.value;
      animTo = target;
      animDuration = duration;
      const step = (now) => {
        const elapsed = now - animStart;
        const t = Math.min(1, elapsed / animDuration);
        const eased = easeOutCubic(t);
        const value = Math.round(animFrom + (animTo - animFrom) * eased);
        displayCount.value = value;
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          rafId = null;
          displayCount.value = animTo;
        }
      };
      rafId = requestAnimationFrame(step);
    }
    function pluralTemplates(n) {
      const mod10 = n % 10;
      const mod100 = n % 100;
      if (mod10 === 1 && mod100 !== 11) return "\u0448\u0430\u0431\u043B\u043E\u043D";
      if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return "\u0448\u0430\u0431\u043B\u043E\u043D\u0430";
      return "\u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432";
    }
    if (!templateStore.loading) {
      displayCount.value = filteredTemplates.value.length;
    } else {
      displayCount.value = 0;
    }
    watch(
      () => filteredTemplates.value.length,
      (newCount, oldCount) => {
        if (!templateStore.loading) {
          animateTo(newCount);
        }
      }
    );
    watch(
      () => templateStore.loading,
      (isLoading, prev) => {
        if (prev === true && isLoading === false) {
          const target = filteredTemplates.value.length;
          animateTo(target);
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "portfolio-grid",
        "aria-busy": unref(templateStore).loading ? "true" : "false"
      }, _attrs))} data-v-1d275d61><div class="portfolio-grid__container container" data-v-1d275d61><div class="portfolio-grid__header" data-v-1d275d61><h2 class="portfolio-grid__title" data-v-1d275d61>`);
      if (unref(templateStore).loading) {
        _push(`<!--[-->\u2026 \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432<!--]-->`);
      } else {
        _push(`<!--[-->${ssrInterpolate(displayCount.value)} ${ssrInterpolate(pluralTemplates(displayCount.value))}<!--]-->`);
      }
      if (!unref(templateStore).loading && __props.activeFilter !== "all") {
        _push(`<span data-v-1d275d61> \u0432 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 &quot;${ssrInterpolate(((_a = filters.value.find((f) => f.id === __props.activeFilter)) == null ? void 0 : _a.name) || __props.activeFilter)}&quot; </span>`);
      } else if (unref(templateStore).loading && __props.activeFilter !== "all") {
        _push(`<span data-v-1d275d61><small class="portfolio-grid__loading-hint" data-v-1d275d61>\u0432 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \xAB${ssrInterpolate(((_b = filters.value.find((f) => f.id === __props.activeFilter)) == null ? void 0 : _b.name) || __props.activeFilter)}\xBB</small></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</h2></div>`);
      if (unref(templateStore).loading) {
        _push(`<div class="portfolio-grid__content" data-v-1d275d61><!--[-->`);
        ssrRenderList(skeletonCount, (n) => {
          _push(`<div class="skeleton-card" role="status" aria-label="\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0430" data-v-1d275d61><div class="skeleton-card__thumb shimmer" data-v-1d275d61></div><div class="skeleton-card__body" data-v-1d275d61><div class="skeleton-line skeleton-line--title shimmer" data-v-1d275d61></div><div class="skeleton-line skeleton-line--meta shimmer" data-v-1d275d61></div><div class="skeleton-line skeleton-line--meta short shimmer" data-v-1d275d61></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(templateStore).error) {
        _push(`<div class="portfolio-grid__empty" data-v-1d275d61> \u041E\u0448\u0438\u0431\u043A\u0430: ${ssrInterpolate(unref(templateStore).error)}</div>`);
      } else if (filteredTemplates.value.length === 0) {
        _push(`<div class="portfolio-grid__content" data-v-1d275d61><!--[-->`);
        ssrRenderList(skeletonCount, (n) => {
          _push(`<div class="skeleton-card" role="status" aria-label="\u041F\u0443\u0441\u0442\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0430 \u2014 \u0437\u0430\u0433\u043B\u0443\u0448\u043A\u0430" data-v-1d275d61><div class="skeleton-card__thumb shimmer" data-v-1d275d61></div><div class="skeleton-card__body" data-v-1d275d61><div class="skeleton-line skeleton-line--title shimmer" data-v-1d275d61></div><div class="skeleton-line skeleton-line--meta shimmer" data-v-1d275d61></div><div class="skeleton-line skeleton-line--meta short shimmer" data-v-1d275d61></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="portfolio-grid__content" data-v-1d275d61><!--[-->`);
        ssrRenderList(filteredTemplates.value, (template) => {
          _push(ssrRenderComponent(TemplateCard, {
            key: template.id,
            template
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/PortfolioGrid.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const PortfolioGrid = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-1d275d61"]]);
const title = "\u041D\u0443\u0436\u0435\u043D \u0443\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0434\u0438\u0437\u0430\u0439\u043D?";
const subtitle = "\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u0435\u043C \u044D\u043A\u0441\u043A\u043B\u044E\u0437\u0438\u0432\u043D\u044B\u0439 \u0441\u0430\u0439\u0442 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u0434\u043B\u044F \u0432\u0430\u0441";
const _sfc_main$1 = {
  __name: "PortfolioCTA",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-cta" }, _attrs))} data-v-f329e64b><div class="portfolio-cta__container container" data-v-f329e64b><div class="portfolio-cta__content" data-v-f329e64b><h2 class="portfolio-cta__title" data-v-f329e64b>${ssrInterpolate(title)}</h2><p class="portfolio-cta__subtitle" data-v-f329e64b>${ssrInterpolate(subtitle)}</p><button class="portfolio-cta__button button button--primary" data-v-f329e64b> \u0417\u0430\u043A\u0430\u0437\u0430\u0442\u044C \u0434\u0438\u0437\u0430\u0439\u043D </button></div></div></section>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/PortfolioCTA.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const PortfolioCTA = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f329e64b"]]);
const _sfc_main = {
  __name: "templates",
  __ssrInlineRender: true,
  setup(__props) {
    const activeFilter = ref("all");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "portfolio-page" }, _attrs))} data-v-5442f79c>`);
      _push(ssrRenderComponent(PortfolioHero, null, null, _parent));
      _push(ssrRenderComponent(PortfolioFilters, {
        "active-filter": unref(activeFilter),
        "onUpdate:activeFilter": ($event) => isRef(activeFilter) ? activeFilter.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(PortfolioGrid, { "active-filter": unref(activeFilter) }, null, _parent));
      _push(ssrRenderComponent(PortfolioCTA, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/templates.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const templates = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5442f79c"]]);

export { templates as default };
//# sourceMappingURL=templates-_oxWeK3x.mjs.map
