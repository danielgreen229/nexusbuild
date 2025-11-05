import { ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { _ as _export_sfc, c as useUserStore } from './server.mjs';
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

const _sfc_main = {
  __name: "reset-password",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useUserStore();
    const password = ref("");
    const passwordConfirm = ref("");
    const loading = ref(false);
    const error = ref(null);
    const success = ref(false);
    ref(null);
    function getQueryParam(name) {
      const v = route.query[name];
      if (Array.isArray(v)) return v[0];
      return v != null ? v : null;
    }
    const token = computed(() => getQueryParam("token") || getQueryParam("resetToken"));
    const uid = computed(() => getQueryParam("uid") || getQueryParam("user") || getQueryParam("uidb64"));
    const missingToken = computed(() => !token.value || !uid.value);
    const pwd = computed(() => {
      var _a;
      return ((_a = password.value) != null ? _a : "").trim();
    });
    const pwd2 = computed(() => {
      var _a;
      return ((_a = passwordConfirm.value) != null ? _a : "").trim();
    });
    const passwordTooShort = computed(() => pwd.value.length > 0 && pwd.value.length < 8);
    const passwordsEmpty = computed(() => !pwd.value || !pwd2.value);
    const passwordsMismatch = computed(() => !!pwd.value && !!pwd2.value && pwd.value !== pwd2.value);
    const canSubmit = computed(() => {
      return !loading.value && !missingToken.value && !passwordsEmpty.value && !passwordTooShort.value && !passwordsMismatch.value;
    });
    function clearError() {
      error.value = null;
    }
    watch([pwd, pwd2], () => {
      if (error.value) clearError();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-page" }, _attrs))} data-v-2b24ea9b><main class="auth-card" role="main" data-v-2b24ea9b><h1 class="auth-title" data-v-2b24ea9b>\u0421\u0431\u0440\u043E\u0441 \u043F\u0430\u0440\u043E\u043B\u044F</h1>`);
      if (error.value) {
        _push(`<div class="auth-error" role="alert" data-v-2b24ea9b>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (missingToken.value) {
        _push(`<div class="auth-error" role="alert" data-v-2b24ea9b> \u041D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0441\u0431\u0440\u043E\u0441 </div>`);
      } else {
        _push(`<!---->`);
      }
      if (!success.value && !missingToken.value) {
        _push(`<form class="auth-form" novalidate data-v-2b24ea9b><label class="auth-field" data-v-2b24ea9b><span class="auth-label" data-v-2b24ea9b>\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C</span><input${ssrRenderAttr("value", password.value)} type="password" required autocomplete="new-password"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} minlength="8" data-v-2b24ea9b></label><label class="auth-field" data-v-2b24ea9b><span class="auth-label" data-v-2b24ea9b>\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C</span><input${ssrRenderAttr("value", passwordConfirm.value)} type="password" required autocomplete="new-password"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} minlength="8" data-v-2b24ea9b></label><div class="auth-actions" data-v-2b24ea9b><button type="submit" class="button button--primary"${ssrIncludeBooleanAttr(!canSubmit.value) ? " disabled" : ""}${ssrRenderAttr("aria-disabled", !canSubmit.value)} data-v-2b24ea9b>`);
        if (!loading.value) {
          _push(`<span data-v-2b24ea9b>\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C</span>`);
        } else {
          _push(`<span data-v-2b24ea9b>\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435...</span>`);
        }
        _push(`</button><button type="button" class="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-2b24ea9b>\u041E\u0442\u043C\u0435\u043D\u0430</button></div></form>`);
      } else {
        _push(`<!---->`);
      }
      if (success.value) {
        _push(`<div class="auth-success" data-v-2b24ea9b> \u041F\u0430\u0440\u043E\u043B\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u0437\u043C\u0435\u043D\u0451\u043D. \u0412\u044B \u0431\u0443\u0434\u0435\u0442\u0435 \u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0432\u0445\u043E\u0434\u0430. <div style="${ssrRenderStyle({ "margin-top": "0.5rem" })}" data-v-2b24ea9b><button class="button button--primary" data-v-2b24ea9b>\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0432\u0445\u043E\u0434\u0443</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (passwordTooShort.value) {
        _push(`<div class="auth-field__hint" data-v-2b24ea9b>\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.</div>`);
      } else {
        _push(`<!---->`);
      }
      if (passwordsMismatch.value) {
        _push(`<div class="auth-field__hint" data-v-2b24ea9b>\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442.</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const resetPassword = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2b24ea9b"]]);

export { resetPassword as default };
//# sourceMappingURL=reset-password-BIb5A0ww.mjs.map
