import { b as buildAssetsURL } from '../nitro/nitro.mjs';
import { mergeProps, withCtx, createTextVNode, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { B as Button } from './Button-BkOV6FTV.mjs';
import { _ as _export_sfc } from './server.mjs';
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
import 'vue-router';
import 'vue3-tel-input';

const _imports_0 = "" + buildAssetsURL("hero.kWZNhF4T.jpeg");
const _sfc_main$7 = {
  __name: "Hero",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero" }, _attrs))} data-v-b0918ce5><div class="hero__container container" data-v-b0918ce5><div class="hero__content" data-v-b0918ce5><h1 class="hero__title" data-v-b0918ce5> \u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0430\u0439\u0442\u044B <br data-v-b0918ce5><span class="text-accent" data-v-b0918ce5>15 000 \u0440\u0443\u0431\u043B\u0435\u0439</span></h1><p class="hero__subtitle" data-v-b0918ce5>\u0420\u0430\u0437\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u043C \u043F\u0440\u043E\u0434\u0430\u044E\u0449\u0438\u0435 \u0441\u0430\u0439\u0442\u044B \u0437\u0430\xA01\xA0\u0434\u0435\u043D\u044C \u0441\xA0\u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0435\u0439 1\xA0\u0433\u043E\u0434</p><div class="hero__actions" data-v-b0918ce5>`);
      _push(ssrRenderComponent(Button, {
        size: "lg",
        variant: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443`);
          } else {
            return [
              createTextVNode("\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443")
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
            _push2(`\u0417\u0430\u043A\u0430\u0437\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D`);
          } else {
            return [
              createTextVNode("\u0417\u0430\u043A\u0430\u0437\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D")
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
        _push(`<div class="service-card__badge" data-v-b5871940>\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E</div>`);
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
            _push2(`\u0417\u0430\u043A\u0430\u0437\u0430\u0442\u044C`);
          } else {
            return [
              createTextVNode("\u0417\u0430\u043A\u0430\u0437\u0430\u0442\u044C")
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
        title: "\u041B\u0435\u043D\u0434\u0438\u043D\u0433",
        price: "10 000 \u20BD",
        features: ["1 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430", "\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u044B\u0439 \u0434\u0438\u0437\u0430\u0439\u043D", "\u0424\u043E\u0440\u043C\u0430 \u0437\u0430\u044F\u0432\u043A\u0438"],
        popular: true
      },
      {
        title: "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0441\u0430\u0439\u0442",
        price: "25 000 \u20BD",
        features: ["5-10 \u0441\u0442\u0440\u0430\u043D\u0438\u0446", "CMS \u0441\u0438\u0441\u0442\u0435\u043C\u0430", "SEO \u0431\u0430\u0437\u0430"],
        popular: false
      },
      {
        title: "\u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D",
        price: "45 000 \u20BD",
        features: ["\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0442\u043E\u0432\u0430\u0440\u043E\u0432", "\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u0438 \u043E\u043F\u043B\u0430\u0442\u0430", "\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442"],
        popular: true
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "services section" }, _attrs))} data-v-b71208da><div class="container" data-v-b71208da><h2 class="section__title" data-v-b71208da>\u0427\u0442\u043E \u0441\u043E\u0437\u0434\u0430\u0435\u043C</h2><div class="services__grid" data-v-b71208da><!--[-->`);
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
            _push2(`\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435`);
          } else {
            return [
              createTextVNode("\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435")
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
        title: "\u0421\u0430\u0439\u0442 + \u0434\u043E\u043C\u0435\u043D \u0432 \u043F\u043E\u0434\u0430\u0440\u043E\u043A",
        desc: "\u041F\u0440\u0438 \u0437\u0430\u043A\u0430\u0437\u0435 \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u043C\u0435\u0441\u044F\u0446\u0430 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u0434\u043E\u043C\u0435\u043D \u043D\u0430 1 \u0433\u043E\u0434",
        deadline: "\u0414\u043E 30 \u043D\u043E\u044F\u0431\u0440\u044F"
      },
      {
        title: "SEO-\u043F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0432 \u043F\u043E\u0434\u0430\u0440\u043E\u043A",
        desc: "\u041F\u0440\u0438 \u0437\u0430\u043A\u0430\u0437\u0435 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0441\u0430\u0439\u0442\u0430 3 \u043C\u0435\u0441\u044F\u0446\u0430 SEO \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",
        deadline: "\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C 12 \u043C\u0435\u0441\u0442"
      },
      {
        title: "\u0421\u043A\u0438\u0434\u043A\u0430 20% \u043D\u0430 \u0432\u0442\u043E\u0440\u043E\u0439 \u0441\u0430\u0439\u0442",
        desc: "\u041F\u0440\u0438 \u0437\u0430\u043A\u0430\u0437\u0435 \u0434\u0432\u0443\u0445 \u0441\u0430\u0439\u0442\u043E\u0432 \u0441\u043A\u0438\u0434\u043A\u0430 \u043D\u0430 \u0432\u0442\u043E\u0440\u043E\u0439 \u043F\u0440\u043E\u0435\u043A\u0442",
        deadline: "\u0411\u0435\u0437 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0439"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "promo section section--gray" }, _attrs))} data-v-5d20618b><div class="container" data-v-5d20618b><h2 class="section__title" data-v-5d20618b>\u0413\u043E\u0440\u044F\u0447\u0438\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F</h2><div class="promo__grid" data-v-5d20618b><!--[-->`);
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
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "features section" }, _attrs))} data-v-9030a428><div class="container" data-v-9030a428><h2 class="section__title" data-v-9030a428>\u041F\u043E\u0447\u0435\u043C\u0443 \u043C\u044B</h2><ul class="features__list" data-v-9030a428><li class="feature" data-v-9030a428><div class="feature__icon" data-v-9030a428>\u{1F680}</div><h3 class="feature__title" data-v-9030a428>\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C</h3><p class="feature__desc" data-v-9030a428>\u0421\u0430\u0439\u0442 \u0437\u0430 5 \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u0434\u043D\u0435\u0439</p></li><li class="feature" data-v-9030a428><div class="feature__icon" data-v-9030a428>\u{1F6E1}\uFE0F</div><h3 class="feature__title" data-v-9030a428>\u0413\u0430\u0440\u0430\u043D\u0442\u0438\u044F</h3><p class="feature__desc" data-v-9030a428>1 \u0433\u043E\u0434 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438</p></li><li class="feature" data-v-9030a428><div class="feature__icon" data-v-9030a428>\u{1F4BC}</div><h3 class="feature__title" data-v-9030a428>\u041E\u043F\u044B\u0442</h3><p class="feature__desc" data-v-9030a428>120+ \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432 \u0437\u0430 3 \u0433\u043E\u0434\u0430</p></li></ul></div></section>`);
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
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "leadform" }, _attrs))} data-v-05594a2b><div class="leadform__container container" data-v-05594a2b><div class="leadform__header" data-v-05594a2b><h2 class="leadform__title" data-v-05594a2b>\u0417\u0430\u043A\u0430\u0436\u0438 \u0441\u0430\u0439\u0442</h2><p class="leadform__subtitle" data-v-05594a2b>\u041E\u0441\u0442\u0430\u0432\u044C \u0437\u0430\u044F\u0432\u043A\u0443 \u0438 \u043F\u043E\u043B\u0443\u0447\u0438 \u043A\u043E\u043C\u043C\u0435\u0440\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u0434\u043D\u044F</p></div><div class="leadform__content" data-v-05594a2b><div class="leadform__benefits" data-v-05594a2b><div class="leadform-benefit" data-v-05594a2b><div class="leadform-benefit__icon" data-v-05594a2b>\u{1F680}</div><div class="leadform-benefit__content" data-v-05594a2b><h3 class="leadform-benefit__title" data-v-05594a2b>\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C</h3><p class="leadform-benefit__desc" data-v-05594a2b>\u041B\u0435\u043D\u0434\u0438\u043D\u0433 \u0437\u0430 3 \u0434\u043D\u044F, \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0437\u0430 \u043D\u0435\u0434\u0435\u043B\u044E</p></div></div><div class="leadform-benefit" data-v-05594a2b><div class="leadform-benefit__icon" data-v-05594a2b>\u{1F4B8}</div><div class="leadform-benefit__content" data-v-05594a2b><h3 class="leadform-benefit__title" data-v-05594a2b>\u0411\u0435\u0437 \u043F\u0440\u0435\u0434\u043E\u043F\u043B\u0430\u0442\u044B</h3><p class="leadform-benefit__desc" data-v-05594a2b>\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u0438\u043D\u044F\u0442\u0438\u044F \u043C\u0430\u043A\u0435\u0442\u0430</p></div></div><div class="leadform-benefit" data-v-05594a2b><div class="leadform-benefit__icon" data-v-05594a2b>\u{1F6E1}\uFE0F</div><div class="leadform-benefit__content" data-v-05594a2b><h3 class="leadform-benefit__title" data-v-05594a2b>\u0413\u0430\u0440\u0430\u043D\u0442\u0438\u044F</h3><p class="leadform-benefit__desc" data-v-05594a2b>\u0418\u0441\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C \u0431\u0430\u0433\u0438 \u0433\u043E\u0434 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E</p></div></div></div><div class="leadform__form" data-v-05594a2b>`);
      if (isSubmitted.value) {
        _push(`<div class="leadform-success" data-v-05594a2b><h3 class="leadform-success__title" data-v-05594a2b>\u0417\u0430\u044F\u0432\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430!</h3><p class="leadform-success__text" data-v-05594a2b> \u0421\u043A\u043E\u0440\u043E \u0441\u0432\u044F\u0436\u0435\u043C\u0441\u044F \u0441 \u0442\u043E\u0431\u043E\u0439. \u0410 \u043F\u043E\u043A\u0430 \u043C\u043E\u0436\u0435\u0448\u044C \u043D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 Telegram \u0434\u043B\u044F \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u043E\u0442\u0432\u0435\u0442\u0430: </p><a href="https://t.me/dozer_stoun" class="button button--primary leadform-success__link" target="_blank" data-v-05594a2b> \u2708\uFE0F \u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 Telegram </a></div>`);
      } else {
        _push(`<form class="leadform-form" data-v-05594a2b><div class="leadform-form__group" data-v-05594a2b><input type="text"${ssrRenderAttr("value", name.value)} class="leadform-form__input" placeholder="\u041A\u0430\u043A \u0442\u0435\u0431\u044F \u0437\u043E\u0432\u0443\u0442?" required data-v-05594a2b></div><div class="leadform-form__group" data-v-05594a2b><input type="text"${ssrRenderAttr("value", contact.value)} class="leadform-form__input" placeholder="\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u0438\u043B\u0438 Telegram" required data-v-05594a2b></div><div class="leadform-form__group" data-v-05594a2b><textarea class="leadform-form__textarea" placeholder="\u041E\u043F\u0438\u0448\u0438 \u043A\u0440\u0430\u0442\u043A\u043E \u0437\u0430\u0434\u0430\u0447\u0443..." rows="3" data-v-05594a2b>${ssrInterpolate(message.value)}</textarea></div><button type="submit" class="button button--primary button--lg leadform-form__button"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} data-v-05594a2b>`);
        if (isSubmitting.value) {
          _push(`<span data-v-05594a2b>\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C...</span>`);
        } else {
          _push(`<span data-v-05594a2b>\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435</span>`);
        }
        _push(`</button><div class="leadform-form__note" data-v-05594a2b> \u041D\u0430\u0436\u0438\u043C\u0430\u044F \u043A\u043D\u043E\u043F\u043A\u0443, \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u0435\u0448\u044C\u0441\u044F \u0441 \u043D\u0430\u0448\u0435\u0439 <a href="#" class="leadform-form__link" data-v-05594a2b>\u043F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438</a></div></form>`);
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

export { _sfc_main as default };
//# sourceMappingURL=index-BmyVNcHF.mjs.map
