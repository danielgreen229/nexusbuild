import { ref, computed, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { defineStore } from 'pinia';
import { _ as _export_sfc, A as API } from './server.mjs';

const useDomainStore = defineStore("domain", {
  state: () => ({
    loading: false,
    error: null,
    // Результаты поиска похожих доменов
    searchResults: [],
    lastSearchKeyword: null,
    // Деплой / регистрация
    lastDeploy: null,
    // Netlify
    netlifySites: [],
    siteInfo: null,
    // DNS статусы кэш (domain -> status)
    dnsStatuses: {}
  }),
  getters: {
    isLoading(state) {
      return state.loading;
    },
    hasError(state) {
      return !!state.error;
    },
    getDnsStatus: (state) => (domain) => {
      return state.dnsStatuses[domain] || null;
    }
  },
  actions: {
    // Универсальный парсер ответа (совместим с вашим formResult)
    async parseResponse(res) {
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = json && (json.data || json.description || json.message) || res.statusText || "Network error";
        throw new Error(msg);
      }
      if (json && (json.status === "200" || json.status === 200)) {
        return json.data;
      }
      return json && json.data !== void 0 ? json.data : json;
    },
    /* ========== Search similar domains ========== */
    async searchSimilarDomains(keyword, opts = {}) {
      if (!keyword || typeof keyword !== "string") throw new Error("keyword \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D");
      this.loading = true;
      this.error = null;
      try {
        const payload = {
          keyword,
          ...opts.tlds ? { tlds: opts.tlds } : {},
          ...opts.maxResults ? { maxResults: opts.maxResults } : {},
          ...opts.batchSize ? { batchSize: opts.batchSize } : {}
        };
        const res = await fetch(`${API.fullUrl}/deploy/search-similar-domains`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await this.parseResponse(res);
        if (data && Array.isArray(data.results)) {
          this.searchResults = data.results;
        } else if (Array.isArray(data)) {
          this.searchResults = data;
        } else {
          this.searchResults = data ? data.results || [] : [];
        }
        this.lastSearchKeyword = keyword;
        return this.searchResults;
      } catch (err) {
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u0438\u0441\u043A\u0430 \u0434\u043E\u043C\u0435\u043D\u043E\u0432";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /* ========== Deploy with domain (register + deploy) ========== */
    async deployWithDomain({ templateId, domain, period = 1 }) {
      if (!templateId || !domain) throw new Error("templateId \u0438 domain \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/deploy/deploy-with-domain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId, domain, period })
        });
        const data = await this.parseResponse(res);
        this.lastDeploy = data;
        return data;
      } catch (err) {
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0434\u0435\u043F\u043B\u043E\u044F";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /* ========== Attach domain by siteId ========== */
    async attachDomain(siteId, domain) {
      if (!siteId || !domain) throw new Error("siteId \u0438 domain \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/deploy/attach-domain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteId, domain })
        });
        const data = await this.parseResponse(res);
        return data;
      } catch (err) {
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 attach";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /* ========== Attach domain by site name ========== */
    async attachDomainByName(siteName, domain) {
      if (!siteName || !domain) throw new Error("siteName \u0438 domain \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/deploy/attach-domain-by-name`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteName, domain })
        });
        const data = await this.parseResponse(res);
        return data;
      } catch (err) {
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 attach by name";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /* ========== Verify site (get site info) ========== */
    async verifySite(siteId) {
      if (!siteId) throw new Error("siteId \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/deploy/verify-site/${encodeURIComponent(siteId)}`);
        const data = await this.parseResponse(res);
        this.siteInfo = data;
        return data;
      } catch (err) {
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 verify";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /* ========== Fetch Netlify sites ========== */
    async fetchNetlifySites() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/deploy/netlify-sites`);
        const data = await this.parseResponse(res);
        this.netlifySites = Array.isArray(data) ? data : data ? [data] : [];
        return this.netlifySites;
      } catch (err) {
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u0430\u0439\u0442\u043E\u0432";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /* ========== Check DNS status ========== */
    async checkDns(domain) {
      if (!domain) throw new Error("domain \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/deploy/check-dns/${encodeURIComponent(domain)}`);
        const data = await this.parseResponse(res);
        if (data && data.domain) {
          this.dnsStatuses[data.domain] = data.dns_status;
        } else if (data && data.dns_status) {
          this.dnsStatuses[domain] = data.dns_status;
        }
        return data;
      } catch (err) {
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 DNS";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /* Утилитные методы */
    clearError() {
      this.error = null;
    },
    resetSearch() {
      this.searchResults = [];
      this.lastSearchKeyword = null;
    }
  }
});
const _sfc_main = {
  __name: "domain-finder",
  __ssrInlineRender: true,
  emits: ["select-domain"],
  setup(__props, { emit: __emit }) {
    const store = useDomainStore();
    const keyword = ref("");
    ref("");
    ref(20);
    const loading = computed(() => store.loading);
    const error = computed(() => store.error);
    const searchResults = computed(() => store.searchResults);
    const lastKeyword = computed(() => store.lastSearchKeyword);
    ref(false);
    ref(false);
    ref(null);
    const lastDeploy = ref(null);
    reactive({ domain: "", templateId: "", period: 1, waitForDns: true });
    function availabilityText(av) {
      if (av === true || av === "available" || typeof av === "string" && av.toLowerCase && av.toLowerCase().includes("\u0441\u0432\u043E\u0431\u043E\u0434")) return "\u0421\u0432\u043E\u0431\u043E\u0434\u0435\u043D";
      if (av === false) return "\u0417\u0430\u043D\u044F\u0442";
      return "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
    }
    function availabilityClass(av) {
      if (av === true || av === "available") return "badge-available";
      if (av === false) return "badge-taken";
      return "badge-unknown";
    }
    function isAvailable(av) {
      return av === true || av === "available" || typeof av === "string" && av.toLowerCase && av.toLowerCase().includes("\u0441\u0432\u043E\u0431\u043E\u0434");
    }
    function formatPrice(price, cur) {
      if (price === null || price === void 0) return "\u2014";
      return `${price} ${cur || "RUB"}`;
    }
    function extractTld(fqdn) {
      if (!fqdn) return "";
      const parts = fqdn.split(".");
      return parts.length ? parts[parts.length - 1] : "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "df-root" }, _attrs))} data-v-b7d285b0><main class="df-container" data-v-b7d285b0><section class="df-search-card" data-v-b7d285b0><form class="df-form" data-v-b7d285b0><div class="df-row" data-v-b7d285b0><label class="df-label" data-v-b7d285b0>\u041A\u043B\u044E\u0447\u0435\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E</label><input${ssrRenderAttr("value", keyword.value)} class="df-input" placeholder="\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: mybrand" data-v-b7d285b0></div><div class="df-row df-row--inline" data-v-b7d285b0><div class="df-actions" data-v-b7d285b0><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="btn btn-primary" type="submit" data-v-b7d285b0>`);
      if (!loading.value) {
        _push(`<span data-v-b7d285b0>\u041F\u043E\u0438\u0441\u043A</span>`);
      } else {
        _push(`<span data-v-b7d285b0>\u0418\u0434\u0451\u0442 \u043F\u043E\u0438\u0441\u043A...</span>`);
      }
      _push(`</button></div></div></form>`);
      if (error.value) {
        _push(`<div class="df-error" data-v-b7d285b0>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
      if (searchResults.value && searchResults.value.length) {
        _push(`<section class="df-results" data-v-b7d285b0><div class="df-results-header" data-v-b7d285b0><div data-v-b7d285b0>\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0434\u0431\u043E\u0440\u0430 \u0434\u043B\u044F \xAB<strong data-v-b7d285b0>${ssrInterpolate(lastKeyword.value)}</strong>\xBB \u2014 ${ssrInterpolate(searchResults.value.length)}</div></div><table class="df-table" data-v-b7d285b0><thead data-v-b7d285b0><tr data-v-b7d285b0><th data-v-b7d285b0>\u0414\u043E\u043C\u0435\u043D</th><th data-v-b7d285b0>\u0421\u0442\u0430\u0442\u0443\u0441</th><th data-v-b7d285b0>\u0426\u0435\u043D\u0430</th><th data-v-b7d285b0>TLD</th><th data-v-b7d285b0></th></tr></thead><tbody data-v-b7d285b0><!--[-->`);
        ssrRenderList(searchResults.value, (item) => {
          var _a, _b;
          _push(`<tr data-v-b7d285b0><td class="td-domain" data-v-b7d285b0><div class="domain-name" data-v-b7d285b0>${ssrInterpolate(item.fqdn)}</div><div class="domain-sub" data-v-b7d285b0>${ssrInterpolate(((_b = (_a = item.attrs) == null ? void 0 : _a.raw) == null ? void 0 : _b.fqdn) || item.fqdn)}</div></td><td data-v-b7d285b0><span class="${ssrRenderClass(["badge", availabilityClass(item.available)])}" data-v-b7d285b0>${ssrInterpolate(availabilityText(item.available))}</span></td><td data-v-b7d285b0>`);
          if (!isAvailable(item.available)) {
            _push(`<div data-v-b7d285b0>-</div>`);
          } else if (item.price !== null && item.price !== void 0) {
            _push(`<div data-v-b7d285b0>${ssrInterpolate(formatPrice(item.price, item.price_currency))}</div>`);
          } else {
            _push(`<div class="muted" data-v-b7d285b0>\u2014</div>`);
          }
          _push(`</td><td data-v-b7d285b0>${ssrInterpolate(item.tld || extractTld(item.fqdn))}</td><td class="td-actions" data-v-b7d285b0><button class="btn small" data-v-b7d285b0>Whois</button><button class="btn primary small"${ssrIncludeBooleanAttr(!isAvailable(item.available) || item.price == null) ? " disabled" : ""} data-v-b7d285b0> \u0412\u044B\u0431\u0440\u0430\u0442\u044C </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></section>`);
      } else {
        _push(`<!--[-->`);
        if (!loading.value) {
          _push(`<section class="df-empty" data-v-b7d285b0><div class="empty-illustration" data-v-b7d285b0>\u{1F50E}</div><div class="empty-sub" data-v-b7d285b0>\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041F\u043E\u0438\u0441\u043A\xBB, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0434\u043E\u0431\u0440\u0430\u0442\u044C \u0434\u043E\u043C\u0435\u043D</div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      if (lastDeploy.value) {
        _push(`<section class="df-deploy-result" data-v-b7d285b0><h3 data-v-b7d285b0>\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438/\u0434\u0435\u043F\u043B\u043E\u044F</h3><div class="deploy-grid" data-v-b7d285b0><div data-v-b7d285b0>\u0414\u043E\u043C\u0435\u043D: <strong data-v-b7d285b0>${ssrInterpolate(lastDeploy.value.domain)}</strong></div>`);
        if (lastDeploy.value.netlify_url) {
          _push(`<div data-v-b7d285b0>Netlify: <a${ssrRenderAttr("href", lastDeploy.value.netlify_url)} target="_blank" data-v-b7d285b0>\u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0430\u0439\u0442</a></div>`);
        } else {
          _push(`<!---->`);
        }
        if (lastDeploy.value.admin_url) {
          _push(`<div data-v-b7d285b0>Admin: <a${ssrRenderAttr("href", lastDeploy.value.admin_url)} target="_blank" data-v-b7d285b0>\u0430\u0434\u043C\u0438\u043D\u043A\u0430</a></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div data-v-b7d285b0>DNS \u0441\u0442\u0430\u0442\u0443\u0441: <strong data-v-b7d285b0>${ssrInterpolate(lastDeploy.value.dns_status || "pending")}</strong></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/domain/domain-finder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DomainFinder = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b7d285b0"]]);

export { DomainFinder as D };
//# sourceMappingURL=domain-finder-SxdG_QPK.mjs.map
