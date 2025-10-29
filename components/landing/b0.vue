<template>
  <bg class="b0__bg" />
  <div class="b0__container">
    <div class="b0__block">
      <div class="b0__block-inside">
        <block_bg class="b0-block__bg" />
        <block_mobile_bg class="b0-block__bg-mobile" />

        <div class="b0-info__container">
          <div class="b0-left__container">
            <div class="b0-left__info">
              <h3 class="b0-left__info-h3">Интеграторы digital-решений </h3>
              <corner :rotation="'270'" :left="'0'" :top="'-1.9'"/>
              <h1 class="b0-left__info-h1-blue">Воплоти свой<br/>бизнес</h1>
              <corner :rotation="'270'" :left="'20.85'" :top="'0.5'"/>
              <h1 class="b0-left__info-h1">в цифровом<br/>пространстве</h1>
              <corner :rotation="'0'" :left="'0'" :top="'22'"/>
            </div>
          </div>

          <!-- RIGHT CONTAINER -->
          <div class="b0-right__container" ref="rightContainer">
            <!-- контейнер с длинной картинкой (окно просмотра) -->
            <div class="b0-right__photo" ref="rightPhoto">
              <img ref="longPhoto" :src="photoSrc" alt="template" class="photo-img"/>
            </div>

            <!-- видео-вырез с clipPath -->
            <div ref="videoWrapper" class="video-mask">
              <svg
                ref="svg"
                xmlns="http://www.w3.org/2000/svg"
                :viewBox="viewBox"
                preserveAspectRatio="xMidYMid slice"
                class="svg-wrap"
              >
                <defs>
                  <clipPath id="rounded-clip" clipPathUnits="userSpaceOnUse">
                    <path id="clip-path-d" ref="clipPathEl" d="M0 0Z"></path>
                  </clipPath>

                  <path id="outline-path" ref="outlineEl" class="outline" d="M0 0Z"></path>
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

                <use href="#outline-path"></use>
              </svg>
            </div>

            <div class="b0-right__imgs">
              <div class="b0-right__cone"/>
              <div class="b0-right__mouse"/>
            </div>
          </div>

          <div class="b0-right-bottom__container">
            <div class="b0-right-bottom__box">
              <corner :rotation="'180'" :left="'-1.95'" :top="'1'"/>
              <corner :rotation="'180'" :left="'18.03'" :top="'-2'"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import bg from '~/assets/icons/landing/bg.svg';
import block_bg from '~/assets/icons/landing/block-bg.svg';
import block_mobile_bg from '~/assets/icons/landing/block-bg-mobile.svg';

import corner from '~/components/ui/blocks/corner.vue';
import photoSrc from '@/assets/icons/landing/template.png';
import videoSrc from '@/assets/images/landing/preview-video.mp4';

// polygon в процентах (ваш)
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

let ro = null; // ResizeObserver for svg/video wrapper
let photoRO = null; // ResizeObserver for photo/container
let resizeTimer = null;
let resizeTimerPhoto = null;
let imgLoadListener = null;

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
  const rUsed = new Array(n);

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
    rUsed[i] = rCorner;

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
  if (!videoWrapper.value || !svg.value || !clipPathEl.value || !outlineEl.value) return;

  const rect = videoWrapper.value.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));

  vbWidth.value = w;
  vbHeight.value = h;
  viewBox.value = `0 0 ${vbWidth.value} ${vbHeight.value}`;

  const pointsPx = polygonPercent.map(p => vec((p[0] / 100) * vbWidth.value, (p[1] / 100) * vbHeight.value));
  const d = roundedPolygonPath(pointsPx, radiusPx);

  clipPathEl.value.setAttribute('d', d);
  outlineEl.value.setAttribute('d', d);
  outlineEl.value.setAttribute('vector-effect', 'non-scaling-stroke');
}

// --- логика прокрутки длинной картинки ---
function updateLongPhotoScroll() {
  const cont = rightPhoto.value;
  const img = longPhoto.value;
  if (!cont || !img) return;

  // размеры окна просмотра (контейнера) и высота реальной картинки
  const containerH = cont.clientHeight;
  const imgH = img.offsetHeight;

  // смещение в px (сколько нужно поднять картинку, чтобы показать низ)
  const dy = Math.max(0, imgH - containerH);
  const dyClamped = Math.round(dy);

  // длительность анимации (настраиваемые параметры)
  const baseSeconds = 4; // минимальная
  const pxPerSecond = 200; // пикселей в секунду
  const duration = dyClamped > 0 ? Math.max(baseSeconds, dyClamped / pxPerSecond) : baseSeconds;

  cont.style.setProperty('--dy', `-${dyClamped}px`);
  cont.style.setProperty('--pan-duration', `${duration}s`);

  if (dyClamped === 0) {
    cont.classList.remove('photo-pan-active');
  } else {
    cont.classList.add('photo-pan-active');
  }
}

onMounted(async () => {
  // SVG clippath resize
  if (videoWrapper.value) {
    ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updatePath, 40);
    });
    ro.observe(videoWrapper.value);
  }

  // photo resize observer
  if (rightContainer.value) {
    photoRO = new ResizeObserver(() => {
      clearTimeout(resizeTimerPhoto);
      resizeTimerPhoto = setTimeout(updateLongPhotoScroll, 80);
    });
    photoRO.observe(rightContainer.value);
    if (rightPhoto.value) photoRO.observe(rightPhoto.value);
  }

  // слушаем загрузку картинки если она не готова
  await nextTick();
  const img = longPhoto.value;
  if (img && !img.complete) {
    imgLoadListener = () => {
      updateLongPhotoScroll();
      img.removeEventListener('load', imgLoadListener);
      imgLoadListener = null;
    };
    img.addEventListener('load', imgLoadListener);
  } else {
    // если уже загружено
    updateLongPhotoScroll();
  }

  // safety вызовы
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

// expose assets
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
  flex-wrap: nowrap;
  padding-top: 4rem;
  justify-content: space-between;
}
.b0-left__container { margin-left: -1px; }
.b0-right__container {
  width: 60%;
  position: relative;
}

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


@media (max-width: 1248px) { 
	.b0-info__container, .b0-block__bg { 
		display: none; 
	} 
	.b0-block__bg-mobile {
		display: block;
	}
	.b0-block__bg {

	}
	.b0__bg {
		min-height: 300vh
	}
}
</style>










