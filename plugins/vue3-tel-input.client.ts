// plugins/vue3-tel-input.client.ts
import { defineNuxtPlugin } from '#app'
import pkg from 'vue3-tel-input' // используем default import — в UMD/CommonJS это безопасно

export default defineNuxtPlugin((nuxtApp) => {
  // pkg может быть плагином сам по себе или содержать свойство VueTelInput
  const VueTelInput = (pkg as any).default?.VueTelInput ?? (pkg as any).VueTelInput ?? (pkg as any).default ?? pkg
  // Если пакет экспортирует объект-плагин — регистрируем его
  if (VueTelInput) {
    // если это объект-плагин
    if (typeof VueTelInput === 'object' || typeof VueTelInput === 'function') {
      nuxtApp.vueApp.use(VueTelInput)
    }
  }
})
