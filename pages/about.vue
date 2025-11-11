<template>
  <div class="contacts-page">
    <div class="hero">
      <svg class="hero-blob" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stop-color="#7c3aed" />
            <stop offset="100%" stop-color="#fb7185" />
          </linearGradient>
        </defs>
        <path fill="url(#g1)" d="M421.1,327.7Q392,405,325,444.6Q258,484.3,184.2,451.8Q110.3,419.3,89.6,344.1Q68.9,268.9,115.8,209.2Q162.7,149.4,234.6,119.4Q306.5,89.4,374.5,118.3Q442.5,147.2,447.9,213.8Q453.4,280.4,421.1,327.7Z"/>
      </svg>

      <div class="hero-content">
        <div class="brand">
          <div class="logo">
            <img src="@/assets/icons/logo-small.png" class="logo-small__img"/>
          </div>
          <div>
            <h1 class="title">Контакты</h1>
            <p class="subtitle">Свяжитесь с нами — сделаем сайт, который продаёт.</p>
          </div>
        </div>

        <div class="hero-actions">
          <a :href="`mailto:${contacts.email}`" class="btn btn-primary">Написать на почту</a>
          <a :href="contacts.telegramLink" target="_blank" class="btn btn-ghost">Telegram</a>
        </div>
      </div>
    </div>

    <main class="main-grid">
      <section class="card contact-cards">
        <h2>Каналы связи</h2>
        <p class="muted">Выберите удобный способ — обычно отвечаем в рабочие часы.</p>

        <ul class="grid-list">
          <li class="item">
            <div class="icon-wrap"><div v-html="EmailIcon.template" /></div>
            <div class="info">
              <div class="label">Почта</div>
              <div class="value"><a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a></div>
            </div>
            <button class="copy" @click="copy(contacts.email)">Копировать</button>
          </li>

          <li class="item">
            <div class="icon-wrap"><div v-html="TelegramIcon.template" /></div>
            <div class="info">
              <div class="label">Telegram группа</div>
              <div class="value"><a :href="contacts.telegramLink" target="_blank">@{{ contacts.telegram }}</a></div>
            </div>
            <button class="copy" @click="copy(contacts.telegramLink)">Копировать</button>
          </li>

          <li class="item">
            <div class="icon-wrap"><div v-html="VkIcon.template" /></div>
            <div class="info">
              <div class="label">ВКонтакте</div>
              <div class="value"><a :href="contacts.vk" target="_blank">Открыть группу</a></div>
            </div>
            <button class="copy" @click="copy(contacts.vk)">Копировать</button>
          </li>

          <li class="item">
            <div class="icon-wrap"><div v-html="IdIcon.template" /></div>
            <div class="info">
              <div class="label">ИНН</div>
              <div class="value">{{ contacts.inn }}</div>
            </div>
            <button class="copy" @click="copy(contacts.inn)">Копировать</button>
          </li>
        </ul>
      </section>

      <aside class="card info-panel">
        <div class="profile">
          <div class="avatar" v-html="ClockIcon.template"/>
          <div>
            <div class="company">SiteByPro</div>
            <div class="worktime">Пн–Пт 09:00–18:00</div>
          </div>
        </div>

        <div class="requisites">
          <div class="row"><span>ИНН</span><strong>{{ contacts.inn }}</strong></div>
          <div class="row"><span>ОГРНИП</span><strong>{{ contacts.ogrn || '—' }}</strong></div>
        </div>

        <div class="quick-links">
          <a :href="contacts.telegramLink" target="_blank" class="link">Написать в Telegram</a>
          <a :href="contacts.vk" target="_blank" class="link">Группа ВКонтакте</a>
        </div>

        <!--<div class="small">Возникли проблемы -<br> пишите в тг/почту/вк</div>-->
      </aside>

    </main>


    <div v-if="toast.show" class="toast" :class="toast.type">{{ toast.message }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const contacts = reactive({
  email: 'sitebypro@mail.ru',
  telegram: 'sitebypro',
  telegramLink: 'https://t.me/dozer_stoun',
  vk: 'https://vk.com/club233841249',
  inn: '302503086616',
  ogrn: '325300000026452'
})

const toast = reactive({ show: false, message: '', type: 'success' })
let timer
function showToast(msg, type = 'success'){
  toast.message = msg; toast.type = type; toast.show = true
  clearTimeout(timer); timer = setTimeout(()=> toast.show = false, 2200)
}

function copy(text){
  if(!text) { showToast('Пусто', 'error'); return }
  if(navigator.clipboard) return navigator.clipboard.writeText(text).then(()=> showToast('Скопировано'))
  // fallback
  const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); showToast('Скопировано') }catch(e){ showToast('Не удалось') } ta.remove()
}

// Lightweight icon components
const EmailIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12v1.45q0 1.475-1.012 2.513T18.5 17q-.875 0-1.65-.375t-1.3-1.075q-.725.725-1.638 1.088T12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12v1.45q0 .65.425 1.1T18.5 15t1.075-.45t.425-1.1V12q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20h5v2zm0-7q1.25 0 2.125-.875T15 12t-.875-2.125T12 9t-2.125.875T9 12t.875 2.125T12 15"/></svg>' }
const TelegramIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-4"/></svg>' }
const VkIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Meteor Icons by zkreations - https://github.com/zkreations/icons/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="22" height="22" x="1" y="1" rx="5"/><path d="M7 8.5a7 8 0 0 0 5 7v-7m5 0Q16 11 13 12q3 1 4 3.5M12 12h1"/></g></svg>' }
const IdIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m-3-3h6v-2h-2V9h2V7H9v2h2v6H9z"/></svg>' }

const ClockIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 22q-1.875 0-3.512-.712t-2.85-1.925t-1.925-2.85T3 13t.713-3.512t1.924-2.85t2.85-1.925T12 4t3.513.713t2.85 1.925t1.925 2.85T21 13t-.712 3.513t-1.925 2.85t-2.85 1.925T12 22m2.8-4.8l1.4-1.4l-3.2-3.2V8h-2v5.4zM5.6 2.35L7 3.75L2.75 8l-1.4-1.4zm12.8 0l4.25 4.25l-1.4 1.4L17 3.75z"/></svg>'
}
</script>

<style scoped>
:root{ --bg:#0f172a; --glass: rgba(255,255,255,0.08) }
.contacts-page{ padding: 1rem; color: #0b1220 }
.hero{     position: relative;
    padding: 48px 24px 40px;
    overflow: hidden;
    border-radius: 18px;
    margin: 18px auto;
    max-width: calc(2100px - 2rem);
    background: linear-gradient(135deg, #fbf7ff 0%, #fff 100%);
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
.hero-blob{ position: absolute; right: -120px; top: -60px; width: 560px; height: 560px; opacity: .12; transform: rotate(12deg) }
.hero-content{ position: relative; display: flex; justify-content: space-between; align-items: center }
.brand{ display:flex; gap:16px; align-items:center }
.logo{ width:64px; height:64px; border-radius:12px;  color:white; display:flex; align-items:center; justify-content:center; font-weight:700 }
.title{ font-size:34px; margin:0 }
.subtitle{ margin:6px 0 0; color:#475569 }
.hero-actions{ display:flex; gap:10px }
.btn{ padding:10px 14px; border-radius:12px; text-decoration:none; font-weight:600 }
.btn-primary{ background: linear-gradient(133deg, #1c4eff 0%, #bfa1ff 100%);     color: white;
    padding: 0.5rem 2rem;
    display: flex;
    align-items: center;
 }
.btn-ghost{ border:1px solid rgba(11,18,32,0.06); background:white }

.main-grid{     display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
    max-width: calc(2100px - 2rem);
    margin: 22px auto;
    margin-bottom: 15rem; }
.card{ height: fit-content;background:white; border-radius:14px; padding:18px; box-shadow: 0 6px 20px rgba(11,18,32,0.04) }
.contact-cards h2{ margin:0 0 6px }
.muted{ color:#64748b }
.grid-list{ list-style:none; padding:0; margin:14px 0 0; display:grid; gap:10px }
.item{ display:flex; align-items:center; gap:12px; padding:10px; border-radius:10px; transition:transform .12s; }
.item:hover{ transform:translateY(-3px) }
.icon-wrap{ width:44px; height:44px; border-radius:10px; background:linear-gradient(180deg,#eef2ff,#fff); display:flex; align-items:center; justify-content:center }
.ico{ width:20px; height:20px }
.info .label{ font-size:12px; color:#475569 }
.info .value{ font-weight:600 }
.copy{ margin-left:auto; background:transparent; border:none; color:#6b7280; cursor:pointer }

.info-panel .profile{ display:flex; gap:12px; align-items:center }
.avatar{ width:56px; height:56px; border-radius:10px; background:linear-gradient(90deg,#7c3aed,#06b6d4); color:white; display:flex; align-items:center; justify-content:center; font-weight:700 }
.requisites{ margin-top:12px; border-top:1px dashed #eef2ff; padding-top:12px }
.requisites .row{ display:flex; justify-content:space-between; padding:6px 0 }
.quick-links{ margin-top:12px; display:flex; flex-direction:column; gap:8px }
.link{ padding:8px 10px; border-radius:10px; background:#f8fafc; text-decoration:none; color:#0f172a }
.small{ margin-top:12px; color:#64748b; font-size:13px }
.value a {
  color: #4563ff;
}
.logo-small__img {
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  background: #0056ff;
  border-radius: 1rem;
}
.map-card .map-placeholder{ height:160px; border-radius:10px; background:linear-gradient(180deg,#f8fafc,#fff); display:flex; align-items:center; justify-content:center; color:#94a3b8; font-weight:600 }

.footer{ margin:28px auto; max-width:1200px; display:flex; justify-content:space-between; color:#64748b; font-size:13px }
.socials a{ margin-left:10px; color:#7c3aed; text-decoration:none }

.toast{ position:fixed; right:20px; bottom:20px; padding:10px 14px; border-radius:10px; color:white; font-weight:600 }
.toast.success{ background:#10b981 }
.toast.error{ background:#ef4444 }

/* Responsive */
@media (max-width: 960px){
  .main-grid{ grid-template-columns: 1fr; }
  .hero-blob{ display:none }
  .hero-content{ flex-direction:column; gap:12px }
}
</style>