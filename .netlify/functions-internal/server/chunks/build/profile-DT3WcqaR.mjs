import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main$4 = {
  __name: "ProfileInfo",
  __ssrInlineRender: true,
  setup(__props) {
    const user = ref({
      name: "\u0418\u0432\u0430\u043D \u0418\u0432\u0430\u043D\u043E\u0432",
      email: "ivan@example.com",
      phone: "+7 (999) 123-45-67",
      telegram: "@ivanov"
    });
    const isEditing = ref(false);
    const tempUser = ref({ ...user.value });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-info" }, _attrs))} data-v-23751153><div class="profile-info__header" data-v-23751153><h2 class="profile-info__title" data-v-23751153>\u041B\u0438\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</h2>`);
      if (!unref(isEditing)) {
        _push(`<button class="button button--outline" data-v-23751153> \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C </button>`);
      } else {
        _push(`<div class="profile-info__actions" data-v-23751153><button class="button button--outline" data-v-23751153> \u041E\u0442\u043C\u0435\u043D\u0430 </button><button class="button button--primary" data-v-23751153> \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C </button></div>`);
      }
      _push(`</div>`);
      if (!unref(isEditing)) {
        _push(`<div class="profile-info__content" data-v-23751153><div class="profile-info__item" data-v-23751153><span class="profile-info__label" data-v-23751153>\u0418\u043C\u044F:</span><span class="profile-info__value" data-v-23751153>${ssrInterpolate(unref(user).name)}</span></div><div class="profile-info__item" data-v-23751153><span class="profile-info__label" data-v-23751153>Email:</span><span class="profile-info__value" data-v-23751153>${ssrInterpolate(unref(user).email)}</span></div><div class="profile-info__item" data-v-23751153><span class="profile-info__label" data-v-23751153>\u0422\u0435\u043B\u0435\u0444\u043E\u043D:</span><span class="profile-info__value" data-v-23751153>${ssrInterpolate(unref(user).phone)}</span></div><div class="profile-info__item" data-v-23751153><span class="profile-info__label" data-v-23751153>Telegram:</span><span class="profile-info__value" data-v-23751153>${ssrInterpolate(unref(user).telegram)}</span></div></div>`);
      } else {
        _push(`<form class="profile-info__form" data-v-23751153><div class="profile-info__form-group" data-v-23751153><label class="profile-info__form-label" data-v-23751153>\u0418\u043C\u044F</label><input${ssrRenderAttr("value", unref(tempUser).name)} type="text" class="profile-info__form-input" data-v-23751153></div><div class="profile-info__form-group" data-v-23751153><label class="profile-info__form-label" data-v-23751153>Email</label><input${ssrRenderAttr("value", unref(tempUser).email)} type="email" class="profile-info__form-input" data-v-23751153></div><div class="profile-info__form-group" data-v-23751153><label class="profile-info__form-label" data-v-23751153>\u0422\u0435\u043B\u0435\u0444\u043E\u043D</label><input${ssrRenderAttr("value", unref(tempUser).phone)} type="tel" class="profile-info__form-input" data-v-23751153></div><div class="profile-info__form-group" data-v-23751153><label class="profile-info__form-label" data-v-23751153>Telegram</label><input${ssrRenderAttr("value", unref(tempUser).telegram)} type="text" class="profile-info__form-input" data-v-23751153></div></form>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileInfo.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const ProfileInfo = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-23751153"]]);
const _sfc_main$3 = {
  __name: "ProfileOrders",
  __ssrInlineRender: true,
  setup(__props) {
    const orders = ref([
      {
        id: "ORD-001",
        date: "15.07.2025",
        template: "\u0421\u0442\u0430\u0440\u0442\u0430\u043F \u041B\u0435\u043D\u0434\u0438\u043D\u0433",
        status: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D",
        price: "12 000 \u20BD"
      },
      {
        id: "ORD-002",
        date: "10.07.2025",
        template: "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0441\u0430\u0439\u0442",
        status: "\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435",
        price: "25 000 \u20BD"
      },
      {
        id: "ORD-003",
        date: "05.07.2025",
        template: "\u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D",
        status: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u043F\u043B\u0430\u0442\u044B",
        price: "35 000 \u20BD"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-orders" }, _attrs))} data-v-c058b596><h2 class="profile-orders__title" data-v-c058b596>\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B</h2><div class="profile-orders__table" data-v-c058b596><div class="profile-orders__row profile-orders__row--header" data-v-c058b596><div class="profile-orders__cell" data-v-c058b596>ID \u0437\u0430\u043A\u0430\u0437\u0430</div><div class="profile-orders__cell" data-v-c058b596>\u0414\u0430\u0442\u0430</div><div class="profile-orders__cell" data-v-c058b596>\u0428\u0430\u0431\u043B\u043E\u043D</div><div class="profile-orders__cell" data-v-c058b596>\u0421\u0442\u0430\u0442\u0443\u0441</div><div class="profile-orders__cell" data-v-c058b596>\u0421\u0443\u043C\u043C\u0430</div><div class="profile-orders__cell" data-v-c058b596>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</div></div><!--[-->`);
      ssrRenderList(unref(orders), (order) => {
        _push(`<div class="profile-orders__row" data-v-c058b596><div class="profile-orders__cell" data-v-c058b596>${ssrInterpolate(order.id)}</div><div class="profile-orders__cell" data-v-c058b596>${ssrInterpolate(order.date)}</div><div class="profile-orders__cell" data-v-c058b596>${ssrInterpolate(order.template)}</div><div class="profile-orders__cell" data-v-c058b596><span class="${ssrRenderClass([
          "profile-orders__status",
          `profile-orders__status--${order.status.toLowerCase()}`
        ])}" data-v-c058b596>${ssrInterpolate(order.status)}</span></div><div class="profile-orders__cell" data-v-c058b596>${ssrInterpolate(order.price)}</div><div class="profile-orders__cell" data-v-c058b596><button class="profile-orders__action" data-v-c058b596> \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 </button></div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileOrders.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ProfileOrders = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-c058b596"]]);
const _sfc_main$2 = {
  __name: "ProfileBalance",
  __ssrInlineRender: true,
  setup(__props) {
    const balance = ref(7500);
    const transactions = ref([
      {
        id: "TRX-001",
        date: "10.07.2025",
        description: "\u041F\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u0431\u0430\u043B\u0430\u043D\u0441\u0430",
        amount: "+10 000 \u20BD",
        type: "income"
      },
      {
        id: "TRX-002",
        date: "05.07.2025",
        description: "\u041E\u043F\u043B\u0430\u0442\u0430 \u0437\u0430\u043A\u0430\u0437\u0430 ORD-003",
        amount: "-2 500 \u20BD",
        type: "expense"
      },
      {
        id: "TRX-003",
        date: "01.07.2025",
        description: "\u0411\u043E\u043D\u0443\u0441 \u0437\u0430 \u043E\u0442\u0437\u044B\u0432",
        amount: "+500 \u20BD",
        type: "income"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-balance" }, _attrs))} data-v-3cc6d55b><div class="profile-balance__header" data-v-3cc6d55b><h2 class="profile-balance__title" data-v-3cc6d55b>\u0411\u0430\u043B\u0430\u043D\u0441</h2><div class="profile-balance__amount" data-v-3cc6d55b>${ssrInterpolate(unref(balance).toLocaleString())} \u20BD </div></div><button class="button button--primary profile-balance__button" data-v-3cc6d55b> \u041F\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0431\u0430\u043B\u0430\u043D\u0441 </button><div class="profile-balance__history" data-v-3cc6d55b><h3 class="profile-balance__subtitle" data-v-3cc6d55b>\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0439</h3><div class="profile-balance__list" data-v-3cc6d55b><!--[-->`);
      ssrRenderList(unref(transactions), (trx) => {
        _push(`<div class="profile-balance__item" data-v-3cc6d55b><div class="profile-balance__info" data-v-3cc6d55b><div class="profile-balance__date" data-v-3cc6d55b>${ssrInterpolate(trx.date)}</div><div class="profile-balance__desc" data-v-3cc6d55b>${ssrInterpolate(trx.description)}</div></div><div class="${ssrRenderClass([
          "profile-balance__sum",
          trx.type === "income" ? "profile-balance__sum--income" : "profile-balance__sum--expense"
        ])}" data-v-3cc6d55b>${ssrInterpolate(trx.amount)}</div></div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileBalance.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ProfileBalance = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-3cc6d55b"]]);
const _sfc_main$1 = {
  __name: "ProfileSettings",
  __ssrInlineRender: true,
  setup(__props) {
    const notifications = ref({
      email: true,
      telegram: true,
      sms: false
    });
    const security = ref({
      twoFactor: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-settings" }, _attrs))} data-v-7489b2d4><h2 class="profile-settings__title" data-v-7489b2d4>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h2><div class="profile-settings__section" data-v-7489b2d4><h3 class="profile-settings__subtitle" data-v-7489b2d4>\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</h3><div class="profile-settings__option" data-v-7489b2d4><div class="profile-settings__option-info" data-v-7489b2d4><div class="profile-settings__option-title" data-v-7489b2d4>Email \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</div><div class="profile-settings__option-desc" data-v-7489b2d4>\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u043F\u043E\u0447\u0442\u0443</div></div><label class="profile-settings__switch" data-v-7489b2d4><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(notifications).email) ? ssrLooseContain(unref(notifications).email, null) : unref(notifications).email) ? " checked" : ""} class="profile-settings__switch-input" data-v-7489b2d4><span class="profile-settings__switch-slider" data-v-7489b2d4></span></label></div><div class="profile-settings__option" data-v-7489b2d4><div class="profile-settings__option-info" data-v-7489b2d4><div class="profile-settings__option-title" data-v-7489b2d4>Telegram \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</div><div class="profile-settings__option-desc" data-v-7489b2d4>\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u0432\u0430\u0436\u043D\u044B\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0432 Telegram</div></div><label class="profile-settings__switch" data-v-7489b2d4><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(notifications).telegram) ? ssrLooseContain(unref(notifications).telegram, null) : unref(notifications).telegram) ? " checked" : ""} class="profile-settings__switch-input" data-v-7489b2d4><span class="profile-settings__switch-slider" data-v-7489b2d4></span></label></div><div class="profile-settings__option" data-v-7489b2d4><div class="profile-settings__option-info" data-v-7489b2d4><div class="profile-settings__option-title" data-v-7489b2d4>SMS \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</div><div class="profile-settings__option-desc" data-v-7489b2d4>\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u0432\u0430\u0436\u043D\u044B\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043F\u043E SMS</div></div><label class="profile-settings__switch" data-v-7489b2d4><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(notifications).sms) ? ssrLooseContain(unref(notifications).sms, null) : unref(notifications).sms) ? " checked" : ""} class="profile-settings__switch-input" data-v-7489b2d4><span class="profile-settings__switch-slider" data-v-7489b2d4></span></label></div></div><div class="profile-settings__section" data-v-7489b2d4><h3 class="profile-settings__subtitle" data-v-7489b2d4>\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C</h3><div class="profile-settings__option" data-v-7489b2d4><div class="profile-settings__option-info" data-v-7489b2d4><div class="profile-settings__option-title" data-v-7489b2d4>\u0414\u0432\u0443\u0445\u0444\u0430\u043A\u0442\u043E\u0440\u043D\u0430\u044F \u0430\u0443\u0442\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F</div><div class="profile-settings__option-desc" data-v-7489b2d4>\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0449\u0438\u0442\u0430 \u0432\u0430\u0448\u0435\u0433\u043E \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430</div></div><label class="profile-settings__switch" data-v-7489b2d4><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(security).twoFactor) ? ssrLooseContain(unref(security).twoFactor, null) : unref(security).twoFactor) ? " checked" : ""} class="profile-settings__switch-input" data-v-7489b2d4><span class="profile-settings__switch-slider" data-v-7489b2d4></span></label></div></div><div class="profile-settings__section" data-v-7489b2d4><h3 class="profile-settings__subtitle" data-v-7489b2d4>\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430</h3><button class="button button--danger" data-v-7489b2d4> \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442 </button></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileSettings.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProfileSettings = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7489b2d4"]]);
const _sfc_main = {
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("info");
    const tabs = [
      { id: "info", title: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C" },
      { id: "orders", title: "\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B" },
      { id: "balance", title: "\u0411\u0430\u043B\u0430\u043D\u0441" },
      { id: "settings", title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile" }, _attrs))} data-v-65c33268><div class="profile__header" data-v-65c33268><h1 class="profile__title" data-v-65c33268>\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442</h1><p class="profile__subtitle" data-v-65c33268>\u0423\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0441\u0432\u043E\u0438\u043C\u0438 \u0437\u0430\u043A\u0430\u0437\u0430\u043C\u0438 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C\u0438</p></div><div class="profile__tabs" data-v-65c33268><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass(["profile__tab", { "profile__tab--active": unref(activeTab) === tab.id }])}" data-v-65c33268>${ssrInterpolate(tab.title)}</button>`);
      });
      _push(`<!--]--></div><div class="profile__content" data-v-65c33268>`);
      if (unref(activeTab) === "info") {
        _push(ssrRenderComponent(ProfileInfo, null, null, _parent));
      } else if (unref(activeTab) === "orders") {
        _push(ssrRenderComponent(ProfileOrders, null, null, _parent));
      } else if (unref(activeTab) === "balance") {
        _push(ssrRenderComponent(ProfileBalance, null, null, _parent));
      } else {
        _push(ssrRenderComponent(ProfileSettings, null, null, _parent));
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-65c33268"]]);

export { profile as default };
//# sourceMappingURL=profile-DT3WcqaR.mjs.map
