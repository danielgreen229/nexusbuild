import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
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
  __name: "confirm",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    useUserStore();
    const loading = ref(false);
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "confirm-page" }, _attrs))} data-v-24f91047>`);
      if (loading.value) {
        _push(`<div class="card" data-v-24f91047><div class="spinner" aria-hidden="true" data-v-24f91047></div><div class="text" data-v-24f91047>\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u043C \u0430\u043A\u043A\u0430\u0443\u043D\u0442, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435...</div></div>`);
      } else if (error.value) {
        _push(`<div class="card error" data-v-24f91047><p class="text" data-v-24f91047>\u041E\u0448\u0438\u0431\u043A\u0430: ${ssrInterpolate(error.value)}</p><div class="actions" data-v-24f91047><button class="btn" data-v-24f91047>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button><button class="btn secondary" data-v-24f91047>\u0412\u043E\u0439\u0442\u0438</button></div></div>`);
      } else {
        _push(`<div class="card success" data-v-24f91047><p class="text" data-v-24f91047>\u0423\u0441\u043F\u0435\u0448\u043D\u043E! \u0421\u0435\u0439\u0447\u0430\u0441 \u0432\u044B \u0431\u0443\u0434\u0435\u0442\u0435 \u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u044B \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u044C.</p></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/confirm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const confirm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-24f91047"]]);

export { confirm as default };
//# sourceMappingURL=confirm-ChOHEVyE.mjs.map
