import { mergeProps, useSSRContext, ref, unref, withCtx, createTextVNode, computed, isRef } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import { B as Button } from "./Button-BkOV6FTV.js";
import "ofetch";
import "#internal/nuxt/paths";
import "/home/gda/Documents/test/nexusbuild/node_modules/hookable/dist/index.mjs";
import "/home/gda/Documents/test/nexusbuild/node_modules/unctx/dist/index.mjs";
import "/home/gda/Documents/test/nexusbuild/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/gda/Documents/test/nexusbuild/node_modules/radix3/dist/index.mjs";
import "/home/gda/Documents/test/nexusbuild/node_modules/defu/dist/defu.mjs";
import "/home/gda/Documents/test/nexusbuild/node_modules/ufo/dist/index.mjs";
const title$1 = "Готовые шаблоны сайтов";
const subtitle$1 = "Выбери шаблон и получи сайт за 24 часа";
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
      { id: "all", name: "Все шаблоны" },
      { id: "landing", name: "Лендинги" },
      { id: "corporate", name: "Корпоративные" },
      { id: "shop", name: "Магазины" },
      { id: "blog", name: "Блоги" }
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
      alert(`Вы выбрали шаблон: ${template.title}
Цена: ${template.price} руб.
Свяжемся с вами для оплаты!`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "template-card" }, _attrs))} data-v-6bfd4f24><div class="template-card__image" data-v-6bfd4f24><img${ssrRenderAttr("src", __props.template.image)}${ssrRenderAttr("alt", __props.template.title)} loading="lazy" data-v-6bfd4f24>`);
      if (__props.template.popular) {
        _push(`<div class="template-card__badge" data-v-6bfd4f24>Популярный</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="template-card__content" data-v-6bfd4f24><div class="template-card__header" data-v-6bfd4f24><h3 class="template-card__title" data-v-6bfd4f24>${ssrInterpolate(__props.template.title)}</h3><div class="template-card__price" data-v-6bfd4f24>${ssrInterpolate(__props.template.price.toLocaleString())} ₽</div></div><p class="template-card__description" data-v-6bfd4f24>${ssrInterpolate(__props.template.description)}</p><div class="template-card__features" data-v-6bfd4f24><!--[-->`);
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
            _push2(` Купить шаблон `);
          } else {
            return [
              createTextVNode(" Купить шаблон ")
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
        { id: "all", name: "Все шаблоны" },
        { id: "landing", name: "Лендинги" },
        { id: "corporate", name: "Корпоративные" },
        { id: "shop", name: "Магазины" },
        { id: "blog", name: "Блоги" }
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
        title: "Стартап Лендинг",
        type: "landing",
        price: 12e3,
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
        description: "Современный лендинг для IT-стартапов и сервисов",
        features: ["Адаптивный", "Форма заявки", "Анимации", "SEO"],
        popular: true
      },
      {
        id: 2,
        title: "Корпоративный сайт",
        type: "corporate",
        price: 25e3,
        image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80",
        description: "Профессиональный сайт для компаний и организаций",
        features: ["5+ страниц", "Блог", "Каталог услуг", "CMS"],
        popular: true
      },
      {
        id: 3,
        title: "Интернет-магазин",
        type: "shop",
        price: 35e3,
        image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=800&q=80",
        description: "Полнофункциональный магазин с корзиной и оплатой",
        features: ["Каталог", "Фильтры", "Личный кабинет", "Оплата"],
        popular: false
      },
      {
        id: 4,
        title: "Блог платформа",
        type: "blog",
        price: 18e3,
        image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=800&q=80",
        description: "Элегантный блог для контент-маркетинга",
        features: ["Категории", "Комментарии", "Подписка", "Поиск"],
        popular: true
      },
      {
        id: 5,
        title: "Лендинг услуг",
        type: "landing",
        price: 1e4,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        description: "Продающий лендинг для услуг и сервисов",
        features: ["Портфолио", "Отзывы", "Калькулятор", "Тарифы"],
        popular: false
      },
      {
        id: 6,
        title: "Магазин электроники",
        type: "shop",
        price: 4e4,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
        description: "Специализированный магазин техники и гаджетов",
        features: ["Фильтры", "Сравнение", "Акции", "Доставка"],
        popular: true
      },
      {
        id: 7,
        title: "Агентство недвижимости",
        type: "corporate",
        price: 28e3,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        description: "Сайт для риэлторских услуг и агентств",
        features: ["Каталог", "Карта", "Фильтры", "Заявки"],
        popular: false
      },
      {
        id: 8,
        title: "Фотограф портфолио",
        type: "landing",
        price: 15e3,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
        description: "Стильный сайт-портфолио для фотографов",
        features: ["Галерея", "Цены", "Бронирование", "Отзывы"],
        popular: true
      },
      {
        id: 9,
        title: "Ресторан и доставка",
        type: "shop",
        price: 32e3,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        description: "Сайт для ресторанов с онлайн-заказом еды",
        features: ["Меню", "Корзина", "Доставка", "Онлайн-оплата"],
        popular: true
      },
      {
        id: 10,
        title: "Фитнес клуб",
        type: "corporate",
        price: 22e3,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        description: "Сайт для фитнес-центров и спортзалов",
        features: ["Расписание", "Тренеры", "Абонементы", "Запись"],
        popular: false
      },
      {
        id: 11,
        title: "Образовательная платформа",
        type: "corporate",
        price: 38e3,
        image: "https://images.unsplash.com/photo-1522881193457-37ae97c905bf?auto=format&fit=crop&w=800&q=80",
        description: "Платформа для онлайн-курсов и обучения",
        features: ["Курсы", "Видеолекции", "Тесты", "Сертификаты"],
        popular: true
      },
      {
        id: 12,
        title: "Автосалон",
        type: "shop",
        price: 42e3,
        image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80",
        description: "Сайт для автосалонов и продажи автомобилей",
        features: ["Каталог авто", "Фильтры", "Кредитный калькулятор", "Trade-in"],
        popular: true
      },
      {
        id: 13,
        title: "Медицинский центр",
        type: "corporate",
        price: 26e3,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        description: "Сайт для клиник и медицинских услуг",
        features: ["Услуги", "Врачи", "Запись онлайн", "Отзывы"],
        popular: false
      },
      {
        id: 14,
        title: "Турагентство",
        type: "landing",
        price: 18e3,
        image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80",
        description: "Продающий лендинг для туристических услуг",
        features: ["Туры", "Горящие предложения", "Онлайн-бронирование", "Отзывы"],
        popular: true
      },
      {
        id: 15,
        title: "Строительная компания",
        type: "corporate",
        price: 3e4,
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        description: "Сайт для строительных фирм и застройщиков",
        features: ["Проекты", "Услуги", "Портфолио", "Калькулятор"],
        popular: false
      },
      {
        id: 16,
        title: "Юридические услуги",
        type: "landing",
        price: 14e3,
        image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80",
        description: "Лендинг для юридических компаний и адвокатов",
        features: ["Услуги", "Специалисты", "Отзывы", "Консультация"],
        popular: true
      }
    ]);
    const filteredTemplates = computed(() => {
      if (props.activeFilter === "all") return templates.value;
      return templates.value.filter((t) => t.type === props.activeFilter);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-grid" }, _attrs))} data-v-e164e54d><div class="portfolio-grid__container container" data-v-e164e54d><div class="portfolio-grid__header" data-v-e164e54d><h2 class="portfolio-grid__title" data-v-e164e54d>${ssrInterpolate(filteredTemplates.value.length)} шаблонов `);
      if (__props.activeFilter !== "all") {
        _push(`<span data-v-e164e54d>в категории &quot;${ssrInterpolate((_a = _ctx.filters.find((f) => f.id === __props.activeFilter)) == null ? void 0 : _a.name)}&quot;</span>`);
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
const title = "Нужен уникальный дизайн?";
const subtitle = "Разработаем эксклюзивный сайт специально для вас";
const _sfc_main$1 = {
  __name: "PortfolioCTA",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-cta" }, _attrs))} data-v-f329e64b><div class="portfolio-cta__container container" data-v-f329e64b><div class="portfolio-cta__content" data-v-f329e64b><h2 class="portfolio-cta__title" data-v-f329e64b>${ssrInterpolate(title)}</h2><p class="portfolio-cta__subtitle" data-v-f329e64b>${ssrInterpolate(subtitle)}</p><button class="portfolio-cta__button button button--primary" data-v-f329e64b> Заказать дизайн </button></div></div></section>`);
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
export {
  portfolio as default
};
//# sourceMappingURL=portfolio-B2XEkvOC.js.map
