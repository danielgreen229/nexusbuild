import { shallowReactive, reactive, effectScope, getCurrentScope, hasInjectionContext, getCurrentInstance, inject, toRef, shallowRef, isReadonly, isRef, isShallow, isReactive, toRaw, defineComponent, createElementBlock, provide, cloneVNode, h, resolveComponent, computed, defineAsyncComponent, ref, Suspense, Fragment, createVNode, resolveDynamicComponent, mergeProps, useSSRContext, watch, nextTick, withCtx, createTextVNode, toDisplayString, openBlock, createElementVNode, unref, onErrorCaptured, onServerPrefetch, createApp } from "vue";
import { $fetch } from "ofetch";
import { baseURL } from "#internal/nuxt/paths";
import { createHooks } from "/Users/danielgreen/Documents/sitebypro/frontend/nexusbuild/node_modules/hookable/dist/index.mjs";
import { getContext, executeAsync } from "/Users/danielgreen/Documents/sitebypro/frontend/nexusbuild/node_modules/unctx/dist/index.mjs";
import { sanitizeStatusCode, createError as createError$1 } from "/Users/danielgreen/Documents/sitebypro/frontend/nexusbuild/node_modules/h3/dist/index.mjs";
import { shouldHydrate, createPinia, setActivePinia, defineStore } from "pinia";
import { defu } from "/Users/danielgreen/Documents/sitebypro/frontend/nexusbuild/node_modules/defu/dist/defu.mjs";
import { START_LOCATION, createMemoryHistory, createRouter as createRouter$1, RouterView, useRouter as useRouter$1, useRoute as useRoute$1 } from "vue-router";
import { toRouteMatcher, createRouter } from "/Users/danielgreen/Documents/sitebypro/frontend/nexusbuild/node_modules/radix3/dist/index.mjs";
import { hasProtocol, joinURL, withQuery, isScriptProtocol, parseQuery, withTrailingSlash, withoutTrailingSlash } from "/Users/danielgreen/Documents/sitebypro/frontend/nexusbuild/node_modules/ufo/dist/index.mjs";
import "/Users/danielgreen/Documents/sitebypro/frontend/nexusbuild/node_modules/klona/dist/index.mjs";
import { ssrRenderVNode, ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderSuspense } from "vue/server-renderer";
import { useHead as useHead$1, headSymbol } from "/Users/danielgreen/Documents/sitebypro/frontend/nexusbuild/node_modules/@unhead/vue/dist/index.mjs";
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.17.6";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin2.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance || (nuxtAppInstance = getNuxtAppCtx(id).tryUse());
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to || (to = "/");
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? void 0 : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value || (error2.value = nuxtError);
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  var _a;
  const nuxt = nuxtApp || tryUseNuxtApp();
  return ((_a = nuxt == null ? void 0 : nuxt.ssrContext) == null ? void 0 : _a.head) || (nuxt == null ? void 0 : nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  }));
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const _routes = [
  {
    name: "faq",
    path: "/faq",
    component: () => import("./_nuxt/faq-BMlcGWbs.js")
  },
  {
    name: "blog",
    path: "/blog",
    component: () => import("./_nuxt/blog-DxquUNuH.js")
  },
  {
    name: "about",
    path: "/about",
    component: () => import("./_nuxt/about-CkPQb906.js")
  },
  {
    name: "admin",
    path: "/admin",
    component: () => import("./_nuxt/admin-BOPqejvP.js")
  },
  {
    name: "index",
    path: "/",
    component: () => import("./_nuxt/index-CfIMDQFg.js")
  },
  {
    name: "login",
    path: "/login",
    component: () => import("./_nuxt/login-DrdvKIji.js")
  },
  {
    name: "submit",
    path: "/submit",
    component: () => import("./_nuxt/submit-CAhWBu4t.js")
  },
  {
    name: "confirm",
    path: "/confirm",
    component: () => import("./_nuxt/confirm-ChOHEVyE.js")
  },
  {
    name: "pricing",
    path: "/pricing",
    component: () => import("./_nuxt/pricing-CGfPLUgK.js")
  },
  {
    name: "profile",
    path: "/profile",
    component: () => import("./_nuxt/profile-FSa1BLs1.js")
  },
  {
    name: "contacts",
    path: "/contacts",
    component: () => import("./_nuxt/contacts-B5MeWRMq.js")
  },
  {
    name: "register",
    path: "/register",
    component: () => import("./_nuxt/register-DlFFX-n3.js")
  },
  {
    name: "services",
    path: "/services",
    component: () => import("./_nuxt/services-CYKomQDV.js")
  },
  {
    name: "templates",
    path: "/templates",
    component: () => import("./_nuxt/templates-Ct_ujbsJ.js")
  },
  {
    name: "buy-domain",
    path: "/buy-domain",
    component: () => import("./_nuxt/buy-domain-CZSXPBJ2.js")
  },
  {
    name: "reset-password",
    path: "/reset-password",
    component: () => import("./_nuxt/reset-password-BIb5A0ww.js")
  },
  {
    name: "buy-template-id",
    path: "/buy-template/:id()",
    component: () => import("./_nuxt/_id_-UOeqcRjD.js")
  },
  {
    name: "buy-template",
    path: "/buy-template",
    component: () => import("./_nuxt/index-DO0UmPdz.js")
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    let position = savedPosition || void 0;
    if (!position && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, "instant", position));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, "instant", position)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, scrollBehaviorType, position) {
  if (position) {
    return position;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: scrollBehaviorType
    };
  }
  return { left: 0, top: 0, behavior: scrollBehaviorType };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter$1({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware || (nuxtApp._middleware = {
      global: [],
      named: {}
    });
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? void 0 : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? void 0 : failure.type) === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0$2 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink == null ? void 0 : useBuiltinLink({ ...props, to });
    const href = computed(() => {
      var _a;
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: (link == null ? void 0 : link.isActive) ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: (link == null ? void 0 : link.isExactActive) ?? computed(() => to.value === router.currentRoute.value.path),
      route: (link == null ? void 0 : link.route) ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        var _a;
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, (_a = slots.default) == null ? void 0 : _a.call(slots));
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_0$1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const LazySvgoBigEmail = defineAsyncComponent(() => import("./_nuxt/big-email-dFX6Kh5b.js").then((r) => r["default"] || r.default || r));
const LazySvgoIconClick = defineAsyncComponent(() => import("./_nuxt/icon-click-CZvvVRyr.js").then((r) => r["default"] || r.default || r));
const LazySvgoLandingCone = defineAsyncComponent(() => import("./_nuxt/Cone-S8GsaI1p.js").then((r) => r["default"] || r.default || r));
const LazySvgoLandingBg = defineAsyncComponent(() => import("./_nuxt/bg-CfI5hjDV.js").then((r) => r["default"] || r.default || r));
const LazySvgoLandingBlockBgMobile = defineAsyncComponent(() => import("./_nuxt/block-bg-mobile-BIVCgtr-.js").then((r) => r["default"] || r.default || r));
const LazySvgoLandingBlockBg = defineAsyncComponent(() => import("./_nuxt/block-bg-CptgMeT7.js").then((r) => r["default"] || r.default || r));
const LazySvgoLandingBlockBg1 = defineAsyncComponent(() => import("./_nuxt/block-bg1-DoeVrfTz.js").then((r) => r["default"] || r.default || r));
const LazySvgoLandingBlockBg2 = defineAsyncComponent(() => import("./_nuxt/block-bg2-BjLeHx_o.js").then((r) => r["default"] || r.default || r));
const LazySvgoLandingMouse = defineAsyncComponent(() => import("./_nuxt/mouse-DbvaMCeI.js").then((r) => r["default"] || r.default || r));
const LazySvgoLogo = defineAsyncComponent(() => Promise.resolve().then(() => logo$1).then((r) => r["default"] || r.default || r));
const LazySvgoNextCircle = defineAsyncComponent(() => import("./_nuxt/next-circle-CvWlHJEr.js").then((r) => r["default"] || r.default || r));
const LazySvgoOpenNext = defineAsyncComponent(() => import("./_nuxt/open-next-Bh2lDVNL.js").then((r) => r["default"] || r.default || r));
const LazySvgoTg = defineAsyncComponent(() => Promise.resolve().then(() => tg).then((r) => r["default"] || r.default || r));
const LazySvgoUser = defineAsyncComponent(() => import("./_nuxt/user-Tg2Xnev4.js").then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["SvgoBigEmail", LazySvgoBigEmail],
  ["SvgoIconClick", LazySvgoIconClick],
  ["SvgoLandingCone", LazySvgoLandingCone],
  ["SvgoLandingBg", LazySvgoLandingBg],
  ["SvgoLandingBlockBgMobile", LazySvgoLandingBlockBgMobile],
  ["SvgoLandingBlockBg", LazySvgoLandingBlockBg],
  ["SvgoLandingBlockBg1", LazySvgoLandingBlockBg1],
  ["SvgoLandingBlockBg2", LazySvgoLandingBlockBg2],
  ["SvgoLandingMouse", LazySvgoLandingMouse],
  ["SvgoLogo", LazySvgoLogo],
  ["SvgoNextCircle", LazySvgoNextCircle],
  ["SvgoOpenNext", LazySvgoOpenNext],
  ["SvgoTg", LazySvgoTg],
  ["SvgoUser", LazySvgoUser]
];
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$c = {
  props: {
    filled: {
      type: Boolean,
      required: false,
      default: false
    },
    fontControlled: {
      type: Boolean,
      required: false,
      default: true
    },
    icon: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: false
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  ssrRenderVNode(_push, createVNode(resolveDynamicComponent($props.icon), mergeProps({
    class: {
      "nuxt-icon": $props.fontControlled,
      "nuxt-icon--fill": !$props.filled
    }
  }, _attrs), null), _parent);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-svgo/dist/runtime/components/nuxt-icon.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const NuxtIcon = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender]]);
const API = {
  currentBuild: "base",
  // 'dev' или 'base'
  base: {
    protocol: "https",
    url: "sitebypro-server.ru",
    port: "",
    subpage: ""
  },
  dev: {
    protocol: "http",
    url: "localhost",
    port: ":3000",
    subpage: ""
  },
  get fullUrl() {
    const config = this[this.currentBuild];
    return `${config.protocol}://${config.url}${config.port}${config.subpage ? "/" + config.subpage : ""}`;
  }
};
const LS_TOKEN_KEY = "token";
const LS_UID_KEY = "uid";
function _buildUrl(path) {
  return `${API.fullUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
async function _parseJsonSafe(res) {
  try {
    return await res.json();
  } catch (e) {
    return {};
  }
}
function _extractMessageFromBody(body) {
  if (!body) return null;
  return body.data || body.message || body.description || body.error || null;
}
const useUserStore = defineStore("user", {
  state: () => ({
    loading: false,
    error: null,
    user: null,
    token: null,
    uid: null,
    isAuthenticated: false
  }),
  actions: {
    // Внутренний HTTP POST хелпер
    async _post(path, body = {}, { includeAuth = false } = {}) {
      const url = _buildUrl(path);
      const headers = { "Content-Type": "application/json" };
      if (includeAuth && this.token) headers["Authorization"] = `Bearer ${this.token}`;
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      const parsed = await _parseJsonSafe(res);
      return { res, parsed };
    },
    _saveAuthToStorage(token, uid) {
      if (token) localStorage.setItem(LS_TOKEN_KEY, token);
      else localStorage.removeItem(LS_TOKEN_KEY);
      if (uid) localStorage.setItem(LS_UID_KEY, uid);
      else localStorage.removeItem(LS_UID_KEY);
    },
    _syncFromUserObject(obj = {}) {
      const maybe = obj.user || obj;
      this.user = maybe;
      this.token = maybe.token || this.token;
      this.uid = maybe.uid || maybe.id || maybe.user && maybe.user.uid || this.uid;
      this.isAuthenticated = !!(this.token && this.uid);
      this._saveAuthToStorage(this.token, this.uid);
    },
    initFromStorage() {
      try {
        const token = localStorage.getItem(LS_TOKEN_KEY);
        const uid = localStorage.getItem(LS_UID_KEY);
        if (token && uid) {
          this.token = token;
          this.uid = uid;
          this.isAuthenticated = true;
        } else {
          this.token = null;
          this.uid = null;
          this.isAuthenticated = false;
        }
      } catch (e) {
        this.token = null;
        this.uid = null;
        this.isAuthenticated = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.uid = null;
      this.isAuthenticated = false;
      this.error = null;
      try {
        localStorage.removeItem(LS_TOKEN_KEY);
        localStorage.removeItem(LS_UID_KEY);
      } catch (e) {
      }
    },
    async login(payload = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { res, parsed } = await this._post("/user/login", payload);
        if (!res.ok) {
          const errMsg = _extractMessageFromBody(parsed) || "Ошибка авторизации";
          this.error = errMsg;
          if (res.status === 401) this.logout();
          throw new Error(errMsg);
        }
        const data = parsed.data || parsed;
        if (!data) {
          this.error = "Некорректный ответ сервера";
          throw new Error(this.error);
        }
        this._syncFromUserObject(data);
        return data;
      } catch (err) {
        this.error = err.message || "Неизвестная ошибка";
        this.isAuthenticated = !!(this.token && this.uid);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async register(payload = {}, { autologin = false } = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { res, parsed } = await this._post("/user/register", payload);
        if (!res.ok) {
          const errMsg = _extractMessageFromBody(parsed) || "Ошибка регистрации";
          this.error = errMsg;
          throw new Error(errMsg);
        }
        const data = parsed.data || parsed;
        if (!data) {
          this.error = "Некорректный ответ сервера при регистрации";
          throw new Error(this.error);
        }
        this.user = data;
        if (autologin) {
          this._syncFromUserObject(data);
        } else {
          this.token = null;
          this.uid = null;
          this.isAuthenticated = false;
          this._saveAuthToStorage(null, null);
        }
        return data;
      } catch (err) {
        this.error = err.message || "Неизвестная ошибка при регистрации";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchCurrentUser() {
      if (!this.token || !this.uid) return null;
      this.loading = true;
      this.error = null;
      try {
        const payload = { token: this.token, uid: this.uid };
        const { res, parsed } = await this._post("/user/me", payload, { includeAuth: true });
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || "Не удалось получить данные пользователя";
          this.error = msg;
          if (res.status === 401) this.logout();
          throw new Error(msg);
        }
        const user = parsed.data || parsed;
        if (!user) {
          this.error = "Некорректный ответ сервера при получении пользователя";
          throw new Error(this.error);
        }
        this.user = user;
        if (user.token) this.token = user.token;
        const newUid = user.uid || user.id || user.user && user.user.uid;
        if (newUid) this.uid = newUid;
        this.isAuthenticated = !!(this.token && this.uid);
        this._saveAuthToStorage(this.token, this.uid);
        return user;
      } catch (err) {
        this.error = err.message || "Ошибка при получении пользователя";
        this.logout();
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      if (!this.token || !this.uid) {
        const msg = "Требуется token и uid";
        this.error = msg;
        throw new Error(msg);
      }
      this.loading = true;
      this.error = null;
      try {
        const payload = { token: this.token, uid: this.uid };
        const { res, parsed } = await this._post("/user/submit", payload, { includeAuth: true });
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}: не удалось пометить пользователя`;
          this.error = msg;
          if (res.status === 401) this.logout();
          throw new Error(msg);
        }
        const data = parsed.data || parsed;
        if (data && typeof data === "object") {
          this._syncFromUserObject(data);
          return data;
        }
        return await this.fetchCurrentUser();
      } catch (err) {
        this.error = err.message || "Неизвестная ошибка при пометке submitted";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async sendTokenEmail(payload = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { res, parsed } = await this._post("/user/send-token-email", payload, { includeAuth: !!this.token });
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}: не удалось отправить письмо`;
          this.error = msg;
          if (res.status === 401) this.logout();
          throw new Error(msg);
        }
        return parsed.data || parsed || null;
      } catch (err) {
        this.error = err.message || "Неизвестная ошибка при отправке письма";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async sendResetPassword(payload = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { res, parsed } = await this._post("/user/send-reset-password", payload, { includeAuth: !!this.token });
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}: не удалось отправить письмо для сброса пароля`;
          this.error = msg;
          if (res.status === 401) this.logout();
          throw new Error(msg);
        }
        return parsed.data || parsed || null;
      } catch (err) {
        this.error = err.message || "Неизвестная ошибка при отправке письма для сброса пароля";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // Вставьте в actions вашего существующего defineStore('user', ...)
    async updateProfile(payload = {}) {
      this.loading = true;
      this.error = null;
      try {
        const url = _buildUrl("/user/update-user");
        const headers = { "Content-Type": "application/json" };
        if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
        const body = Object.assign({}, payload, { uid: this.uid });
        const res = await fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify(body)
        });
        const parsed = await _parseJsonSafe(res);
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}`;
          this.error = msg;
          if (res.status === 401) this.logout();
          throw new Error(msg);
        }
        const data = parsed.data || parsed || null;
        if (data && typeof data === "object") {
          if (typeof this._syncFromUserObject === "function") {
            this._syncFromUserObject(data);
          } else {
            if (data.token) this.token = data.token;
            if (data.uid || data.id) this.uid = data.uid || data.id;
            this.isAuthenticated = !!(this.token && this.uid);
            this._saveAuthToStorage(this.token, this.uid);
          }
          this.user = data;
          return data;
        }
        return parsed;
      } catch (err) {
        this.error = err.message || "Неизвестная ошибка при обновлении профиля";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async resetPassword({ uid, token, newPassword } = {}) {
      this.loading = true;
      this.error = null;
      if (!uid || !token || !newPassword) {
        const msg = "Обязательные поля отсутствуют: uid, token, newPassword";
        this.error = msg;
        this.loading = false;
        throw new Error(msg);
      }
      try {
        const { res, parsed } = await this._post("/user/reset-password", { uid, token, newPassword }, { includeAuth: !!this.token });
        if (!res.ok) {
          const msg = _extractMessageFromBody(parsed) || `Ошибка ${res.status}: не удалось сбросить пароль`;
          this.error = msg;
          if (res.status === 401) this.logout();
          throw new Error(msg);
        }
        const data = parsed.data || parsed || null;
        if (data && typeof data === "object") {
          if (data.token || data.uid || data.id || data.user) {
            this._syncFromUserObject(data);
          }
          if (data.username || data.email || data.user) {
            this.user = data;
            this.isAuthenticated = !!(this.token && this.uid);
          }
          return data;
        }
        return data || true;
      } catch (err) {
        this.error = err.message || "Неизвестная ошибка при сбросе пароля";
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
const _sfc_main$b = {
  __name: "RegisterModal",
  __ssrInlineRender: true,
  props: { visible: Boolean },
  emits: ["update:visible", "register"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const store = useUserStore();
    const fullname = ref("");
    const city = ref("");
    ref("");
    ref("");
    const phoneError = ref("");
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const modal = ref(null);
    const loading = computed(() => !!store.loading);
    const error = computed(() => store.error || "");
    function clearError() {
      store.error = null;
    }
    watch(() => props.visible, async (v) => {
      if (v) {
        clearError();
        await nextTick();
        setTimeout(() => {
          var _a;
          return (_a = modal.value) == null ? void 0 : _a.focus();
        }, 50);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0$2;
      if (__props.visible) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "modal-overlay",
          role: "dialog",
          "aria-modal": "true"
        }, _attrs))} data-v-ad94c45a><div class="modal" tabindex="-1" data-v-ad94c45a><button class="modal__close" aria-label="Закрыть" data-v-ad94c45a>✕</button><h3 class="modal__title" data-v-ad94c45a>Создать пользователя</h3><form class="modal__form" data-v-ad94c45a>`);
        if (error.value) {
          _push(`<div class="modal__error" role="alert" data-v-ad94c45a>${ssrInterpolate(error.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label class="modal__field" data-v-ad94c45a><span class="modal__label" data-v-ad94c45a>ФИО</span><input${ssrRenderAttr("value", fullname.value)} type="text" required autocomplete="name"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-ad94c45a></label><label class="modal__field" data-v-ad94c45a><span class="modal__label" data-v-ad94c45a>Город</span><input${ssrRenderAttr("value", city.value)} type="text" required autocomplete="address-level2"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-ad94c45a></label><label class="modal__field" data-v-ad94c45a><span class="modal__label" data-v-ad94c45a>Телефон</span>`);
        _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
        if (phoneError.value) {
          _push(`<div class="field-error" data-v-ad94c45a>${ssrInterpolate(phoneError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><label class="modal__field" data-v-ad94c45a><span class="modal__label" data-v-ad94c45a>Логин</span><input${ssrRenderAttr("value", username.value)} type="text" required autocomplete="username"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-ad94c45a></label><label class="modal__field" data-v-ad94c45a><span class="modal__label" data-v-ad94c45a>Электронная почта</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-ad94c45a></label><label class="modal__field" data-v-ad94c45a><span class="modal__label" data-v-ad94c45a>Пароль</span><input${ssrRenderAttr("value", password.value)} type="password" required autocomplete="new-password"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-ad94c45a></label><div class="modal__actions" data-v-ad94c45a><button type="submit" class="button button--primary"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-ad94c45a>`);
        if (!loading.value) {
          _push(`<span data-v-ad94c45a>Создать</span>`);
        } else {
          _push(`<span data-v-ad94c45a>Создание...</span>`);
        }
        _push(`</button><button type="button" class="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-ad94c45a>Отмена</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/Modals/RegisterModal.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const RegisterModal = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-ad94c45a"]]);
const _sfc_main$a = {
  __name: "ForgotPasswordModal",
  __ssrInlineRender: true,
  props: {
    visible: { type: Boolean, default: false }
  },
  emits: ["update:visible", "back-to-login", "create-user", "password-reset-requested"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const userStore = useUserStore();
    const email = ref("");
    ref(null);
    const emailInput = ref(null);
    const success = ref(false);
    const localError = ref(null);
    const loading = computed(() => !!userStore.loading);
    const storeError = computed(() => userStore.error);
    const displayError = computed(() => localError.value || storeError.value || null);
    const isEmailValid = computed(() => {
      const val = (email.value || "").trim();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    });
    function clearAllErrors() {
      localError.value = null;
      try {
        userStore.error = null;
      } catch (e) {
      }
    }
    watch(() => props.visible, async (v) => {
      if (v) {
        clearAllErrors();
        success.value = false;
        await nextTick();
        setTimeout(() => {
          var _a;
          return (_a = emailInput.value) == null ? void 0 : _a.focus();
        }, 50);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-35bfaefb>`);
      if (__props.visible) {
        _push(`<div class="modal-overlay" role="dialog" aria-modal="true" data-v-35bfaefb><div class="modal" tabindex="-1" data-v-35bfaefb><button class="modal__close" aria-label="Закрыть" data-v-35bfaefb>✕</button><h3 class="modal__title" data-v-35bfaefb>Восстановление пароля</h3><form class="modal__form" data-v-35bfaefb>`);
        if (displayError.value) {
          _push(`<div class="modal__error" role="alert" data-v-35bfaefb>${ssrInterpolate(displayError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (!success.value) {
          _push(`<div data-v-35bfaefb><label class="modal__field" data-v-35bfaefb><span class="modal__label" data-v-35bfaefb>Электронная почта</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-35bfaefb></label><div class="modal__actions" data-v-35bfaefb><button type="submit" class="button button--primary"${ssrIncludeBooleanAttr(loading.value || !isEmailValid.value) ? " disabled" : ""} data-v-35bfaefb>`);
          if (!loading.value) {
            _push(`<span data-v-35bfaefb>Отправить ссылку</span>`);
          } else {
            _push(`<span data-v-35bfaefb>Отправка...</span>`);
          }
          _push(`</button><button type="button" class="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-35bfaefb>Отмена</button></div></div>`);
        } else {
          _push(`<div class="modal__success" role="status" aria-live="polite" data-v-35bfaefb><p data-v-35bfaefb>Мы отправили письмо с инструкцией по восстановлению пароля на <strong data-v-35bfaefb>${ssrInterpolate(email.value)}</strong> (проверьте папку «Спам»).</p><div class="modal__actions" data-v-35bfaefb><button type="button" class="button button--primary" data-v-35bfaefb>Закрыть</button><button type="button" class="button" data-v-35bfaefb>Вернуться к входу</button></div><div class="modal__links" style="${ssrRenderStyle({ "margin-top": "0.5rem" })}" data-v-35bfaefb><button type="button" class="button button--link"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-35bfaefb>Отправить снова</button></div></div>`);
        }
        _push(`</form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/Modals/ForgotPasswordModal.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const ForgotPasswordModal = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-35bfaefb"]]);
const _sfc_main$9 = {
  __name: "LoginModal",
  __ssrInlineRender: true,
  props: {
    visible: { type: Boolean, default: false },
    startWithRegister: { type: Boolean, default: false }
  },
  emits: ["update:visible", "login", "create-user", "forgot-password", "register"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const userStore = useUserStore();
    const email = ref("");
    const password = ref("");
    ref(null);
    const emailInput = ref(null);
    const isRegisterOpen = ref(false);
    const isForgotOpen = ref(false);
    const loading = computed(() => !!userStore.loading);
    const error = computed(() => userStore.error);
    function clearError() {
      userStore.error = null;
    }
    async function openRegisterFromLogin() {
      if (loading.value) return;
      clearError();
      emit("create-user");
      await nextTick();
      isRegisterOpen.value = true;
    }
    async function onForgotBackToLogin() {
      var _a;
      if (loading.value) return;
      clearError();
      isForgotOpen.value = false;
      emit("update:visible", true);
      await nextTick();
      (_a = emailInput.value) == null ? void 0 : _a.focus();
    }
    function onPasswordResetRequested(emailSentTo) {
      emit("forgot-password", emailSentTo);
    }
    async function onRegistered(user) {
      clearError();
      emit("register", user);
    }
    watch(() => props.visible, async (v) => {
      var _a;
      if (v) {
        clearError();
        isForgotOpen.value = false;
        isRegisterOpen.value = false;
        await nextTick();
        if (props.startWithRegister) {
          openRegisterFromLogin();
        } else {
          await nextTick();
          (_a = emailInput.value) == null ? void 0 : _a.focus();
        }
      }
    });
    watch([isRegisterOpen, isForgotOpen], (vals) => {
      if (vals[0] || vals[1]) clearError();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-9c5b72d0>`);
      if (__props.visible) {
        _push(`<div class="modal-overlay" role="dialog" aria-modal="true" data-v-9c5b72d0><div class="modal" tabindex="-1" data-v-9c5b72d0><button class="modal__close" aria-label="Закрыть" data-v-9c5b72d0>✕</button><h3 class="modal__title" data-v-9c5b72d0>Вход в аккаунт</h3><div class="modal__form" data-v-9c5b72d0>`);
        if (error.value) {
          _push(`<div class="modal__error" role="alert" data-v-9c5b72d0>${ssrInterpolate(error.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label class="modal__field" data-v-9c5b72d0><span class="modal__label" data-v-9c5b72d0>Электронная почта</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-9c5b72d0></label><label class="modal__field" data-v-9c5b72d0><span class="modal__label" data-v-9c5b72d0>Пароль</span><input${ssrRenderAttr("value", password.value)} type="password" required autocomplete="current-password"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-9c5b72d0></label><div class="modal__links" data-v-9c5b72d0><button type="button" class="button button--link"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-9c5b72d0> Забыли пароль? </button><button type="button" class="button button--link"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-9c5b72d0> Создать пользователя </button></div><div class="modal__actions" data-v-9c5b72d0><button type="button" class="button button--primary"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-9c5b72d0>`);
        if (!loading.value) {
          _push(`<span data-v-9c5b72d0>Войти</span>`);
        } else {
          _push(`<span data-v-9c5b72d0>Вход...</span>`);
        }
        _push(`</button><button type="button" class="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-9c5b72d0>Отмена</button></div></div>`);
        _push(ssrRenderComponent(RegisterModal, {
          visible: isRegisterOpen.value,
          "onUpdate:visible": ($event) => isRegisterOpen.value = $event,
          onRegister: onRegistered
        }, null, _parent));
        _push(ssrRenderComponent(ForgotPasswordModal, {
          visible: isForgotOpen.value,
          "onUpdate:visible": ($event) => isForgotOpen.value = $event,
          onBackToLogin: onForgotBackToLogin,
          onPasswordResetRequested
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/Modals/LoginModal.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const LoginModal = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-9c5b72d0"]]);
const _sfc_main$8 = {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    useRouter$1();
    const headerRef = ref(null);
    const isUserMenuOpen = ref(false);
    const isMobileMenuOpen = ref(false);
    const isLoginModalOpen = ref(false);
    const isAuthenticated = computed(() => !!userStore.isAuthenticated);
    const user = computed(() => userStore.user || null);
    const displayName = computed(() => {
      if (!user.value) return "";
      return user.value.fullname || user.value.username || (user.value.email ? user.value.email.split("@")[0] : "");
    });
    const initials = computed(() => {
      const name = displayName.value;
      if (!name) return "👤";
      const parts = name.split(" ").filter(Boolean);
      if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
      return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
    });
    const avatarUrl = computed(() => {
      const av = user.value && user.value.avatar;
      if (!av) return null;
      if (typeof av === "string") return av;
      return null;
    });
    function onLoginEvent(userData) {
      isLoginModalOpen.value = false;
      isUserMenuOpen.value = false;
    }
    function closeUserMenu() {
      isUserMenuOpen.value = false;
    }
    function closeMobileMenu() {
      isMobileMenuOpen.value = false;
    }
    const primaryPages = [
      { path: "/", title: "Главная" },
      { path: "/templates", title: "Шаблоны" },
      { path: "/services", title: "Услуги" }
    ];
    const secondaryPages = [
      { path: "/contacts", title: "Контакты" },
      { path: "/blog", title: "Блог" },
      { path: "/about", title: "О нас" },
      { path: "/faq", title: "FAQ" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({
        ref_key: "headerRef",
        ref: headerRef,
        class: "app-header"
      }, _attrs))} data-v-af32f420><div class="container app-header__container" data-v-af32f420><div class="app-header__top" data-v-af32f420>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "app-header__logo"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="app-header__logo-text" data-v-af32f420${_scopeId}>SITE.BY</span><span class="app-header__logo-badge" data-v-af32f420${_scopeId}>PRO</span>`);
          } else {
            return [
              createVNode("span", { class: "app-header__logo-text" }, "SITE.BY"),
              createVNode("span", { class: "app-header__logo-badge" }, "PRO")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="app-nav app-nav--primary" data-v-af32f420><ul class="app-nav__list" data-v-af32f420><!--[-->`);
      ssrRenderList(primaryPages, (page) => {
        _push(`<li class="app-nav__item" data-v-af32f420>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: page.path,
          class: "app-nav__link",
          "exact-active-class": "app-nav__link--active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(page.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(page.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav><div class="app-header__actions" data-v-af32f420>`);
      if (isAuthenticated.value && user.value) {
        _push(`<div class="app-header__profile" data-v-af32f420><button class="app-header__profile-toggle" data-v-af32f420><div class="app-header__avatar" data-v-af32f420>`);
        if (avatarUrl.value) {
          _push(`<img${ssrRenderAttr("src", avatarUrl.value)} alt="avatar" class="app-header__avatar-img" data-v-af32f420>`);
        } else {
          _push(`<!--[-->${ssrInterpolate(initials.value)}<!--]-->`);
        }
        _push(`</div><span class="app-header__user-name" data-v-af32f420>${ssrInterpolate(displayName.value)}</span></button>`);
        if (isUserMenuOpen.value) {
          _push(`<div class="user-menu" data-v-af32f420><div class="user-menu__header" data-v-af32f420><div class="user-menu__avatar" data-v-af32f420>${ssrInterpolate(initials.value)}</div><div class="user-menu__info" data-v-af32f420><div class="user-menu__name" data-v-af32f420>${ssrInterpolate(displayName.value)}</div><div class="user-menu__email" data-v-af32f420>${ssrInterpolate(user.value.email)}</div></div></div><ul class="user-menu__list" data-v-af32f420><li class="user-menu__item" data-v-af32f420>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile?tab=orders",
            class: "user-menu__link",
            onClick: closeUserMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Мои заказы`);
              } else {
                return [
                  createTextVNode("Мои заказы")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li><li class="user-menu__item" data-v-af32f420>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile",
            class: "user-menu__link",
            onClick: closeUserMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Мой профиль`);
              } else {
                return [
                  createTextVNode("Мой профиль")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li><li class="user-menu__item" data-v-af32f420>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile?tab=settings",
            class: "user-menu__link",
            onClick: closeUserMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Настройки`);
              } else {
                return [
                  createTextVNode("Настройки")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li></ul><div class="user-menu__footer" data-v-af32f420><button class="user-menu__logout" data-v-af32f420>Выйти из аккаунта</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div data-v-af32f420><button class="button button--primary" data-v-af32f420>Войти</button></div>`);
      }
      _push(`<button class="app-header__menu-toggle" data-v-af32f420><span class="${ssrRenderClass([{ "app-header__menu-icon--active": isMobileMenuOpen.value }, "app-header__menu-icon"])}" data-v-af32f420></span></button></div></div><div class="app-header__bottom" data-v-af32f420><nav class="app-nav app-nav--secondary" data-v-af32f420><ul class="app-nav__list" data-v-af32f420><!--[-->`);
      ssrRenderList(secondaryPages, (page) => {
        _push(`<li class="app-nav__item" data-v-af32f420>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: page.path,
          class: "app-nav__link",
          "active-class": "app-nav__link--active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(page.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(page.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav></div></div><div class="${ssrRenderClass([{ "app-mobile-menu--active": isMobileMenuOpen.value }, "app-mobile-menu"])}" data-v-af32f420><div class="app-mobile-menu__content" data-v-af32f420><nav class="app-mobile-nav" data-v-af32f420><div class="app-mobile-nav__section" data-v-af32f420><h3 class="app-mobile-nav__title" data-v-af32f420>Основные</h3><ul class="app-mobile-nav__list" data-v-af32f420><!--[-->`);
      ssrRenderList(primaryPages, (page) => {
        _push(`<li class="app-mobile-nav__item" data-v-af32f420>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: page.path,
          class: "app-mobile-nav__link",
          onClick: closeMobileMenu,
          "exact-active-class": "app-mobile-nav__link--active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(page.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(page.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div class="app-mobile-nav__section" data-v-af32f420><h3 class="app-mobile-nav__title" data-v-af32f420>Дополнительные</h3><ul class="app-mobile-nav__list" data-v-af32f420><!--[-->`);
      ssrRenderList(secondaryPages, (page) => {
        _push(`<li class="app-mobile-nav__item" data-v-af32f420>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: page.path,
          class: "app-mobile-nav__link",
          onClick: closeMobileMenu,
          "active-class": "app-mobile-nav__link--active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(page.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(page.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></nav></div></div>`);
      _push(ssrRenderComponent(LoginModal, {
        visible: isLoginModalOpen.value,
        "onUpdate:visible": ($event) => isLoginModalOpen.value = $event,
        onLogin: onLoginEvent
      }, null, _parent));
      _push(`</header>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-af32f420"]]);
const _hoisted_1$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 156 34"
};
function render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "#0040C1",
      d: "M9.893 32.308c-3.08 0-6.059-1.061-8.66-3.457l2.396-2.979c1.78 1.61 3.765 2.842 6.298 2.842 2.294 0 3.766-1.267 3.766-3.047v-.034c0-1.506-.787-2.5-4.587-3.903-4.553-1.711-6.915-3.389-6.915-7.223v-.068c0-3.937 3.15-6.71 7.6-6.71 2.772 0 5.34.89 7.53 2.807l-2.259 3.047c-1.643-1.335-3.457-2.26-5.374-2.26-2.157 0-3.492 1.199-3.492 2.773v.035c0 1.677.89 2.567 4.964 4.142 4.45 1.711 6.504 3.56 6.504 7.052v.068c0 4.21-3.286 6.915-7.77 6.915M20.74 32V8.037h3.97V32zm12.95 0V11.734h-6.3V8.037h16.57v3.697h-6.3V32zm12.797 0V8.037h15.097v3.595h-11.16v6.504h9.893v3.594h-9.893v6.676h11.33V32zm17.71 0v-4.553h4.382V32zm7.841 0V8.037h8.559c2.601 0 4.792.72 6.127 2.054 1.061 1.061 1.61 2.396 1.61 4.04v.102c0 2.944-1.712 4.485-3.527 5.375 2.636.924 4.553 2.499 4.553 5.717v.137c0 4.21-3.423 6.538-8.524 6.538zm12.324-17.15v-.069c0-2.02-1.472-3.184-4.04-3.184H75.94v6.641h4.142c2.602 0 4.28-1.163 4.28-3.388m1.027 10.132c0-2.088-1.609-3.389-4.621-3.389H75.94v6.847h4.998c2.739 0 4.45-1.198 4.45-3.39zM97.188 32v-9.55l-8.08-14.413h4.554l5.545 10.373 5.58-10.373h4.416l-8.045 14.378V32z"
    }, null, -1),
    createElementVNode("rect", {
      width: "40",
      height: "24",
      x: "114",
      y: "2",
      fill: "#0040C1",
      rx: "12"
    }, null, -1),
    createElementVNode("path", {
      fill: "#fff",
      d: "M119.554 18.5V8.7h4.242q1.317 0 2.268.434.953.42 1.47 1.218.519.798.518 1.904 0 1.092-.518 1.89-.517.798-1.47 1.232-.951.42-2.268.42h-2.982l1.008-1.022V18.5zm2.268-3.472-1.008-1.078h2.856q1.05 0 1.568-.448.519-.448.518-1.246 0-.812-.518-1.26t-1.568-.448h-2.856l1.008-1.078zm7.345 3.472V8.7h4.242q1.315 0 2.268.434.952.42 1.47 1.218t.518 1.904q0 1.092-.518 1.89-.518.784-1.47 1.204-.953.42-2.268.42h-2.982l1.008-.994V18.5zm6.23 0-2.45-3.556h2.422l2.478 3.556zm-3.962-3.472-1.008-1.064h2.856q1.05 0 1.568-.448.518-.462.518-1.26 0-.812-.518-1.26t-1.568-.448h-2.856l1.008-1.078zm12.282 3.64a6 6 0 0 1-2.156-.378 5.2 5.2 0 0 1-1.708-1.064 5 5 0 0 1-1.12-1.61 5.1 5.1 0 0 1-.392-2.016q0-1.092.392-2.016a4.9 4.9 0 0 1 1.134-1.61 5.2 5.2 0 0 1 1.708-1.064 5.9 5.9 0 0 1 2.128-.378q1.162 0 2.128.378a5 5 0 0 1 1.694 1.064 4.87 4.87 0 0 1 1.54 3.626 5.05 5.05 0 0 1-.406 2.03 4.9 4.9 0 0 1-1.134 1.61 5.1 5.1 0 0 1-1.694 1.05 5.8 5.8 0 0 1-2.114.378m-.014-1.932q.658 0 1.204-.224.56-.224.98-.644t.644-.994a3.3 3.3 0 0 0 .238-1.274 3.3 3.3 0 0 0-.238-1.274 2.85 2.85 0 0 0-.644-.994 2.7 2.7 0 0 0-.966-.644 3.3 3.3 0 0 0-1.218-.224q-.657 0-1.218.224-.546.225-.966.644t-.658.994a3.5 3.5 0 0 0-.224 1.274q0 .686.224 1.274.239.574.644.994.42.42.98.644.561.224 1.218.224"
    }, null, -1)
  ]));
}
const logo = { render() {
  return h(NuxtIcon, { icon: { render: render$1 }, name: "logo" });
} };
const logo$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: logo,
  render: render$1
}, Symbol.toStringTag, { value: "Module" }));
const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 30 30"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "#4A63C4",
      d: "m27.458 5.717-4.553 18.47c-.214.87-1.205 1.317-2.018.904l-5.758-2.925-2.723 4.384c-.741 1.195-2.616.677-2.616-.72v-4.886c0-.378.16-.738.437-1.001L21.45 9.398c-.01-.132-.152-.246-.295-.15L7.763 18.422l-4.5-2.284c-1.053-.536-1.008-2.039.081-2.504L25.53 4.118c1.062-.457 2.205.483 1.928 1.6"
    }, null, -1)
  ]));
}
const IconTg = { render() {
  return h(NuxtIcon, { icon: { render }, name: "tg" });
} };
const tg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: IconTg,
  render
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = {
  __name: "SideMenu",
  __ssrInlineRender: true,
  props: {
    visible: { type: Boolean, default: false },
    primaryPages: { type: Array, default: () => [] },
    secondaryPages: { type: Array, default: () => [] }
  },
  emits: ["update:visible", "login"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function close() {
      emit("update:visible", false);
    }
    function onLink() {
      close();
    }
    function onOrder() {
      close();
    }
    watch(
      () => props.visible,
      (val) => {
        return;
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="${ssrRenderClass([{ "app-mobile-menu--active": __props.visible }, "app-mobile-menu"])}" data-v-27e846b9><div class="app-mobile-menu__content" data-v-27e846b9><div class="app-mobile-menu__mobile-header" data-v-27e846b9>`);
        _push2(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "app-mobile-menu__logo",
          onClick: close
        }, {
          default: withCtx((_, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(ssrRenderComponent(unref(logo), {
                class: "app-mobile-menu__logo-svg",
                filled: ""
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(logo), {
                  class: "app-mobile-menu__logo-svg",
                  filled: ""
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push2(`<button class="app-mobile-menu__close" aria-label="Закрыть меню" data-v-27e846b9>✕</button></div><nav class="app-mobile-nav" data-v-27e846b9><div class="app-mobile-nav__section" data-v-27e846b9><h3 class="app-mobile-nav__title" data-v-27e846b9>Основные</h3><ul class="app-mobile-nav__list" data-v-27e846b9><!--[-->`);
        ssrRenderList(__props.primaryPages, (page) => {
          _push2(`<li class="app-mobile-nav__item" data-v-27e846b9>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: page.path,
            class: "app-mobile-nav__link",
            onClick: onLink,
            "exact-active-class": "app-mobile-nav__link--active"
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`${ssrInterpolate(page.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(page.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push2(`</li>`);
        });
        _push2(`<!--]--></ul></div><div class="app-mobile-nav__section" data-v-27e846b9><h3 class="app-mobile-nav__title" data-v-27e846b9>Дополнительные</h3><ul class="app-mobile-nav__list" data-v-27e846b9><!--[-->`);
        ssrRenderList(__props.secondaryPages, (page) => {
          _push2(`<li class="app-mobile-nav__item" data-v-27e846b9>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: page.path,
            class: "app-mobile-nav__link",
            onClick: onLink,
            "active-class": "app-mobile-nav__link--active"
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`${ssrInterpolate(page.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(page.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push2(`</li>`);
        });
        _push2(`<!--]--></ul></div></nav><div class="app-mobile-menu__footer" data-v-27e846b9>`);
        _push2(ssrRenderComponent(_component_NuxtLink, {
          to: "/templates",
          class: "button button--primary app-mobile-menu__btn-order",
          onClick: onOrder
        }, {
          default: withCtx((_, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(`Заказать`);
            } else {
              return [
                createTextVNode("Заказать")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push2(`<a href="https://t.me/dozer_stoun" target="_blank" rel="noopener noreferrer" class="button button--outline app-mobile-menu__btn-tg" data-v-27e846b9>`);
        _push2(ssrRenderComponent(unref(IconTg), { class: "tg__icon" }, null, _parent));
        _push2(` Написать в тг </a></div></div></div>`);
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Modal/SideMenu.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const SideMenu = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-27e846b9"]]);
const _sfc_main$6 = {
  __name: "LandingHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    useRouter$1();
    ref(null);
    const isUserMenuOpen = ref(false);
    const isMobileMenuOpen = ref(false);
    const isLoginModalOpen = ref(false);
    computed(() => !!userStore.isAuthenticated);
    const user = computed(() => userStore.user || null);
    const displayName = computed(() => {
      if (!user.value) return "";
      return user.value.fullname || user.value.username || (user.value.email ? user.value.email.split("@")[0] : "");
    });
    computed(() => {
      const name = displayName.value;
      if (!name) return "👤";
      const parts = name.split(" ").filter(Boolean);
      if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
      return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
    });
    computed(() => {
      const av = user.value && user.value.avatar;
      if (!av) return null;
      if (typeof av === "string") return av;
      return null;
    });
    function onMobileLogin() {
      isLoginModalOpen.value = true;
      closeMobileMenu();
    }
    function onLoginEvent(userData) {
      isLoginModalOpen.value = false;
      isUserMenuOpen.value = false;
    }
    function closeMobileMenu() {
      isMobileMenuOpen.value = false;
    }
    const primaryPages = [
      { path: "/templates", title: "шаблоны" },
      { path: "/services", title: "услуги" },
      { path: "/services", title: "3D-модели" }
    ];
    const secondaryPages = [
      { path: "/contacts", title: "Контакты" },
      { path: "/blog", title: "Блог" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<!--[--><header class="app-header" data-v-1d5de54d><div class="app-header__container" data-v-1d5de54d><div class="app-header__top" data-v-1d5de54d>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "app-header__logo"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(logo), {
              class: "app-header__logo-svg",
              filled: ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(logo), {
                class: "app-header__logo-svg",
                filled: ""
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="app-nav app-nav--primary" data-v-1d5de54d><ul class="app-nav__list" data-v-1d5de54d><!--[-->`);
      ssrRenderList(primaryPages, (page) => {
        _push(`<li class="app-nav__item" data-v-1d5de54d>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: page.path,
          class: "app-nav__link",
          "exact-active-class": "app-nav__link--active"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(page.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(page.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav><div class="app-header__actions" data-v-1d5de54d>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/templates",
        class: "nuxt-link__a"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="goto__template" data-v-1d5de54d${_scopeId}>заказать</div>`);
          } else {
            return [
              createVNode("div", { class: "goto__template" }, "заказать")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="burger-mobile__container" role="button" aria-label="Открыть меню" data-v-1d5de54d><div class="burger-stick" data-v-1d5de54d></div><div class="burger-stick" data-v-1d5de54d></div><div class="burger-stick" data-v-1d5de54d></div></div></div></div></div>`);
      _push(ssrRenderComponent(LoginModal, {
        visible: isLoginModalOpen.value,
        "onUpdate:visible": ($event) => isLoginModalOpen.value = $event,
        onLogin: onLoginEvent
      }, null, _parent));
      _push(`</header>`);
      _push(ssrRenderComponent(SideMenu, {
        visible: isMobileMenuOpen.value,
        "onUpdate:visible": ($event) => isMobileMenuOpen.value = $event,
        "primary-pages": primaryPages,
        "secondary-pages": secondaryPages,
        onLogin: onMobileLogin
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Nav/LandingHeader.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const LandingHeader = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-1d5de54d"]]);
const title = "Нужен уникальный дизайн?";
const subtitle = "Разработаем эксклюзивный сайт специально для вас";
const _sfc_main$5 = {
  __name: "PortfolioCTA",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "portfolio-cta" }, _attrs))} data-v-f329e64b><div class="portfolio-cta__container container" data-v-f329e64b><div class="portfolio-cta__content" data-v-f329e64b><h2 class="portfolio-cta__title" data-v-f329e64b>${ssrInterpolate(title)}</h2><p class="portfolio-cta__subtitle" data-v-f329e64b>${ssrInterpolate(subtitle)}</p><button class="portfolio-cta__button button button--primary" data-v-f329e64b> Заказать дизайн </button></div></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/portfolio/PortfolioCTA.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const PortfolioCTA = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-f329e64b"]]);
const _sfc_main$4 = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const excludedPages = [
      "/login",
      "/thank-you",
      "/private/*"
      // все пути, начинающиеся с /private/
    ];
    const isExcluded = (r) => {
      const path = r.path || "";
      const name = r.name != null ? String(r.name) : "";
      return excludedPages.some((pattern) => {
        if (!pattern) return false;
        if (pattern.startsWith("name:")) {
          const expectedName = pattern.slice(5);
          return expectedName === name;
        }
        if (pattern.endsWith("*")) {
          const prefix = pattern.slice(0, -1);
          return path.startsWith(prefix);
        }
        return path === pattern;
      });
    };
    const showCTA = computed(() => !isExcluded(route));
    const telegramLink = ref("https://t.me/dozer_stoun");
    const currentYear = ref((/* @__PURE__ */ new Date()).getFullYear());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-221f761d>`);
      if (showCTA.value) {
        _push(ssrRenderComponent(PortfolioCTA, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="footer__container container" data-v-221f761d><div class="footer__brand" data-v-221f761d><div class="footer__logo" data-v-221f761d>SiteByPro</div><p class="footer__tagline" data-v-221f761d>Быстрые сайты для быстрых денег</p><a${ssrRenderAttr("href", telegramLink.value)} class="footer__telegram" target="_blank" rel="noopener" aria-label="Наш Telegram" data-v-221f761d><span class="footer__telegram-icon" data-v-221f761d>✈️</span><span class="footer__telegram-text" data-v-221f761d>Пишите в Telegram</span></a></div><div class="footer__nav" data-v-221f761d><h4 class="footer__title" data-v-221f761d>Навигация</h4><ul class="footer__list" data-v-221f761d><li data-v-221f761d><a href="#" class="footer__link" data-v-221f761d>Главная</a></li><li data-v-221f761d><a href="#" class="footer__link" data-v-221f761d>Портфолио</a></li><li data-v-221f761d><a href="#" class="footer__link" data-v-221f761d>Тарифы</a></li><li data-v-221f761d><a href="#" class="footer__link" data-v-221f761d>Блог</a></li></ul></div><div class="footer__services" data-v-221f761d><h4 class="footer__title" data-v-221f761d>Услуги</h4><ul class="footer__list" data-v-221f761d><li data-v-221f761d><a href="#" class="footer__link" data-v-221f761d>Лендинги</a></li><li data-v-221f761d><a href="#" class="footer__link" data-v-221f761d>Корпоративные сайты</a></li><li data-v-221f761d><a href="#" class="footer__link" data-v-221f761d>Интернет-магазины</a></li><li data-v-221f761d><a href="#" class="footer__link" data-v-221f761d>SEO-оптимизация</a></li></ul></div></div><div class="footer__bottom" data-v-221f761d><div class="container" data-v-221f761d><div class="footer__copyright" data-v-221f761d> © ${ssrInterpolate(currentYear.value)} sitebypro. Продажа сайтов. <span class="footer__highlight" data-v-221f761d>Быстрые сайты.</span></div></div></div></footer>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Footer.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-221f761d"]]);
const useAlertStore = defineStore("alert", {
  state: () => ({
    alerts: []
  }),
  getters: {
    allAlerts: (state) => state.alerts
  },
  actions: {
    /**
     * Показывает алерт.
     * @param {Object} alert - { title, message, type, typeClass, background, color, autoClose, position }
     * @returns {string|number} id созданного алерта
     */
    showAlert(alert) {
      const id = Date.now() + Math.random();
      const alertWithId = { ...alert, id };
      this.alerts.push(alertWithId);
      if (process && false) ;
      return id;
    },
    /**
     * Удаляет алерт по id.
     * Очищает таймаут если он был.
     */
    removeAlert(id) {
      const idx = this.alerts.findIndex((a2) => a2.id === id);
      if (idx === -1) return;
      const a = this.alerts[idx];
      if (a && a._timeout) {
        clearTimeout(a._timeout);
      }
      this.alerts.splice(idx, 1);
    },
    removeAll() {
      for (const a of this.alerts) {
        if (a && a._timeout) clearTimeout(a._timeout);
      }
      this.alerts = [];
    }
  }
});
const _sfc_main$3 = {
  __name: "Alert",
  __ssrInlineRender: true,
  setup(__props) {
    const alertStore = useAlertStore();
    const alerts = computed(() => alertStore.alerts);
    function getStyle(alert) {
      var _a;
      return {
        color: alert.color,
        background: alert.background,
        border: alert.border,
        padding: alert.padding || "0.5rem 1rem",
        borderRadius: alert.borderRadius || "0.5rem",
        minWidth: alert.minWidth || "250px",
        maxWidth: alert.maxWidth || "400px",
        boxShadow: alert.boxShadow || "0 2px 12px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        position: "relative",
        pointerEvents: "auto",
        zIndex: ((_a = alert.position) == null ? void 0 : _a.zIndex) ?? 100001
      };
    }
    function getIcon(type) {
      const icons = {
        success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155724" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
        error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#721c24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0c5460" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>`,
        warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#856404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17"/></svg>`
      };
      return icons[type] || "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="alerts-container" data-v-e238137d><div${ssrRenderAttrs({ name: "fade" })} data-v-e238137d>`);
        ssrRenderList(alerts.value, (alert) => {
          _push2(`<div class="${ssrRenderClass(["alert", alert.typeClass])}" style="${ssrRenderStyle(getStyle(alert))}" data-v-e238137d><span class="alert-icon" aria-hidden="true" data-v-e238137d>${getIcon(alert.type) ?? ""}</span><div class="alert-content" data-v-e238137d>`);
          if (alert.title) {
            _push2(`<strong data-v-e238137d>${ssrInterpolate(alert.title)}</strong>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<span data-v-e238137d>${ssrInterpolate(alert.message)}</span></div><button class="alert-close"${ssrRenderAttr("aria-label", `Close alert ${alert.title || ""}`)} data-v-e238137d> × </button></div>`);
        });
        _push2(`</div></div>`);
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Modal/Alert.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const AlertsContainer = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-e238137d"]]);
const SITE_NAME = "sitebypro";
const SITE_URL = "https://sitebypro.com";
const defaultHead = {
  title: "Главная",
  titleTemplate: "%s — " + SITE_NAME,
  meta: [
    { name: "description", content: "Краткое описание сайта", vmid: "description" },
    { name: "robots", content: "index,follow", vmid: "robots" },
    // Open Graph
    { property: "og:site_name", content: SITE_NAME, vmid: "og:site_name" },
    { property: "og:type", content: "website", vmid: "og:type" },
    { property: "og:locale", content: "ru_RU", vmid: "og:locale" },
    // twitter
    { name: "twitter:card", content: "summary_large_image", vmid: "twitter:card" }
  ],
  link: [
    { rel: "canonical", href: SITE_URL, vmid: "canonical" }
  ]
  // можно добавить jsonLd или другие поля при необходимости
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    useHead(defaultHead);
    const userStore = useUserStore();
    const route = useRoute$1();
    const isHome = computed(() => route.path === "/");
    computed(() => !!userStore.isAuthenticated);
    computed(() => userStore.user || null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "main__container" }, _attrs))}>`);
      if (isHome.value) {
        _push(ssrRenderComponent(LandingHeader, null, null, _parent));
      } else {
        _push(ssrRenderComponent(Header, null, null, _parent));
      }
      _push(ssrRenderComponent(AlertsContainer, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtPage, { class: "main__body" }, null, _parent));
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import("./_nuxt/error-404-Do_ozxqR.js"));
    const _Error = defineAsyncComponent(() => import("./_nuxt/error-500-DGmE-xbP.js"));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    var _a;
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      (_a = nuxt.payload).error || (_a.error = createError(error));
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);
export {
  API as A,
  LoginModal as L,
  NuxtIcon as N,
  _export_sfc as _,
  __nuxt_component_0$1 as a,
  __nuxt_component_0$2 as b,
  useUserStore as c,
  useAlertStore as d,
  entry$1 as default,
  navigateTo as n,
  useHead as u
};
//# sourceMappingURL=server.mjs.map
