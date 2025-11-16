import { b as buildAssetsURL } from '../nitro/nitro.mjs';
import { reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _imports_0 = "" + buildAssetsURL("logo-small.DL52Md90.png");
const _sfc_main = {
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    const contacts = reactive({
      email: "sitebypro@mail.ru",
      telegram: "sitebypro",
      telegramLink: "https://t.me/dozer_stoun",
      vk: "https://vk.com/club233841249",
      inn: "302503086616",
      ogrn: "325300000026452"
    });
    const toast = reactive({ show: false, message: "", type: "success" });
    const EmailIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12v1.45q0 1.475-1.012 2.513T18.5 17q-.875 0-1.65-.375t-1.3-1.075q-.725.725-1.638 1.088T12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12v1.45q0 .65.425 1.1T18.5 15t1.075-.45t.425-1.1V12q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20h5v2zm0-7q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15"/></svg>' };
    const TelegramIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Tabler Icons by Pawe\u0142 Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-4"/></svg>' };
    const VkIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Meteor Icons by zkreations - https://github.com/zkreations/icons/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="22" height="22" x="1" y="1" rx="5"/><path d="M7 8.5a7 8 0 0 0 5 7v-7m5 0Q16 11 13 12q3 1 4 3.5M12 12h1"/></g></svg>' };
    const IdIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m-3-3h6v-2h-2V9h2V7H9v2h2v6H9z"/></svg>' };
    const ClockIcon = {
      template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 22q-1.875 0-3.512-.712t-2.85-1.925t-1.925-2.85T3 13t.713-3.512t1.924-2.85t2.85-1.925T12 4t3.513.713t2.85 1.925t1.925 2.85T21 13t-.712 3.513t-1.925 2.85t-2.85 1.925T12 22m2.8-4.8l1.4-1.4l-3.2-3.2V8h-2v5.4zM5.6 2.35L7 3.75L2.75 8l-1.4-1.4zm12.8 0l4.25 4.25l-1.4 1.4L17 3.75z"/></svg>'
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "contacts-page" }, _attrs))} data-v-7a011590><div class="hero" data-v-7a011590><svg class="hero-blob" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden data-v-7a011590><defs data-v-7a011590><linearGradient id="g1" x1="0" x2="1" data-v-7a011590><stop offset="0%" stop-color="#7c3aed" data-v-7a011590></stop><stop offset="100%" stop-color="#fb7185" data-v-7a011590></stop></linearGradient></defs><path fill="url(#g1)" d="M421.1,327.7Q392,405,325,444.6Q258,484.3,184.2,451.8Q110.3,419.3,89.6,344.1Q68.9,268.9,115.8,209.2Q162.7,149.4,234.6,119.4Q306.5,89.4,374.5,118.3Q442.5,147.2,447.9,213.8Q453.4,280.4,421.1,327.7Z" data-v-7a011590></path></svg><div class="hero-content" data-v-7a011590><div class="brand" data-v-7a011590><div class="logo" data-v-7a011590><img${ssrRenderAttr("src", _imports_0)} class="logo-small__img" data-v-7a011590></div><div data-v-7a011590><h1 class="title" data-v-7a011590>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</h1><p class="subtitle" data-v-7a011590>\u0421\u0432\u044F\u0436\u0438\u0442\u0435\u0441\u044C \u0441 \u043D\u0430\u043C\u0438 \u2014 \u0441\u0434\u0435\u043B\u0430\u0435\u043C \u0441\u0430\u0439\u0442, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u0440\u043E\u0434\u0430\u0451\u0442.</p></div></div><div class="hero-actions" data-v-7a011590><a${ssrRenderAttr("href", `mailto:${contacts.email}`)} class="btn btn-primary" data-v-7a011590>\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043D\u0430 \u043F\u043E\u0447\u0442\u0443</a><a${ssrRenderAttr("href", contacts.telegramLink)} target="_blank" class="btn btn-ghost" data-v-7a011590>Telegram</a></div></div></div><main class="main-grid" data-v-7a011590><section class="card contact-cards" data-v-7a011590><h2 data-v-7a011590>\u041A\u0430\u043D\u0430\u043B\u044B \u0441\u0432\u044F\u0437\u0438</h2><p class="muted" data-v-7a011590>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0434\u043E\u0431\u043D\u044B\u0439 \u0441\u043F\u043E\u0441\u043E\u0431 \u2014 \u043E\u0431\u044B\u0447\u043D\u043E \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u043C \u0432 \u0440\u0430\u0431\u043E\u0447\u0438\u0435 \u0447\u0430\u0441\u044B.</p><ul class="grid-list" data-v-7a011590><li class="item" data-v-7a011590><div class="icon-wrap" data-v-7a011590><div data-v-7a011590>${EmailIcon.template}</div></div><div class="info" data-v-7a011590><div class="label" data-v-7a011590>\u041F\u043E\u0447\u0442\u0430</div><div class="value" data-v-7a011590><a${ssrRenderAttr("href", `mailto:${contacts.email}`)} data-v-7a011590>${ssrInterpolate(contacts.email)}</a></div></div><button class="copy" data-v-7a011590>\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button></li><li class="item" data-v-7a011590><div class="icon-wrap" data-v-7a011590><div data-v-7a011590>${TelegramIcon.template}</div></div><div class="info" data-v-7a011590><div class="label" data-v-7a011590>Telegram \u0433\u0440\u0443\u043F\u043F\u0430</div><div class="value" data-v-7a011590><a${ssrRenderAttr("href", contacts.telegramLink)} target="_blank" data-v-7a011590>@${ssrInterpolate(contacts.telegram)}</a></div></div><button class="copy" data-v-7a011590>\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button></li><li class="item" data-v-7a011590><div class="icon-wrap" data-v-7a011590><div data-v-7a011590>${VkIcon.template}</div></div><div class="info" data-v-7a011590><div class="label" data-v-7a011590>\u0412\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u0435</div><div class="value" data-v-7a011590><a${ssrRenderAttr("href", contacts.vk)} target="_blank" data-v-7a011590>\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443</a></div></div><button class="copy" data-v-7a011590>\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button></li><li class="item" data-v-7a011590><div class="icon-wrap" data-v-7a011590><div data-v-7a011590>${IdIcon.template}</div></div><div class="info" data-v-7a011590><div class="label" data-v-7a011590>\u0418\u041D\u041D</div><div class="value" data-v-7a011590>${ssrInterpolate(contacts.inn)}</div></div><button class="copy" data-v-7a011590>\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button></li></ul></section><aside class="card info-panel" data-v-7a011590><div class="profile" data-v-7a011590><div class="avatar" data-v-7a011590>${ClockIcon.template}</div><div data-v-7a011590><div class="company" data-v-7a011590>SiteByPro</div><div class="worktime" data-v-7a011590>\u041F\u043D\u2013\u041F\u0442 09:00\u201318:00</div></div></div><div class="requisites" data-v-7a011590><div class="row" data-v-7a011590><span data-v-7a011590>\u0418\u041D\u041D</span><strong data-v-7a011590>${ssrInterpolate(contacts.inn)}</strong></div><div class="row" data-v-7a011590><span data-v-7a011590>\u041E\u0413\u0420\u041D\u0418\u041F</span><strong data-v-7a011590>${ssrInterpolate(contacts.ogrn || "\u2014")}</strong></div></div><div class="quick-links" data-v-7a011590><a${ssrRenderAttr("href", contacts.telegramLink)} target="_blank" class="link" data-v-7a011590>\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 Telegram</a><a${ssrRenderAttr("href", contacts.vk)} target="_blank" class="link" data-v-7a011590>\u0413\u0440\u0443\u043F\u043F\u0430 \u0412\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u0435</a></div></aside></main>`);
      if (toast.show) {
        _push(`<div class="${ssrRenderClass([toast.type, "toast"])}" data-v-7a011590>${ssrInterpolate(toast.message)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7a011590"]]);

export { about as default };
//# sourceMappingURL=about-BBE0aF0g.mjs.map
