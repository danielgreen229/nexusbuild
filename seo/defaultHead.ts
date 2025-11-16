// src/seo/defaultHead.ts
export const SITE_NAME = 'sitebypro';
export const SITE_URL = 'https://sitebypro.com';

// дефолтная картинка (в Nuxt папка static/ отдается из корня — поэтому в URL не должно быть `/static`)
export const DEFAULT_OG_IMAGE = 'https://sitebypro-server.ru/static/files/store/preview.png'

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

    // Рекомендуемые размеры (можно заменить, если нужно другое)
    { property: 'og:image:width', content: '1200', vmid: 'og:image:width' },
    { property: 'og:image:height', content: '630', vmid: 'og:image:height' },
    { property: 'og:image:secure_url', content: DEFAULT_OG_IMAGE, vmid: 'og:image:secure_url' },
    // тип по умолчанию (при необходимости можно переопределить)
    { property: 'og:image:type', content: 'image/png', vmid: 'og:image:type' },
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
 * Утилиты для работы со списком meta
 */
function findMetaByProp(list: MetaEntry[] | undefined, prop: string) {
  if (!list) return undefined;
  return list.find(m => m.property === prop || m.name === prop);
}
function hasMeta(list: MetaEntry[] | undefined, prop: string) {
  return !!findMetaByProp(list, prop);
}

/**
 * Основная функция: берём defaultHead и применяем overrides.
 * ВАЖНО: НЕ ПОДСТАВЛЯЕМ titleTemplate в title (чтобы избежать двойной подстановки
 * — Nuxt / useHead применят шаблон самостоятельно).
 *
 * Дополнительно: если задан og:image (в default или overrides), то
 * автоматически добавим / синхронизируем недостающие поля:
 * - twitter:image (если не задан),
 * - image (если не задан),
 * - og:image:secure_url, og:image:width, og:image:height, og:image:type (если не заданы).
 * Все поля можно переопределить через overrides.meta — при совпадающем vmid/name/property override победит.
 */
export function buildHead(overrides: HeadObject = {}): HeadObject {
  // оставляем titleTemplate передаваемым как есть — framework применит его
  const titleTemplate = overrides.titleTemplate ?? defaultHead.titleTemplate;
  // rawTitle — не изменяем, не подставляем шаблон внутрь строки
  const rawTitle = overrides.title ?? defaultHead.title;
  const title = rawTitle;

  const mergedMeta = mergeLists(defaultHead.meta, overrides.meta);
  const mergedLink = mergeLists(defaultHead.link, overrides.link);

  // --- синхронизация image-полей ---
  // находим og:image (с учётом того, что ключи могли быть переопределены)
  const ogImageEntry = mergedMeta.find(m => (m.property === 'og:image') || (m.name === 'og:image'));
  const ogImageUrl = ogImageEntry?.content;

  if (ogImageUrl) {
    // helper — определить mime-type по расширению (ориентировочно)
    const ext = ogImageUrl.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
    const guessedType = ext === 'png' ? 'image/png' : (ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : (ext === 'webp' ? 'image/webp' : 'image/*'));

    // добавляем только если отсутствуют (чтобы не перезаписать overrides)
    if (!hasMeta(mergedMeta, 'twitter:image')) {
      mergedMeta.push({ name: 'twitter:image', content: ogImageUrl, vmid: 'twitter:image' });
    }
    if (!hasMeta(mergedMeta, 'image')) {
      mergedMeta.push({ name: 'image', content: ogImageUrl, vmid: 'image' });
    }
    if (!hasMeta(mergedMeta, 'og:image:secure_url')) {
      mergedMeta.push({ property: 'og:image:secure_url', content: ogImageUrl, vmid: 'og:image:secure_url' });
    }
    if (!hasMeta(mergedMeta, 'og:image:width')) {
      mergedMeta.push({ property: 'og:image:width', content: '1200', vmid: 'og:image:width' });
    }
    if (!hasMeta(mergedMeta, 'og:image:height')) {
      mergedMeta.push({ property: 'og:image:height', content: '630', vmid: 'og:image:height' });
    }
    if (!hasMeta(mergedMeta, 'og:image:type')) {
      mergedMeta.push({ property: 'og:image:type', content: guessedType, vmid: 'og:image:type' });
    }
  }

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
