import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
const _sfc_main = {
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    variant: {
      type: String,
      default: "primary",
      validator: (value) => ["primary", "outline"].includes(value)
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value)
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: [
          "button",
          `button--${__props.variant}`,
          `button--${__props.size}`
        ]
      }, _attrs))} data-v-62a209ae>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Button.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Button = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-62a209ae"]]);
export {
  Button as B
};
//# sourceMappingURL=Button-BkOV6FTV.js.map
