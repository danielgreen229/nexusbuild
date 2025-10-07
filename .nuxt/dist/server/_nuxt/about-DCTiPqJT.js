import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
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
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))}><h1>Контакты</h1><p>Свяжитесь с нами для заказа сайта</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  about as default
};
//# sourceMappingURL=about-DCTiPqJT.js.map
