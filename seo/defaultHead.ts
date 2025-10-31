// src/seo/defaultHead.ts
export const SITE_NAME = 'sitebypro';
export const SITE_URL = 'https://sitebypro.com';

export const defaultHead = {
  title: 'Главная',
  titleTemplate: '%s — ' + SITE_NAME,
  meta: [
    { name: 'description', content: 'Краткое описание сайта', vmid: 'description' },
    { name: 'robots', content: 'index,follow', vmid: 'robots' },

    // Open Graph
    { property: 'og:site_name', content: SITE_NAME, vmid: 'og:site_name' },
    { property: 'og:type', content: 'website', vmid: 'og:type' },
    { property: 'og:locale', content: 'ru_RU', vmid: 'og:locale' },

    // twitter
    { name: 'twitter:card', content: 'summary_large_image', vmid: 'twitter:card' },
  ],
  link: [
    { rel: 'canonical', href: SITE_URL, vmid: 'canonical' }
  ],
  // можно добавить jsonLd или другие поля при необходимости
};
