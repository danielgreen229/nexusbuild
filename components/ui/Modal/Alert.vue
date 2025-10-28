<template>
  <teleport to="body">
    <div class="alerts-container">
      <transition-group name="fade" tag="div">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="['alert', alert.typeClass]"
          :style="getStyle(alert)"
        >
          <span v-html="getIcon(alert.type)" class="alert-icon" aria-hidden="true"></span>

          <div class="alert-content">
            <strong v-if="alert.title">{{ alert.title }}</strong>
            <span>{{ alert.message }}</span>
          </div>

          <!-- Крестик -->
          <button
            class="alert-close"
            @click="close(alert.id)"
            :aria-label="`Close alert ${alert.title || ''}`"
          >
            ×
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from "vue";
import { useAlertStore } from "~/stores/alert";

// Pinia store
const alertStore = useAlertStore();

// Используем прямой state (можно через геттер allAlerts)
const alerts = computed(() => alertStore.alerts);

// Закрытие алерта
function close(id) {
  alertStore.removeAlert(id);
}

// Стиль алерта (оставил как inline через :style, чтобы сохранялись переданные цвета/параметры)
function getStyle(alert) {
  return {
    color: alert.color,
    background: alert.background,
    border: alert.border,
    padding: alert.padding || "0.5rem 1rem",
    borderRadius: alert.borderRadius || "0.5rem",
    minWidth: alert.minWidth || "250px",
    maxWidth: alert.maxWidth || "400px",
    boxShadow: alert.boxShadow || "0 2px 12px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "relative",
    pointerEvents: "auto",
    zIndex: alert.position?.zIndex ?? 100001
  };
}

// Иконки (HTML SVG)
function getIcon(type) {
  const icons = {
    success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155724" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
    error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#721c24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0c5460" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>`,
    warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#856404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a1 1 0 0 0 .86 1.5h18.64a1 1 0 0 0 .86-1.5L13.71 3.86a1 1 0 0 0-1.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17"/></svg>`
  };
  return icons[type] || "";
}
</script>

<style scoped>
.alerts-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 20px;
}

.alert {
  margin-bottom: 10px;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.alert-close {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 1rem;
  padding: 0;
}

strong {
  line-height: 1rem;
}

.alert-icon {
  flex-shrink: 0;
  height: 1.5rem;
  width: 1.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
