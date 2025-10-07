import { defineComponent, shallowRef, h, resolveComponent, hasInjectionContext, getCurrentInstance, computed, createElementBlock, provide, cloneVNode, defineAsyncComponent, ref, inject, Suspense, Fragment, useSSRContext, createApp, shallowReactive, createVNode, resolveDynamicComponent, mergeProps, openBlock, createElementVNode, toRef, onErrorCaptured, onServerPrefetch, unref, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, getCurrentScope, withCtx, createTextVNode, toDisplayString, watch, nextTick } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue/index.mjs';
import { $fetch } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ofetch/dist/node.mjs';
import { e as baseURL } from '../nitro/nitro.mjs';
import { createHooks } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/hookable/dist/index.mjs';
import { getContext, executeAsync } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unctx/dist/index.mjs';
import { sanitizeStatusCode, createError as createError$1, appendHeader } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/h3/dist/index.mjs';
import { defineStore, createPinia, setActivePinia, shouldHydrate } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/pinia/dist/pinia.prod.cjs';
import { defu } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/defu/dist/defu.mjs';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue-router/dist/vue-router.node.mjs';
import { toRouteMatcher, createRouter as createRouter$1 } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/radix3/dist/index.mjs';
import { parseQuery, hasProtocol, isScriptProtocol, joinURL, withQuery, withTrailingSlash, withoutTrailingSlash } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ufo/dist/index.mjs';
import { ssrRenderVNode, ssrRenderSuspense, ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/vue/server-renderer/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/destr/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/node-mock-http/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ohash/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/klona/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/scule/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/pathe/dist/index.mjs';
import 'file:///Users/danielgreen/Documents/sprintweb/nexusbuild/node_modules/ipx/dist/index.mjs';

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
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
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
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
const _routes = [
  {
    name: "faq",
    path: "/faq",
    component: () => import('./faq-CY3Zr0_3.mjs')
  },
  {
    name: "blog",
    path: "/blog",
    component: () => import('./blog-Cs-11t_F.mjs')
  },
  {
    name: "about",
    path: "/about",
    component: () => import('./about-DCTiPqJT.mjs')
  },
  {
    name: "admin",
    path: "/admin",
    component: () => import('./admin-DycVp_oZ.mjs')
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-cLjX-sul.mjs')
  },
  {
    name: "login",
    path: "/login",
    component: () => import('./login-UxcJ1qva.mjs')
  },
  {
    name: "pricing",
    path: "/pricing",
    component: () => import('./pricing-CloIwPoc.mjs')
  },
  {
    name: "profile",
    path: "/profile",
    component: () => import('./profile-jfHiOu1f.mjs')
  },
  {
    name: "contacts",
    path: "/contacts",
    component: () => import('./contacts-CNNFkz_s.mjs')
  },
  {
    name: "register",
    path: "/register",
    component: () => import('./register-CBFvJqlN.mjs')
  },
  {
    name: "services",
    path: "/services",
    component: () => import('./services-Cs_m6C7e.mjs')
  },
  {
    name: "templates",
    path: "/templates",
    component: () => import('./templates-_oxWeK3x.mjs')
  },
  {
    name: "buy-template-id",
    path: "/buy-template/:id()",
    component: () => import('./_id_-BISEckwS.mjs')
  },
  {
    name: "buy-template",
    path: "/buy-template",
    component: () => import('./index-C5TP2lb-.mjs')
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
    const routes2 = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
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
      routes: routes2
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
          for (const entry2 of toArray$1(componentMiddleware)) {
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
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
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
function useRequestEvent(nuxtApp) {
  var _a;
  nuxtApp || (nuxtApp = useNuxtApp());
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function prerenderRoutes(path) {
  const paths = toArray(path);
  appendHeader(useRequestEvent(), "x-nitro-prerender", paths.map((p) => encodeURIComponent(p)).join(", "));
}
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
const LazySvgoIconClick = defineAsyncComponent(() => Promise.resolve().then(() => iconClick).then((r) => r["default"] || r.default || r));
const LazySvgoOpenNext = defineAsyncComponent(() => import('./open-next-BTngSjB-.mjs').then((r) => r["default"] || r.default || r));
const LazySvgoUser = defineAsyncComponent(() => import('./user-CYYBwZaE.mjs').then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["SvgoIconClick", LazySvgoIconClick],
  ["SvgoOpenNext", LazySvgoOpenNext],
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
let routes;
const prerender_server_sqIxOBipVr4FbVMA9kqWL0wT8FPop6sKAXLVfifsJzk = /* @__PURE__ */ defineNuxtPlugin(async () => {
  let __temp, __restore;
  if (routes && !routes.length) {
    return;
  }
  (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules;
  routes || (routes = Array.from(processRoutes(([__temp, __restore] = executeAsync(() => {
    var _a;
    return (_a = routerOptions.routes) == null ? void 0 : _a.call(routerOptions, _routes);
  }), __temp = await __temp, __restore(), __temp) ?? _routes)));
  const batch = routes.splice(0, 10);
  prerenderRoutes(batch);
});
const OPTIONAL_PARAM_RE = /^\/?:.*(?:\?|\(\.\*\)\*)$/;
function shouldPrerender(path) {
  return true;
}
function processRoutes(routes2, currentPath = "/", routesToPrerender = /* @__PURE__ */ new Set()) {
  var _a;
  for (const route of routes2) {
    if (OPTIONAL_PARAM_RE.test(route.path) && !((_a = route.children) == null ? void 0 : _a.length) && shouldPrerender()) {
      routesToPrerender.add(currentPath);
    }
    if (route.path.includes(":")) {
      continue;
    }
    const fullPath = joinURL(currentPath, route.path);
    {
      routesToPrerender.add(fullPath);
    }
    if (route.children) {
      processRoutes(route.children, fullPath, routesToPrerender);
    }
  }
  return routesToPrerender;
}
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  prerender_server_sqIxOBipVr4FbVMA9kqWL0wT8FPop6sKAXLVfifsJzk
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
const _sfc_main$7 = {
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-svgo/dist/runtime/components/nuxt-icon.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const NuxtIcon = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender]]);
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
const IconClick = { render() {
  return h(NuxtIcon, { icon: { render }, name: "icon-click" });
} };
const iconClick = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: IconClick,
  render
}, Symbol.toStringTag, { value: "Module" }));
const API = {
  currentBuild: "base",
  // 'dev' или 'base'
  base: {
    protocol: "https",
    url: "life30server.ru",
    port: "",
    subpage: "sitebypro"
  },
  dev: {
    protocol: "http",
    url: "localhost",
    port: ":3000",
    subpage: "sitebypro"
  },
  get fullUrl() {
    const config = this[this.currentBuild];
    return `${config.protocol}://${config.url}${config.port}/${config.subpage}`;
  }
};
const useUserStore = defineStore("user", {
  state: () => ({
    loading: false,
    error: null,
    user: null,
    token: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token
  },
  actions: {
    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          this.error = data.message || "Ошибка регистрации";
          throw new Error(this.error);
        }
        await this.login({
          email: payload.email,
          password: payload.password
        });
        return await res.json();
      } catch (err) {
        this.error = this.error || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async login(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const data2 = await res.json().catch(() => ({}));
          this.error = data2.message || "Ошибка авторизации";
          throw new Error(this.error);
        }
        const data = await res.json();
        this.user = data.user || null;
        this.token = data.token || null;
        if (this.token) {
          localStorage.setItem("token", this.token);
        }
        return data;
      } catch (err) {
        this.error = this.error || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
    async fetchCurrentUser() {
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/me`, {
          headers: { "Authorization": `Bearer ${this.token}` }
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          this.error = data.message || "Не удалось получить данные пользователя";
          throw new Error(this.error);
        }
        this.user = await res.json();
      } catch (err) {
        this.error = this.error || err.message;
        this.logout();
      } finally {
        this.loading = false;
      }
    },
    async updateUser(payload) {
      if (!this.token) throw new Error("Не авторизован");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/update-user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          this.error = data.message || "Ошибка обновления данных";
          throw new Error(this.error);
        }
        this.user = await res.json();
        return this.user;
      } catch (err) {
        this.error = this.error || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // Новая функция для автоматической подгрузки токена и пользователя при старте
    async init() {
      const token = localStorage.getItem("token");
      console.log(token);
      if (token) {
        this.token = token;
        await this.fetchCurrentUser();
      }
    }
  }
});
const _sfc_main$6 = {
  __name: "RegisterModal",
  __ssrInlineRender: true,
  props: { visible: Boolean },
  emits: ["update:visible"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useUserStore();
    const fullname = ref("");
    const city = ref("");
    ref("");
    const phoneError = ref("");
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const modal = ref(null);
    watch(() => props.visible, async (v) => {
      if (v) {
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
        }, _attrs))} data-v-7e4f35b5><div class="modal" tabindex="-1" data-v-7e4f35b5><button class="modal__close" aria-label="Закрыть" data-v-7e4f35b5>✕</button><h3 class="modal__title" data-v-7e4f35b5>Создать пользователя</h3><form class="modal__form" data-v-7e4f35b5><label class="modal__field" data-v-7e4f35b5><span class="modal__label" data-v-7e4f35b5>ФИО</span><input${ssrRenderAttr("value", fullname.value)} type="text" required autocomplete="name"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-7e4f35b5></label><label class="modal__field" data-v-7e4f35b5><span class="modal__label" data-v-7e4f35b5>Город</span><input${ssrRenderAttr("value", city.value)} type="text" required autocomplete="address-level2"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-7e4f35b5></label><label class="modal__field" data-v-7e4f35b5><span class="modal__label" data-v-7e4f35b5>Телефон</span>`);
        _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
        if (phoneError.value) {
          _push(`<div class="field-error" data-v-7e4f35b5>${ssrInterpolate(phoneError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><label class="modal__field" data-v-7e4f35b5><span class="modal__label" data-v-7e4f35b5>Логин</span><input${ssrRenderAttr("value", username.value)} type="text" required autocomplete="username"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-7e4f35b5></label><label class="modal__field" data-v-7e4f35b5><span class="modal__label" data-v-7e4f35b5>Электронная почта</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-7e4f35b5></label><label class="modal__field" data-v-7e4f35b5><span class="modal__label" data-v-7e4f35b5>Пароль</span><input${ssrRenderAttr("value", password.value)} type="password" required autocomplete="new-password"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-7e4f35b5></label><div class="modal__actions" data-v-7e4f35b5><button type="submit" class="button button--primary"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-7e4f35b5>`);
        if (!loading.value) {
          _push(`<span data-v-7e4f35b5>Создать</span>`);
        } else {
          _push(`<span data-v-7e4f35b5>Создание...</span>`);
        }
        _push(`</button><button type="button" class="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-7e4f35b5>Отмена</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/Modals/RegisterModal.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const RegisterModal = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-7e4f35b5"]]);
const _sfc_main$5 = {
  __name: "LoginModal",
  __ssrInlineRender: true,
  props: {
    visible: { type: Boolean, default: false }
  },
  emits: ["update:visible", "login", "create-user", "forgot-password", "register"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    ref(null);
    const emailInput = ref(null);
    const isRegisterOpen = ref(false);
    function onRegistered(user) {
      emit("register", user);
    }
    watch(() => props.visible, async (v) => {
      if (v) {
        await nextTick();
        setTimeout(() => {
          var _a;
          return (_a = emailInput.value) == null ? void 0 : _a.focus();
        }, 50);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-abf6c188>`);
      if (__props.visible) {
        _push(`<div class="modal-overlay" role="dialog" aria-modal="true" data-v-abf6c188><div class="modal" tabindex="-1" data-v-abf6c188><button class="modal__close" aria-label="Закрыть" data-v-abf6c188>✕</button><h3 class="modal__title" data-v-abf6c188>Вход в аккаунт</h3><form class="modal__form" data-v-abf6c188><label class="modal__field" data-v-abf6c188><span class="modal__label" data-v-abf6c188>Электронная почта</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-abf6c188></label><label class="modal__field" data-v-abf6c188><span class="modal__label" data-v-abf6c188>Пароль</span><input${ssrRenderAttr("value", password.value)} type="password" required autocomplete="current-password"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-abf6c188></label><div class="modal__links" data-v-abf6c188><button type="button" class="button button--link"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-abf6c188> Забыли пароль? </button><button type="button" class="button button--link"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-abf6c188> Создать пользователя </button></div><div class="modal__actions" data-v-abf6c188><button type="submit" class="button button--primary"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-abf6c188>`);
        if (!loading.value) {
          _push(`<span data-v-abf6c188>Войти</span>`);
        } else {
          _push(`<span data-v-abf6c188>Вход...</span>`);
        }
        _push(`</button><button type="button" class="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-abf6c188>Отмена</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(RegisterModal, {
        visible: isRegisterOpen.value,
        "onUpdate:visible": ($event) => isRegisterOpen.value = $event,
        onRegister: onRegistered
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/profile/Modals/LoginModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const LoginModal = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-abf6c188"]]);
const _sfc_main$4 = {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const isUserMenuOpen = ref(false);
    const isMobileMenuOpen = ref(false);
    const isLoginModalOpen = ref(false);
    const userToken = ref(true);
    const userData = ref({
      name: "Иван Иванов",
      email: "ivan@example.com"
    });
    function handleLogin(user) {
      userData.value = user;
      userToken.value = true;
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
      { path: "/pricing", title: "Цены" },
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
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "app-header" }, _attrs))} data-v-73c34e12><div class="container app-header__container" data-v-73c34e12><div class="app-header__top" data-v-73c34e12>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "app-header__logo"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="app-header__logo-text" data-v-73c34e12${_scopeId}>SITE.BY</span><span class="app-header__logo-badge" data-v-73c34e12${_scopeId}>PRO</span>`);
          } else {
            return [
              createVNode("span", { class: "app-header__logo-text" }, "SITE.BY"),
              createVNode("span", { class: "app-header__logo-badge" }, "PRO")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="app-nav app-nav--primary" data-v-73c34e12><ul class="app-nav__list" data-v-73c34e12><!--[-->`);
      ssrRenderList(primaryPages, (page) => {
        _push(`<li class="app-nav__item" data-v-73c34e12>`);
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
      _push(`<!--]--></ul></nav><div class="app-header__actions" data-v-73c34e12><a href="https://t.me/dozer_stoun" class="button button--outline app-header__telegram" target="_blank" data-v-73c34e12><span class="app-header__telegram-icon" data-v-73c34e12>`);
      _push(ssrRenderComponent(unref(IconClick), { class: "app-header__telegram-img" }, null, _parent));
      _push(`</span><span class="app-header__telegram-text" data-v-73c34e12>Купить в клик</span></a>`);
      if (userToken.value && userData.value && userData.value.name) {
        _push(`<div class="app-header__profile" data-v-73c34e12><button class="app-header__profile-toggle" data-v-73c34e12><div class="app-header__avatar" data-v-73c34e12>👤</div><span class="app-header__user-name" data-v-73c34e12>${ssrInterpolate(userData.value.name)}</span></button>`);
        if (isUserMenuOpen.value) {
          _push(`<div class="user-menu" data-v-73c34e12><div class="user-menu__header" data-v-73c34e12><div class="user-menu__avatar" data-v-73c34e12>👤</div><div class="user-menu__info" data-v-73c34e12><div class="user-menu__name" data-v-73c34e12>${ssrInterpolate(userData.value.name)}</div><div class="user-menu__email" data-v-73c34e12>${ssrInterpolate(userData.value.email)}</div></div></div><ul class="user-menu__list" data-v-73c34e12><li class="user-menu__item" data-v-73c34e12>`);
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
          _push(`</li><li class="user-menu__item" data-v-73c34e12>`);
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
          _push(`</li><li class="user-menu__item" data-v-73c34e12>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile?tab=balance",
            class: "user-menu__link",
            onClick: closeUserMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Баланс`);
              } else {
                return [
                  createTextVNode("Баланс")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li></ul><div class="user-menu__footer" data-v-73c34e12><button class="user-menu__logout" data-v-73c34e12>Выйти из аккаунта</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div data-v-73c34e12><button class="button button--primary" data-v-73c34e12>Войти</button></div>`);
      }
      _push(`<button class="app-header__menu-toggle" data-v-73c34e12><span class="${ssrRenderClass([{ "app-header__menu-icon--active": isMobileMenuOpen.value }, "app-header__menu-icon"])}" data-v-73c34e12></span></button></div></div><div class="app-header__bottom" data-v-73c34e12><nav class="app-nav app-nav--secondary" data-v-73c34e12><ul class="app-nav__list" data-v-73c34e12><!--[-->`);
      ssrRenderList(secondaryPages, (page) => {
        _push(`<li class="app-nav__item" data-v-73c34e12>`);
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
      _push(`<!--]--></ul></nav></div></div><div class="${ssrRenderClass([{ "app-mobile-menu--active": isMobileMenuOpen.value }, "app-mobile-menu"])}" data-v-73c34e12><div class="app-mobile-menu__content" data-v-73c34e12><nav class="app-mobile-nav" data-v-73c34e12><div class="app-mobile-nav__section" data-v-73c34e12><h3 class="app-mobile-nav__title" data-v-73c34e12>Основные</h3><ul class="app-mobile-nav__list" data-v-73c34e12><!--[-->`);
      ssrRenderList(primaryPages, (page) => {
        _push(`<li class="app-mobile-nav__item" data-v-73c34e12>`);
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
      _push(`<!--]--></ul></div><div class="app-mobile-nav__section" data-v-73c34e12><h3 class="app-mobile-nav__title" data-v-73c34e12>Дополнительные</h3><ul class="app-mobile-nav__list" data-v-73c34e12><!--[-->`);
      ssrRenderList(secondaryPages, (page) => {
        _push(`<li class="app-mobile-nav__item" data-v-73c34e12>`);
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
      _push(`<!--]--></ul></div><div class="app-mobile-nav__section" data-v-73c34e12><ul class="app-mobile-nav__list" data-v-73c34e12><li class="app-mobile-nav__item" data-v-73c34e12><button class="app-mobile-nav__link" data-v-73c34e12>Войти</button></li></ul></div></nav></div></div>`);
      _push(ssrRenderComponent(LoginModal, {
        visible: isLoginModalOpen.value,
        "onUpdate:visible": ($event) => isLoginModalOpen.value = $event,
        onLogin: handleLogin
      }, null, _parent));
      _push(`</header>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-73c34e12"]]);
const _sfc_main$3 = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const telegramLink = ref("https://t.me/dozer_stoun");
    ref((/* @__PURE__ */ new Date()).getFullYear());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-3ae4bd54><div class="footer__container container" data-v-3ae4bd54><div class="footer__brand" data-v-3ae4bd54><div class="footer__logo" data-v-3ae4bd54>SiteByPro</div><p class="footer__tagline" data-v-3ae4bd54>Быстрые сайты для быстрых денег</p><a${ssrRenderAttr("href", telegramLink.value)} class="footer__telegram" target="_blank" rel="noopener" aria-label="Наш Telegram" data-v-3ae4bd54><span class="footer__telegram-icon" data-v-3ae4bd54>✈️</span><span class="footer__telegram-text" data-v-3ae4bd54>Пишите в Telegram</span></a></div><div class="footer__nav" data-v-3ae4bd54><h4 class="footer__title" data-v-3ae4bd54>Навигация</h4><ul class="footer__list" data-v-3ae4bd54><li data-v-3ae4bd54><a href="#" class="footer__link" data-v-3ae4bd54>Главная</a></li><li data-v-3ae4bd54><a href="#" class="footer__link" data-v-3ae4bd54>Портфолио</a></li><li data-v-3ae4bd54><a href="#" class="footer__link" data-v-3ae4bd54>Тарифы</a></li><li data-v-3ae4bd54><a href="#" class="footer__link" data-v-3ae4bd54>Блог</a></li></ul></div><div class="footer__services" data-v-3ae4bd54><h4 class="footer__title" data-v-3ae4bd54>Услуги</h4><ul class="footer__list" data-v-3ae4bd54><li data-v-3ae4bd54><a href="#" class="footer__link" data-v-3ae4bd54>Лендинги</a></li><li data-v-3ae4bd54><a href="#" class="footer__link" data-v-3ae4bd54>Корпоративные сайты</a></li><li data-v-3ae4bd54><a href="#" class="footer__link" data-v-3ae4bd54>Интернет-магазины</a></li><li data-v-3ae4bd54><a href="#" class="footer__link" data-v-3ae4bd54>SEO-оптимизация</a></li></ul></div></div><div class="footer__bottom" data-v-3ae4bd54><div class="container" data-v-3ae4bd54><div class="footer__copyright" data-v-3ae4bd54> © 2022 sitebypro. Продажа сайтов. <span class="footer__highlight" data-v-3ae4bd54>Быстрые сайты.</span></div></div></div></footer>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Footer.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3ae4bd54"]]);
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    userStore.init();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
};
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
    const _Error404 = defineAsyncComponent(() => import('./error-404-Ce5IC_m-.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-CB-Kfm_R.mjs'));
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

export { API as A, NuxtIcon as N, _export_sfc as _, __nuxt_component_0$1 as a, entry$1 as default, navigateTo as n, tryUseNuxtApp as t, useUserStore as u };
//# sourceMappingURL=server.mjs.map
