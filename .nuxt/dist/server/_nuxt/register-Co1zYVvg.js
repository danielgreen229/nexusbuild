import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "/home/gda/Documents/test/nexusbuild/node_modules/hookable/dist/index.mjs";
import "/home/gda/Documents/test/nexusbuild/node_modules/unctx/dist/index.mjs";
import "/home/gda/Documents/test/nexusbuild/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/gda/Documents/test/nexusbuild/node_modules/radix3/dist/index.mjs";
import "/home/gda/Documents/test/nexusbuild/node_modules/defu/dist/defu.mjs";
import "/home/gda/Documents/test/nexusbuild/node_modules/ufo/dist/index.mjs";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))}><h1>Регистрация</h1><p>Создайте новый аккаунт</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  register as default
};
//# sourceMappingURL=register-Co1zYVvg.js.map
