import { ref, mergeProps, unref, isRef, computed, withCtx, createTextVNode, useSSRContext } from 'file:///home/gda/Documents/test/nexusbuild/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'file:///home/gda/Documents/test/nexusbuild/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc } from './server.mjs';
import { B as Button } from './Button-BkOV6FTV.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/h3/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/ufo/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/destr/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/hookable/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/node-mock-http/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unstorage/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unstorage/drivers/fs.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/ohash/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/klona/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/defu/dist/defu.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/scule/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unctx/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/pathe/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/ipx/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/vue-router/dist/vue-router.node.mjs';

const title$1 = "\u0413\u043E\u0442\u043E\u0432\u044B\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B \u0441\u0430\u0439\u0442\u043E\u0432";
const subtitle$1 = "\u0412\u044B\u0431\u0435\u0440\u0438 \u0448\u0430\u0431\u043B\u043E\u043D \u0438 \u043F\u043E\u043B\u0443\u0447\u0438 \u0441\u0430\u0439\u0442 \u0437\u0430 24 \u0447\u0430\u0441\u0430";
const _sfc_main$5 = {
  __name: "PortfolioHero",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-hero" }, _attrs))} data-v-719090a3><div class="portfolio-hero__container container" data-v-719090a3><div class="portfolio-hero__content" data-v-719090a3><h1 class="portfolio-hero__title" data-v-719090a3>${ssrInterpolate(title$1)}</h1><p class="portfolio-hero__subtitle" data-v-719090a3>${ssrInterpolate(subtitle$1)}</p></div></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/PortfolioHero.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const PortfolioHero = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-719090a3"]]);
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
      { id: "all", name: "\u0412\u0441\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B" },
      { id: "landing", name: "\u041B\u0435\u043D\u0434\u0438\u043D\u0433\u0438" },
      { id: "corporate", name: "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0435" },
      { id: "shop", name: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D\u044B" },
      { id: "blog", name: "\u0411\u043B\u043E\u0433\u0438" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-filters" }, _attrs))} data-v-e9cb9013><div class="portfolio-filters__container container" data-v-e9cb9013><div class="portfolio-filters__wrapper" data-v-e9cb9013><!--[-->`);
      ssrRenderList(unref(filters), (filter) => {
        _push(`<button class="${ssrRenderClass(["portfolio-filters__button", { "portfolio-filters__button--active": __props.activeFilter === filter.id }])}" data-v-e9cb9013>${ssrInterpolate(filter.name)}</button>`);
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
const PortfolioFilters = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-e9cb9013"]]);
const _sfc_main$3 = {
  __name: "TemplateCard",
  __ssrInlineRender: true,
  props: {
    template: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const buyTemplate = () => {
      alert(`\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u0448\u0430\u0431\u043B\u043E\u043D: ${template.title}
\u0426\u0435\u043D\u0430: ${template.price} \u0440\u0443\u0431.
\u0421\u0432\u044F\u0436\u0435\u043C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438 \u0434\u043B\u044F \u043E\u043F\u043B\u0430\u0442\u044B!`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "template-card" }, _attrs))} data-v-6bfd4f24><div class="template-card__image" data-v-6bfd4f24><img${ssrRenderAttr("src", __props.template.image)}${ssrRenderAttr("alt", __props.template.title)} loading="lazy" data-v-6bfd4f24>`);
      if (__props.template.popular) {
        _push(`<div class="template-card__badge" data-v-6bfd4f24>\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0439</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="template-card__content" data-v-6bfd4f24><div class="template-card__header" data-v-6bfd4f24><h3 class="template-card__title" data-v-6bfd4f24>${ssrInterpolate(__props.template.title)}</h3><div class="template-card__price" data-v-6bfd4f24>${ssrInterpolate(__props.template.price.toLocaleString())} \u20BD</div></div><p class="template-card__description" data-v-6bfd4f24>${ssrInterpolate(__props.template.description)}</p><div class="template-card__features" data-v-6bfd4f24><!--[-->`);
      ssrRenderList(__props.template.features, (feature, idx) => {
        _push(`<span class="template-card__feature" data-v-6bfd4f24>${ssrInterpolate(feature)}</span>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(Button, {
        class: "template-card__button button button--primary",
        onClick: buyTemplate
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u041A\u0443\u043F\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D `);
          } else {
            return [
              createTextVNode(" \u041A\u0443\u043F\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D ")
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
const TemplateCard = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-6bfd4f24"]]);
const __default__ = {
  data() {
    return {
      filters: [
        { id: "all", name: "\u0412\u0441\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u044B" },
        { id: "landing", name: "\u041B\u0435\u043D\u0434\u0438\u043D\u0433\u0438" },
        { id: "corporate", name: "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0435" },
        { id: "shop", name: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D\u044B" },
        { id: "blog", name: "\u0411\u043B\u043E\u0433\u0438" }
      ]
    };
  }
};
const _sfc_main$2 = /* @__PURE__ */ Object.assign(__default__, {
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
    const templates = ref([
      {
        id: 1,
        title: "\u0421\u0442\u0430\u0440\u0442\u0430\u043F \u041B\u0435\u043D\u0434\u0438\u043D\u0433",
        type: "landing",
        price: 12e3,
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 \u043B\u0435\u043D\u0434\u0438\u043D\u0433 \u0434\u043B\u044F IT-\u0441\u0442\u0430\u0440\u0442\u0430\u043F\u043E\u0432 \u0438 \u0441\u0435\u0440\u0432\u0438\u0441\u043E\u0432",
        features: ["\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u044B\u0439", "\u0424\u043E\u0440\u043C\u0430 \u0437\u0430\u044F\u0432\u043A\u0438", "\u0410\u043D\u0438\u043C\u0430\u0446\u0438\u0438", "SEO"],
        popular: true
      },
      {
        id: 2,
        title: "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0441\u0430\u0439\u0442",
        type: "corporate",
        price: 25e3,
        image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80",
        description: "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0430\u0439\u0442 \u0434\u043B\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0439 \u0438 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0439",
        features: ["5+ \u0441\u0442\u0440\u0430\u043D\u0438\u0446", "\u0411\u043B\u043E\u0433", "\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0443\u0441\u043B\u0443\u0433", "CMS"],
        popular: true
      },
      {
        id: 3,
        title: "\u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D",
        type: "shop",
        price: 35e3,
        image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=800&q=80",
        description: "\u041F\u043E\u043B\u043D\u043E\u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0441 \u043A\u043E\u0440\u0437\u0438\u043D\u043E\u0439 \u0438 \u043E\u043F\u043B\u0430\u0442\u043E\u0439",
        features: ["\u041A\u0430\u0442\u0430\u043B\u043E\u0433", "\u0424\u0438\u043B\u044C\u0442\u0440\u044B", "\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442", "\u041E\u043F\u043B\u0430\u0442\u0430"],
        popular: false
      },
      {
        id: 4,
        title: "\u0411\u043B\u043E\u0433 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430",
        type: "blog",
        price: 18e3,
        image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=800&q=80",
        description: "\u042D\u043B\u0435\u0433\u0430\u043D\u0442\u043D\u044B\u0439 \u0431\u043B\u043E\u0433 \u0434\u043B\u044F \u043A\u043E\u043D\u0442\u0435\u043D\u0442-\u043C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433\u0430",
        features: ["\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438", "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438", "\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430", "\u041F\u043E\u0438\u0441\u043A"],
        popular: true
      },
      {
        id: 5,
        title: "\u041B\u0435\u043D\u0434\u0438\u043D\u0433 \u0443\u0441\u043B\u0443\u0433",
        type: "landing",
        price: 1e4,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        description: "\u041F\u0440\u043E\u0434\u0430\u044E\u0449\u0438\u0439 \u043B\u0435\u043D\u0434\u0438\u043D\u0433 \u0434\u043B\u044F \u0443\u0441\u043B\u0443\u0433 \u0438 \u0441\u0435\u0440\u0432\u0438\u0441\u043E\u0432",
        features: ["\u041F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E", "\u041E\u0442\u0437\u044B\u0432\u044B", "\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440", "\u0422\u0430\u0440\u0438\u0444\u044B"],
        popular: false
      },
      {
        id: 6,
        title: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u0438\u043A\u0438",
        type: "shop",
        price: 4e4,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0442\u0435\u0445\u043D\u0438\u043A\u0438 \u0438 \u0433\u0430\u0434\u0436\u0435\u0442\u043E\u0432",
        features: ["\u0424\u0438\u043B\u044C\u0442\u0440\u044B", "\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435", "\u0410\u043A\u0446\u0438\u0438", "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430"],
        popular: true
      },
      {
        id: 7,
        title: "\u0410\u0433\u0435\u043D\u0442\u0441\u0442\u0432\u043E \u043D\u0435\u0434\u0432\u0438\u0436\u0438\u043C\u043E\u0441\u0442\u0438",
        type: "corporate",
        price: 28e3,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u0430\u0439\u0442 \u0434\u043B\u044F \u0440\u0438\u044D\u043B\u0442\u043E\u0440\u0441\u043A\u0438\u0445 \u0443\u0441\u043B\u0443\u0433 \u0438 \u0430\u0433\u0435\u043D\u0442\u0441\u0442\u0432",
        features: ["\u041A\u0430\u0442\u0430\u043B\u043E\u0433", "\u041A\u0430\u0440\u0442\u0430", "\u0424\u0438\u043B\u044C\u0442\u0440\u044B", "\u0417\u0430\u044F\u0432\u043A\u0438"],
        popular: false
      },
      {
        id: 8,
        title: "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444 \u043F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E",
        type: "landing",
        price: 15e3,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u0442\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u0430\u0439\u0442-\u043F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E \u0434\u043B\u044F \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u043E\u0432",
        features: ["\u0413\u0430\u043B\u0435\u0440\u0435\u044F", "\u0426\u0435\u043D\u044B", "\u0411\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435", "\u041E\u0442\u0437\u044B\u0432\u044B"],
        popular: true
      },
      {
        id: 9,
        title: "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D \u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430",
        type: "shop",
        price: 32e3,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u0430\u0439\u0442 \u0434\u043B\u044F \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u043E\u0432 \u0441 \u043E\u043D\u043B\u0430\u0439\u043D-\u0437\u0430\u043A\u0430\u0437\u043E\u043C \u0435\u0434\u044B",
        features: ["\u041C\u0435\u043D\u044E", "\u041A\u043E\u0440\u0437\u0438\u043D\u0430", "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430", "\u041E\u043D\u043B\u0430\u0439\u043D-\u043E\u043F\u043B\u0430\u0442\u0430"],
        popular: true
      },
      {
        id: 10,
        title: "\u0424\u0438\u0442\u043D\u0435\u0441 \u043A\u043B\u0443\u0431",
        type: "corporate",
        price: 22e3,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u0430\u0439\u0442 \u0434\u043B\u044F \u0444\u0438\u0442\u043D\u0435\u0441-\u0446\u0435\u043D\u0442\u0440\u043E\u0432 \u0438 \u0441\u043F\u043E\u0440\u0442\u0437\u0430\u043B\u043E\u0432",
        features: ["\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435", "\u0422\u0440\u0435\u043D\u0435\u0440\u044B", "\u0410\u0431\u043E\u043D\u0435\u043C\u0435\u043D\u0442\u044B", "\u0417\u0430\u043F\u0438\u0441\u044C"],
        popular: false
      },
      {
        id: 11,
        title: "\u041E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430",
        type: "corporate",
        price: 38e3,
        image: "https://images.unsplash.com/photo-1522881193457-37ae97c905bf?auto=format&fit=crop&w=800&q=80",
        description: "\u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0434\u043B\u044F \u043E\u043D\u043B\u0430\u0439\u043D-\u043A\u0443\u0440\u0441\u043E\u0432 \u0438 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F",
        features: ["\u041A\u0443\u0440\u0441\u044B", "\u0412\u0438\u0434\u0435\u043E\u043B\u0435\u043A\u0446\u0438\u0438", "\u0422\u0435\u0441\u0442\u044B", "\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u044B"],
        popular: true
      },
      {
        id: 12,
        title: "\u0410\u0432\u0442\u043E\u0441\u0430\u043B\u043E\u043D",
        type: "shop",
        price: 42e3,
        image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u0430\u0439\u0442 \u0434\u043B\u044F \u0430\u0432\u0442\u043E\u0441\u0430\u043B\u043E\u043D\u043E\u0432 \u0438 \u043F\u0440\u043E\u0434\u0430\u0436\u0438 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u0435\u0439",
        features: ["\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0430\u0432\u0442\u043E", "\u0424\u0438\u043B\u044C\u0442\u0440\u044B", "\u041A\u0440\u0435\u0434\u0438\u0442\u043D\u044B\u0439 \u043A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440", "Trade-in"],
        popular: true
      },
      {
        id: 13,
        title: "\u041C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u0438\u0439 \u0446\u0435\u043D\u0442\u0440",
        type: "corporate",
        price: 26e3,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u0430\u0439\u0442 \u0434\u043B\u044F \u043A\u043B\u0438\u043D\u0438\u043A \u0438 \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u0438\u0445 \u0443\u0441\u043B\u0443\u0433",
        features: ["\u0423\u0441\u043B\u0443\u0433\u0438", "\u0412\u0440\u0430\u0447\u0438", "\u0417\u0430\u043F\u0438\u0441\u044C \u043E\u043D\u043B\u0430\u0439\u043D", "\u041E\u0442\u0437\u044B\u0432\u044B"],
        popular: false
      },
      {
        id: 14,
        title: "\u0422\u0443\u0440\u0430\u0433\u0435\u043D\u0442\u0441\u0442\u0432\u043E",
        type: "landing",
        price: 18e3,
        image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80",
        description: "\u041F\u0440\u043E\u0434\u0430\u044E\u0449\u0438\u0439 \u043B\u0435\u043D\u0434\u0438\u043D\u0433 \u0434\u043B\u044F \u0442\u0443\u0440\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0443\u0441\u043B\u0443\u0433",
        features: ["\u0422\u0443\u0440\u044B", "\u0413\u043E\u0440\u044F\u0449\u0438\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F", "\u041E\u043D\u043B\u0430\u0439\u043D-\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435", "\u041E\u0442\u0437\u044B\u0432\u044B"],
        popular: true
      },
      {
        id: 15,
        title: "\u0421\u0442\u0440\u043E\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F",
        type: "corporate",
        price: 3e4,
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        description: "\u0421\u0430\u0439\u0442 \u0434\u043B\u044F \u0441\u0442\u0440\u043E\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u0444\u0438\u0440\u043C \u0438 \u0437\u0430\u0441\u0442\u0440\u043E\u0439\u0449\u0438\u043A\u043E\u0432",
        features: ["\u041F\u0440\u043E\u0435\u043A\u0442\u044B", "\u0423\u0441\u043B\u0443\u0433\u0438", "\u041F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E", "\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440"],
        popular: false
      },
      {
        id: 16,
        title: "\u042E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0443\u0441\u043B\u0443\u0433\u0438",
        type: "landing",
        price: 14e3,
        image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80",
        description: "\u041B\u0435\u043D\u0434\u0438\u043D\u0433 \u0434\u043B\u044F \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0439 \u0438 \u0430\u0434\u0432\u043E\u043A\u0430\u0442\u043E\u0432",
        features: ["\u0423\u0441\u043B\u0443\u0433\u0438", "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u044B", "\u041E\u0442\u0437\u044B\u0432\u044B", "\u041A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0438\u044F"],
        popular: true
      }
    ]);
    const filteredTemplates = computed(() => {
      if (props.activeFilter === "all") return templates.value;
      return templates.value.filter((t) => t.type === props.activeFilter);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-grid" }, _attrs))} data-v-e164e54d><div class="portfolio-grid__container container" data-v-e164e54d><div class="portfolio-grid__header" data-v-e164e54d><h2 class="portfolio-grid__title" data-v-e164e54d>${ssrInterpolate(filteredTemplates.value.length)} \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432 `);
      if (__props.activeFilter !== "all") {
        _push(`<span data-v-e164e54d>\u0432 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 &quot;${ssrInterpolate((_a = _ctx.filters.find((f) => f.id === __props.activeFilter)) == null ? void 0 : _a.name)}&quot;</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</h2></div><div class="portfolio-grid__content" data-v-e164e54d><!--[-->`);
      ssrRenderList(filteredTemplates.value, (template2) => {
        _push(ssrRenderComponent(TemplateCard, {
          key: template2.id,
          template: template2
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/PortfolioGrid.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const PortfolioGrid = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-e164e54d"]]);
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
  __name: "portfolio",
  __ssrInlineRender: true,
  setup(__props) {
    const activeFilter = ref("all");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "portfolio-page" }, _attrs))} data-v-61094dea>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/portfolio.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const portfolio = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-61094dea"]]);

export { portfolio as default };
//# sourceMappingURL=portfolio-B2XEkvOC.mjs.map
