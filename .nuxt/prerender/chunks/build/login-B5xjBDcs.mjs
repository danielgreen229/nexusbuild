import { mergeProps, useSSRContext } from 'file:///home/gda/Documents/test/nexusbuild/node_modules/vue/index.mjs';
import { ssrRenderAttrs } from 'file:///home/gda/Documents/test/nexusbuild/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/ofetch/dist/node.mjs';
import '../nitro/nitro.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/h3/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/ufo/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/destr/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/hookable/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/node-mock-http/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unstorage/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unstorage/drivers/fs.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/ohash/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/klona/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/defu/dist/defu.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/scule/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/unctx/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/pathe/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/ipx/dist/index.mjs';
import 'file:///home/gda/Documents/test/nexusbuild/node_modules/vue-router/dist/vue-router.node.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))}><h1>\u0412\u0445\u043E\u0434 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442</h1><p>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u0432\u0445\u043E\u0434\u0430</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { login as default };
//# sourceMappingURL=login-B5xjBDcs.mjs.map
