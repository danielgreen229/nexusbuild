<script setup>
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import ProfileOrders from '@/components/profile/ProfileOrders.vue'
import ProfileBalance from '@/components/profile/ProfileBalance.vue'
import ProfileSettings from '@/components/profile/ProfileSettings.vue'

const activeTab = ref('info')
const tabs = [
  { id: 'orders', title: 'Мои заказы' },
  { id: 'info', title: 'Профиль' },
  { id: 'settings', title: 'Настройки' }
]
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
        @click="activeTab = tab.id"
      >
        {{ tab.title }}
      </button>
    </div>
    
    <div class="profile__content">
      <ProfileInfo v-if="activeTab === 'info'" />
      <ProfileOrders v-else-if="activeTab === 'orders'" />
      <ProfileBalance v-else-if="activeTab === 'balance'" />
      <ProfileSettings v-else />
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