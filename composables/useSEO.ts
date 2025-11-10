// ~/composables/useSEO.ts
/**
 * useSEO — удобный composable для Nuxt 3.
 * - Не нужно импортировать useHead или buildHead в страницах (Nuxt автоподхват composables).
 * - Поддерживает обычный объект и ref/computed (реактивные обновления).
 * - Делегирует слияние мета-тегов в buildHead (~/seo/defaultHead).
 */

import { unref, watch, type Ref, type ComputedRef } from 'vue'
import { useHead } from '#imports'
import { buildHead, type HeadObject } from '~/seo/defaultHead'

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>

type MetaEntry = { name?: string; property?: string; content: string; vmid?: string }
type LinkEntry = Record<string, string>

export interface UseSEOOptions {
  title?: string
  description?: string
  url?: string
  image?: string
  extrasMeta?: MetaEntry[]
  extrasLink?: LinkEntry[]
  // любые дополнительные поля, которые будет поддерживать buildHead (например jsonLd)
  [k: string]: any
}

/**
 * useSEO(options?)
 *
 * Примеры:
 * useSEO({ title: 'О нас', description: '...' })
 * useSEO(ref({ title: 'Страница', description: '...' })) // реактивно обновится
 */
export function useSEO(options?: MaybeRef<UseSEOOptions>) {
  const getOptions = () => unref(options) ?? {}

  const buildOverrides = (opts: UseSEOOptions): HeadObject => {
    const { title, description, url, image, extrasMeta = [], extrasLink = [] } = opts

    const meta: MetaEntry[] = [
      ...(description ? [{ name: 'description', content: description, vmid: 'description' }] : []),
      ...(image ? [{ property: 'og:image', content: image, vmid: 'og:image' }] : []),
      ...(url ? [{ property: 'og:url', content: url, vmid: 'og:url' }] : []),
      ...extrasMeta
    ]

    const link: LinkEntry[] = [
      // не добавляем дефолтные link здесь — buildHead сам смажирует defaultHead.link с overrides.link
      ...(url ? [{ rel: 'canonical', href: url, vmid: 'canonical' }] : []),
      ...extrasLink
    ]

    const overrides: HeadObject = {
      ...(title ? { title } : {}),
      meta,
      link,
    }

    // включаем любые дополнительные поля из opts (например jsonLd)
    for (const k in opts) {
      if (k !== 'title' && k !== 'description' && k !== 'url' && k !== 'image' && k !== 'extrasMeta' && k !== 'extrasLink') {
        overrides[k] = (opts as any)[k]
      }
    }

    return overrides
  }

  const apply = (opts: UseSEOOptions) => {
    const overrides = buildOverrides(opts)
    // buildHead делает аккуратный merge с defaultHead; useHead применяет результат
    useHead(buildHead(overrides))
  }

  // применяем начальные значения
  apply(getOptions())

  // если передали ref/computed — следим за изменениями и обновляем head
  // deep: true — чтобы реагировать на изменения в extrasMeta/extrasLink и т.д.
  watch(getOptions, (newVal) => {
    apply(newVal ?? {})
  }, { deep: true })

  // возвращаем текущий head-объект (полезно, если нужно что-то отладить)
  return buildHead(buildOverrides(getOptions()))
}
