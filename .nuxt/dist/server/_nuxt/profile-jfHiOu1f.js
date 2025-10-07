import { ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrLooseContain, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc, u as useUserStore } from "../server.mjs";
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
const _sfc_main$4 = {
  __name: "ProfileInfo",
  __ssrInlineRender: true,
  setup(__props) {
    useUserStore();
    const user = ref({
      name: "Иван Иванов",
      email: "ivan@example.com",
      phone: "+7 (999) 123-45-67",
      telegram: "@ivanov"
    });
    const isEditing = ref(false);
    const tempUser = ref({ ...user.value });
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-info" }, _attrs))} data-v-9f526a4a><div class="profile-info__header" data-v-9f526a4a><h2 class="profile-info__title" data-v-9f526a4a>Личные данные</h2>`);
      if (!unref(isEditing)) {
        _push(`<button class="button button--outline" data-v-9f526a4a> Редактировать </button>`);
      } else {
        _push(`<div class="profile-info__actions" data-v-9f526a4a><button class="button button--outline" data-v-9f526a4a> Отмена </button><button class="button button--primary"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-9f526a4a>${ssrInterpolate(unref(loading) ? "Сохранение..." : "Сохранить")}</button></div>`);
      }
      _push(`</div>`);
      if (!unref(isEditing)) {
        _push(`<div class="profile-info__content" data-v-9f526a4a><div class="profile-info__item" data-v-9f526a4a><span class="profile-info__label" data-v-9f526a4a>Имя:</span><span class="profile-info__value" data-v-9f526a4a>${ssrInterpolate(unref(user).name)}</span></div><div class="profile-info__item" data-v-9f526a4a><span class="profile-info__label" data-v-9f526a4a>Email:</span><span class="profile-info__value" data-v-9f526a4a>${ssrInterpolate(unref(user).email)}</span></div><div class="profile-info__item" data-v-9f526a4a><span class="profile-info__label" data-v-9f526a4a>Телефон:</span><span class="profile-info__value" data-v-9f526a4a>${ssrInterpolate(unref(user).phone)}</span></div><div class="profile-info__item" data-v-9f526a4a><span class="profile-info__label" data-v-9f526a4a>Telegram:</span><span class="profile-info__value" data-v-9f526a4a>${ssrInterpolate(unref(user).telegram)}</span></div></div>`);
      } else {
        _push(`<form class="profile-info__form" data-v-9f526a4a><div class="profile-info__form-group" data-v-9f526a4a><label class="profile-info__form-label" data-v-9f526a4a>Имя</label><input${ssrRenderAttr("value", unref(tempUser).name)} type="text" class="profile-info__form-input" data-v-9f526a4a></div><div class="profile-info__form-group" data-v-9f526a4a><label class="profile-info__form-label" data-v-9f526a4a>Email</label><input${ssrRenderAttr("value", unref(tempUser).email)} type="email" class="profile-info__form-input" data-v-9f526a4a></div><div class="profile-info__form-group" data-v-9f526a4a><label class="profile-info__form-label" data-v-9f526a4a>Телефон</label><input${ssrRenderAttr("value", unref(tempUser).phone)} type="tel" class="profile-info__form-input" data-v-9f526a4a></div><div class="profile-info__form-group" data-v-9f526a4a><label class="profile-info__form-label" data-v-9f526a4a>Telegram</label><input${ssrRenderAttr("value", unref(tempUser).telegram)} type="text" class="profile-info__form-input" data-v-9f526a4a></div></form>`);
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
const ProfileInfo = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-9f526a4a"]]);
const _sfc_main$3 = {
  __name: "ProfileOrders",
  __ssrInlineRender: true,
  setup(__props) {
    useUserStore();
    const orders = ref([]);
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-orders" }, _attrs))} data-v-f6ff993f><h2 class="profile-orders__title" data-v-f6ff993f>Мои заказы</h2>`);
      if (unref(loading)) {
        _push(`<div class="profile-orders__loading" data-v-f6ff993f> Загрузка заказов... </div>`);
      } else if (unref(orders).length === 0) {
        _push(`<div class="profile-orders__empty" data-v-f6ff993f> У вас пока нет заказов </div>`);
      } else {
        _push(`<div class="profile-orders__table" data-v-f6ff993f><div class="profile-orders__row profile-orders__row--header" data-v-f6ff993f><div class="profile-orders__cell" data-v-f6ff993f>ID заказа</div><div class="profile-orders__cell" data-v-f6ff993f>Дата</div><div class="profile-orders__cell" data-v-f6ff993f>Шаблон</div><div class="profile-orders__cell" data-v-f6ff993f>Статус</div><div class="profile-orders__cell" data-v-f6ff993f>Сумма</div><div class="profile-orders__cell" data-v-f6ff993f>Действия</div></div><!--[-->`);
        ssrRenderList(unref(orders), (order) => {
          _push(`<div class="profile-orders__row" data-v-f6ff993f><div class="profile-orders__cell" data-v-f6ff993f>${ssrInterpolate(order.id)}</div><div class="profile-orders__cell" data-v-f6ff993f>${ssrInterpolate(order.date)}</div><div class="profile-orders__cell" data-v-f6ff993f>${ssrInterpolate(order.template)}</div><div class="profile-orders__cell" data-v-f6ff993f><span class="${ssrRenderClass([
            "profile-orders__status",
            `profile-orders__status--${order.statusCode}`
          ])}" data-v-f6ff993f>${ssrInterpolate(order.status)}</span></div><div class="profile-orders__cell" data-v-f6ff993f>${ssrInterpolate(order.price)}</div><div class="profile-orders__cell" data-v-f6ff993f><button class="profile-orders__action" data-v-f6ff993f> Подробнее </button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileOrders.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ProfileOrders = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-f6ff993f"]]);
const _sfc_main$2 = {
  __name: "ProfileBalance",
  __ssrInlineRender: true,
  setup(__props) {
    useUserStore();
    const balance = ref(0);
    const transactions = ref([]);
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-balance" }, _attrs))} data-v-682a4482><div class="profile-balance__header" data-v-682a4482><h2 class="profile-balance__title" data-v-682a4482>Баланс</h2><div class="profile-balance__amount" data-v-682a4482>${ssrInterpolate(unref(balance).toLocaleString())} ₽ </div></div><button class="button button--primary profile-balance__button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-682a4482>${ssrInterpolate(unref(loading) ? "Пополнение..." : "Пополнить баланс")}</button><div class="profile-balance__history" data-v-682a4482><h3 class="profile-balance__subtitle" data-v-682a4482>История операций</h3>`);
      if (unref(loading)) {
        _push(`<div class="profile-balance__loading" data-v-682a4482> Загрузка операций... </div>`);
      } else if (unref(transactions).length === 0) {
        _push(`<div class="profile-balance__empty" data-v-682a4482> У вас пока нет операций </div>`);
      } else {
        _push(`<div class="profile-balance__list" data-v-682a4482><!--[-->`);
        ssrRenderList(unref(transactions), (trx) => {
          _push(`<div class="profile-balance__item" data-v-682a4482><div class="profile-balance__info" data-v-682a4482><div class="profile-balance__date" data-v-682a4482>${ssrInterpolate(trx.date)}</div><div class="profile-balance__desc" data-v-682a4482>${ssrInterpolate(trx.description)}</div></div><div class="${ssrRenderClass([
            "profile-balance__sum",
            trx.type === "income" ? "profile-balance__sum--income" : "profile-balance__sum--expense"
          ])}" data-v-682a4482>${ssrInterpolate(trx.amount)}</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileBalance.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ProfileBalance = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-682a4482"]]);
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-settings" }, _attrs))} data-v-7489b2d4><h2 class="profile-settings__title" data-v-7489b2d4>Настройки</h2><div class="profile-settings__section" data-v-7489b2d4><h3 class="profile-settings__subtitle" data-v-7489b2d4>Уведомления</h3><div class="profile-settings__option" data-v-7489b2d4><div class="profile-settings__option-info" data-v-7489b2d4><div class="profile-settings__option-title" data-v-7489b2d4>Email уведомления</div><div class="profile-settings__option-desc" data-v-7489b2d4>Получать новости и обновления на почту</div></div><label class="profile-settings__switch" data-v-7489b2d4><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(notifications).email) ? ssrLooseContain(unref(notifications).email, null) : unref(notifications).email) ? " checked" : ""} class="profile-settings__switch-input" data-v-7489b2d4><span class="profile-settings__switch-slider" data-v-7489b2d4></span></label></div><div class="profile-settings__option" data-v-7489b2d4><div class="profile-settings__option-info" data-v-7489b2d4><div class="profile-settings__option-title" data-v-7489b2d4>Telegram уведомления</div><div class="profile-settings__option-desc" data-v-7489b2d4>Получать важные уведомления в Telegram</div></div><label class="profile-settings__switch" data-v-7489b2d4><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(notifications).telegram) ? ssrLooseContain(unref(notifications).telegram, null) : unref(notifications).telegram) ? " checked" : ""} class="profile-settings__switch-input" data-v-7489b2d4><span class="profile-settings__switch-slider" data-v-7489b2d4></span></label></div><div class="profile-settings__option" data-v-7489b2d4><div class="profile-settings__option-info" data-v-7489b2d4><div class="profile-settings__option-title" data-v-7489b2d4>SMS уведомления</div><div class="profile-settings__option-desc" data-v-7489b2d4>Получать важные уведомления по SMS</div></div><label class="profile-settings__switch" data-v-7489b2d4><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(notifications).sms) ? ssrLooseContain(unref(notifications).sms, null) : unref(notifications).sms) ? " checked" : ""} class="profile-settings__switch-input" data-v-7489b2d4><span class="profile-settings__switch-slider" data-v-7489b2d4></span></label></div></div><div class="profile-settings__section" data-v-7489b2d4><h3 class="profile-settings__subtitle" data-v-7489b2d4>Безопасность</h3><div class="profile-settings__option" data-v-7489b2d4><div class="profile-settings__option-info" data-v-7489b2d4><div class="profile-settings__option-title" data-v-7489b2d4>Двухфакторная аутентификация</div><div class="profile-settings__option-desc" data-v-7489b2d4>Дополнительная защита вашего аккаунта</div></div><label class="profile-settings__switch" data-v-7489b2d4><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(security).twoFactor) ? ssrLooseContain(unref(security).twoFactor, null) : unref(security).twoFactor) ? " checked" : ""} class="profile-settings__switch-input" data-v-7489b2d4><span class="profile-settings__switch-slider" data-v-7489b2d4></span></label></div></div><div class="profile-settings__section" data-v-7489b2d4><h3 class="profile-settings__subtitle" data-v-7489b2d4>Удаление аккаунта</h3><button class="button button--danger" data-v-7489b2d4> Удалить аккаунт </button></div></div>`);
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
      { id: "info", title: "Профиль" },
      { id: "orders", title: "Мои заказы" },
      { id: "balance", title: "Баланс" },
      { id: "settings", title: "Настройки" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile" }, _attrs))} data-v-65c33268><div class="profile__header" data-v-65c33268><h1 class="profile__title" data-v-65c33268>Личный кабинет</h1><p class="profile__subtitle" data-v-65c33268>Управляйте своими заказами и настройками</p></div><div class="profile__tabs" data-v-65c33268><!--[-->`);
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
export {
  profile as default
};
//# sourceMappingURL=profile-jfHiOu1f.js.map
