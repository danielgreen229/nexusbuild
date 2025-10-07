import { mergeProps, useSSRContext } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue/index.mjs';
import { ssrRenderAttrs } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/h3/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ufo/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/destr/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/hookable/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/node-mock-http/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ohash/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/klona/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/defu/dist/defu.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/scule/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unctx/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/pathe/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ipx/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/pinia/dist/pinia.prod.cjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue-router/dist/vue-router.node.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))}><h1>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</h1><p>\u0421\u0432\u044F\u0436\u0438\u0442\u0435\u0441\u044C \u0441 \u043D\u0430\u043C\u0438 \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u0430 \u0441\u0430\u0439\u0442\u0430</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { about as default };
//# sourceMappingURL=about-DCTiPqJT.mjs.map
