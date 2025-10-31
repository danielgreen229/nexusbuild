// ~/composables/useSEO.ts
import { useHead } from '#imports'
import { defaultHead } from '~/seo/defaultHead'

type MetaEntry = { name?: string; property?: string; content: string; vmid?: string }

/**
 * Простой мердж мета-записей по vmid/name/property.
 */
function mergeMeta(defaultMeta: MetaEntry[] = [], newMeta: MetaEntry[] = []) {
  const map = new Map<string, MetaEntry>()
  const keyOf = (m: MetaEntry) => m.vmid ?? m.name ?? m.property ?? JSON.stringify(m)

  for (const m of defaultMeta) map.set(keyOf(m), m)
  for (const m of newMeta) map.set(keyOf(m), m) // новые значения перекрывают старые
  return Array.from(map.values())
}

export function useSEO(options: {
  title?: string
  description?: string
  url?: string
  image?: string
  extrasMeta?: MetaEntry[]
  extrasLink?: Array<Record<string, string>>
} = {}) {
  const { title, description, url, image, extrasMeta = [], extrasLink = [] } = options

  const meta = mergeMeta(defaultHead.meta ?? [], [
    ...(description ? [{ name: 'description', content: description, vmid: 'description' }] : []),
    ...(image ? [{ property: 'og:image', content: image, vmid: 'og:image' }] : []),
    ...(url ? [{ property: 'og:url', content: url, vmid: 'og:url' }] : []),
    ...extrasMeta
  ])

  const link = [
    ...(defaultHead.link ?? []),
    ...(url ? [{ rel: 'canonical', href: url, vmid: 'canonical' }] : []),
    ...extrasLink
  ]

  const headObj: any = {
    meta,
    link
  }

  if (title) headObj.title = title
  useHead(headObj)
}
