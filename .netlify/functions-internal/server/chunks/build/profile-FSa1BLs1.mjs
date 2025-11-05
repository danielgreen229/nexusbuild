import { ref, watch, mergeProps, withCtx, createVNode, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderSlot, ssrIncludeBooleanAttr, ssrRenderStyle, ssrLooseContain } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { _ as _export_sfc, c as useUserStore } from './server.mjs';
import NextCircle from './next-circle-CvWlHJEr.mjs';
import { u as useOrdersStore } from './order-Bw7cn7lw.mjs';
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
import 'pinia';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';

const _sfc_main$4 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "block-header__container" }, _attrs))} data-v-dcdaca36>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BlockHeader.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const BlockHeader = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-dcdaca36"]]);
const _sfc_main$3 = {
  __name: "ProfileInfo",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    const isEditing = ref(false);
    const loading = ref(false);
    function mapUserFromApi(api = {}) {
      var _a2, _b2, _c2, _d2;
      var _a, _b, _c, _d;
      const digits = (api.phone || "").replace(/\D/g, "");
      const phone = digits.length === 11 && digits.startsWith("7") ? `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}` : api.phone || "";
      return {
        uid: api.uid || api.id || null,
        username: api.username || "",
        name: api.fullname || api.username || "",
        email: api.email || "",
        phone,
        telegram: api.tg || api.telegram || "",
        city: api.city || "",
        avatar: api.avatar || null,
        // дефолтные значения для настроек (если бэк не вернул — используем безопасные)
        notifications: {
          email: (_a2 = (_a = api.notifications) == null ? void 0 : _a.email) != null ? _a2 : true,
          telegram: (_b2 = (_b = api.notifications) == null ? void 0 : _b.telegram) != null ? _b2 : true,
          sms: (_c2 = (_c = api.notifications) == null ? void 0 : _c.sms) != null ? _c2 : false
        },
        security: {
          twoFactor: (_d2 = (_d = api.security) == null ? void 0 : _d.twoFactor) != null ? _d2 : false
        },
        raw: api
      };
    }
    const storeUser = computed(() => userStore.user ? mapUserFromApi(userStore.user) : null);
    const tempUser = ref({
      uid: null,
      name: "",
      username: "",
      email: "",
      phone: "",
      telegram: "",
      city: "",
      avatar: null,
      notifications: { email: true, telegram: true, sms: false },
      security: { twoFactor: false },
      raw: null
    });
    watch(
      storeUser,
      (val) => {
        if (!val) {
          tempUser.value = {
            uid: null,
            name: "",
            username: "",
            email: "",
            phone: "",
            telegram: "",
            city: "",
            avatar: null,
            notifications: { email: true, telegram: true, sms: false },
            security: { twoFactor: false },
            raw: null
          };
        } else if (!isEditing.value) {
          tempUser.value = { ...val, notifications: { ...val.notifications }, security: { ...val.security } };
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-info" }, _attrs))} data-v-867202f1><div class="profile-info__header" data-v-867202f1><h2 class="profile-info__title" data-v-867202f1>\u041B\u0438\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</h2>`);
      if (!isEditing.value) {
        _push(`<button class="button button--outline" data-v-867202f1> \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C </button>`);
      } else {
        _push(`<div class="profile-info__actions" data-v-867202f1><button class="button button--outline" data-v-867202f1> \u041E\u0442\u043C\u0435\u043D\u0430 </button><button class="button button--primary"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-867202f1>${ssrInterpolate(loading.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")}</button></div>`);
      }
      _push(`</div>`);
      if (!isEditing.value) {
        _push(`<div class="profile-info__content" data-v-867202f1><div class="profile-info__item" data-v-867202f1><span class="profile-info__label" data-v-867202f1>\u0418\u043C\u044F:</span><span class="profile-info__value" data-v-867202f1>${ssrInterpolate((_a = storeUser.value) == null ? void 0 : _a.name)}</span></div><div class="profile-info__item" data-v-867202f1><span class="profile-info__label" data-v-867202f1>Email:</span><span class="profile-info__value" data-v-867202f1>${ssrInterpolate((_b = storeUser.value) == null ? void 0 : _b.email)}</span></div><div class="profile-info__item" data-v-867202f1><span class="profile-info__label" data-v-867202f1>\u0422\u0435\u043B\u0435\u0444\u043E\u043D:</span><span class="profile-info__value" data-v-867202f1>${ssrInterpolate((_c = storeUser.value) == null ? void 0 : _c.phone)}</span></div>`);
        if ((_d = storeUser.value) == null ? void 0 : _d.city) {
          _push(`<div class="profile-info__item" data-v-867202f1><span class="profile-info__label" data-v-867202f1>\u0413\u043E\u0440\u043E\u0434:</span><span class="profile-info__value" data-v-867202f1>${ssrInterpolate((_e = storeUser.value) == null ? void 0 : _e.city)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<form class="profile-info__form" data-v-867202f1><div class="profile-info__form-group" data-v-867202f1><label class="profile-info__form-label" data-v-867202f1>\u0418\u043C\u044F</label><input${ssrRenderAttr("value", tempUser.value.name)} type="text" class="profile-info__form-input" data-v-867202f1></div><div class="profile-info__form-group" data-v-867202f1><label class="profile-info__form-label" data-v-867202f1>Email</label><input${ssrRenderAttr("value", tempUser.value.email)} type="email" class="profile-info__form-input" data-v-867202f1></div><div class="profile-info__form-group" data-v-867202f1><label class="profile-info__form-label" data-v-867202f1>\u0422\u0435\u043B\u0435\u0444\u043E\u043D</label><input${ssrRenderAttr("value", tempUser.value.phone)} type="tel" class="profile-info__form-input" data-v-867202f1></div><div class="profile-info__form-group" data-v-867202f1><label class="profile-info__form-label" data-v-867202f1>\u0413\u043E\u0440\u043E\u0434</label><input${ssrRenderAttr("value", tempUser.value.city)} type="text" class="profile-info__form-input" data-v-867202f1></div></form>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileInfo.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ProfileInfo = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-867202f1"]]);
const _sfc_main$2 = {
  __name: "ProfileOrders",
  __ssrInlineRender: true,
  setup(__props) {
    useUserStore();
    useOrdersStore();
    const orders = ref([]);
    const loadingInitial = ref(false);
    const loadingMore = ref(false);
    const error = ref(null);
    ref(1);
    ref(20);
    ref(null);
    const noMore = ref(false);
    const sentinel = ref(null);
    watch(sentinel, (val) => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-orders" }, _attrs))} data-v-8a5f5392><h2 class="profile-orders__title" data-v-8a5f5392>\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B</h2>`);
      if (loadingInitial.value) {
        _push(`<div class="profile-orders__loading" data-v-8a5f5392> \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0437\u0430\u043A\u0430\u0437\u043E\u0432... </div>`);
      } else if (error.value) {
        _push(`<div class="profile-orders__loading" data-v-8a5f5392> \u041E\u0448\u0438\u0431\u043A\u0430: ${ssrInterpolate(error.value)} <div style="${ssrRenderStyle({ "margin-top": "12px" })}" data-v-8a5f5392><button class="primary__button" data-v-8a5f5392>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button></div></div>`);
      } else if (orders.value.length === 0) {
        _push(`<div class="profile-orders__empty" data-v-8a5f5392> \u0423 \u0432\u0430\u0441 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u043A\u0430\u0437\u043E\u0432 <button class="primary__button" data-v-8a5f5392> \u041A\u0443\u043F\u0438\u0442\u044C \u0441\u0430\u0439\u0442 `);
        _push(ssrRenderComponent(unref(NextCircle), { class: "next-cirlce__svg" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<div class="profile-orders__table" data-v-8a5f5392><div class="profile-orders__row profile-orders__row--header" data-v-8a5f5392><div class="profile-orders__cell" data-v-8a5f5392>\u0414\u0430\u0442\u0430</div><div class="profile-orders__cell" data-v-8a5f5392>\u0428\u0430\u0431\u043B\u043E\u043D</div><div class="profile-orders__cell" data-v-8a5f5392>\u0421\u0442\u0430\u0442\u0443\u0441</div><div class="profile-orders__cell" data-v-8a5f5392>\u0421\u0443\u043C\u043C\u0430</div><div class="profile-orders__cell" data-v-8a5f5392>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</div></div><!--[-->`);
        ssrRenderList(orders.value, (order) => {
          _push(`<div class="profile-orders__row" data-v-8a5f5392><div class="profile-orders__cell profile-orders__cell--date" data-v-8a5f5392>${ssrInterpolate(order.date)}</div><div class="profile-orders__cell profile-orders__cell--template" data-v-8a5f5392><div class="profile-orders__template" data-v-8a5f5392>`);
          if (order.raw.template.preview) {
            _push(`<img${ssrRenderAttr("src", order.raw.template.preview)} class="profile-orders__thumb" data-v-8a5f5392>`);
          } else {
            _push(`<div class="profile-orders__thumb profile-orders__thumb--placeholder" data-v-8a5f5392></div>`);
          }
          _push(`<div class="profile-orders__template-info" data-v-8a5f5392><div class="profile-orders__template-title" data-v-8a5f5392>${ssrInterpolate(order.template)}</div></div></div></div><div class="profile-orders__cell profile-orders__cell--status" data-v-8a5f5392><span class="${ssrRenderClass([
            "profile-orders__status",
            `profile-orders__status--${order.statusCode}`
          ])}" data-v-8a5f5392>${ssrInterpolate(order.status)}</span></div><div class="profile-orders__cell profile-orders__cell--price" data-v-8a5f5392>${ssrInterpolate(order.price)}</div><div class="profile-orders__cell profile-orders__cell--actions" data-v-8a5f5392><button class="profile-orders__action" data-v-8a5f5392> \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 </button></div></div>`);
        });
        _push(`<!--]--><div class="profile-orders__row" style="${ssrRenderStyle({ "border-top": "none" })}" data-v-8a5f5392><div class="profile-orders__cell" style="${ssrRenderStyle({ "grid-column": "1 / -1", "display": "flex", "justify-content": "center", "padding": "20px" })}" data-v-8a5f5392>`);
        if (loadingMore.value) {
          _push(`<div class="profile-orders__loading" data-v-8a5f5392>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...</div>`);
        } else if (noMore.value) {
          _push(`<div class="profile-orders__loading" data-v-8a5f5392>\u0411\u043E\u043B\u044C\u0448\u0435 \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u043D\u0435\u0442</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div style="${ssrRenderStyle({ "height": "1px", "width": "100%" })}" data-v-8a5f5392></div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileOrders.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ProfileOrders = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-8a5f5392"]]);
const _sfc_main$1 = {
  __name: "ProfileSettings",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    const hasUser = computed(() => !!userStore.user);
    const emailAccess = computed({
      get() {
        if (!userStore.user) return false;
        return Number(userStore.user.email_access) === 1;
      },
      set(val) {
        if (!userStore.user) return;
        const numeric = val ? 1 : 0;
        userStore.user.email_access = numeric;
        if (userStore.isAuthenticated) {
          userStore.updateProfile({ email_access: numeric }).catch(async () => {
            try {
              await userStore.fetchCurrentUser();
            } catch (e) {
            }
          });
        }
      }
    });
    const tgAccess = computed({
      get() {
        if (!userStore.user) return false;
        return Number(userStore.user.tg_access) === 1;
      },
      set(val) {
        if (!userStore.user) return;
        const numeric = val ? 1 : 0;
        userStore.user.tg_access = numeric;
        if (userStore.isAuthenticated) {
          userStore.updateProfile({ tg_access: numeric }).catch(async () => {
            try {
              await userStore.fetchCurrentUser();
            } catch (e) {
            }
          });
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-settings" }, _attrs))} data-v-8ee05b4e><h2 class="profile-settings__title" data-v-8ee05b4e>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h2><div class="profile-settings__section" data-v-8ee05b4e><h3 class="profile-settings__subtitle" data-v-8ee05b4e>\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</h3><div class="profile-settings__option" data-v-8ee05b4e><div class="profile-settings__option-info" data-v-8ee05b4e><div class="profile-settings__option-title" data-v-8ee05b4e>Email \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</div><div class="profile-settings__option-desc" data-v-8ee05b4e> \u041F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u0438 \u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u043F\u043E\u0447\u0442\u0443 \u0441 \u0432\u0430\u0448\u0438\u0445 \u0441\u0430\u0439\u0442\u043E\u0432 </div></div><label class="profile-settings__switch"${ssrRenderAttr("title", hasUser.value ? "" : "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D")} data-v-8ee05b4e><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(emailAccess.value) ? ssrLooseContain(emailAccess.value, null) : emailAccess.value) ? " checked" : ""} class="profile-settings__switch-input"${ssrIncludeBooleanAttr(!hasUser.value || unref(userStore).loading) ? " disabled" : ""} data-v-8ee05b4e><span class="profile-settings__switch-slider" data-v-8ee05b4e></span></label></div><div class="profile-settings__option" data-v-8ee05b4e><div class="profile-settings__option-info" data-v-8ee05b4e><div class="profile-settings__option-title" data-v-8ee05b4e>Telegram \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</div><div class="profile-settings__option-desc" data-v-8ee05b4e> \u041F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u0432\u0430\u0436\u043D\u044B\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0432 Telegram \u0441 \u0432\u0430\u0448\u0438\u0445 \u0441\u0430\u0439\u0442\u043E\u0432 </div></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px" })}" data-v-8ee05b4e><button class="profile-settings__connect-btn"${ssrIncludeBooleanAttr(!hasUser.value || unref(userStore).loading) ? " disabled" : ""} type="button" data-v-8ee05b4e> \u041F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C Telegram </button><label class="profile-settings__switch"${ssrRenderAttr("title", hasUser.value ? "" : "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D")} data-v-8ee05b4e><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(tgAccess.value) ? ssrLooseContain(tgAccess.value, null) : tgAccess.value) ? " checked" : ""} class="profile-settings__switch-input"${ssrIncludeBooleanAttr(!hasUser.value || unref(userStore).loading) ? " disabled" : ""} data-v-8ee05b4e><span class="profile-settings__switch-slider" data-v-8ee05b4e></span></label></div></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/ProfileSettings.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProfileSettings = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8ee05b4e"]]);
const _sfc_main = {
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const tabs = [
      { id: "orders", title: "\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B" },
      { id: "info", title: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C" },
      { id: "settings", title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }
    ];
    const tabIds = tabs.map((t) => t.id);
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();
    const getQueryTab = (r) => {
      var _a;
      const raw = (_a = r == null ? void 0 : r.query) == null ? void 0 : _a.tab;
      const tab = Array.isArray(raw) ? raw[0] : raw;
      return tab;
    };
    const initial = getQueryTab(route);
    const activeTab = ref(tabIds.includes(initial) ? initial : "info");
    const authReady = ref(false);
    watch(
      () => route.fullPath,
      // срабатывает на любое изменение route; можно более узко — route.query.tab
      () => {
        const q = getQueryTab(route);
        if (q && tabIds.includes(q) && q !== activeTab.value) {
          activeTab.value = q;
        } else if (!q && activeTab.value !== "info") {
          activeTab.value = "info";
        }
      }
    );
    watch(
      () => userStore.isAuthenticated,
      (isAuth) => {
        if (!isAuth) {
          if (router.currentRoute.value.path !== "/") {
            router.replace({ path: "/" }).catch(() => {
            });
          }
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (authReady.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile" }, _attrs))} data-v-16abeb9d>`);
        _push(ssrRenderComponent(BlockHeader, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h1 class="profile__title" data-v-16abeb9d${_scopeId}>\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442</h1><p class="profile__subtitle" data-v-16abeb9d${_scopeId}>\u0423\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0441\u0432\u043E\u0438\u043C\u0438 \u0437\u0430\u043A\u0430\u0437\u0430\u043C\u0438 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C\u0438</p>`);
            } else {
              return [
                createVNode("h1", { class: "profile__title" }, "\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442"),
                createVNode("p", { class: "profile__subtitle" }, "\u0423\u043F\u0440\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0441\u0432\u043E\u0438\u043C\u0438 \u0437\u0430\u043A\u0430\u0437\u0430\u043C\u0438 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C\u0438")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="profile__tabs" data-v-16abeb9d><!--[-->`);
        ssrRenderList(tabs, (tab) => {
          _push(`<button class="${ssrRenderClass(["profile__tab", { "profile__tab--active": activeTab.value === tab.id }])}"${ssrRenderAttr("aria-pressed", activeTab.value === tab.id)} data-v-16abeb9d>${ssrInterpolate(tab.title)}</button>`);
        });
        _push(`<!--]--></div><div class="profile__content" data-v-16abeb9d>`);
        if (activeTab.value === "info") {
          _push(ssrRenderComponent(ProfileInfo, null, null, _parent));
        } else if (activeTab.value === "orders") {
          _push(ssrRenderComponent(ProfileOrders, null, null, _parent));
        } else if (activeTab.value === "settings") {
          _push(ssrRenderComponent(ProfileSettings, null, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-16abeb9d"]]);

export { profile as default };
//# sourceMappingURL=profile-FSa1BLs1.mjs.map
