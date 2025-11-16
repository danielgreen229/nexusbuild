// src/seo/defaultHead.ts
export const SITE_NAME = 'sitebypro';

// Дефолтный публичный URL сайта (можно переопределить при вызове buildHead)
export const SITE_URL = 'https://sitebypro.com';

// Желаемый дефолт для Open Graph (ваш конкретный URL)
export const FALLBACK_OG_IMAGE = 'https://sitebypro-server.ru/static/files/store/preview.png';

/**
 * Типы для meta/link и итогового head
 */
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
  [k: string]: any; // произвольные дополнительные поля (jsonLd и т.д.)
};

/**
 * Базовый дефолтный head — используется если не передать overrides или runtime.
 * Поля, основанные на DEFAULT_OG_IMAGE, будут синхронизированы в buildHead.
 */
const baseDefaultHead: HeadObject = {
  title: 'Главная',
  titleTemplate: '%s | ' + SITE_NAME,
  meta: [
    { name: 'description', content: 'SiteByPro — создаём сайты для всех: онлайн-магазины, лендинги, портфолио и корпоративные порталы. Красиво, быстро, эффективно.', vmid: 'description' },
    { name: 'robots', content: 'index,follow', vmid: 'robots' },

    // Open Graph (ограничимся базовыми полями — url/image будет установлено в buildHead)
    { property: 'og:site_name', content: SITE_NAME, vmid: 'og:site_name' },
    { property: 'og:type', content: 'website', vmid: 'og:type' },
    { property: 'og:locale', content: 'ru_RU', vmid: 'og:locale' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image', vmid: 'twitter:card' },

    // универсальная картинка — при отсутствии будет подставлена в buildHead
    { name: 'image', content: '', vmid: 'image' },
  ],
  link: [
    { rel: 'canonical', href: SITE_URL, vmid: 'canonical' }
  ]
};

/**
 * Утилиты
 */
function keyOf(item: any) {
  return item?.vmid ?? item?.name ?? item?.property ?? JSON.stringify(item);
}

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

function findMetaByProp(list: MetaEntry[] | undefined, prop: string) {
  if (!list) return undefined;
  return list.find(m => m.property === prop || m.name === prop);
}
function hasMeta(list: MetaEntry[] | undefined, prop: string) {
  return !!findMetaByProp(list, prop);
}

/**
 * helper: попытка угадать mime type по расширению
 */
function guessMimeTypeByUrl(url: string | undefined): string {
  if (!url) return 'image/*';
  const clean = url.split('?')[0];
  const ext = clean.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  return 'image/*';
}

/**
 * Основная функция: строит head, применяя overrides и runtime-параметры.
 *
 * @param overrides — пользовательские meta/link/title и т.д.
 * @param runtime — опционально можно передать { siteUrl, defaultOgImage } (например из useRuntimeConfig)
 *
 * Использование:
 *   import { buildHead } from '~/src/seo/defaultHead';
 *   const head = buildHead({ title: 'О магазине' }, { siteUrl: process.env.SITE_URL, defaultOgImage: process.env.DEFAULT_OG_IMAGE });
 */
export function buildHead(overrides: HeadObject = {}, runtime?: { siteUrl?: string; defaultOgImage?: string }): HeadObject {
  const siteUrl = runtime?.siteUrl ?? SITE_URL;
  const defaultOgImageRaw = runtime?.defaultOgImage ?? FALLBACK_OG_IMAGE;

  // если пользователь передал относительный путь в defaultOgImage — приводим к абсолютному
  const defaultOgImage = defaultOgImageRaw.startsWith('http') ? defaultOgImageRaw : (siteUrl.replace(/\/$/, '') + '/' + defaultOgImageRaw.replace(/^\//, ''));

  // Начинаем с base + overrides
  const titleTemplate = overrides.titleTemplate ?? baseDefaultHead.titleTemplate;
  const rawTitle = overrides.title ?? baseDefaultHead.title;
  const title = rawTitle; // не подставляем шаблон внутрь, это сделает фреймворк

  const mergedMeta = mergeLists(baseDefaultHead.meta, overrides.meta);
  const mergedLink = mergeLists(baseDefaultHead.link, overrides.link);

  // Обеспечим, что canonical соответствует siteUrl, если не переопределено
  if (!mergedLink.find(l => l.rel === 'canonical')) {
    mergedLink.push({ rel: 'canonical', href: siteUrl, vmid: 'canonical' });
  } else {
    // если есть, но пустой href — заполнить
    const canLink = mergedLink.find(l => l.rel === 'canonical');
    if (canLink && !canLink.href) canLink.href = siteUrl;
  }

  // --- Синхронизация OG/Twitter/Image полей ---
  // Приоритет: 1) overrides meta og:image, 2) существующий mergedMeta, 3) defaultOgImage
  const explicitOgImage = findMetaByProp(mergedMeta, 'og:image')?.content;
  const ogImageUrl = explicitOgImage || defaultOgImage;

  // Установим/перепроверим og:url
  if (!hasMeta(mergedMeta, 'og:url')) {
    mergedMeta.push({ property: 'og:url', content: siteUrl, vmid: 'og:url' });
  } else {
    // если задан, но пустой — заполнить
    const ogUrl = findMetaByProp(mergedMeta, 'og:url');
    if (ogUrl && !ogUrl.content) ogUrl.content = siteUrl;
  }

  // Подставим og:image если нет
  if (!hasMeta(mergedMeta, 'og:image')) {
    mergedMeta.push({ property: 'og:image', content: ogImageUrl, vmid: 'og:image' });
  }

  // Синхронизируем доп. поля, только если они не заданы явно (чтобы override всегда побеждал)
  if (!hasMeta(mergedMeta, 'twitter:image')) {
    mergedMeta.push({ name: 'twitter:image', content: ogImageUrl, vmid: 'twitter:image' });
  }
  if (!hasMeta(mergedMeta, 'twitter:image:alt')) {
    mergedMeta.push({ name: 'twitter:image:alt', content: SITE_NAME, vmid: 'twitter:image:alt' });
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
    mergedMeta.push({ property: 'og:image:type', content: guessMimeTypeByUrl(ogImageUrl), vmid: 'og:image:type' });
  }
  if (!hasMeta(mergedMeta, 'og:image:alt')) {
    mergedMeta.push({ property: 'og:image:alt', content: SITE_NAME, vmid: 'og:image:alt' });
  }

  const result: HeadObject = {
    ...baseDefaultHead,
    ...overrides,
    title,
    titleTemplate,
    meta: mergedMeta,
    link: mergedLink,
  };

  return result;
}

/**
 * Утилита для быстрого получения head с минимальной конфигурацией (удобно в рантайме).
 * Пример использования в Nuxt 3 setup():
 *
 * const config = useRuntimeConfig();
 * const head = makeHead({ title: 'Страница' }, { siteUrl: config.public.siteUrl, defaultOgImage: config.public.defaultOgImage });
 */
export const makeHead = buildHead; // экспорт для совместимости — можно импортировать как makeHead или buildHead
