<template>
  <div class="b0">
    <div class="b0__container">
      <div class="b0__block">
       
      	<client-only>
          <SectionComMobile v-if="isMobile" class="b0__section" />
          <SectionCom v-else class="b0__section" />


          <video autoplay loop muted playsinline
            class="b0__video"
           id="video-player-v"
           ref="video-player-v">
            <source src="@/assets/images/landing/preview-landing-video-low.mp4" type="video/mp4">
          </video>

          <img v-if="!isMobile" alt="earn-cone" src="@/assets/images/landing/cone.png" class="b0__cone"/>
          <img v-if="!isMobile" alt="earn-mouse" src="@/assets/images/landing/mouse.png" class="b0__mouse"/>

          <img v-if="isMobile" alt="earn-cone" src="@/assets/images/landing/cone-mobile.png" class="b0__cone"/>
          <img v-if="isMobile" alt="earn-mouse" src="@/assets/images/landing/mouse-mobile.png" class="b0__mouse"/>

        </client-only>
         
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

import SectionCom from './SectionCom.vue'
import SectionComMobile from './SectionComMobile.vue'


// polygon в процентах
const polygonPercent = [
  [11, 15],
  [94, 7],
  [94, 92],
  [4.5, 72],
];

const radiusPx = 5; // радиус скругления вершин

// refs
const videoWrapper = ref(null);
const svg = ref(null);
const clipPathEl = ref(null);
const outlineEl = ref(null);
const videoEl = ref(null);

const rightContainer = ref(null);
const rightPhoto = ref(null);
const longPhoto = ref(null);

const vbWidth = ref(1);
const vbHeight = ref(1);
const viewBox = ref('0 0 1 1');
const currentPath = ref('M0 0Z');
const videoClipStyle = ref({});

let ro = null; // ResizeObserver for svg/video wrapper
let photoRO = null; // ResizeObserver for photo/container
let resizeTimer = null;
let resizeTimerPhoto = null;
let imgLoadListener = null;

// Safari detection
const isSafari = ref(false);

// векторные утилиты
function vec(x, y) { return { x, y }; }
function sub(a, b) { return { x: a.x - b.x, y: a.y - b.y }; }
function add(a, b) { return { x: a.x + b.x, y: a.y + b.y }; }
function mul(a, s) { return { x: a.x * s, y: a.y * s }; }
function len(v) { return Math.hypot(v.x, v.y); }
function norm(v) { const L = len(v) || 1; return { x: v.x / L, y: v.y / L }; }

// Функция строит path со сглаженными углами (квадратичные кривые Q)
function roundedPolygonPath(points, r) {
  const n = points.length;
  if (n < 3) return '';

  const starts = new Array(n);
  const ends = new Array(n);

  for (let i = 0; i < n; i++) {
    const P = points[i];
    const Pprev = points[(i - 1 + n) % n];
    const Pnext = points[(i + 1) % n];

    const vPrev = sub(Pprev, P);
    const vNext = sub(Pnext, P);

    const lenPrev = len(vPrev);
    const lenNext = len(vNext);

    const r1 = Math.min(r, lenPrev / 2);
    const r2 = Math.min(r, lenNext / 2);
    const rCorner = Math.min(r1, r2);

    const nvPrev = norm(vPrev);
    const nvNext = norm(vNext);

    starts[i] = add(P, mul(nvPrev, rCorner));
    ends[i] = add(P, mul(nvNext, rCorner));
  }

  let d = `M ${ends[n - 1].x.toFixed(3)} ${ends[n - 1].y.toFixed(3)}`;

  for (let i = 0; i < n; i++) {
    d += ` L ${starts[i].x.toFixed(3)} ${starts[i].y.toFixed(3)}`;
    const P = points[i];
    d += ` Q ${P.x.toFixed(3)} ${P.y.toFixed(3)} ${ends[i].x.toFixed(3)} ${ends[i].y.toFixed(3)}`;
  }

  d += ' Z';
  return d;
}

function updatePath() {
  const wrapper = videoWrapper.value;
  if (!wrapper) return;

  const rect = wrapper.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));

  // Защита от аномалий
  if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return;
  if (w * h > 1e8) { // слишком большая область — прекращаем
    console.warn('updatePath: skipping crazy big size', w, h);
    return;
  }

  vbWidth.value = w;
  vbHeight.value = h;
  viewBox.value = `0 0 ${vbWidth.value} ${vbHeight.value}`;

  const pointsPx = polygonPercent.map(p => vec((p[0] / 100) * vbWidth.value, (p[1] / 100) * vbHeight.value));
  const d = roundedPolygonPath(pointsPx, radiusPx) || `M0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;

  // сохраняем и применяем
  currentPath.value = d;

  // Для SVG-элементов (non-safari) — напрямую ставим в элементы, если refs доступны
  if (clipPathEl.value) clipPathEl.value.setAttribute('d', d);
  if (outlineEl.value) {
    outlineEl.value.setAttribute('d', d);
    outlineEl.value.setAttribute('vector-effect', 'non-scaling-stroke');
  }

  // Safari fallback — ставим CSS clip-path на video
  try {
    const escaped = d.replace(/'/g, "\\'");
    const clip = `path('${escaped}')`;
    videoClipStyle.value = {
      clipPath: clip,
      WebkitClipPath: clip,
    };
  } catch (e) {
    // если не получилось — сбрасываем
    videoClipStyle.value = {};
  }
}

// --- логика прокрутки длинной картинки ---
function updateLongPhotoScroll() {
  const cont = rightPhoto.value;
  const img = longPhoto.value;
  if (!cont || !img) return;

  const containerH = cont.clientHeight;
  const imgH = img.offsetHeight;
  const dy = Math.max(0, imgH - containerH);
  const dyClamped = Math.round(dy);

  const baseSeconds = 4;
  const pxPerSecond = 200;
  const duration = dyClamped > 0 ? Math.max(baseSeconds, dyClamped / pxPerSecond) : baseSeconds;

  cont.style.setProperty('--dy', `-${dyClamped}px`);
  cont.style.setProperty('--pan-duration', `${duration}s`);

  if (dyClamped === 0) cont.classList.remove('photo-pan-active');
  else cont.classList.add('photo-pan-active');
}

onMounted(async () => {
  update()
  mq = window.matchMedia('(max-width: 767.98px)')
  // modern browsers
  if (mq.addEventListener) mq.addEventListener('change', update)
  else mq.addListener(update) // fallback for older browsers


  // Safari detection (simple)
  const ua = navigator.userAgent || '';
  isSafari.value = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);

  await nextTick();

  // ResizeObserver для видео-обёртки (debounced)
  if (videoWrapper.value) {
    ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updatePath, 60);
    });
    ro.observe(videoWrapper.value);
  }

  // photo resize observer
  if (rightContainer.value) {
    photoRO = new ResizeObserver(() => {
      clearTimeout(resizeTimerPhoto);
      resizeTimerPhoto = setTimeout(updateLongPhotoScroll, 120);
    });
    photoRO.observe(rightContainer.value);
    if (rightPhoto.value) photoRO.observe(rightPhoto.value);
  }

  // слушаем загрузку картинки если она не готова
  const img = longPhoto.value;
  if (img && !img.complete) {
    imgLoadListener = () => {
      updateLongPhotoScroll();
      img.removeEventListener('load', imgLoadListener);
      imgLoadListener = null;
    };
    img.addEventListener('load', imgLoadListener);
  } else {
    updateLongPhotoScroll();
  }

  // initial safe calls
  setTimeout(updatePath, 60);
  setTimeout(updateLongPhotoScroll, 120);

  window.addEventListener('load', updatePath);
  window.addEventListener('orientationchange', updatePath);
});

onBeforeUnmount(() => {
  if (ro && videoWrapper.value) ro.unobserve(videoWrapper.value);
  if (ro) { ro.disconnect(); ro = null; }

  if (photoRO) {
    if (rightContainer.value) photoRO.unobserve(rightContainer.value);
    if (rightPhoto.value) photoRO.unobserve(rightPhoto.value);
    photoRO.disconnect();
    photoRO = null;
  }

  if (imgLoadListener && longPhoto.value) {
    longPhoto.value.removeEventListener('load', imgLoadListener);
    imgLoadListener = null;
  }

  window.removeEventListener('load', updatePath);
  window.removeEventListener('orientationchange', updatePath);
  clearTimeout(resizeTimer);
  clearTimeout(resizeTimerPhoto);

  if (!mq) return
  if (mq.removeEventListener) mq.removeEventListener('change', update)
  else mq.removeListener(update)
});



const isMobile = ref(false)
let mq = null

function update() {
  isMobile.value = window.innerWidth < 768
}



</script>



<style scoped>

.b0__bg {
  width: 100%;
  height: 100%;
  
  margin-bottom: 0;
}
.nuxt-icon--fill, .nuxt-icon--fill * {
  fill: revert-layer !important;
}
.b0__container {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 1vw;
  overflow: hidden;
}
.b0__block {
  /*max-width: 2100px;*/
  margin: 0 auto;
  background-color: white;
  padding: 12px 12px 96px 12px;
  padding: 0;
  border-radius: 26px;
  overflow: hidden;
}
.b0-block__bg {
  width: inherit;
  height: inherit;
  margin-bottom: 0;
  border-radius: 26px;
}

.b0-block__bg-mobile {
  display: none;
  width: inherit;
  height: inherit;
  margin-bottom: 0;
  border-radius: 26px;
}

.b0__block-inside {
  border-radius: 26px;
  position: relative;
  background: linear-gradient(270deg, #6A11CB 0%, #2575FC 100%);
}
.b0-info__container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 7rem;
  flex-wrap: nowrap;
  padding-top: 4rem;
  justify-content: space-between;
}
.b0-left__container { margin-left: -1px; }
.b0-right__container {
  position: relative;
	width: 100%;
	max-width: 60%;
	margin-left: auto;
	margin-right: auto;
}

/* --- VIDEO / SVG area --- */
/* Use aspect-ratio when available; fallback handled below */
.video-mask {
  width: 100%;
  aspect-ratio: 22 / 15;
  position: relative;
  display: block;
  padding-bottom: 80px;
}

.svg-wrap { width: 100%; height: 100%; display: block; }

.inner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(-1, 1);
  display: block;
}

.outline {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 8;
  pointer-events: none;
  vector-effect: non-scaling-stroke;
}

/* typography blocks */
.b0-left__info-h3 {
  color: #000;
  position: relative;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 20.568px;
  background-color: white;
  width: fit-content;
  padding: 19px 36px 0px 22px;
  border-radius: 0px 26px 0px 0px;
}

.b0-left__info-h1 {
  background-color: white;
  text-align: right;
  font-size: 72px;
  font-style: normal;
  font-weight: 500;
  line-height: 61px;
  letter-spacing: -2.88px;
  border-radius: 0px 0 26px 0px;
  padding: 0 36px 39px 0;
}

.b0-left__info-h1-blue {
  color: #0040C1;
  background-color: white;
  text-align: right;
  font-size: 72px;
  font-style: normal;
  font-weight: 500;
  line-height: 61px;
  letter-spacing: -2.88px;
  border-radius: 0px 26px 0px 0px;
  padding: 30px 36px 0px 22px;
}

.b0-left__info { position: relative; }

.b0-right-bottom__container {
  position: absolute;
  width: 20rem;
  height: 3rem;
  background-color: white;
  right: 0px;
  bottom: 0px;
  border-radius: 24px 0px 0px 0px;
}
.b0-right-bottom__box { position: relative; width: 100%; height: 100%; }

.b0-right__imgs { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }

.b0-right__mouse {
  background: url('@/assets/icons/landing/mouse.svg');
  width: 24rem;
  height: 21rem;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  bottom: -7rem;
  left: -4rem;
  z-index: 10;
}

.b0-right__cone {
  background: url('@/assets/icons/landing/cone.png');
  width: 24rem;
  height: 21rem;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  top: -6rem;
  right: -10rem;
  z-index: 10;
}

/* --- КОНТЕЙНЕР ДЛЯ ДЛИННОЙ КАРТИНКИ --- */
.b0-right__photo {
  position: absolute;
  bottom: 6rem;
  left: -5rem;
  width: 27rem;
  height: 18rem;
  overflow: hidden;
  border-radius: 14px;
  z-index: 10;
  border: 0.2rem solid #c6ccfd;
  --dy: 0px;
  --pan-duration: 20s;
  will-change: transform;
}

/* картинка внутри контейнера - растягиваем по ширине */
.b0-right__photo .photo-img {
  display: block;
  width: 100%;
  height: auto;
  transform: translateY(0);
  pointer-events: none;
}

/* активная анимация: двигаем img внутри контейнера */
.b0-right__photo.photo-pan-active .photo-img {
  animation: photo-pan 10s ease-in-out infinite;
  animation-direction: normal;
}

@keyframes photo-pan {
  0% { transform: translateY(0); }
  50% { transform: translateY(var(--dy)); }
  100% { transform: translateY(0); }
}

/* ===========================
   CROSS-BROWSER PATCHES
   =========================== */

/* Rendering smoothness + box sizing safe */
.b0__block,
.b0__block-inside,
.b0-info__container,
.b0-right__container,
.video-mask,
.svg-wrap,
.inner-video,
.b0-right__photo,
.b0-right__photo .photo-img {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* object-fit fallbacks & video flipping cross-browser */
.inner-video {
  object-fit: cover;
  -webkit-object-fit: cover;
  -o-object-fit: cover;
  width: 100%;
  height: 100%;
  /* two ways to flip horizontally for broader compatibility */
  transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -ms-transform: scaleX(-1);
  display: block;
  will-change: transform;
}

/* aspect-ratio support and fallback */
@supports (aspect-ratio: 1/1) {
  .video-mask {
    aspect-ratio: 22 / 15;
    padding-bottom: 0;
    height: auto;
  }
  .video-mask > svg { position: relative; width: 100%; height: 100%; }
}
@supports not (aspect-ratio: 1/1) {
  .video-mask {
    height: 0;
    padding-bottom: calc(15 / 22 * 100%); /* fallback: 22:15 ratio */
    overflow: hidden;
  }
  .video-mask > svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
}

/* Ensure svg scales correctly in flex containers (Firefox) */
.svg-wrap {
  width: 100% !important;
  height: 100% !important;
  display: block;
  min-width: 0;
  min-height: 0;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* force non-scaling stroke and consistent stroke rendering */
.outline {
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 8;
}

/* hardware acceleration hints for animated elements */
.b0-right__photo,
.b0-right__photo .photo-img,
.b0-right__imgs,
.b0-right__mouse,
.b0-right__cone {
  /*-webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform, opacity;
  */
}

/* make sure image doesn't reflow while loading */
.b0-right__photo img {
  display: block;
  max-width: 100%;
  height: auto;
  -webkit-user-drag: none;
  user-select: none;
}

/* Safari specific tweaks (old versions) */
@supports (-webkit-touch-callout: none) {
  .outline { stroke-width: 6; } /* visual tweak for old Safari */
  .svg-wrap { -webkit-transform-style: preserve-3d; transform-style: preserve-3d; }
}

/* Firefox-specific (older) */
@-moz-document url-prefix() {
  .b0-right__container { min-width: 260px; }
  .svg-wrap { display: block; width: 100%; height: 100%; }
}

/* typography small improvements across browsers */
.b0-left__info-h1,
.b0-left__info-h1-blue {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* keep visual identical but smoother */
}

.middle-corner {
	display: none;
}

.b0 {
  min-height: calc(65vw + 5px);
}

.b0__section {
	width: 100%;
	height: 100%;	
}

html, body {
  -webkit-text-size-adjust: 100%;
}

@supports (-webkit-touch-callout: none) {

  /* 1) принудительный хардварный слой для smooth animations / transform */
  .video-mask,
  .svg-wrap,
  .inner-video,
  .b0-right__photo,
  .b0-right__photo .photo-img,
  .b0-right__imgs {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    will-change: transform, opacity;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  /* 2) object-fit / flipping compatibility */
  .inner-video {
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    -webkit-object-fit: cover;
    object-fit: cover;
    object-position: 50% 50%;
    -webkit-backdrop-filter: none;
  }

  /* 3) flex children min-height bug in Safari (prevents overflow / collapsing) */
  .b0-info__container,
  .b0-right__container,
  .svg-wrap {
    min-height: 0;
    min-width: 0;
  }

  /* 4) prefix for keyframes / animation on iOS Safari */
  @-webkit-keyframes photo-pan {
    0% { -webkit-transform: translateY(0); transform: translateY(0); }
    50% { -webkit-transform: translateY(var(--dy)); transform: translateY(var(--dy)); }
    100% { -webkit-transform: translateY(0); transform: translateY(0); }
  }
  @keyframes photo-pan {
    0% { -webkit-transform: translateY(0); transform: translateY(0); }
    50% { -webkit-transform: translateY(var(--dy)); transform: translateY(var(--dy)); }
    100% { -webkit-transform: translateY(0); transform: translateY(0); }
  }
  .b0-right__photo.photo-pan-active .photo-img {
    -webkit-animation: photo-pan var(--pan-duration) ease-in-out infinite;
    animation: photo-pan var(--pan-duration) ease-in-out infinite;
    -webkit-animation-direction: normal;
    animation-direction: normal;
    -webkit-animation-timing-function: ease-in-out;
  }

  /* 5) stroke visual tweak for older Safari (сохраняем читаемость контура) */
  .outline {
    stroke-width: 6; /* чуть тоньше для старых движков */
    -webkit-stroke-width: 6;
    vector-effect: non-scaling-stroke;
  }

  /* 6) ensure smooth touch scrolling in image/photo containers on iOS */
  .b0-right__photo,
  .b0-info__container {
    -webkit-overflow-scrolling: touch;
  }

  /* 7) background / image rendering fixes */
  .b0-right__mouse,
  .b0-right__cone {
    -webkit-background-size: contain;
    background-size: contain;
    background-repeat: no-repeat;
    -webkit-transform-style: preserve-3d;
  }

  /* 8) fallback for clip-path: Safari иногда лучше работает с mask/clip-path префиксом.
     JS у вас уже ставит inline -webkit-clip-path — этот селектор поможет, если нужно */
  .inner-video[style*="clip-path"],
  .inner-video[style*="-webkit-clip-path"] {
    -webkit-clip-path: unset; /* даём приоритет inline-стилю из JS */
  }

  /* 9) предотвращаем резкие изменения шрифтов при масштабировании / рендере */
  .b0-left__info-h1,
  .b0-left__info-h1-blue,
  .b0-left__info-h3 {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
}
.b0__video {
  position: absolute;
  top: 14vw;
  left: 55vw;
  width: 62vw;
  height: 37vw;
  display: block;
  margin: 0;
  padding: 0;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 1vw;
}
.b0__cone {
  position: absolute;
  right: 1vw;
  top: 7vw;
  width: 12vw;
  height: 13vw;
}
.b0__mouse {
      position: absolute;
    right: 57vw;
    top: 46vw;
    width: 29vw;
    height: 25vw;
}

@media (max-width: 768px) {
  .b0 {
    min-height: calc(224vw + 5px);
    overflow-x: hidden;
    width: 100vw;
  }
  .b0__container {
    padding: 0vw;
  }
  .b0__video {
    top: 135vw;
    left: 8vw;
    width: 108vw;
    height: 64vw;
  }
  .b0__mouse {
    right: unset;
    top: 191vw;
    width: 52vw;
    height: 44vw;
    left: 5vw;
  }
  .b0__cone {
    position: absolute;
    right: 4vw;
    top: 19vw;
    width: 45vw;
    height: 50vw;
  }

  .b0__block {
    border-radius: 0; 
  }
}
</style>









