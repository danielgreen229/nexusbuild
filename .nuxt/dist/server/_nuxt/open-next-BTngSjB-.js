import { h, createElementBlock, openBlock, createElementVNode } from "vue";
import { N as NuxtIcon } from "../server.mjs";
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
import "vue/server-renderer";
const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "currentColor",
      d: "M7 21q-.425 0-.712-.288T6 20t.288-.712T7 19h6v-7.2l.9.9q.275.275.7.275t.7-.275.275-.7-.275-.7l-2.6-2.6q-.3-.3-.7-.3t-.7.3l-2.6 2.6q-.275.275-.275.7t.275.7.7.275.7-.275l.9-.9V16H4q-.825 0-1.412-.587T2 14V5q0-.825.588-1.412T4 3h16q.825 0 1.413.588T22 5v9q0 .825-.587 1.413T20 16h-5v3h2q.425 0 .713.288T18 20t-.288.713T17 21z"
    }, null, -1)
  ]));
}
const OpenNext = { render() {
  return h(NuxtIcon, { icon: { render }, name: "open-next" });
} };
export {
  OpenNext as default,
  render
};
//# sourceMappingURL=open-next-BTngSjB-.js.map
