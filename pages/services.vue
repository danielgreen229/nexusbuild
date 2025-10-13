<template>
  <div>
    <BlockHeader>
      <h1 class="block__title">Услуги</h1>
    </BlockHeader>

    <div class="services-container" ref="root">
      <div
        v-for="(child, idx) in merged.children"
        :key="child.id ?? idx"
        class="services-section"
      >
        <button
          :id="buttonId(idx)"
          class="services-toggle"
          @click="toggleSection(idx)"
          @keydown.enter.prevent="toggleSection(idx)"
          @keydown.space.prevent="toggleSection(idx)"
          :aria-expanded="String(isOpen(idx))"
          :aria-controls="listId(idx)"
          :ref="el => setButtonRef(el, idx)"
          @keydown.arrow-down.prevent="focusFirstItem(idx)"
          @keydown.arrow-up.prevent="focusLastItem(idx)"
        >
          <div class="img__container">
            <img src="@/assets/images/service/grey-landing.png"/>
          </div>
          <div class="about_container">
            <component
              :is="sectionTitleTag(child)"
              class="section-title"
              aria-hidden="true"
            >
              {{ child.title }}
            </component>

            <!-- Иконка + / − — две буквы, между которыми переключается видимость -->
            <span class="services-toggle-icon" aria-hidden="true">
              <span class="icon-plus">+</span>
              <span class="icon-minus">−</span>
            </span>
          </div>
        </button>

        <transition name="dropdown">
          <ul
            v-if="isOpen(idx)"
            :id="listId(idx)"
            class="services-list"
            role="menu"
            :ref="el => setMenuRef(el, idx)"
            @keydown.down.prevent="focusNextItem(idx)"
            @keydown.up.prevent="focusPrevItem(idx)"
            @keydown.esc.prevent="closeSection(idx)"
          >
            <li v-for="(item, j) in child.items" :key="j" role="none">
              <a
                :href="item.href || '#'"
                role="menuitem"
                tabindex="0"
                @click.prevent="onSelect(idx, item)"
                @keydown.enter.prevent="onSelect(idx, item)"
              >
                {{ item.title }}
              </a>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BlockHeader from '@/components/ui/BlockHeader.vue'

/**
 * Описание node (как ранее)
 */

const props = defineProps({
  node: {
    type: Object as () => any,
    default: () => ({
      id: undefined,
      title: 'Услуги',
      titleProps: { tag: 'h2', class: '', align: 'center' },
      buttonLabel: 'Показать',
      mode: 'multiple',
      closeOnOutside: true,
      settings: {
        container: { class: 'services-container' },
        section: { class: 'services-section' },
        button: { class: 'services-toggle' },
        icon: { class: 'services-toggle-icon' },
        list: { class: 'services-list' },
      },
      children: [
        { 
          id: 'web', 
          title: 'Веб-разработка', 
          preview: '',
          titleProps: { tag: 'h3' }, 
          items: [{ title: 'Frontend', href: '/web/frontend' }, { title: 'Backend', href: '/web/backend' }] },
        { id: 'design', title: 'Дизайн', items: [{ title: 'UI/UX', href: '/design/uiux' }] },
      ],
    }),
  },
})

const emit = defineEmits<{
  (e: 'select', sectionIndex: number, item: { title: string; href?: string }): void
}>()

// Defaults (оставляем, но шаблон использует статические классы)
const defaults = {
  id: undefined,
  title: 'Услуги',
  titleProps: { tag: 'h2', class: '', align: 'center' },
  buttonLabel: 'Показать',
  mode: 'multiple',
  closeOnOutside: true,
  settings: {
    container: { class: 'services-container' },
    section: { class: 'services-section' },
    button: { class: 'services-toggle' },
    icon: { class: 'services-toggle-icon' },
    list: { class: 'services-list' },
  },
  children: [] as any[],
}

const merged = computed(() => {
  const n = props.node || {}
  return {
    id: n.id ?? defaults.id,
    title: {
      text: n.title ?? defaults.title,
      tag: (n.titleProps?.tag ?? defaults.titleProps.tag) || 'h2',
      class: n.titleProps?.class ?? defaults.titleProps.class ?? '',
      align: n.titleProps?.align ?? defaults.titleProps.align ?? 'center',
      level: n.titleProps?.level ?? defaults.titleProps.level ?? null,
    },
    buttonLabel: n.buttonLabel ?? defaults.buttonLabel,
    mode: n.mode ?? defaults.mode,
    closeOnOutside: n.closeOnOutside ?? defaults.closeOnOutside,
    settings: {
      container: n.settings?.container ?? defaults.settings.container,
      section: n.settings?.section ?? defaults.settings.section,
      button: n.settings?.button ?? defaults.settings.button,
      icon: n.settings?.icon ?? defaults.settings.icon,
      list: n.settings?.list ?? defaults.settings.list,
    },
    children: n.children ?? defaults.children,
  }
})

// root ref for click outside
const root = ref<HTMLElement | null>(null)

// Open state (support single / multiple)
const openSingle = ref<number | null>(null)
const openSet = ref(new Set<number>())

function isOpen(idx: number) {
  return merged.value.mode === 'single' ? openSingle.value === idx : openSet.value.has(idx)
}
function openSection(idx: number) {
  if (merged.value.mode === 'single') openSingle.value = idx
  else openSet.value.add(idx)
}
function closeSection(idx: number) {
  if (merged.value.mode === 'single') {
    if (openSingle.value === idx) openSingle.value = null
  } else openSet.value.delete(idx)
}
function toggleSection(idx: number) {
  if (isOpen(idx)) closeSection(idx)
  else {
    if (merged.value.mode === 'single') openSingle.value = idx
    else openSet.value.add(idx)
    // focus first item after DOM update
    requestAnimationFrame(() => focusFirstItem(idx))
  }
}

// Refs arrays for menus/buttons (assigned by index)
const menuRefs = ref<Array<HTMLElement | null>>([])
const buttonRefs = ref<Array<HTMLElement | null>>([])

function setMenuRef(el: HTMLElement | null, idx: number) {
  menuRefs.value[idx] = el
}
function setButtonRef(el: HTMLElement | null, idx: number) {
  buttonRefs.value[idx] = el
}

// IDs
const blockPrefix = computed(() => {
  return merged.value.id ? String(merged.value.id) : 'block'
})

// простая безопасная slug-фунция
function slugify(s: any) {
  if (!s && s !== 0) return ''
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '')
    .replace(/-+/g, '-')
}

// ids — детерминированно и стабильно:
function listId(idx: number) {
  const child = merged.value.children[idx] ?? {}
  const childBase = child.id ? String(child.id) : slugify(child.title ?? `child-${idx}`)
  return `list-${blockPrefix.value}-${childBase}-${idx}`
}
function buttonId(idx: number) {
  const child = merged.value.children[idx] ?? {}
  const childBase = child.id ? String(child.id) : slugify(child.title ?? `child-${idx}`)
  return `button-${blockPrefix.value}-${childBase}-${idx}`
}

// keyboard navigation helpers per section
function focusFirstItem(sectionIdx: number) {
  const menu = menuRefs.value[sectionIdx]
  const items = menu?.querySelectorAll<HTMLElement>('a[role="menuitem"]') ?? []
  if (items.length) items[0].focus()
}
function focusLastItem(sectionIdx: number) {
  const menu = menuRefs.value[sectionIdx]
  const items = menu?.querySelectorAll<HTMLElement>('a[role="menuitem"]') ?? []
  if (items.length) items[items.length - 1].focus()
}
function focusNextItem(sectionIdx: number) {
  const menu = menuRefs.value[sectionIdx]
  const items = menu?.querySelectorAll<HTMLElement>('a[role="menuitem"]') ?? []
  if (!items.length) return
  const idx = Array.from(items).indexOf(document.activeElement as HTMLElement)
  const next = (idx + 1 + items.length) % items.length
  items[next].focus()
}
function focusPrevItem(sectionIdx: number) {
  const menu = menuRefs.value[sectionIdx]
  const items = menu?.querySelectorAll<HTMLElement>('a[role="menuitem"]') ?? []
  if (!items.length) return
  const idx = Array.from(items).indexOf(document.activeElement as HTMLElement)
  const prev = (idx - 1 + items.length) % items.length
  items[prev].focus()
}

// select handler
function onSelect(sectionIdx: number, item: { title: string; href?: string }) {
  if (merged.value.mode === 'single') openSingle.value = null
  else openSet.value.delete(sectionIdx)
  emit('select', sectionIdx, item)
}

// click outside
function onDocumentClick(e: MouseEvent) {
  if (!merged.value.closeOnOutside) return
  const target = e.target as Node
  if (!root.value) return
  if (!root.value.contains(target)) {
    if (merged.value.mode === 'single') openSingle.value = null
    else openSet.value.clear()
  }
}

onMounted(() => {
  if (merged.value.closeOnOutside) document.addEventListener('click', onDocumentClick)
})
onBeforeUnmount(() => {
  if (merged.value.closeOnOutside) document.removeEventListener('click', onDocumentClick)
})

// helper for section title tag
function sectionTitleTag(child: any) {
  return child?.titleProps?.tag ?? 'h3'
}
</script>

<style scoped>
/* Default classes (статические) */
.services-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* block title */
.block-title {
  margin: 0;
  font-size: 1.25rem;
}

/* alignment helpers (если захотите применять через titleProps — сейчас не используются в шаблоне) */
.title--align-left { text-align: left; }
.title--align-center { text-align: center; }
.title--align-right { text-align: right; }

/* section wrapper */
.services-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* section title (теперь используется внутри кнопки) */
.section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 100;
  /* чтобы заголовок выглядел как текст внутри кнопки */
  display: inline-block;
  line-height: 1;
}

/* toggle button */
.services-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  overflow: hidden;
  padding: 0rem 0rem 1rem 0rem;
  border: 1px solid #e6e6e6;
  background: white;
  cursor: pointer;
  border-radius: 0.8rem;
  width: 100%;
  box-sizing: border-box;
}

/* icon container */
.services-toggle-icon {
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  position: relative;
  flex: 0 0 auto;
}

/* plus/minus elements stacked exactly one on another */
.services-toggle-icon .icon-plus,
.services-toggle-icon .icon-minus {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  user-select: none;
  transition: opacity 180ms ease, transform 200ms ease;
  font-size: 1.05rem;
}

/* initial states: show plus, hide minus */
.services-toggle-icon .icon-plus {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
.services-toggle-icon .icon-minus {
  opacity: 0;
  transform: rotate(-120deg) scale(0.6);
}

/* when expanded: swap visibility and animate */
.services-toggle[aria-expanded='true'] .services-toggle-icon .icon-plus {
  opacity: 0;
  transform: rotate(120deg) scale(0.6);
}
.services-toggle[aria-expanded='true'] .services-toggle-icon .icon-minus {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* list */
.services-list {
  margin: 0;
  padding: 0.5rem;
  list-style: none;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* items */
.services-list li { margin: 0; padding: 0; }
.services-list a {
  display: block;
  padding: 0.6rem 0.8rem;
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
  outline: none;
}
.services-list a:focus,
.services-list a:hover { background: rgba(0,0,0,0.04); }

/* Transition */
.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}
.dropdown-enter-to,
.dropdown-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: max-height 260ms cubic-bezier(.2,.9,.2,1), opacity 200ms ease, transform 200ms ease;
}
.block__title {
  color: var(--white)
}
.img__container {
  width: 100%;
  height: 20rem;
  overflow: hidden;
}
.img__container img {
  width: inherit;
  height: inherit;
  object-fit: cover;
}
</style>
