// utils/remove-preloads.ts
export default function removePreloadsPlugin(filter = (linkStr: string) =>
  /_payload\.json|\/builds\/meta\/.*\.json/.test(linkStr)
) {
  return {
    name: 'remove-preloads',
    enforce: 'post' as const,
    transformIndexHtml(html: string) {
      return html.replace(
        /\s*(<link rel="(?:module)?preload"[^>]*>)\s*/gi,
        (orig: string, linkStr: string) => {
          try {
            return filter(linkStr) ? '' : orig;
          } catch (e) {
            return orig;
          }
        }
      );
    }
  };
}
