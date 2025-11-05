import BigEmail from './big-email-dFX6Kh5b.mjs';
import { _ as _export_sfc, c as useUserStore } from './server.mjs';
import { resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
import 'vue-router';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = {
  components: { BigEmail },
  data() {
    return {
      loading: false,
      successMessage: "",
      errorMessage: ""
    };
  },
  computed: {
    // теперь только по uid
    hasUid() {
      const store = useUserStore();
      const uid = store.uid || localStorage.getItem("uid");
      return Boolean(uid);
    }
  },
  mounted() {
    const store = useUserStore();
    if (typeof store.initFromStorage === "function") {
      store.initFromStorage();
    }
  },
  methods: {
    async resend() {
      this.loading = true;
      this.successMessage = "";
      this.errorMessage = "";
      const store = useUserStore();
      try {
        const uid = store.uid || localStorage.getItem("uid");
        if (!uid) {
          this.errorMessage = "\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u0430\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u0432 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443.";
          return;
        }
        if (typeof store.sendTokenEmail === "function") {
          try {
            await store.sendTokenEmail({ uid });
          } catch (callErr) {
            console.log(callErr);
            throw new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u043F\u0438\u0441\u044C\u043C\u0430");
          }
        } else {
          throw new Error("\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0434\u043B\u044F \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0439 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0432 \u0441\u0442\u043E\u0440\u0435.");
        }
        this.successMessage = "\u041F\u0438\u0441\u044C\u043C\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u043E\u0447\u0442\u0443 (\u0432\u043A\u043B\u044E\u0447\u0430\u044F \u043F\u0430\u043F\u043A\u0443 \u0421\u043F\u0430\u043C).";
      } catch (err) {
        if (err && err.response && err.response.data && err.response.data.message) {
          this.errorMessage = err.response.data.message;
        } else if (err && err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0435 \u043F\u0438\u0441\u044C\u043C\u0430";
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_BigEmail = resolveComponent("BigEmail");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "submit__container" }, _attrs))} data-v-52d2315e><p data-v-52d2315e>\u041D\u0430 \u0432\u0430\u0448\u0443 \u043F\u043E\u0447\u0442\u0443 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043F\u0438\u0441\u044C\u043C\u043E.</p><p data-v-52d2315e>\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435 \u0432 \u043F\u0438\u0441\u044C\u043C\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C email.</p><div class="big-email__container" data-v-52d2315e>`);
  _push(ssrRenderComponent(_component_BigEmail, { class: "big-email" }, null, _parent));
  _push(`</div><div class="resend-container" aria-live="polite" data-v-52d2315e><p class="hint" data-v-52d2315e>\u0415\u0441\u043B\u0438 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u043F\u0440\u0438\u0448\u043B\u043E \u2014 \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0435\u0433\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E.</p><div class="buttons" data-v-52d2315e><button class="btn resend"${ssrIncludeBooleanAttr($data.loading) ? " disabled" : ""} title="\u041F\u0435\u0440\u0435\u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044F uid" data-v-52d2315e>${ssrInterpolate($data.loading ? "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430..." : "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E \u0437\u0430\u043D\u043E\u0432\u043E")}</button></div>`);
  if ($data.successMessage) {
    _push(`<p class="success" data-v-52d2315e>${ssrInterpolate($data.successMessage)}</p>`);
  } else {
    _push(`<!---->`);
  }
  if ($data.errorMessage) {
    _push(`<p class="error" data-v-52d2315e>${ssrInterpolate($data.errorMessage)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/submit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const submit = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-52d2315e"]]);

export { submit as default };
//# sourceMappingURL=submit-CAhWBu4t.mjs.map
