// src/seo/defaultHead.ts
export const SITE_NAME = 'sitebypro';
export const SITE_URL = 'https://sitebypro.com';

// дефолтная картинка (можешь заменить путь на тот, который используешь на проде)
export const DEFAULT_OG_IMAGE = SITE_URL + '/static/files/store/preview.png';

export type MetaEntry = {
  vmid?: string;
  name?: string;
  property?: string;
  content?: string;
  [k: string]: any;
};

export type LinkEntry = {
  vmid?: string;
  rel: string;
  href: string;
  [k: string]: any;
};

export type HeadObject = {
  title?: string;
  titleTemplate?: string | null;
  meta?: MetaEntry[];
  link?: LinkEntry[];
  // допускаем произвольные дополнительные поля (jsonLd и т.д.)
  [k: string]: any;
};

export const defaultHead: HeadObject = {
  title: 'Главная',
  // оставляем titleTemplate — Nuxt / useHead применит его один раз
  titleTemplate: '%s | ' + SITE_NAME,
  meta: [
    { name: 'description', content: 'SiteByPro — создаём сайты для всех: онлайн-магазины, лендинги, портфолио и корпоративные порталы. Красиво, быстро, эффективно.', vmid: 'description' },
    { name: 'robots', content: 'index,follow', vmid: 'robots' },

    // Open Graph
    { property: 'og:site_name', content: SITE_NAME, vmid: 'og:site_name' },
    { property: 'og:type', content: 'website', vmid: 'og:type' },
    { property: 'og:locale', content: 'ru_RU', vmid: 'og:locale' },
    { property: 'og:url', content: SITE_URL, vmid: 'og:url' },
    { property: 'og:image', content: DEFAULT_OG_IMAGE, vmid: 'og:image' },
    { property: 'og:image:alt', content: SITE_NAME, vmid: 'og:image:alt' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image', vmid: 'twitter:card' },
    { name: 'twitter:image', content: DEFAULT_OG_IMAGE, vmid: 'twitter:image' },
    { name: 'twitter:image:alt', content: SITE_NAME, vmid: 'twitter:image:alt' },

    // универсальная картинка (на всякий случай)
    { name: 'image', content: DEFAULT_OG_IMAGE, vmid: 'image' },
  ],
  link: [
    { rel: 'canonical', href: SITE_URL, vmid: 'canonical' }
  ],
};

/**
 * Вспомогательная функция: ключ для элемента meta/link — vmid, или name, или property,
 * иначе JSON-строка (гарантирует уникальный ключ).
 */
function keyOf(item: any) {
  return item?.vmid ?? item?.name ?? item?.property ?? JSON.stringify(item);
}

/**
 * Глубокое (по спискам) слияние дефолтных и пользовательских meta/link:
 * - элементы с одинаковым ключом (vmid/name/property) перезаписываются override-ом,
 * - новые элементы добавляются.
 */
function mergeLists<T extends Record<string, any>>(defaultList: T[] | undefined, overrideList: T[] | undefined): T[] {
  const map = new Map<string, T>();
  if (defaultList) {
    for (const it of defaultList) map.set(keyOf(it), { ...it });
  }
  if (overrideList) {
    for (const it of overrideList) {
      const k = keyOf(it);
      const prev = map.get(k) ?? {};
      map.set(k, { ...prev, ...it });
    }
  }
  return Array.from(map.values());
}

/**
 * Основная функция: берём defaultHead и применяем overrides.
 * ВАЖНО: НЕ ПОДСТАВЛЯЕМ titleTemplate в title (чтобы избежать двойной подстановки
 * — Nuxt / useHead применят шаблон самостоятельно).
 */
export function buildHead(overrides: HeadObject = {}): HeadObject {
  // оставляем titleTemplate передаваемым как есть — framework применит его
  const titleTemplate = overrides.titleTemplate ?? defaultHead.titleTemplate;
  // rawTitle — не изменяем, не подставляем шаблон внутрь строки
  const rawTitle = overrides.title ?? defaultHead.title;
  const title = rawTitle;

  const mergedMeta = mergeLists(defaultHead.meta, overrides.meta);
  const mergedLink = mergeLists(defaultHead.link, overrides.link);

  // Собираем итог — приоритет у overrides для прочих полей (например jsonLd)
  const result: HeadObject = {
    ...defaultHead,
    ...overrides,
    title,
    titleTemplate,
    meta: mergedMeta,
    link: mergedLink,
  };

  return result;
}
