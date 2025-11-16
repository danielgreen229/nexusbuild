import { watch, unref } from 'vue';
import { f as buildHead, u as useHead } from './server.mjs';

function useSEO(options) {
  const getOptions = () => {
    var _a;
    return (_a = unref(options)) != null ? _a : {};
  };
  const buildOverrides = (opts) => {
    const { title, description, url, image, extrasMeta = [], extrasLink = [] } = opts;
    const meta = [
      ...description ? [{ name: "description", content: description, vmid: "description" }] : [],
      ...image ? [{ property: "og:image", content: image, vmid: "og:image" }] : [],
      ...url ? [{ property: "og:url", content: url, vmid: "og:url" }] : [],
      ...extrasMeta
    ];
    const link = [
      // не добавляем дефолтные link здесь — buildHead сам смажирует defaultHead.link с overrides.link
      ...url ? [{ rel: "canonical", href: url, vmid: "canonical" }] : [],
      ...extrasLink
    ];
    const overrides = {
      ...title ? { title } : {},
      meta,
      link
    };
    for (const k in opts) {
      if (k !== "title" && k !== "description" && k !== "url" && k !== "image" && k !== "extrasMeta" && k !== "extrasLink") {
        overrides[k] = opts[k];
      }
    }
    return overrides;
  };
  const apply = (opts) => {
    const overrides = buildOverrides(opts);
    useHead(buildHead(overrides));
  };
  apply(getOptions());
  watch(getOptions, (newVal) => {
    apply(newVal != null ? newVal : {});
  }, { deep: true });
  return buildHead(buildOverrides(getOptions()));
}

export { useSEO as u };
//# sourceMappingURL=useSEO-CGkjS5so.mjs.map
