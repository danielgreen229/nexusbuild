<template>
  <div ref="root" class="b3">
    <div ref="left" class="b3__left">
      <div
        class="b3__shape-placeholder"
      />

      <img
        ref="shape"
        class="b3__shape"
        :src="shapeSrc"
        alt="sitebypro-shape"
        :style="shapeStyle"
        @load="onImageLoad"
        draggable="false"
      />
    </div>

    <div class="b3__right">
      <div class="b3__form">
        <div class="b3__info">
          <h2 class="b1__main-h2">
            <span class="b1__main-h2-colored">Делайте сайт с&nbsp;командой,</span>
            <br />
            которой доверяют
          </h2>
          <p class="b1__main-p">Опишите задачу — мы оценим и пришлём понятный план  с бюджетом и сроками. Поддержка и доработка включены.</p>
        </div>
        <div class="b3__form-input">
          <div class="b3__input-top">
            <input class="b3__input" v-model="request.FIO" placeholder="ФИО"/>
            <input class="b3__input" v-model="request.company" placeholder="Компания"/>
          </div>
          <div class="b3__input-top">
            <input class="b3__input" v-model="request.email" placeholder="Email*"/>
            <input class="b3__input" v-model="request.phone" placeholder="+7 (000) 000-00-00"/>
          </div>
          <textarea class="b3__textarea" v-model="request.description" placeholder="Краткое описание"></textarea>
          <div class="b3__form-input-bottom">
            <div class="b3__item-checkbox">
                <p class="b3__p-checkbox">
                  <itemCheckbox class="b3__p-checkbox-img"/>
                  <span>Согласен(а) на&nbsp;обработку персональных данных&quot;&nbsp;&mdash; со&nbsp;ссылкой на&nbsp;политику&nbsp;&mdash; (обязательное)</span>
                </p>
            </div>
            <button
              class="b3__send-button"
              @click="sendRequest()"
              :disabled="sending"
            >
              <span v-if="!sending">Отправить</span>
              <span v-else>Отправка...</span>
            </button>
          </div>

          <div style="margin-top:1vw">
            <p v-if="errorMessage" style="color:#b00020; font-size:1vw; margin:0">{{ errorMessage }}</p>
            <p v-if="successMessage" style="color:#0b8a14; font-size:1vw; margin:0">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import shapeSrc from '@/assets/images/landing/shape.png';
import itemCheckbox from '~/assets/images/landing/checkbox.svg';
import { API } from '@/config/index.js';
import { useAlertStore } from '~/stores/alert'
const alertStore = useAlertStore()
import { useOrdersStore } from '~/stores/order'
const ordersStore = useOrdersStore()

const request = reactive({
  FIO: '',
  company: '',
  email: '',
  phone: '',
  description: ''
})

const sending = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

function isValidEmail(email = '') {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

async function sendRequest () {
  errorMessage.value = '';
  successMessage.value = '';

  if (!isValidEmail(request.email)) {
    errorMessage.value = 'Введите корректный email.';
    return;
  }
  if (!request.description || request.description.trim().length < 5) {
    errorMessage.value = 'Опишите, пожалуйста, задачу (минимум 5 символов).';
    return;
  }

  const payload = {
    fio: request.FIO || null,
    company: request.company || null,
    email: request.email,
    phone: request.phone || null,
    description: request.description
  };

  sending.value = true;

  try {
    
    const res = await ordersStore.sendRequest(payload)

    alertStore.showAlert({
      title: 'Заявка отправлена',
      message: `Спасибо! Ваша заявка отправлена. Мы свяжемся в ближайшее время.`,
      type: 'success',
      typeClass: 'alert-success',
      background: '#d4edda',
      color: '#155724',
      autoClose: { enabled: true, delay: 4000 }
    })
    request.FIO = '';
    request.company = '';
    request.email = '';
    request.phone = '';
    request.description = '';

  } catch (err) {
    console.error('sendRequest error', err);
    errorMessage.value = err?.message || 'Сетевая ошибка. Попробуйте позже.';
  } finally {
    sending.value = false;
  }
}


const INITIAL_LIFT_VW = -15;
const TOP_OFFSET_VW = 30;

const root = ref(null);
const left = ref(null);
const shape = ref(null);

const state = reactive({
  shapeWidthVw: 40,
  shapeHeightVw: 40,
  shapeMaxWidthVw: 40,
  translateVw: INITIAL_LIFT_VW, // текущий translateY в vw
  mode: 'before', // before | sticky | after
});

let rafId = null;

function pxToVw(px) { return (px / window.innerWidth) * 100; }
function vwToPx(vw) { return (vw / 100) * window.innerWidth; }

function getDocumentOffset(el) {
  const rect = el.getBoundingClientRect();
  const scrollTop = window.scrollY || window.pageYOffset;
  const scrollLeft = window.scrollX || window.pageXOffset;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    width: rect.width,
    height: rect.height,
    rect,
  };
}

function onImageLoad() {
  if (!shape.value || !left.value) return;

  const naturalW = shape.value.naturalWidth || shape.value.width || 400;
  const naturalH = shape.value.naturalHeight || shape.value.height || 400;

  const leftOffset = getDocumentOffset(left.value);
  const leftColWidthPx = leftOffset.width || (window.innerWidth * 0.4);

  const wantedWidthPx = Math.min(naturalW, leftColWidthPx);
  state.shapeWidthVw = pxToVw(wantedWidthPx);
  state.shapeHeightVw = pxToVw((wantedWidthPx / naturalW) * naturalH);
  state.shapeMaxWidthVw = pxToVw(leftColWidthPx);

  state.translateVw = INITIAL_LIFT_VW;

  update();
}

function update() {
  if (!root.value || !left.value || !shape.value) return;

  const scrollY = window.scrollY || window.pageYOffset;
  const viewportHeight = window.innerHeight;

  const rootOffset = getDocumentOffset(root.value);
  const leftOffset = getDocumentOffset(left.value);

  const containerTopPx = rootOffset.top;
  const containerBottomPx = rootOffset.top + rootOffset.height;

  const shapeHeightPx = vwToPx(state.shapeHeightVw);

  // compute initial visual top of shape (taking initial lift into account)
  const initialLiftPx = vwToPx(INITIAL_LIFT_VW); // negative
  const shapeTopInitialPx = leftOffset.top + initialLiftPx;
  const shapeCenterInitialPx = shapeTopInitialPx + shapeHeightPx / 2;

  // viewport center
  const viewportCenterPx = scrollY + viewportHeight / 2;

  // triggered when center of shape reaches center of viewport
  const centerReached = shapeCenterInitialPx <= viewportCenterPx;

  // sticky end boundary (to avoid leaving container)
  const stickyEndPx = containerBottomPx - shapeHeightPx;

  if (!centerReached) {
    // BEFORE: держим начальный подъём
    state.mode = 'before';
    state.translateVw = INITIAL_LIFT_VW;
    return;
  }

  // Если центр достиг, вычисляем target top (где хотим визуально разместить top shape)
  const topOffsetPx = vwToPx(TOP_OFFSET_VW);
  const targetTopDocPx = scrollY + topOffsetPx + initialLiftPx;

  if (targetTopDocPx < stickyEndPx) {
    // STICKY: прижать к верху окна (с учётом initial lift)
    const translatePx = targetTopDocPx - leftOffset.top;
    state.mode = 'sticky';
    state.translateVw = pxToVw(translatePx);
  } else {
    // AFTER: прикрепить к низу контейнера
    const translatePx = (containerBottomPx - shapeHeightPx) - leftOffset.top;
    state.mode = 'after';
    state.translateVw = pxToVw(translatePx);
  }
}

function onScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    update();
    rafId = null;
  });
}

function onResize() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    if (shape.value && left.value) {
      const leftOffset = getDocumentOffset(left.value);
      const leftColWidthPx = leftOffset.width || (window.innerWidth * 0.4);
      state.shapeMaxWidthVw = pxToVw(leftColWidthPx);
      state.shapeWidthVw = Math.min(state.shapeWidthVw, state.shapeMaxWidthVw);

      const naturalW = shape.value.naturalWidth || shape.value.width || 400;
      const naturalH = shape.value.naturalHeight || shape.value.height || 400;
      const widthPx = vwToPx(state.shapeWidthVw);
      state.shapeHeightVw = pxToVw((widthPx / naturalW) * naturalH);
    }
    update();
    rafId = null;
  });
}

onMounted(async () => {
  await nextTick();
  if (shape.value && shape.value.complete) {
    onImageLoad();
  } else {
    if (left.value) {
      const leftOffset = getDocumentOffset(left.value);
      state.shapeMaxWidthVw = pxToVw(leftOffset.width || window.innerWidth * 0.4);
      state.shapeWidthVw = Math.min(state.shapeWidthVw, state.shapeMaxWidthVw);
    }
    state.translateVw = INITIAL_LIFT_VW;
    update();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('orientationchange', onResize);
  if (rafId) cancelAnimationFrame(rafId);
});


const shapeStyle = computed(() => {
  const translateX = '-50%';
  const translateY = `${state.translateVw}vw`;
  return {
    width: 50 + 'vw',
    height: 'auto',
    transform: `translate(${translateX}, ${translateY})`,
    willChange: 'transform',
    position: 'absolute',
    top: '0',
    left: '50%',
    zIndex: 2,
    pointerEvents: 'none',
    transition: 'transform 220ms ease-out',
  };
});
</script>

<style scoped>
.b3 {
  /*min-height: calc(118vw + 1vw);*/
  height: 100%;
  position: relative;
  display: flex;
  gap: 3vw;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  padding: 0 0vw 0 12vw;
  box-sizing: border-box;
}

.b3__left {
  width: 30%;
  position: relative; /* shape позиционируется относительно .b3__left */
  display: block;
  box-sizing: border-box;
  overflow: visible;
}

.b3__shape-placeholder {
  width: 100%;
  box-sizing: border-box;
}

/* shape внутри колонки, по горизонтали центрируется через left:50% + translateX(-50%) */
.b3__shape {
  display: block;
  margin: 0;
  padding: 0;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
  will-change: transform;
  /* ширина задаётся инлайн-стилем (vw) */
}

.b3__right {
  width: 70%;
  box-sizing: border-box;
}

.b3__form {
  padding: 10vw 10vw;
}

.b3__info {
  position: relative;
}

.b1__main-h2 {
  font-size: 4vw;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: -0.06em;
  margin: 0;
}

.b1__main-h2-colored {
  color: #0040c1;
}
.b1__main-p {
  font-weight: 400;
  font-size: 1.5vw;
  color: #4e4e4e;
  line-height: normal;
  margin-top: 2vw;
  width: 80%;
}

.b3__form-input {
  margin-top: 4vw;
}

.b3__form-input {
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
}

.b3__input-top {
  display: flex;
  flex-direction: row;
  gap: 1.5vw;
}

.b3__input {
  border: 0.2vw solid #c8d3f1;
  border-radius: 5vw;
  padding: 16px;
  width: 50%;
  padding: 1vw;
  transition: 0.3s ease all;
  outline: none;
  font-size: 1.2vw;
}

.b3__textarea {
  border: 0.2vw solid #c8d3f1;
  border-radius: 2vw;
  width: 100%;
  padding: 1vw;
  height: 14vw;
  resize: none;
  outline: none;
  font-size: 1.2vw;
}


.b3__input:active, .b3__textarea:active, .b3__input:focus, .b3__textarea:focus {
  border: 0.2vw solid #0041c1
}


.b3__item-checkbox {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 1vw;
}

.b3__p-checkbox-img {
  width: 4vw;
  height: 4vw;
}
.b3__p-checkbox {
  display: flex;
  gap: 1vw;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  font-weight: 400;
  font-size: 1vw;
  color: #667085;
}

.b3__form-input-bottom {
  display: flex;
  gap: 2vw;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}

.b3__send-button {
  font-weight: 400;
  font-size: 1.5vw;
  letter-spacing: -0.03em;
  text-align: center;
  color: #fff;
  background: linear-gradient(133deg, #1c4eff 0%, #bfa1ff 100%);
  padding: 1.5vw 8vw;
  border: none;
  outline: none;
  border-radius: 5vw;
  line-height: 1;
  height: fit-content;
  cursor: pointer;
}

.b3__send-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 48em) {
  .b3__item-checkbox {
    margin-top: 7vw;
    gap: 3vw;
  }
  .b3 {
    flex-direction: column;
    gap: 0;
    padding: 0 4vw;
  }
  .b3__left,
  .b3__right {
    width: 100%;
  }
  .b3__left {
    width: 0;
    top: -38vw;
    left: 65vw;
    height: 0;
  }
  .b3__shape-placeholder {
    max-width: 100vw;
    height: auto;
  }
  .b3__form {
    padding-top: 0;
    padding-bottom: 9vw;
    padding-left: 4vw;
    padding-right: 4vw;
  }
  .b1__main-h2 {
    position: relative;
    font-weight: 400;
    font-size: 12vw;
    letter-spacing: -0.9vw;
    padding-top: 12vw;
    padding-bottom: 9vw;
  }
  .b3__shape {
    position: relative !important;
    transform: none !important;
    width: 60vw !important;
    margin: 4vw auto;
    display: block;
  }
  .b1__main-p {
    font-size: 7vw;
    margin-top: 6vw;
    font-weight: 300;
    width: 100%;
    margin-top: 0;
  }

  .b3__p-checkbox {
    font-size: 4.8vw;
    gap: 3vw;
    font-weight: 400;
  }
  .b3__item-checkbox {
    margin-top: 7vw;
    gap: 3vw;
  }
  .b3__p-checkbox-img {
    width: 5vw;
    height: 5vw;
  }

  .b3__input-top {
    width: 100%;
  }
  .b3__form-input {
    width: 100%;
    gap: 5vw;
    margin-top: 15vw;
  }

  .b3__input, .b3__textarea {
    font-size: 5vw;
    padding: 5vw;
    width: 100%;
  }
  .b3__textarea {
    height: 50vw;
    border-radius: 6vw;
  }
  .b3__input-top {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 5vw;
    flex-wrap: nowrap;
  }

  .b3__form-input-bottom {
    display: flex;
    flex-direction: column-reverse;
    flex-wrap: nowrap;
    width: 100%;
  }

  .b3__send-button {
    padding: 5vw 39vw;
    font-size: 7vw;
    margin-top: 8vw;
  }
  .b3__p-checkbox-img {
    width: 20vw;
    height: 20vw;
  }
}

.nuxt-icon--fill, .nuxt-icon--fill * {
  fill: revert-layer !important;
}
</style>
