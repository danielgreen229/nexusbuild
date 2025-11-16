import { ref, mergeProps, unref, isRef, watch, computed, nextTick, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
import { u as useTemplateStore } from './template-B72Yob-U.mjs';
import { _ as _export_sfc, e as useUserStore, n as navigateTo } from './server.mjs';
import OpenNext from './open-next-Bh2lDVNL.mjs';
import { u as useSEO } from './useSEO-CGkjS5so.mjs';
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
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';

const title = "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0448\u0430\u0431\u043B\u043E\u043D";
const subtitle = "";
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
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-hero" }, _attrs))} data-v-494953f4><div class="portfolio-hero__container container" data-v-494953f4><div class="portfolio-hero__content" data-v-494953f4><h1 class="portfolio-hero__title" data-v-494953f4>${ssrInterpolate(title)}</h1><p class="portfolio-hero__subtitle" data-v-494953f4>${ssrInterpolate(subtitle)}</p><form class="portfolio-hero__search" aria-label="\u041F\u043E\u0438\u0441\u043A \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432" data-v-494953f4><div class="search-wrap" data-v-494953f4><input${ssrRenderAttr("value", search.value)} type="search" placeholder="\u041D\u0430\u0439\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D..." class="portfolio-hero__input" aria-label="\u041F\u043E\u0438\u0441\u043A \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432" data-v-494953f4><button type="submit" class="btn-search"${ssrIncludeBooleanAttr(unref(templateStore).loading) ? " disabled" : ""} data-v-494953f4>`);
      if (unref(templateStore).loading) {
        _push(`<span data-v-494953f4>\u041F\u043E\u0438\u0441\u043A...</span>`);
      } else {
        _push(`<span data-v-494953f4>\u041D\u0430\u0439\u0442\u0438</span>`);
      }
      _push(`</button></div></form>`);
      if (unref(templateStore).templates && unref(templateStore).templates.length >= 0) {
        _push(`<div class="portfolio-hero__meta" data-v-494953f4>`);
        if (unref(templateStore).total && unref(templateStore).templates.length > 0) {
          _push(`<span class="meta-count" data-v-494953f4> \u041D\u0430\u0439\u0434\u0435\u043D\u043E: <strong data-v-494953f4>${ssrInterpolate((_a = unref(templateStore).total) != null ? _a : unref(templateStore).templates.length)}</strong></span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(templateStore).loading) {
          _push(`<span class="meta-loading" data-v-494953f4> \xB7 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442\u0441\u044F\u2026</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(templateStore).error) {
          _push(`<span class="meta-error" data-v-494953f4> \xB7 \u041E\u0448\u0438\u0431\u043A\u0430: ${ssrInterpolate(unref(templateStore).error)}</span>`);
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
const PortfolioHero = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-494953f4"]]);
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
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-filters" }, _attrs))} data-v-f61ec0aa><div class="portfolio-filters__container container" data-v-f61ec0aa><div class="portfolio-filters__wrapper" data-v-f61ec0aa><!--[-->`);
      ssrRenderList(unref(filters), (filter) => {
        _push(`<button class="${ssrRenderClass(["portfolio-filters__button", { "portfolio-filters__button--active": __props.activeFilter === filter.id }])}" data-v-f61ec0aa>${ssrInterpolate(filter.name)}</button>`);
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
const PortfolioFilters = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-f61ec0aa"]]);
const _sfc_main$3 = {
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    variant: {
      type: String,
      default: "primary",
      validator: (value) => ["primary", "outline"].includes(value)
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value)
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: [
          "button",
          `button--${__props.variant}`,
          `button--${__props.size}`
        ]
      }, _attrs))} data-v-62a209ae>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Button.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Button = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-62a209ae"]]);
const _sfc_main$2 = {
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
    const haveHtml = computed(() => {
      var _a2;
      var _a, _b;
      const t = (_a2 = (_a = props.template) == null ? void 0 : _a.have_html) != null ? _a2 : (_b = props.template) == null ? void 0 : _b.haveHtml;
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
      }, _attrs))} data-v-4622e1c4><div class="template-card__image" data-v-4622e1c4><img${ssrRenderAttr("src", __props.template.preview)}${ssrRenderAttr("alt", __props.template.title)} loading="lazy" draggable="false" data-v-4622e1c4><div class="template-card__badges" data-v-4622e1c4>`);
      if (!haveHtml.value) {
        _push(`<div class="template-card__badge template-card__badge--custom" data-v-4622e1c4>\u0417\u0430\u043A\u0430\u0437\u043D\u043E\u0439</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.template.popular) {
        _push(`<div class="template-card__badge template-card__badge--popular" data-v-4622e1c4>\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0439</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="template-card__view-button" type="button" aria-label="\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D" data-v-4622e1c4> \u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C `);
      _push(ssrRenderComponent(unref(OpenNext), { class: "open-next__svg" }, null, _parent));
      _push(`</button></div><div class="template-card__content" data-v-4622e1c4><div class="template-card__header" data-v-4622e1c4><h3 class="template-card__title" data-v-4622e1c4>${ssrInterpolate(__props.template.title)}</h3><div class="template-card__price" aria-live="polite" data-v-4622e1c4>`);
      if (computedDiscountAmount.value > 0) {
        _push(`<div style="${ssrRenderStyle({ "text-align": "right" })}" data-v-4622e1c4><div style="${ssrRenderStyle({ "font-size": "0.9rem", "color": "#64748b", "text-decoration": "line-through" })}" data-v-4622e1c4>${ssrInterpolate(fmt(price.value))} \u20BD</div><div style="${ssrRenderStyle({ "font-size": "1.2rem", "font-weight": "700", "color": "#f97315" })}" data-v-4622e1c4>${ssrInterpolate(fmt(finalPrice.value))} \u20BD</div><div style="${ssrRenderStyle({ "font-size": "0.8rem", "color": "#065f46" })}" data-v-4622e1c4>\u0421\u043A\u0438\u0434\u043A\u0430: `);
        if (discountPercent.value > 0) {
          _push(`<span data-v-4622e1c4>${ssrInterpolate(discountPercent.value)}%</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!--[-->${ssrInterpolate(fmt(price.value))} \u20BD<!--]-->`);
      }
      _push(`</div></div><p class="template-card__description" data-v-4622e1c4>${ssrInterpolate(__props.template.description)}</p><div class="template-card__features" data-v-4622e1c4><!--[-->`);
      ssrRenderList(__props.template.features, (feature, idx) => {
        _push(`<span class="template-card__feature" data-v-4622e1c4>${ssrInterpolate(feature)}</span>`);
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/TemplateCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TemplateCard = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-4622e1c4"]]);
const PER_PAGE = 12;
const SORT_BY = "have_html,popular,created_at";
const ORDER = "desc";
const _sfc_main$1 = {
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
    ref([{ id: "all", name: "\u0412\u0441\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B" }]);
    const sentinel = ref(null);
    let observer = null;
    const isLoadingMore = ref(false);
    const isInitialLoad = computed(() => templateStore.loading && templateStore.templates.length === 0);
    const cardHeight = ref(240);
    function buildFilters() {
      const f = {};
      if (props.activeFilter && props.activeFilter !== "all") f.type = props.activeFilter;
      return f;
    }
    async function measureCardHeight() {
      await nextTick();
      try {
        const el = (void 0).querySelector(".portfolio-grid__content .grid-item");
        if (el && el.offsetHeight) cardHeight.value = el.offsetHeight;
      } catch (e) {
      }
    }
    async function requestPage({ page = 1, perPage = PER_PAGE, filters: filters2 = {}, append = false } = {}) {
      const serverFilters = { ...filters2 };
      return templateStore.listTemplates({
        page,
        perPage,
        filters: serverFilters,
        append,
        sortBy: SORT_BY,
        order: ORDER
      });
    }
    async function loadTemplates() {
      try {
        templateStore.perPage = PER_PAGE;
        const f = buildFilters();
        await requestPage({ page: 1, perPage: PER_PAGE, filters: f, append: false });
        await measureCardHeight();
      } catch (e) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432:", e);
      }
    }
    async function loadMore() {
      if (templateStore.loading || isLoadingMore.value) return;
      if (!templateStore.hasMore) return;
      isLoadingMore.value = true;
      await measureCardHeight();
      try {
        const f = buildFilters();
        const nextPage = (Number(templateStore.page) || 1) + 1;
        await requestPage({ page: nextPage, perPage: PER_PAGE, filters: f, append: true });
        await measureCardHeight();
      } catch (e) {
        console.warn("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u0434\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B:", e);
      } finally {
        isLoadingMore.value = false;
      }
    }
    const onIntersect = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) loadMore();
      }
    };
    function initObserver() {
      if (observer) {
        try {
          if (sentinel.value) observer.unobserve(sentinel.value);
          observer.disconnect();
        } catch (e) {
        }
        observer = null;
      }
      observer = new IntersectionObserver(onIntersect, { root: null, rootMargin: "300px", threshold: 0.1 });
      nextTick(() => {
        if (sentinel.value) observer.observe(sentinel.value);
      });
    }
    watch(() => props.activeFilter, async () => {
      await loadTemplates();
      initObserver();
    });
    const filteredTemplates = computed(() => {
      const items = templateStore.templates || [];
      if (props.activeFilter === "all") return items;
      return items.filter((t) => String(t.type) === String(props.activeFilter));
    });
    const skeletonCount = ref(PER_PAGE);
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
        displayCount.value = Math.round(animFrom + (animTo - animFrom) * eased);
        if (t < 1) rafId = requestAnimationFrame(step);
        else {
          rafId = null;
          displayCount.value = animTo;
        }
      };
      rafId = requestAnimationFrame(step);
    }
    displayCount.value = templateStore.loading ? 0 : filteredTemplates.value.length;
    watch(() => filteredTemplates.value.length, (newCount) => {
      if (!templateStore.loading) animateTo(newCount);
    });
    watch(() => templateStore.loading, (isLoading, prev) => {
      if (prev === true && isLoading === false) animateTo(filteredTemplates.value.length);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "portfolio-grid",
        "aria-busy": isInitialLoad.value ? "true" : "false"
      }, _attrs))} data-v-e116ba3a><div class="portfolio-grid__container container" data-v-e116ba3a><div class="portfolio-grid__header" data-v-e116ba3a></div>`);
      if (isInitialLoad.value) {
        _push(`<div class="portfolio-grid__content" data-v-e116ba3a><!--[-->`);
        ssrRenderList(skeletonCount.value, (n) => {
          _push(`<div class="skeleton-card" role="status" aria-label="\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0430" style="${ssrRenderStyle({ minHeight: cardHeight.value + "px" })}" data-v-e116ba3a><div class="skeleton-card__thumb shimmer" data-v-e116ba3a></div><div class="skeleton-card__body" data-v-e116ba3a><div class="skeleton-line skeleton-line--title shimmer" data-v-e116ba3a></div><div class="skeleton-line skeleton-line--meta shimmer" data-v-e116ba3a></div><div class="skeleton-line skeleton-line--meta short shimmer" data-v-e116ba3a></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(templateStore).error) {
        _push(`<div class="portfolio-grid__empty" data-v-e116ba3a> \u041E\u0448\u0438\u0431\u043A\u0430: ${ssrInterpolate(unref(templateStore).error)}</div>`);
      } else {
        _push(`<div class="portfolio-grid__content" data-v-e116ba3a><div${ssrRenderAttrs({
          name: "grid",
          class: "portfolio-grid__content-inner"
        })} data-v-e116ba3a>`);
        ssrRenderList(filteredTemplates.value, (template, index) => {
          _push(`<div class="grid-item" style="${ssrRenderStyle({ transitionDelay: `${Math.min(index, 20) * 30}ms` })}" data-v-e116ba3a>`);
          _push(ssrRenderComponent(TemplateCard, { template }, null, _parent));
          _push(`</div>`);
        });
        if (isLoadingMore.value) {
          _push(`<!--[-->`);
          ssrRenderList(skeletonCount.value, (n) => {
            _push(`<div class="grid-item skeleton-placeholder" style="${ssrRenderStyle({ height: cardHeight.value + "px", transitionDelay: `${Math.min(filteredTemplates.value.length + n, 40) * 12}ms` })}" aria-hidden="true" data-v-e116ba3a><div class="skeleton-card__thumb shimmer" data-v-e116ba3a></div><div class="skeleton-card__body" data-v-e116ba3a><div class="skeleton-line skeleton-line--title shimmer" data-v-e116ba3a></div><div class="skeleton-line skeleton-line--meta shimmer" data-v-e116ba3a></div></div></div>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</div><div class="infinite-sentinel" style="${ssrRenderStyle({ "height": "1px", "width": "100%" })}" data-v-e116ba3a></div>`);
        if (unref(templateStore).loading && !isInitialLoad.value) {
          _push(`<div class="portfolio-grid__loading" data-v-e116ba3a>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/PortfolioGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const PortfolioGrid = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-e116ba3a"]]);
const _sfc_main = {
  __name: "templates",
  __ssrInlineRender: true,
  setup(__props) {
    const activeFilter = ref("all");
    useSEO({
      title: "\u0428\u0430\u0431\u043B\u043E\u043D\u044B",
      description: "\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u044B\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B \u0434\u043B\u044F \u043B\u0435\u043D\u0434\u0438\u043D\u0433\u043E\u0432, \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u043E\u0432 \u0438 \u043F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E \u2014 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u0437\u0430\u043F\u0443\u0441\u043A \u0441\u0430\u0439\u0442\u0430, \u043F\u0440\u043E\u0441\u0442\u0430\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0438 SEO-\u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C.",
      image: "https://sitebypro-server.ru/static/files/store/preview.png",
      url: "https://sitebypro.com/templates"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "portfolio-page" }, _attrs))} data-v-81f957a1>`);
      _push(ssrRenderComponent(PortfolioHero, null, null, _parent));
      _push(ssrRenderComponent(PortfolioFilters, {
        "active-filter": unref(activeFilter),
        "onUpdate:activeFilter": ($event) => isRef(activeFilter) ? activeFilter.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(PortfolioGrid, { "active-filter": unref(activeFilter) }, null, _parent));
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
const templates = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-81f957a1"]]);

export { templates as default };
//# sourceMappingURL=templates-38okd0OF.mjs.map
