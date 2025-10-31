<template>
  <div class="b0">
    <div class="b0__container">
      <div class="b0__block">
        <div class="b0__block-inside">
          <BlockBg class="b0-block__bg" />
          <BlockMobileBg class="b0-block__bg-mobile" />

          <div class="b0-info__container">
            <div class="b0-left__container">
              <div class="b0-left__info">
                <h3 class="b0-left__info-h3">Интеграторы digital-решений</h3>
                <Corner :rotation="'270'" :left="'0'" :top="'-1.9'" :mobileLeft="'0'" :mobileTop="'-1.9'" />
                <h1 class="b0-left__info-h1-blue">Воплоти свой<br/>бизнес</h1>
                <Corner :rotation="'270'" :left="'20.85'" :top="'0.5'" :mobileLeft="'17.85'" :mobileTop="'0.5'" />

                <Corner class="middle-corner" :rotation="'270'" :left="'29.45'" :top="'10'" :mobileLeft="'29.45'" :mobileTop="'10'" />
                <h1 class="b0-left__info-h1">в цифровом<br/>пространстве</h1>
                <Corner :rotation="'0'" :left="'0'" :top="'100%'" />
              </div>
            </div>

            <!-- RIGHT CONTAINER -->
            <div class="b0-right__container" ref="rightContainer">
              <!-- контейнер с длинной картинкой (окно просмотра) -->
              <div class="b0-right__photo" ref="rightPhoto">
                <img ref="longPhoto" :src="photoSrc" alt="template" class="photo-img" />
              </div>

              <!-- видео-вырез с clipPath: один контейнер; внутри — два варианта рендера (SVG+foreignObject для большинства, HTML+CSS clip-path для Safari) -->
              <div ref="videoWrapper" class="video-mask">
                <!-- Non-Safari: SVG + foreignObject (видео внутри SVG clipPath) -->
                <svg
                  v-if="!isSafari"
                  ref="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  :viewBox="viewBox"
                  preserveAspectRatio="xMidYMid slice"
                  class="svg-wrap"
                >
                  <defs>
                    <clipPath id="rounded-clip" clipPathUnits="userSpaceOnUse">
                      <path id="clip-path-d" ref="clipPathEl" :d="currentPath" />
                    </clipPath>

                    <path id="outline-path" ref="outlineEl" class="outline" :d="currentPath" />
                  </defs>

                  <foreignObject
                    x="0"
                    y="0"
                    :width="vbWidth"
                    :height="vbHeight"
                    clip-path="url(#rounded-clip)"
                  >
                    <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;">
                      <video
                        ref="videoEl"
                        class="inner-video"
                        :src="videoSrc"
                        autoplay
                        muted
                        loop
                        playsinline
                      ></video>
                    </div>
                  </foreignObject>

                  <use href="#outline-path" />
                </svg>

                <!-- Safari fallback: обычный HTML <video> с CSS clip-path (path()) и отдельная SVG overlay для контура -->
                <div v-else class="safari-fallback">
                  <video
                    ref="videoEl"
                    class="inner-video"
                    :src="videoSrc"
                    autoplay
                    muted
                    loop
                    playsinline
                    :style="videoClipStyle"
                  ></video>

                  <!-- SVG overlay для stroke контура (не используем foreignObject здесь) -->
                  <svg v-if="currentPath" :viewBox="viewBox" preserveAspectRatio="xMidYMid slice" class="svg-wrap svg-overlay">
                    <path :d="currentPath" class="outline" fill="none" />
                  </svg>
                </div>
              </div>

              <div class="b0-right__imgs">
                <div class="b0-right__cone" />
                <div class="b0-right__mouse" />
              </div>
            </div>

            <div class="b0-right-bottom__container">
              <div class="b0-right-bottom__box">
                <Corner :rotation="'180'" :left="'-1.95'" :top="'1'" />
                <Corner :rotation="'180'" :left="'18.03'" :top="'-2'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import BlockBg from '~/assets/icons/landing/block-bg.svg';
import BlockMobileBg from '~/assets/icons/landing/block-bg-mobile.svg';
import Corner from '~/components/ui/blocks/corner.vue';
import photoSrc from '@/assets/icons/landing/template.png';
import videoSrc from '@/assets/images/landing/preview-video.mp4';

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
});
</script>



<style scoped>
/* ===========================
   ORIGINAL STYLES + BROWSER PATCHES
   =========================== */

/* base */
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
  height: 100%;
  padding: 20px;
}
.b0__block {
  max-width: 2100px;
  margin: 0 auto;
  background-color: white;
  padding: 12px 12px 96px 12px;
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
/* ===========================
   MEDIA QUERIES (fixed)
   =========================== */

@media (max-width: 1248px) and (min-width: 768px) {
	.b0-right__container {
		
	}
	.b0-right__photo {
		width: 27vw;
		height: 17vw;
		bottom: 3vw;
	}
	.b0-right__mouse {
		width: 14rem;
		height: 14rem;
		left: -9rem;
		bottom: -6rem;
	}
	.b0-right__cone {
		width: 18rem;
		height: 18rem;
		top: 0rem;
		right: -5rem;
		position: fixed;
	}
	.b0-block__bg {
		min-height: 31vh;
	}
	.b0__block-inside {
		overflow: hidden;
	}
}


@media (max-width: 768px) {
	.middle-corner {
		display: block;
	}
  .b0-block__bg {
    display: none;
  }
  .b0-block__bg-mobile {
    display: block;
    height: 100vh;
    min-width: 100%;
    min-height: 100vh;
  }

  .b0__block-inside {
    overflow: hidden;
  }
  .b0__bg {
    min-height: 300vh;
  }
  .b0-info__container {
    flex-direction: column;
    align-items: flex-start;
    padding-top: 12rem;
  }
  .b0-right__cone {
    top: 3rem;
    position: fixed;
    right: -5rem;
    width: 18rem;
    height: 18rem;
  }

  .b0-right__container {
    width: 100%;
  }
  .b0-right__photo {
    display: none;
  }

  .video-mask {
    padding: 0;
    margin-bottom: 10rem;
  }
  .b0-right-bottom__container {
    display: none;
  }

  /* responsive typography adjustments for small screens */
  .b0-left__info-h1,
  .b0-left__info-h1-blue {
  }
  .b0-left__info-h1-blue {
  	padding-right: 36px;
		width: fit-content;
  }
  .b0-left__info-h1 {
		border-radius: 0px 26px 26px 0px;
		padding-left: 66px;
		padding-right: 36px;
  }
  .b0-left__info-h3 {
    font-size: clamp(12px, 3.6vw, 16px);
  }
  .b0-info__container {
  	gap: 0rem;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
  }
  .b0-right__container {
  	max-width: 100%;
  }
  .b0-right__mouse {
		bottom: 2rem;
		left: -1rem;
		width: 20rem;
		height: 20rem;
  }
}
.b0 {
	min-height: 110vh;
}
</style>
