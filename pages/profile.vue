<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import ProfileOrders from '@/components/profile/ProfileOrders.vue'
import ProfileSettings from '@/components/profile/ProfileSettings.vue'

// список вкладок (источник правды)
const tabs = [
  { id: 'orders', title: 'Мои заказы' },
  { id: 'info', title: 'Профиль' },
  { id: 'settings', title: 'Настройки' }
]
const tabIds = tabs.map(t => t.id)

// vue-router
const route = useRoute()
const router = useRouter()

// helper: безопасно получить tab из query (может быть массив или undefined)
const getQueryTab = (r) => {
  const raw = r?.query?.tab
  const tab = Array.isArray(raw) ? raw[0] : raw
  return tab
}

// начальная активная вкладка — из query (если валидна) или 'info'
const initial = getQueryTab(route)
const activeTab = ref(tabIds.includes(initial) ? initial : 'info')

// при клике — переключаем активную вкладку и обновляем query (replace, чтобы не засорять историю)
function selectTab(id) {
  if (!tabIds.includes(id)) return
  activeTab.value = id
  // сохраняем другие query-параметры, обновляем только tab
  router.replace({
    query: {
      ...route.query,
      tab: id
    }
  }).catch(() => {}) // подавляем NavigationDuplicated / прочие обещания
}

// следим за изменением route (например, пользователь перешёл по внешней ссылке /profile?tab=settings)
watch(
  () => route.fullPath, // срабатывает на любое изменение route; можно более узко — route.query.tab
  () => {
    const q = getQueryTab(route)
    if (q && tabIds.includes(q) && q !== activeTab.value) {
      activeTab.value = q
    } else if (!q && activeTab.value !== 'info') {
      // если query убрали — вернуть дефолт
      activeTab.value = 'info'
    }
  }
)

// на первом монтировании — синхронизируем URL, если в нём нет валидного tab (чтобы ссылка всегда отражала состояние)
onMounted(() => {
  const q = getQueryTab(route)
  if (!q || !tabIds.includes(q)) {
    router.replace({
      query: {
        ...route.query,
        tab: activeTab.value
      }
    }).catch(() => {})
  }
})
</script>

<template>
  <div class="profile">
    <div class="profile__header">
      <h1 class="profile__title">Личный кабинет</h1>
      <p class="profile__subtitle">Управляйте своими заказами и настройками</p>
    </div>
    
    <div class="profile__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['profile__tab', { 'profile__tab--active': activeTab === tab.id }]"
        @click="selectTab(tab.id)"
        :aria-pressed="activeTab === tab.id"
      >
        {{ tab.title }}
      </button>
    </div>
    
    <div class="profile__content">
      <ProfileInfo v-if="activeTab === 'info'" />
      <ProfileOrders v-else-if="activeTab === 'orders'" />
      <ProfileSettings v-else-if="activeTab === 'settings'" />
      <!-- при необходимости сюда можно добавить дополнительные вкладки -->
    </div>
  </div>
</template>

<style scoped>
.profile {
  /*padding: 40px 20px 80px;
  max-width: 1800px;
  */
  padding: 0;
  margin: auto;
  margin-top: 0;
}

.profile__header {
  text-align: center;
  padding: 80px 0;
  background: linear-gradient(135deg, #2563eb 0%, #7da5e6 68%, #2563eb 85%);
}

.profile__title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: var(--white);
}

.profile__subtitle {
  font-size: 1.2rem;
  color: var(--white);
  opacity: 0.7
}

.profile__tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 30px;
  overflow-x: auto;
  max-width: 1800px;
  margin-left: auto;
  margin-right: auto;
}

.profile__tab {
  padding: 15px 25px;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray);
  cursor: pointer;
  position: relative;
  white-space: nowrap;
}

.profile__tab--active {
  color: var(--primary);
}

.profile__tab--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary);
}

.profile__content {
  padding: 0rem 2rem;
  max-width: 1800px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 5rem;
  min-height: 28rem;
}
</style>
