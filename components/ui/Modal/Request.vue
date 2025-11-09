<template>
<teleport to="body">
  <div v-if="visible" class="modal-overlay" @click.self="onOverlayClick">
    <div class="modal-content" role="dialog" aria-modal="true" :aria-labelledby="titleId" ref="modalContent">
      <button
        type="button"
        class="modal-close"
        @click.stop="closeModal"
        aria-label="Закрыть"
      >×</button>


      <!-- Component markup -->
      <div ref="root" class="modal-request">
        <div class="modal-request__right">
          <div class="modal-request__form">
            <div class="modal-request__info">
              <h2 :id="titleId" class="b1__main-h2">
                <span class="b1__main-h2-colored">Делайте сайт с&nbsp;командой,</span>
                <br />
                которой доверяют
              </h2>
              <p class="b1__main-p">Опишите задачу — мы оценим и пришлём понятный план с бюджетом и сроками. Поддержка и доработка включены.</p>
            </div>

            <form class="modal-request__form-input" @submit.prevent="sendRequest">
              <div class="modal-request__input-top">
                <input class="modal-request__input" v-model="request.FIO" placeholder="ФИО" autocomplete="name" />
                <input class="modal-request__input" v-model="request.company" placeholder="Компания" autocomplete="organization" />
              </div>
              <div class="modal-request__input-top">
                <input class="modal-request__input" v-model="request.email" placeholder="Email*" type="email" autocomplete="email" required />
                <input class="modal-request__input" v-model="request.phone" placeholder="+7 (000) 000-00-00" type="tel" autocomplete="tel" />
              </div>

              <textarea class="modal-request__textarea" v-model="request.description" placeholder="Краткое описание" required></textarea>

              <div class="modal-request__form-input-bottom">
                <div class="modal-request__item-checkbox">
                  <label class="modal-request__p-checkbox">
                    <itemCheckbox class="modal-request__p-checkbox-img"/>
                    <span>Согласен(а) на&nbsp;обработку персональных данных — с&nbsp;ссылкой на&nbsp;политику — (обязательное)</span>
                  </label>
                </div>

                <button
                  class="modal-request__send-button"
                  type="submit"
                  :disabled="sending"
                >
                  <span v-if="!sending">Отправить</span>
                  <span v-else>Отправка...</span>
                </button>
              </div>

              <div class="modal-request__messages">
                <p v-if="errorMessage" class="modal-request__message modal-request__message--error">{{ errorMessage }}</p>
                <p v-if="successMessage" class="modal-request__message modal-request__message--success">{{ successMessage }}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- /Component markup -->

    </div>
  </div>
</teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import shapeSrc from '@/assets/images/landing/shape.png';
import itemCheckbox from '~/assets/images/landing/checkbox.svg';
import { useAlertStore } from '~/stores/alert'
const alertStore = useAlertStore()
import { useOrdersStore } from '~/stores/order'
const ordersStore = useOrdersStore()

const props = defineProps({ modelValue: { type: Boolean, default: false } });
const emit = defineEmits(["update:modelValue", "open", "close", "opened", "closed"]);

const visible = ref(!!props.modelValue);
watch(() => props.modelValue, (val) => {
  visible.value = !!val;
  if (val) {
    emit('open');
    setTimeout(() => emit('opened'), 220);
  } else {
    emit('close');
    setTimeout(() => emit('closed'), 220);
  }
});

// lock body scroll when modal open
watch(visible, (v) => {
  try { document.documentElement.style.scrollBehavior = v ? 'auto' : '' } catch(e){}
  document.body.style.overflow = v ? 'hidden' : '';
});

function openModal() { emit('update:modelValue', true); }
function closeModal() {
  try {
    // Обновим локальное состояние сразу — защитный шаг
    visible.value = false;
  } catch (e) {
    // noop
  }
  // Основной контракт: сообщаем родителю закрыть (v-model)
  emit('update:modelValue', false);
  // Для дебага можно временно раскомментировать:
  // console.log('closeModal called, emitted update:modelValue false');
}

function onOverlayClick() { closeModal(); }

const request = reactive({ FIO: '', company: '', email: '', phone: '', description: '' })
const sending = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

function isValidEmail(email = '') { if (!email) return false; const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return re.test(String(email).toLowerCase()); }

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
    emit('close');
    successMessage.value = 'Ваша заявка отправлена.';

  } catch (err) {
    console.error('sendRequest error', err);
    errorMessage.value = err?.message || 'Сетевая ошибка. Попробуйте позже.';
  } finally {
    sending.value = false;
  }
}

// shape / scroll logic (preserved & reused)
const INITIAL_LIFT_VW = -15;
const TOP_OFFSET_VW = 30;
const root = ref(null);
const left = ref(null);
const shape = ref(null);
const modalContent = ref(null);
const state = reactive({ shapeWidthVw: 40, shapeHeightVw: 40, shapeMaxWidthVw: 40, translateVw: INITIAL_LIFT_VW, mode: 'before' });
let rafId = null;
function pxToVw(px) { return (px / window.innerWidth) * 100; }
function vwToPx(vw) { return (vw / 100) * window.innerWidth; }
function getDocumentOffset(el) { const rect = el.getBoundingClientRect(); const scrollTop = window.scrollY || window.pageYOffset; const scrollLeft = window.scrollX || window.pageXOffset; return { top: rect.top + scrollTop, left: rect.left + scrollLeft, width: rect.width, height: rect.height, rect }; }

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
  const initialLiftPx = vwToPx(INITIAL_LIFT_VW);
  const shapeTopInitialPx = leftOffset.top + initialLiftPx;
  const shapeCenterInitialPx = shapeTopInitialPx + shapeHeightPx / 2;
  const viewportCenterPx = scrollY + viewportHeight / 2;
  const centerReached = shapeCenterInitialPx <= viewportCenterPx;
  const stickyEndPx = containerBottomPx - shapeHeightPx;
  if (!centerReached) {
    state.mode = 'before';
    state.translateVw = INITIAL_LIFT_VW;
    return;
  }
  const topOffsetPx = vwToPx(TOP_OFFSET_VW);
  const targetTopDocPx = scrollY + topOffsetPx + initialLiftPx;
  if (targetTopDocPx < stickyEndPx) {
    const translatePx = targetTopDocPx - leftOffset.top;
    state.mode = 'sticky';
    state.translateVw = pxToVw(translatePx);
  } else {
    const translatePx = (containerBottomPx - shapeHeightPx) - leftOffset.top;
    state.mode = 'after';
    state.translateVw = pxToVw(translatePx);
  }
}

function onScroll() { if (rafId) cancelAnimationFrame(rafId); rafId = requestAnimationFrame(() => { update(); rafId = null; }); }
function onResize() { if (rafId) cancelAnimationFrame(rafId); rafId = requestAnimationFrame(() => {
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
}, 0); }

onMounted(async () => {
  await nextTick();
  if (shape.value && shape.value.complete) { onImageLoad(); } else {
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
  window.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('orientationchange', onResize);
  window.removeEventListener('keydown', onKeyDown);
  if (rafId) cancelAnimationFrame(rafId);
  document.body.style.overflow = '';
});

function onKeyDown(e) { if (e.key === 'Escape' && visible.value) { closeModal(); } }

const shapeStyle = computed(() => {
  const translateX = '-50%';
  const translateY = `${state.translateVw}vw`;
  const width = Math.min(state.shapeWidthVw, state.shapeMaxWidthVw) + 'vw';
  return {
    width,
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

const titleId = `modal-request-title-${Math.random().toString(36).slice(2,9)}`;

defineExpose({ openModal, closeModal, toggleModal: () => emit('update:modelValue', !visible.value), visible, modalContent, shapeSrc, itemCheckbox, request, sending, errorMessage, successMessage, sendRequest, root, left, shape, onImageLoad, shapeStyle });
</script>

<style scoped>
/* Base modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 4vw;
}
.modal-content {
  background: #fff;
  border-radius: 1vw;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  transition: transform 220ms ease, opacity 220ms ease;
}
.modal-close {
  position: absolute;
  right: 1vw;
  top: 1vw;
  background: transparent;
  border: none;
  font-size: 2.2vw;
  line-height: 1;
  cursor: pointer;
  padding: 0.8vw;
  cursor: pointer;
  z-index: 1000;
}

/* --- layout --- */
.modal-request {
  height: 100%;
  position: relative;
  display: flex;
  gap: 3vw;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 1vw 2vw;
}

.modal-request__left {
  width: 30%;
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: visible;
}

.modal-request__shape-placeholder { width: 100%; box-sizing: border-box; }
.modal-request__shape { display:block; margin:0; padding:0; user-select:none; -webkit-user-drag:none; pointer-events:none; will-change:transform; }

.modal-request__right { width: 100%; box-sizing: border-box; }
.modal-request__form { padding: 1vw 1vw; }
.modal-request__info { position: relative; }

.b1__main-h2 { font-size: 4vw; font-weight: 400; line-height: 1; letter-spacing: -0.06em; margin: 0; }
.b1__main-h2-colored { color: #0040c1; }
.b1__main-p { font-weight: 400; font-size: 1.5vw; color: #4e4e4e; line-height: 1.35; margin-top: 2vw; width: 80%; }

.modal-request__form-input { margin-top: 4vw; display:flex; flex-direction:column; gap:1.5vw; }
.modal-request__input-top { display:flex; flex-direction:row; gap:1.5vw; }

.modal-request__input { border: 0.2vw solid #c8d3f1; border-radius: 5vw; padding: 1vw; width:50%; transition: 0.3s ease all; outline:none; font-size:1.2vw; box-sizing:border-box; }
.modal-request__input:focus { border-color:#0041c1; }
.modal-request__textarea { border: 0.2vw solid #c8d3f1; border-radius: 2vw; width:100%; padding:1vw; height:14vw; resize:none; outline:none; font-size:1.2vw; }

.modal-request__item-checkbox { display:flex; flex-direction:column; gap:1vw; }
.modal-request__p-checkbox-img { width:2vw; height:2vw; }
.modal-request__p-checkbox { display:flex; gap:1vw; align-items:center; flex-direction:row; font-weight:400; font-size:1vw; color:#667085; }

.modal-request__form-input-bottom { display:flex; gap:2vw; align-items:center; flex-direction:row;     justify-content: space-between; }

.modal-request__send-button { font-weight:400; font-size:1.5vw; letter-spacing:-0.03em; text-align:center; color:#fff; background: linear-gradient(133deg, #1c4eff 0%, #bfa1ff 100%); padding:1.5vw 8vw; border:none; outline:none; border-radius:5vw; line-height:1; cursor:pointer; }
.modal-request__send-button[disabled] { opacity:0.6; cursor:not-allowed; }

.modal-request__messages { margin-top:1vw; }
.modal-request__message { margin:0; font-size:1vw; }
.modal-request__message--error { color:#b00020; }
.modal-request__message--success { color:#0b8a14; }

/* --- Responsive tweaks --- */
@media (max-width: 768px) {
  .modal-overlay { padding: 0; align-items: flex-end; }
  .modal-content { border-radius: 1rem 1rem 0 0; max-height: 100vh; height: 100vh; width:100%; max-width:100%; }
  .modal-close { right: 4vw; top: 4vw; font-size: 6vw; padding: 2vw; }

  .modal-request { flex-direction: column; gap:0; padding: 0; }
  .modal-request__left, .modal-request__right { width:100%; }
  .modal-request__left { width:100%; position:relative; top:0; left:0; height:auto; }
  .modal-request__shape { position:relative !important; transform:none !important; width:60vw !important; margin:4vw auto 0; display:block; }
  .modal-request__form { padding: 0 4vw 9vw; }
  .b1__main-h2 { font-weight:400; font-size:12vw; letter-spacing: -0.9vw; padding-top: 12vw; padding-bottom: 9vw; }
  .b1__main-p { font-size:7vw; margin-top:0; width:100%; font-weight:300; }

  .modal-request__p-checkbox { font-size:4.8vw; gap:3vw; }
  .modal-request__p-checkbox-img { width:5vw; height:5vw; }

  .modal-request__input-top { width:100%; flex-direction:column; gap:5vw; }
  .modal-request__form-input { width:100%; gap:5vw; margin-top:15vw; }
  .modal-request__input, .modal-request__textarea { font-size:5vw; padding:5vw; width:100%; }
  .modal-request__textarea { height:50vw; border-radius:6vw; }

  .modal-request__form-input-bottom { display:flex; flex-direction:column-reverse; gap:3vw; width:100%; padding:0 4vw; }
  .modal-request__send-button { padding:5vw 10vw; font-size:7vw; margin-top:8vw; border-radius:6vw; }
  .modal-request__message { font-size:4.6vw; }
  .modal-request__p-checkbox-img {
    width: 14vw;
    height: 14vw;
  }
}

/* Extra small screens: ensure tappable targets and spacing */
@media (max-width: 360px) {
  .modal-close { right: 3vw; top: 3vw; }
  .modal-request__send-button { padding-left: 6vw; padding-right: 6vw; }
}

.nuxt-icon--fill, .nuxt-icon--fill * { fill: revert-layer !important; }
</style>
