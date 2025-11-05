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
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "1.5",
      d: "M6.92 6.956 5.45 5.473m9.309 1.483 1.47-1.483m-10.78 10.88 1.47-1.484m3.92-9.89V3m-5.88 7.913H3m13.875 5.923 3.814-1.506a.496.496 0 0 0 0-.921l-9.165-3.615a.492.492 0 0 0-.635.64l3.582 9.251c.162.42.75.42.912 0z"
    }, null, -1)
  ]));
}
const iconClick = { render() {
  return h(NuxtIcon, { icon: { render }, name: "icon-click" });
} };

export { iconClick as default, render };
//# sourceMappingURL=icon-click-CZvvVRyr.mjs.map
