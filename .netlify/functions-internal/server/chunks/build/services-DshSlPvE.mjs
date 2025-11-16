import { b as buildAssetsURL } from '../nitro/nitro.mjs';
import { defineComponent, ref, computed, createVNode, resolveDynamicComponent, withCtx, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrRenderVNode, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, R as RequestModal } from './server.mjs';
import NextCircle from './next-circle-CvWlHJEr.mjs';
import { u as useSEO } from './useSEO-CGkjS5so.mjs';
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
import 'unhead/utils';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';

const landing = "" + buildAssetsURL("landing.CiC1knjC.mp4");
const order = "" + buildAssetsURL("order.BAZQkS6Q.mp4");
const video3D = "" + buildAssetsURL("3D.GQEWSoqN.mp4");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "services",
  __ssrInlineRender: true,
  props: {
    node: {
      type: Object,
      default: () => ({
        id: void 0,
        title: "\u0423\u0441\u043B\u0443\u0433\u0438",
        titleProps: { tag: "h2", class: "", align: "center" },
        buttonLabel: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C",
        mode: "multiple",
        closeOnOutside: true,
        video: "landing.mp4",
        settings: {
          container: { class: "services-container" },
          section: { class: "services-section" },
          button: { class: "services-toggle" },
          icon: { class: "services-toggle-icon" },
          list: { class: "services-list" }
        },
        children: [
          {
            "id": "web",
            "title": "\u0412\u0435\u0431-<br>\u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0430",
            video: "landing.mp4",
            "titleProps": {
              "tag": "h3"
            },
            "items": [
              {
                "title": "Frontend",
                "href": "/web/frontend"
              },
              {
                "title": "Backend",
                "href": "/web/backend"
              }
            ]
          },
          {
            "id": "design",
            "title": "\u0423\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439<br>\u0434\u0438\u0437\u0430\u0439\u043D",
            video: "order.mp4",
            "items": [
              {
                "title": "UI/UX",
                "href": "/design/uiux"
              }
            ]
          },
          {
            "id": "design-3d",
            "title": "3D-<br>\u043C\u0430\u043A\u0435\u0442\u044B",
            video: "3D.mp4",
            "items": [
              {
                "title": "UI/UX",
                "href": "/design/uiux"
              }
            ]
          }
        ]
      })
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    useSEO({
      title: "\u0423\u0441\u043B\u0443\u0433\u0438",
      description: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0441\u0430\u0439\u0442\u043E\u0432, \u0431\u0440\u0435\u043D\u0434\u0438\u043D\u0433 \u0438 SEO-\u043F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u043E\u0442 SiteByPro \u2014 \u043F\u043E\u043B\u043D\u044B\u0439 \u0446\u0438\u043A\u043B \u0443\u0441\u043B\u0443\u0433 \u0434\u043B\u044F \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044F \u0432\u0430\u0448\u0435\u0433\u043E \u0431\u0438\u0437\u043D\u0435\u0441\u0430 \u043E\u043D\u043B\u0430\u0439\u043D.",
      image: "https://sitebypro-server.ru/static/files/store/preview.png",
      url: "https://sitebypro.com/services"
    });
    const showForm = ref(false);
    function onOpen() {
    }
    function onClose() {
      showForm.value = false;
    }
    function onOpened() {
    }
    function onClosed() {
    }
    const videos = {
      "landing.mp4": landing,
      "order.mp4": order,
      "3D.mp4": video3D
    };
    const props = __props;
    const defaults = {
      id: void 0,
      title: "\u0423\u0441\u043B\u0443\u0433\u0438",
      titleProps: { tag: "h2", class: "", align: "center" },
      buttonLabel: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C",
      mode: "multiple",
      closeOnOutside: true,
      settings: {
        container: { class: "services-container" },
        section: { class: "services-section" },
        button: { class: "services-toggle" },
        icon: { class: "services-toggle-icon" },
        list: { class: "services-list" }
      },
      children: []
    };
    const merged = computed(() => {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const n = props.node || {};
      return {
        id: (_a2 = n.id) != null ? _a2 : defaults.id,
        title: {
          text: (_b2 = n.title) != null ? _b2 : defaults.title,
          tag: ((_c2 = (_a = n.titleProps) == null ? void 0 : _a.tag) != null ? _c2 : defaults.titleProps.tag) || "h2",
          class: (_e2 = (_d2 = (_b = n.titleProps) == null ? void 0 : _b.class) != null ? _d2 : defaults.titleProps.class) != null ? _e2 : "",
          align: (_g2 = (_f2 = (_c = n.titleProps) == null ? void 0 : _c.align) != null ? _f2 : defaults.titleProps.align) != null ? _g2 : "center",
          level: (_i2 = (_h2 = (_d = n.titleProps) == null ? void 0 : _d.level) != null ? _h2 : defaults.titleProps.level) != null ? _i2 : null
        },
        buttonLabel: (_j = n.buttonLabel) != null ? _j : defaults.buttonLabel,
        mode: (_k = n.mode) != null ? _k : defaults.mode,
        closeOnOutside: (_l = n.closeOnOutside) != null ? _l : defaults.closeOnOutside,
        settings: {
          container: (_m = (_e = n.settings) == null ? void 0 : _e.container) != null ? _m : defaults.settings.container,
          section: (_n = (_f = n.settings) == null ? void 0 : _f.section) != null ? _n : defaults.settings.section,
          button: (_o = (_g = n.settings) == null ? void 0 : _g.button) != null ? _o : defaults.settings.button,
          icon: (_p = (_h = n.settings) == null ? void 0 : _h.icon) != null ? _p : defaults.settings.icon,
          list: (_q = (_i = n.settings) == null ? void 0 : _i.list) != null ? _q : defaults.settings.list
        },
        children: (_r = n.children) != null ? _r : defaults.children
      };
    });
    ref(null);
    const openSingle = ref(null);
    const openSet = ref(/* @__PURE__ */ new Set());
    function getVideoUrl(fileName) {
      var _a;
      if (!fileName) return "";
      return (_a = videos[fileName]) != null ? _a : "";
    }
    function isOpen(idx) {
      return merged.value.mode === "single" ? openSingle.value === idx : openSet.value.has(idx);
    }
    ref([]);
    ref([]);
    const blockPrefix = computed(() => {
      return merged.value.id ? String(merged.value.id) : "block";
    });
    function slugify(s) {
      if (!s && s !== 0) return "";
      return String(s).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\-_]/g, "").replace(/-+/g, "-");
    }
    function listId(idx) {
      var _a, _b;
      const child = (_a = merged.value.children[idx]) != null ? _a : {};
      const childBase = child.id ? String(child.id) : slugify((_b = child.title) != null ? _b : `child-${idx}`);
      return `list-${blockPrefix.value}-${childBase}-${idx}`;
    }
    function buttonId(idx) {
      var _a, _b;
      const child = (_a = merged.value.children[idx]) != null ? _a : {};
      const childBase = child.id ? String(child.id) : slugify((_b = child.title) != null ? _b : `child-${idx}`);
      return `button-${blockPrefix.value}-${childBase}-${idx}`;
    }
    function sectionTitleTag(child) {
      var _a2;
      var _a;
      return (_a2 = (_a = child == null ? void 0 : child.titleProps) == null ? void 0 : _a.tag) != null ? _a2 : "h3";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-9dd151bf><div class="services-container" data-v-9dd151bf><!--[-->`);
      ssrRenderList(merged.value.children, (child, idx) => {
        var _a, _b, _c;
        _push(`<div class="services-section" data-v-9dd151bf><button${ssrRenderAttr("id", buttonId(idx))} class="services-toggle"${ssrRenderAttr("aria-expanded", String(isOpen(idx)))}${ssrRenderAttr("aria-controls", listId(idx))} data-v-9dd151bf><div class="img__container" data-v-9dd151bf><div class="img__block" data-v-9dd151bf><video autoplay muted loop class="img__video" playsinline data-v-9dd151bf><source${ssrRenderAttr("src", getVideoUrl(child.video))} type="video/mp4" data-v-9dd151bf></video></div></div><div class="${ssrRenderClass(["about__container-" + child.id, "about__container"])}" data-v-9dd151bf>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(sectionTitleTag(child)), {
          class: "section-title",
          "aria-hidden": "true"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2;
            if (_push2) {
              _push2(`<span data-v-9dd151bf${_scopeId}>${(_a2 = child.title) != null ? _a2 : ""}</span>`);
            } else {
              return [
                createVNode("span", {
                  innerHTML: child.title
                }, null, 8, ["innerHTML"])
              ];
            }
          }),
          _: 2
        }), _parent);
        _push(`<span class="services-toggle-icon" aria-hidden="true" data-v-9dd151bf><span class="icon-plus" data-v-9dd151bf>+</span><span class="icon-minus" data-v-9dd151bf>\u2212</span></span></div></button>`);
        if (isOpen(idx)) {
          _push(`<div${ssrRenderAttr("id", listId(idx))} class="services-list" role="menu" data-v-9dd151bf>`);
          if (child.id === "web" || ((_a = child.title) == null ? void 0 : _a.toLowerCase().includes("\u0432\u0435\u0431"))) {
            _push(`<div class="service-content" data-v-9dd151bf><p class="service-lead" data-v-9dd151bf> \u041F\u043E\u043B\u043D\u044B\u0439 \u043F\u0430\u043A\u0435\u0442 \u0434\u043B\u044F \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u0432\u0430\u0448\u0435\u0433\u043E \u0441\u0430\u0439\u0442\u0430 \u2014 \u043E\u0442 \u0432\u044B\u0431\u043E\u0440\u0430 \u0448\u0430\u0431\u043B\u043E\u043D\u0430 \u0434\u043E \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 CRM. \u041C\u044B \u0440\u0430\u0437\u0431\u0438\u043B\u0438 \u043F\u0440\u043E\u0446\u0435\u0441\u0441 \u043D\u0430 \u043F\u0440\u043E\u0441\u0442\u044B\u0435 \u0448\u0430\u0433\u0438, \u0447\u0442\u043E\u0431\u044B \u0432\u044B \u0442\u043E\u0447\u043D\u043E \u0437\u043D\u0430\u043B\u0438, \u0447\u0442\u043E \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442. </p><ol class="service-steps" data-v-9dd151bf><li data-v-9dd151bf><strong data-v-9dd151bf>\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D</strong><div class="step-desc" data-v-9dd151bf>\u0412\u044B\u0431\u0438\u0440\u0430\u0435\u0442\u0435 \u0433\u043E\u0442\u043E\u0432\u044B\u0439 \u0448\u0430\u0431\u043B\u043E\u043D, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u043F\u043E \u0441\u0442\u0438\u043B\u044E \u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u0443.</div><button class="service-btn" data-v-9dd151bf>\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D `);
            _push(ssrRenderComponent(unref(NextCircle), { class: "next-cirlce__svg" }, null, _parent));
            _push(`</button></li><li data-v-9dd151bf><strong data-v-9dd151bf>\u0412\u044B\u0431\u043E\u0440 \u0434\u043E\u043C\u0435\u043D\u043D\u043E\u0433\u043E \u0438\u043C\u0435\u043D\u0438</strong><div class="step-desc" data-v-9dd151bf>\u041F\u043E\u0434\u0431\u0438\u0440\u0430\u0435\u043C \u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0435\u043C \u0434\u043E\u043C\u0435\u043D \u2014 \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0438\u043C\u044F \u0434\u043B\u044F \u0432\u0430\u0448\u0435\u0433\u043E \u0431\u0440\u0435\u043D\u0434\u0430.</div><button class="service-btn" data-v-9dd151bf>\u041F\u043E\u0434\u043E\u0431\u0440\u0430\u0442\u044C \u0434\u043E\u043C\u0435\u043D `);
            _push(ssrRenderComponent(unref(NextCircle), { class: "next-cirlce__svg" }, null, _parent));
            _push(`</button></li><li data-v-9dd151bf><strong data-v-9dd151bf>\u0421\u0430\u0439\u0442 \u0433\u043E\u0442\u043E\u0432 \u2014 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 CRM</strong><div class="step-desc" data-v-9dd151bf>\u041F\u043E\u0441\u043B\u0435 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438 \u0441\u0430\u0439\u0442\u0430 \u043C\u044B \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0430\u0435\u043C \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0438\u0432\u0430\u0435\u043C \u0432\u0430\u0448\u0443 \u0441\u0438\u0441\u0442\u0435\u043C\u0443 \u0438 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043D\u0443\u044E \u043F\u0430\u043D\u0435\u043B\u044C.</div></li></ol><div class="service-extra" data-v-9dd151bf><p data-v-9dd151bf>\u0415\u0441\u043B\u0438 \u0443 \u0432\u0430\u0441 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u043F\u043E\u0436\u0435\u043B\u0430\u043D\u0438\u044F \u043F\u043E \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0435 \u2014 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435 \u043F\u0443\u043D\u043A\u0442\u044B \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u0443\u0441\u043B\u0443\u0433\u0438 \u0438\u043B\u0438 \u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043F\u0440\u0438 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0438.</p></div></div>`);
          } else if (child.id === "design" || ((_b = child.title) == null ? void 0 : _b.toLowerCase().includes("\u0434\u0438\u0437\u0430\u0439\u043D"))) {
            _push(`<div class="service-content" data-v-9dd151bf><p class="service-lead" data-v-9dd151bf> \u0423\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0434\u0438\u0437\u0430\u0439\u043D \u043F\u043E\u0434 \u0432\u0430\u0448 \u0431\u0438\u0437\u043D\u0435\u0441: \u0432\u0438\u0437\u0443\u0430\u043B, \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u0438 \u0430\u0434\u043C\u0438\u043D\u043A\u0430, \u0433\u043E\u0442\u043E\u0432\u044B\u0435 \u043A \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044E. </p><ol class="service-steps" data-v-9dd151bf><li data-v-9dd151bf><strong data-v-9dd151bf>\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443</strong><div class="step-desc" data-v-9dd151bf>\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0443 \u2014 \u043D\u0430\u0448\u0438 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u044B \u0441\u0432\u044F\u0436\u0443\u0442\u0441\u044F \u0434\u043B\u044F \u0443\u0442\u043E\u0447\u043D\u0435\u043D\u0438\u044F \u0434\u0435\u0442\u0430\u043B\u0435\u0439.</div><button class="service-btn" data-v-9dd151bf>\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443`);
            _push(ssrRenderComponent(unref(NextCircle), { class: "next-cirlce__svg" }, null, _parent));
            _push(`</button></li><li data-v-9dd151bf><strong data-v-9dd151bf>\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0430\u0434\u043C\u0438\u043D\u043A\u0443</strong><div class="step-desc" data-v-9dd151bf>\u041F\u0440\u043E\u0435\u043A\u0442\u0438\u0440\u0443\u0435\u043C \u0438 \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0435\u043C \u0430\u0434\u043C\u0438\u043D-\u043F\u0430\u043D\u0435\u043B\u044C \u043F\u043E\u0434 \u0432\u0430\u0448\u0438 \u0431\u0438\u0437\u043D\u0435\u0441-\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B.</div></li><li data-v-9dd151bf><strong data-v-9dd151bf>\u0418\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F \u0438 \u0437\u0430\u043F\u0443\u0441\u043A</strong><div class="step-desc" data-v-9dd151bf>\u0412\u043D\u0435\u0434\u0440\u044F\u0435\u043C \u0434\u0438\u0437\u0430\u0439\u043D \u043D\u0430 \u0441\u0430\u0439\u0442, \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u043C \u0442\u0435\u0441\u0442\u044B \u0438 \u043F\u0435\u0440\u0435\u0434\u0430\u0451\u043C \u0433\u043E\u0442\u043E\u0432\u044B\u0439 \u043F\u0440\u043E\u0434\u0443\u043A\u0442.</div></li></ol><div class="service-extra" data-v-9dd151bf><p data-v-9dd151bf>\u0415\u0441\u043B\u0438 \u043D\u0443\u0436\u043D\u043E \u2014 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u0438\u043C \u043F\u0440\u043E\u0442\u043E\u0442\u0438\u043F\u044B \u0438 \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u043C\u0430\u043A\u0435\u0442\u044B \u043F\u0435\u0440\u0435\u0434 \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u043E\u0439 \u0432\u0435\u0440\u0441\u0442\u043A\u043E\u0439.</p></div></div>`);
          } else if (child.id === "design-3d" || ((_c = child.title) == null ? void 0 : _c.toLowerCase().includes("3d"))) {
            _push(`<div class="service-content" data-v-9dd151bf><p class="service-lead" data-v-9dd151bf> 3D-\u043C\u0430\u043A\u0435\u0442\u044B \u0438 \u0432\u0438\u0437\u0443\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F: \u043E\u0442 \u043E\u043F\u0440\u043E\u0441\u0430 \u0434\u043E \u0433\u043E\u0442\u043E\u0432\u043E\u0433\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430. </p><ol class="service-steps" data-v-9dd151bf><li data-v-9dd151bf><strong data-v-9dd151bf>\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443</strong><div class="step-desc" data-v-9dd151bf>\u041F\u043E\u0441\u043B\u0435 \u043E\u043F\u0440\u043E\u0441\u0430 \u0432\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0435 \u0437\u0430\u044F\u0432\u043A\u0443 \u2014 \u043C\u044B \u043E\u0446\u0435\u043D\u0438\u0432\u0430\u0435\u043C \u0441\u0440\u043E\u043A\u0438 \u0438 \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C.</div><button class="service-btn" data-v-9dd151bf>\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443`);
            _push(ssrRenderComponent(unref(NextCircle), { class: "next-cirlce__svg" }, null, _parent));
            _push(`</button></li><li data-v-9dd151bf><strong data-v-9dd151bf>\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435</strong><div class="step-desc" data-v-9dd151bf>\u041C\u044B \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u043C \u0437\u0430\u043A\u0430\u0437 \u0432 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u0441\u0440\u043E\u043A\u0438 \u0438 \u043F\u0440\u0438\u0441\u044B\u043B\u0430\u0435\u043C \u043F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0432\u0435\u0440\u0441\u0438\u0438 \u0434\u043B\u044F \u043F\u0440\u0430\u0432\u043E\u043A.</div></li></ol><div class="service-extra" data-v-9dd151bf><p data-v-9dd151bf>\u041F\u043E \u0438\u0442\u043E\u0433\u0430\u043C \u0440\u0430\u0431\u043E\u0442\u044B \u0432\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0435 \u0444\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0444\u0430\u0439\u043B\u044B \u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438 \u043F\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044E/\u0432\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u043D\u0438\u044E.</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(RequestModal, {
        modelValue: showForm.value,
        "onUpdate:modelValue": ($event) => showForm.value = $event,
        onOpen,
        onClose,
        onOpened,
        onClosed
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const services = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9dd151bf"]]);

export { services as default };
//# sourceMappingURL=services-DshSlPvE.mjs.map
