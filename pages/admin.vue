<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Управление страницами</h2>

    <!-- Фильтр по дате -->
    <div class="flex gap-4 mb-4">
      <div>
        <label>С:</label>
        <input type="date" v-model="dateFrom" class="border rounded p-2" />
      </div>
      <div>
        <label>По:</label>
        <input type="date" v-model="dateTo" class="border rounded p-2" />
      </div>
    </div>

    <!-- Таблица CRUD -->
    <div class="overflow-x-auto border rounded-lg mb-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">UID</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Название</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Цвет фона</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Логотип</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Дата создания</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="landing in filteredLandings" :key="landing.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 text-sm text-gray-700">{{ landing.id }}</td>
            <td class="px-4 py-2 text-sm text-gray-700">{{ landing.uid }}</td>
            <td class="px-4 py-2">
              <input v-model="landing.title" class="border rounded px-2 py-1 w-full" />
            </td>
            <td class="px-4 py-2">
              <input v-model="landing.bg_color" type="color" class="w-full h-8 border rounded p-1" />
            </td>
            <td class="px-4 py-2">
              <input v-model="landing.logo" class="border rounded px-2 py-1 w-full" />
            </td>
            <td class="px-4 py-2 text-sm text-gray-700">
						  {{ landing.dt_created ? new Date(landing.dt_created).toLocaleString() : '' }}
						</td>
            <td class="px-4 py-2 space-x-2">
              <button @click="updateLanding(landing)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Сохранить</button>
              <button @click="deleteLanding(landing.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Форма добавления новой записи -->
    <h3 class="text-xl font-semibold mb-2">Создать новую страницу</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <input v-model="newLanding.title" placeholder="Название" class="border rounded p-2" />
      <input v-model="newLanding.bg_color" type="color" class="border rounded p-2" />
      <input v-model="newLanding.logo" placeholder="URL логотипа" class="border rounded p-2" />
      <input v-model="newLanding.user_uid" placeholder="User UID" class="border rounded p-2" />
    </div>
    <button @click="addLanding" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Создать</button>

    <!-- Ошибки -->
    <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
  </div>
</template>

<script>
import { useLandingStore } from '~/stores/landing'

export default {
  name: 'LandingTable',
  data() {
    return {
      landings: [],
      newLanding: {
        uid: '',
        bg_color: '#f5511e',
        font: null,
        logo: '',
        user_uid: '',
        title: '',
        preview: null,
        url: null,
        url_preview: null
      },
      dateFrom: '',
      dateTo: '',
      error: null,
    }
  },
  computed: {
    filteredLandings() {
      return this.landings.filter(l => {
        if (!l.dt_created) return true
        const created = new Date(l.dt_created)
        const from = this.dateFrom ? new Date(this.dateFrom) : null
        const to = this.dateTo ? new Date(this.dateTo) : null
        if (from && created < from) return false
        if (to && created > to) return false
        return true
      })
    }
  },
  methods: {
    async fetchAll() {
      try {
        const store = useLandingStore()
        this.landings = await store.fetchAll()
      } catch (err) {
        this.error = err.message
      }
    },
    async addLanding() {
      try {
        const store = useLandingStore()
        const created = await store.addLandingSettings(this.newLanding)
        const exists = this.landings.find(l => l.id === created.id)
        if (!exists) this.landings.unshift(created)
        this.newLanding = { uid: '', bg_color: '#f5511e', font: null, logo: '', user_uid: '', title: '', preview: null, url: null, url_preview: null }
        this.error = null
      } catch (err) {
        this.error = err.message
      }
    },
    async updateLanding(landing) {
      try {
        const store = useLandingStore()
        await store.updateLanding(landing.id, landing)
        this.error = null
      } catch (err) {
        this.error = err.message
      }
    },
    async deleteLanding(id) {
      try {
        const store = useLandingStore()
        await store.deleteLanding(id)
        this.landings = this.landings.filter(l => l.id !== id)
      } catch (err) {
        this.error = err.message
      }
    }
  },
  mounted() {
    this.fetchAll()
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  text-align: left;
}
input {
  outline: none;
}
button {
  cursor: pointer;
}
</style>
