<template>
  <div>
    <!--<BlockHeader>
      <h1 class="block__title">Услуги</h1>
      <p class="header__subtitle">Наши услуги — ваш путь к результату</p>
    </BlockHeader>-->

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
            <div class="img__block">
              <video autoplay muted loop class="img__video" playsinline>
                <source :src="getVideoUrl(child.video)" type="video/mp4" />
              </video>
            </div>
          </div>
          <div class="about__container" :class="'about__container-' + child.id">
            <component
              :is="sectionTitleTag(child)"
              class="section-title"
              aria-hidden="true"
            >
              <span v-html="child.title"></span>
            </component>

            <span class="services-toggle-icon" aria-hidden="true">
              <span class="icon-plus">+</span>
              <span class="icon-minus">−</span>
            </span>
          </div>
        </button>

        <transition name="dropdown">
          <div
            v-if="isOpen(idx)"
            :id="listId(idx)"
            class="services-list"
            role="menu"
            :ref="el => setMenuRef(el, idx)"
            @keydown.down.prevent="focusNextItem(idx)"
            @keydown.up.prevent="focusPrevItem(idx)"
            @keydown.esc.prevent="closeSection(idx)"
          >
            <!-- РЕНДЕР КОНТЕНТА ДЛЯ КАЖДОЙ УСЛУГИ -->
            <template v-if="child.id === 'web' || child.title?.toLowerCase().includes('веб')">
              <div class="service-content">
                <p class="service-lead">
                  Полный пакет для запуска вашего сайта — от выбора шаблона до настройки CRM.
                  Мы разбили процесс на простые шаги, чтобы вы точно знали, что происходит.
                </p>

                <ol class="service-steps">
                  <li>
                    <strong>Выбрать шаблон</strong>
                    <div class="step-desc">Выбираете готовый шаблон, который подходит по стилю и функционалу.</div>
                    <button class="service-btn" @click="goTo('/template')">Выбрать шаблон <NextCircle class="next-cirlce__svg"/></button>
                  </li>

                  <li>
                    <strong>Выбор доменного имени</strong>
                    <div class="step-desc">Подбираем и регистрируем домен — оптимальное имя для вашего бренда.</div>
                    <button class="service-btn" @click="goTo('/templates')">Подобрать домен <NextCircle class="next-cirlce__svg"/></button>
                  </li>

                  <li>
                    <strong>Сайт готов — настройка CRM</strong>
                    <div class="step-desc">После публикации сайта мы подключаем и настроиваем вашу систему и административную панель.</div>
                    <!--<button class="service-btn" @click="goTo('/templates')">Обзор Админ. панели<NextCircle class="next-cirlce__svg"/></button>-->
                  </li>
                </ol>

                <div class="service-extra">
                  <p>Если у вас уже есть пожелания по структуре — выберите соответствующие пункты в карточке услуги или оставьте комментарий при оформлении.</p>
                </div>
              </div>
            </template>

            <template v-else-if="child.id === 'design' || child.title?.toLowerCase().includes('дизайн')">
              <div class="service-content">
                <p class="service-lead">
                  Уникальный дизайн под ваш бизнес: визуал, интерфейс и админка, готовые к использованию.
                </p>

                <ol class="service-steps">
                  <li>
                    <strong>Оставить заявку</strong>
                    <div class="step-desc">Опишите задачу — наши менеджеры свяжутся для уточнения деталей.</div>
                    <button class="service-btn" @click="showForm = true">Оставить заявку<NextCircle class="next-cirlce__svg"/></button>
                  </li>

                  <li>
                    <strong>Настроить админку</strong>
                    <div class="step-desc">Проектируем и настраиваем админ-панель под ваши бизнес-процессы.</div>
                    <!--<button class="service-btn" @click="goTo('/templates')">Обзор Админ. панели<NextCircle class="next-cirlce__svg"/></button>-->
                  </li>

                  <li>
                    <strong>Интеграция и запуск</strong>
                    <div class="step-desc">Внедряем дизайн на сайт, проводим тесты и передаём готовый продукт.</div>
                  </li>
                </ol>

                <div class="service-extra">
                  <p>Если нужно — подготовим прототипы и интерактивные макеты перед финальной версткой.</p>
                </div>
              </div>
            </template>

            <template v-else-if="child.id === 'design-3d' || child.title?.toLowerCase().includes('3d')">
              <div class="service-content">
                <p class="service-lead">
                  3D-макеты и визуализация: от опроса до готового результата.
                </p>

                <ol class="service-steps">
                  <!--<li>
                    <strong>Пройти опрос</strong>
                    <div class="step-desc">Короткий опрос поможет нам понять задачу и техническое задание.</div>
                    <button class="service-btn" @click="goTo('/templates')">Пройти опрос<NextCircle class="next-cirlce__svg"/></button>
                  </li>-->

                  <li>
                    <strong>Отправить заявку</strong>
                    <div class="step-desc">После опроса вы отправляете заявку — мы оцениваем сроки и стоимость.</div>
                    <button class="service-btn" @click="showForm = true">Отправить заявку<NextCircle class="next-cirlce__svg"/></button>
                  </li>

                  <li>
                    <strong>Ожидание и выполнение</strong>
                    <div class="step-desc">Мы выполняем заказ в согласованные сроки и присылаем предварительные версии для правок.</div>
                  </li>
                </ol>

                <div class="service-extra">
                  <p>По итогам работы вы получаете финальные файлы и инструкции по использованию/встраиванию.</p>
                </div>
              </div>
            </template>
          </div>
        </transition>
      </div>
    </div>
    <RequestModal v-model="showForm" @open="onOpen" @close="onClose" @opened="onOpened" @closed="onClosed" />
  </div>
</template>

<script setup lang="ts">
import RequestModal from '@/components/ui/Modal/Request.vue'
import NextCircle from '~/assets/icons/next-circle.svg'
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
const route = useRoute()
import { useRoute } from 'vue-router'

import BlockHeader from '@/components/ui/BlockHeader.vue'
// статические импорты видео
import landing from '@/assets/images/service/landing.mp4'
import order from '@/assets/images/service/order.mp4'
import video3D from '@/assets/images/service/3D.mp4' 

useSEO({ 
  title: 'Услуги', 
  description: 'Создание сайтов, брендинг и SEO-продвижение от SiteByPro — полный цикл услуг для развития вашего бизнеса онлайн.',
  image: 'https://sitebypro-server.ru/static/files/store/preview.png',
  url: 'https://sitebypro.com/services'
})



const showForm = ref(false)

function onOpen() {  }
function onClose() { showForm.value = false }   
function onOpened() {  }
function onClosed() {  }

// карта статических видео по именам файлов
const videos: Record<string, string> = {
  'landing.mp4': landing,
  'order.mp4': order,
  '3D.mp4': video3D,
}

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
      video: 'landing.mp4',
      settings: {
        container: { class: 'services-container' },
        section: { class: 'services-section' },
        button: { class: 'services-toggle' },
        icon: { class: 'services-toggle-icon' },
        list: { class: 'services-list' },
      },
      children: [
        {
          "id": "web",
          "title": "Веб-<br>разработка",
          video: 'landing.mp4',
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
          "title": "Уникальный<br>дизайн",
          video: 'order.mp4',
          "items": [
            {
              "title": "UI/UX",
              "href": "/design/uiux"
            }
          ]
        },
        {
          "id": "design-3d",
          "title": "3D-<br>макеты",
          video: '3D.mp4',
          "items": [
            {
              "title": "UI/UX",
              "href": "/design/uiux"
            }
          ]
        }
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

// helper to return статический импорт по имени файла
function getVideoUrl(fileName?: string) {
  if (!fileName) return ''
  return videos[fileName] ?? ''
}

async function goTo(path) { await navigateTo({ path: '/templates' }) }

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
  const items = menu?.querySelectorAll<HTMLElement>('a[role="menuitem"], button[role="menuitem"]') ?? []
  if (items.length) items[0].focus()
}
function focusLastItem(sectionIdx: number) {
  const menu = menuRefs.value[sectionIdx]
  const items = menu?.querySelectorAll<HTMLElement>('a[role="menuitem"], button[role="menuitem"]') ?? []
  if (items.length) items[items.length - 1].focus()
}
function focusNextItem(sectionIdx: number) {
  const menu = menuRefs.value[sectionIdx]
  const items = menu?.querySelectorAll<HTMLElement>('a[role="menuitem"], button[role="menuitem"]') ?? []
  if (!items.length) return
  const idx = Array.from(items).indexOf(document.activeElement as HTMLElement)
  const next = (idx + 1 + items.length) % items.length
  items[next].focus()
}
function focusPrevItem(sectionIdx: number) {
  const menu = menuRefs.value[sectionIdx]
  const items = menu?.querySelectorAll<HTMLElement>('a[role="menuitem"], button[role="menuitem"]') ?? []
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

function scrollToSectionById(sectionId: string) {
  const idx = merged.value.children.findIndex(c => c.id === sectionId)
  if (idx === -1) return

  openSection(idx) // открываем секцию

  nextTick(() => {
    const btn = document.getElementById(buttonId(idx))
    const menu = document.getElementById(listId(idx))
    if (!btn || !menu) return

    // ждем, пока transition закончится
    const onTransitionEnd = () => {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' })
      menu.removeEventListener('transitionend', onTransitionEnd)
    }
    menu.addEventListener('transitionend', onTransitionEnd)
  })
}


watch(
  () => route.query['3d'],
  (val) => {
    if (val === '1') {
      // ждём рендера секции после перехода
      nextTick(() => scrollToSectionById('design-3d'))
    }
  }
)

onMounted(() => {
  if (merged.value.closeOnOutside) document.addEventListener('click', onDocumentClick)

  if (route.query['3d'] === '1') {
    nextTick(() => scrollToSectionById('design-3d'))
  }
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
  max-width: 2100px;
  margin: 0 auto;
  padding: 1rem;
  padding-bottom: 5rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* block title */
.block-title {
  margin: 0;
  font-size: 1.25rem;
}

/* section wrapper */
.services-section {
  display: flex;
  flex-direction: column;
}

/* section title (теперь используется внутри кнопки) */
.section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  display: inline-block;
  line-height: 1;
  color: white;
  text-wrap: nowrap;
  text-align: left;
}

/* toggle button */
.services-toggle {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: space-between;
  gap: 0rem;
  overflow: hidden;
  padding: 0rem;
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
  padding: 2rem;
  list-style: none;
  border: 1px solid #f0f0f0;
  border-top: 0;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background: #fff;
  font-size: 25px;
  border-radius: 0rem 0rem 2rem 2rem;
}

/* content inside service */
.service-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.service-lead {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}
.service-steps {
  margin: 0;
  padding-left: 1.25rem;
}
.service-steps li {
  margin: 0.6rem 0;
}
.step-desc {
  margin: 0.35rem 0;
  color: #444;
}

/* buttons */
.service-btn {
  display: inline-block;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  text-decoration: none;
  background: #2663eb;
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  width: fit-content;

}

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
  height: 22rem;
  overflow: hidden;
}
.img__container img {
  width: inherit;
  height: inherit;
  object-fit: contain;
  background-color: #ebeaef;
}
.about__container {
  padding: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  background-color: #2663eb;
  color: white;
}
.img__block {
  height: 100%;
  width: 100%;
  background-color: #ebebf0;
  padding: 1rem;
}
.img__video {
  height: 100%;
  width: 100%;
}

@media (max-width: 768px) {
  .img__container {
    height: fit-content;
  }
  .about__container {
  }
}

@media (min-width: 768px) {
  .services-toggle-icon {
    display: none
  }
  .services-toggle {
    flex-direction: row;
    height: 100%;
  }
  .about__container {
    height: -webkit-fill-available;
    background-color: white;
    color: #2663eb;
  }
  .section-title {
    color: #2663eb;
    font-weight: bold;
    font-size: inherit;
    line-height: 8.5rem;
    letter-spacing: -0.5rem;
  }
  .about__container-web {
    width: 114%;
    word-break: break-word;
    font-size: 9rem;
    height: fit-content;
    text-align: left;
    color: #f97315;
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;

  }
  .about__container-design {
    width: 142%;
    height: fit-content;
    word-break: break-word;
    font-size: 11rem;
    text-align: left;
    color: #f97315;
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
  }
  .about__container-design-3d {
    width: 55%;
    word-break: break-word;
    font-size: 11rem;
    text-align: left;
    color: #f97315;
    display: flex;
    height: fit-content;
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  #button-block-design-1 {
    flex-direction: row-reverse;
    .section-title {color: #313237}
  }
}

@media (max-width: 1024px) and (min-width: 768px) {
  .section-title {
    line-height: 4.5rem;
    letter-spacing: -0.3rem;
  }
  .about__container-web {
    width: 50%;
    font-size: 5rem;
  }
  .about__container-design {
    width: 50%;
    font-size: 5rem;
  }
  .about__container-design-3d {
    width: 33%;
    font-size: 5rem;
  }
}

@media (max-width: 1245px) and (min-width: 1024px) {
  .section-title {
    line-height: 4.5rem;
    letter-spacing: -0.3rem;
  }
  .about__container-web {
    width: 50%;
    font-size: 5rem;
  }
  .about__container-design {
    width: 50%;
    font-size: 5rem;
  }
  .about__container-design-3d {
    width: 30%;
    font-size: 5rem;
  }
}

@media (min-width: 1245px) and (max-width: 1800px) {
  .section-title {
    line-height: 5.5rem;
    letter-spacing: -0.5rem;
  }
  .about__container-web {
    width: 50%;
    font-size: 9rem;
  }
  .about__container-design {
    width: 60%;
    font-size: 9rem;
  }
  .about__container-design-3d {
    width: 30%;
    font-size: 9rem;
  }
}

.header__subtitle {
  font-size: 1.2rem;
  color: var(--white);
  opacity: 0.9;
}
.next-cirlce__svg {
  margin-left: 0.5rem;
}
</style>
