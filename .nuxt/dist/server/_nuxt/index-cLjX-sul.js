import { mergeProps, withCtx, createTextVNode, useSSRContext, ref } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { B as Button } from "./Button-BkOV6FTV.js";
import { _ as _export_sfc } from "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/hookable/dist/index.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unctx/dist/index.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/radix3/dist/index.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ufo/dist/index.mjs";
import "/Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/klona/dist/index.mjs";
const _imports_0 = "" + __buildAssetsURL("hero.kWZNhF4T.jpeg");
const _sfc_main$7 = {
  __name: "Hero",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero" }, _attrs))} data-v-b0918ce5><div class="hero__container container" data-v-b0918ce5><div class="hero__content" data-v-b0918ce5><h1 class="hero__title" data-v-b0918ce5> Профессиональные сайты <br data-v-b0918ce5><span class="text-accent" data-v-b0918ce5>15 000 рублей</span></h1><p class="hero__subtitle" data-v-b0918ce5>Разрабатываем продающие сайты за 1 день с гарантией 1 год</p><div class="hero__actions" data-v-b0918ce5>`);
      _push(ssrRenderComponent(Button, {
        size: "lg",
        variant: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Оставить заявку`);
          } else {
            return [
              createTextVNode("Оставить заявку")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(Button, {
        size: "lg",
        variant: "outline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Заказать шаблон`);
          } else {
            return [
              createTextVNode("Заказать шаблон")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="hero__image" data-v-b0918ce5><div class="mockup" data-v-b0918ce5><img class="mockup__screen"${ssrRenderAttr("src", _imports_0)} data-v-b0918ce5><div class="mockup__bar" data-v-b0918ce5></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/Hero.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Hero = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-b0918ce5"]]);
const _sfc_main$6 = {
  __name: "ServiceCard",
  __ssrInlineRender: true,
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiButton = Button;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "service-card" }, _attrs))} data-v-b5871940><div class="service-card__header" data-v-b5871940><h3 class="service-card__title" data-v-b5871940>${ssrInterpolate(__props.service.title)}</h3><div class="service-card__price" data-v-b5871940>${ssrInterpolate(__props.service.price)}</div>`);
      if (__props.service.popular) {
        _push(`<div class="service-card__badge" data-v-b5871940>Популярно</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><ul class="service-card__features" data-v-b5871940><!--[-->`);
      ssrRenderList(__props.service.features, (feature, idx) => {
        _push(`<li class="service-card__feature" data-v-b5871940>${ssrInterpolate(feature)}</li>`);
      });
      _push(`<!--]--></ul>`);
      _push(ssrRenderComponent(_component_UiButton, {
        class: "service-card__button",
        variant: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Заказать`);
          } else {
            return [
              createTextVNode("Заказать")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ServiceCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ServiceCard = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-b5871940"]]);
const _sfc_main$5 = {
  __name: "Services",
  __ssrInlineRender: true,
  setup(__props) {
    const services = [
      {
        title: "Лендинг",
        price: "10 000 ₽",
        features: ["1 страница", "Адаптивный дизайн", "Форма заявки"],
        popular: true
      },
      {
        title: "Корпоративный сайт",
        price: "25 000 ₽",
        features: ["5-10 страниц", "CMS система", "SEO база"],
        popular: false
      },
      {
        title: "Интернет-магазин",
        price: "45 000 ₽",
        features: ["Каталог товаров", "Корзина и оплата", "Личный кабинет"],
        popular: true
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "services section" }, _attrs))} data-v-b71208da><div class="container" data-v-b71208da><h2 class="section__title" data-v-b71208da>Что создаем</h2><div class="services__grid" data-v-b71208da><!--[-->`);
      ssrRenderList(services, (service, index) => {
        _push(ssrRenderComponent(ServiceCard, {
          key: index,
          service
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/Services.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const Services = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-b71208da"]]);
const _sfc_main$4 = {
  __name: "PromoCard",
  __ssrInlineRender: true,
  props: {
    promo: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "promo-card" }, _attrs))} data-v-6b02a7df><h3 class="promo-card__title" data-v-6b02a7df>${ssrInterpolate(__props.promo.title)}</h3><p class="promo-card__desc" data-v-6b02a7df>${ssrInterpolate(__props.promo.desc)}</p><div class="promo-card__deadline" data-v-6b02a7df>${ssrInterpolate(__props.promo.deadline)}</div>`);
      _push(ssrRenderComponent(Button, { variant: "outline" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Подробнее`);
          } else {
            return [
              createTextVNode("Подробнее")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/PromoCard.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const PromoCard = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-6b02a7df"]]);
const _sfc_main$3 = {
  __name: "Promo",
  __ssrInlineRender: true,
  setup(__props) {
    const promos = [
      {
        title: "Сайт + домен в подарок",
        desc: "При заказе до конца месяца бесплатный домен на 1 год",
        deadline: "До 30 ноября"
      },
      {
        title: "SEO-продвижение в подарок",
        desc: "При заказе корпоративного сайта 3 месяца SEO бесплатно",
        deadline: "Осталось 12 мест"
      },
      {
        title: "Скидка 20% на второй сайт",
        desc: "При заказе двух сайтов скидка на второй проект",
        deadline: "Без ограничений"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "promo section section--gray" }, _attrs))} data-v-5d20618b><div class="container" data-v-5d20618b><h2 class="section__title" data-v-5d20618b>Горячие предложения</h2><div class="promo__grid" data-v-5d20618b><!--[-->`);
      ssrRenderList(promos, (promo, index) => {
        _push(ssrRenderComponent(PromoCard, {
          key: index,
          promo
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/Promo.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Promo = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-5d20618b"]]);
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "features section" }, _attrs))} data-v-9030a428><div class="container" data-v-9030a428><h2 class="section__title" data-v-9030a428>Почему мы</h2><ul class="features__list" data-v-9030a428><li class="feature" data-v-9030a428><div class="feature__icon" data-v-9030a428>🚀</div><h3 class="feature__title" data-v-9030a428>Скорость</h3><p class="feature__desc" data-v-9030a428>Сайт за 5 рабочих дней</p></li><li class="feature" data-v-9030a428><div class="feature__icon" data-v-9030a428>🛡️</div><h3 class="feature__title" data-v-9030a428>Гарантия</h3><p class="feature__desc" data-v-9030a428>1 год технической поддержки</p></li><li class="feature" data-v-9030a428><div class="feature__icon" data-v-9030a428>💼</div><h3 class="feature__title" data-v-9030a428>Опыт</h3><p class="feature__desc" data-v-9030a428>120+ проектов за 3 года</p></li></ul></div></section>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/Features.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Features = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-9030a428"]]);
const _sfc_main$1 = {
  __name: "LeadForm",
  __ssrInlineRender: true,
  setup(__props) {
    const name = ref("");
    const contact = ref("");
    const message = ref("");
    const isSubmitting = ref(false);
    const isSubmitted = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "leadform" }, _attrs))} data-v-05594a2b><div class="leadform__container container" data-v-05594a2b><div class="leadform__header" data-v-05594a2b><h2 class="leadform__title" data-v-05594a2b>Закажи сайт</h2><p class="leadform__subtitle" data-v-05594a2b>Оставь заявку и получи коммерческое предложение в течение дня</p></div><div class="leadform__content" data-v-05594a2b><div class="leadform__benefits" data-v-05594a2b><div class="leadform-benefit" data-v-05594a2b><div class="leadform-benefit__icon" data-v-05594a2b>🚀</div><div class="leadform-benefit__content" data-v-05594a2b><h3 class="leadform-benefit__title" data-v-05594a2b>Скорость</h3><p class="leadform-benefit__desc" data-v-05594a2b>Лендинг за 3 дня, магазин за неделю</p></div></div><div class="leadform-benefit" data-v-05594a2b><div class="leadform-benefit__icon" data-v-05594a2b>💸</div><div class="leadform-benefit__content" data-v-05594a2b><h3 class="leadform-benefit__title" data-v-05594a2b>Без предоплаты</h3><p class="leadform-benefit__desc" data-v-05594a2b>Оплата после принятия макета</p></div></div><div class="leadform-benefit" data-v-05594a2b><div class="leadform-benefit__icon" data-v-05594a2b>🛡️</div><div class="leadform-benefit__content" data-v-05594a2b><h3 class="leadform-benefit__title" data-v-05594a2b>Гарантия</h3><p class="leadform-benefit__desc" data-v-05594a2b>Исправляем баги год бесплатно</p></div></div></div><div class="leadform__form" data-v-05594a2b>`);
      if (isSubmitted.value) {
        _push(`<div class="leadform-success" data-v-05594a2b><h3 class="leadform-success__title" data-v-05594a2b>Заявка отправлена!</h3><p class="leadform-success__text" data-v-05594a2b> Скоро свяжемся с тобой. А пока можешь написать в Telegram для быстрого ответа: </p><a href="https://t.me/dozer_stoun" class="button button--primary leadform-success__link" target="_blank" data-v-05594a2b> ✈️ Написать в Telegram </a></div>`);
      } else {
        _push(`<form class="leadform-form" data-v-05594a2b><div class="leadform-form__group" data-v-05594a2b><input type="text"${ssrRenderAttr("value", name.value)} class="leadform-form__input" placeholder="Как тебя зовут?" required data-v-05594a2b></div><div class="leadform-form__group" data-v-05594a2b><input type="text"${ssrRenderAttr("value", contact.value)} class="leadform-form__input" placeholder="Телефон или Telegram" required data-v-05594a2b></div><div class="leadform-form__group" data-v-05594a2b><textarea class="leadform-form__textarea" placeholder="Опиши кратко задачу..." rows="3" data-v-05594a2b>${ssrInterpolate(message.value)}</textarea></div><button type="submit" class="button button--primary button--lg leadform-form__button"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} data-v-05594a2b>`);
        if (isSubmitting.value) {
          _push(`<span data-v-05594a2b>Отправляем...</span>`);
        } else {
          _push(`<span data-v-05594a2b>Получить предложение</span>`);
        }
        _push(`</button><div class="leadform-form__note" data-v-05594a2b> Нажимая кнопку, соглашаешься с нашей <a href="#" class="leadform-form__link" data-v-05594a2b>политикой конфиденциальности</a></div></form>`);
      }
      _push(`</div></div></div></section>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/LeadForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const LeadForm = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-05594a2b"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))}><main>`);
      _push(ssrRenderComponent(Hero, null, null, _parent));
      _push(ssrRenderComponent(Services, null, null, _parent));
      _push(ssrRenderComponent(Promo, null, null, _parent));
      _push(ssrRenderComponent(Features, null, null, _parent));
      _push(ssrRenderComponent(LeadForm, null, null, _parent));
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-cLjX-sul.js.map
