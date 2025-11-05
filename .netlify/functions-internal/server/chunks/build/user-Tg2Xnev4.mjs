import { h, createElementBlock, openBlock, createElementVNode } from 'vue';
import { N as NuxtIcon } from './server.mjs';
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
import 'vue/server-renderer';
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';

const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "currentColor",
      d: "M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388 3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
    }, null, -1)
  ]));
}
const user = { render() {
  return h(NuxtIcon, { icon: { render }, name: "user" });
} };

export { user as default, render };
//# sourceMappingURL=user-Tg2Xnev4.mjs.map
