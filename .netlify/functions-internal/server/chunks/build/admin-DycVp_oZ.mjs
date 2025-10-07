import { defineStore } from 'pinia';
import { _ as _export_sfc, A as API } from './server.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import 'vue-router';

const useLandingStore = defineStore("landing", {
  state: () => ({
    loading: false,
    error: null,
    landings: [],
    landing: null
  }),
  getters: {
    isLoading(state) {
      return state.loading;
    },
    hasError(state) {
      return !!state.error;
    }
  },
  actions: {
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
    async addLandingSettings(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/landing/add-settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const created = await this.parseResponse(res);
        if (created) {
          const idx = this.landings.findIndex((l) => l.id && created.id && l.id === created.id || l.uid && created.uid && l.uid === created.uid);
          if (idx !== -1) this.landings.splice(idx, 1, created);
          else this.landings.unshift(created);
          this.landing = created;
        }
        return created;
      } catch (err) {
        this.error = err.message || "\u041E\u0448\u0438\u0431\u043A\u0430";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchLanding(id) {
      if (!id) throw new Error("id \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/landing/landing/${id}`);
        const data = await this.parseResponse(res);
        this.landing = data;
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchLandingByUid(uid) {
      if (!uid) throw new Error("uid \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/landing/landing-uid/${uid}`);
        const data = await this.parseResponse(res);
        this.landing = data;
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/landing/landings`);
        const data = await this.parseResponse(res);
        this.landings = Array.isArray(data) ? data : data ? [data] : [];
        return this.landings;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updateLanding(id, payload) {
      if (!id) throw new Error("id \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/landing/landing/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const updated = await this.parseResponse(res);
        if (updated) {
          const idx = this.landings.findIndex((l) => l.id && updated.id && l.id === updated.id);
          if (idx !== -1) this.landings.splice(idx, 1, updated);
          this.landing = updated;
        }
        return updated;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteLanding(id) {
      if (!id) throw new Error("id \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D");
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API.fullUrl}/landing/landing/${id}`, { method: "DELETE" });
        const deleted = await this.parseResponse(res);
        const idx = this.landings.findIndex((l) => l.id && l.id === Number(id) || l.id && l.id === id);
        if (idx !== -1) this.landings.splice(idx, 1);
        if (this.landing && (this.landing.id === id || this.landing.id === Number(id))) this.landing = null;
        return deleted;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
const _sfc_main = {
  name: "LandingTable",
  data() {
    return {
      landings: [],
      newLanding: {
        uid: "",
        bg_color: "#f5511e",
        font: null,
        logo: "",
        user_uid: "",
        title: "",
        preview: null,
        url: null,
        url_preview: null
      },
      dateFrom: "",
      dateTo: "",
      error: null
    };
  },
  computed: {
    filteredLandings() {
      return this.landings.filter((l) => {
        if (!l.dt_created) return true;
        const created = new Date(l.dt_created);
        const from = this.dateFrom ? new Date(this.dateFrom) : null;
        const to = this.dateTo ? new Date(this.dateTo) : null;
        if (from && created < from) return false;
        if (to && created > to) return false;
        return true;
      });
    }
  },
  methods: {
    async fetchAll() {
      try {
        const store = useLandingStore();
        this.landings = await store.fetchAll();
      } catch (err) {
        this.error = err.message;
      }
    },
    async addLanding() {
      try {
        const store = useLandingStore();
        const created = await store.addLandingSettings(this.newLanding);
        const exists = this.landings.find((l) => l.id === created.id);
        if (!exists) this.landings.unshift(created);
        this.newLanding = { uid: "", bg_color: "#f5511e", font: null, logo: "", user_uid: "", title: "", preview: null, url: null, url_preview: null };
        this.error = null;
      } catch (err) {
        this.error = err.message;
      }
    },
    async updateLanding(landing) {
      try {
        const store = useLandingStore();
        await store.updateLanding(landing.id, landing);
        this.error = null;
      } catch (err) {
        this.error = err.message;
      }
    },
    async deleteLanding(id) {
      try {
        const store = useLandingStore();
        await store.deleteLanding(id);
        this.landings = this.landings.filter((l) => l.id !== id);
      } catch (err) {
        this.error = err.message;
      }
    }
  },
  mounted() {
    this.fetchAll();
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-6xl mx-auto" }, _attrs))} data-v-6768c2ae><h2 class="text-2xl font-bold mb-6" data-v-6768c2ae>\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u043C\u0438</h2><div class="flex gap-4 mb-4" data-v-6768c2ae><div data-v-6768c2ae><label data-v-6768c2ae>\u0421:</label><input type="date"${ssrRenderAttr("value", $data.dateFrom)} class="border rounded p-2" data-v-6768c2ae></div><div data-v-6768c2ae><label data-v-6768c2ae>\u041F\u043E:</label><input type="date"${ssrRenderAttr("value", $data.dateTo)} class="border rounded p-2" data-v-6768c2ae></div></div><div class="overflow-x-auto border rounded-lg mb-6" data-v-6768c2ae><table class="min-w-full divide-y divide-gray-200" data-v-6768c2ae><thead class="bg-gray-100" data-v-6768c2ae><tr data-v-6768c2ae><th class="px-4 py-2 text-left text-sm font-medium text-gray-700" data-v-6768c2ae>ID</th><th class="px-4 py-2 text-left text-sm font-medium text-gray-700" data-v-6768c2ae>UID</th><th class="px-4 py-2 text-left text-sm font-medium text-gray-700" data-v-6768c2ae>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</th><th class="px-4 py-2 text-left text-sm font-medium text-gray-700" data-v-6768c2ae>\u0426\u0432\u0435\u0442 \u0444\u043E\u043D\u0430</th><th class="px-4 py-2 text-left text-sm font-medium text-gray-700" data-v-6768c2ae>\u041B\u043E\u0433\u043E\u0442\u0438\u043F</th><th class="px-4 py-2 text-left text-sm font-medium text-gray-700" data-v-6768c2ae>\u0414\u0430\u0442\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F</th><th class="px-4 py-2 text-left text-sm font-medium text-gray-700" data-v-6768c2ae>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th></tr></thead><tbody class="bg-white divide-y divide-gray-200" data-v-6768c2ae><!--[-->`);
  ssrRenderList($options.filteredLandings, (landing) => {
    _push(`<tr class="hover:bg-gray-50" data-v-6768c2ae><td class="px-4 py-2 text-sm text-gray-700" data-v-6768c2ae>${ssrInterpolate(landing.id)}</td><td class="px-4 py-2 text-sm text-gray-700" data-v-6768c2ae>${ssrInterpolate(landing.uid)}</td><td class="px-4 py-2" data-v-6768c2ae><input${ssrRenderAttr("value", landing.title)} class="border rounded px-2 py-1 w-full" data-v-6768c2ae></td><td class="px-4 py-2" data-v-6768c2ae><input${ssrRenderAttr("value", landing.bg_color)} type="color" class="w-full h-8 border rounded p-1" data-v-6768c2ae></td><td class="px-4 py-2" data-v-6768c2ae><input${ssrRenderAttr("value", landing.logo)} class="border rounded px-2 py-1 w-full" data-v-6768c2ae></td><td class="px-4 py-2 text-sm text-gray-700" data-v-6768c2ae>${ssrInterpolate(landing.dt_created ? new Date(landing.dt_created).toLocaleString() : "")}</td><td class="px-4 py-2 space-x-2" data-v-6768c2ae><button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" data-v-6768c2ae>\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button><button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" data-v-6768c2ae>\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button></td></tr>`);
  });
  _push(`<!--]--></tbody></table></div><h3 class="text-xl font-semibold mb-2" data-v-6768c2ae>\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-v-6768c2ae><input${ssrRenderAttr("value", $data.newLanding.title)} placeholder="\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" class="border rounded p-2" data-v-6768c2ae><input${ssrRenderAttr("value", $data.newLanding.bg_color)} type="color" class="border rounded p-2" data-v-6768c2ae><input${ssrRenderAttr("value", $data.newLanding.logo)} placeholder="URL \u043B\u043E\u0433\u043E\u0442\u0438\u043F\u0430" class="border rounded p-2" data-v-6768c2ae><input${ssrRenderAttr("value", $data.newLanding.user_uid)} placeholder="User UID" class="border rounded p-2" data-v-6768c2ae></div><button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" data-v-6768c2ae>\u0421\u043E\u0437\u0434\u0430\u0442\u044C</button>`);
  if ($data.error) {
    _push(`<div class="mt-4 text-red-600" data-v-6768c2ae>${ssrInterpolate($data.error)}</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-6768c2ae"]]);

export { admin as default };
//# sourceMappingURL=admin-DycVp_oZ.mjs.map
