<script setup>

defineProps({
  activeFilter: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:activeFilter'])

const filters = ref([
  { id: 'all', name: 'Все шаблоны' },
])

const setFilter = (filterId) => {
  emit('update:activeFilter', filterId)
}
</script>

<template>
  <section class="portfolio-filters">
    <div class="portfolio-filters__container container">
      <div class="portfolio-filters__wrapper">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          :class="['portfolio-filters__button', { 'portfolio-filters__button--active': activeFilter === filter.id }]"
          @click="setFilter(filter.id)"
        >
          {{ filter.name }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portfolio-filters {
  padding: 25px 0;
  background: white;
  position: sticky;
  top: 114px;
  z-index: 90;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.portfolio-filters__wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: left;
}

.portfolio-filters__button {
  padding: 10px 20px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.portfolio-filters__button:hover {
  background: #e2e8f0;
}

.portfolio-filters__button--active {
  background: #2563eb;
  color: white;
}

@media (max-width: 768px) {
  .portfolio-filters {
    top: 69px;
  }
  
  .portfolio-filters__wrapper {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
  }
}
</style>