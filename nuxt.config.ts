// ===== file: nuxt.config.ts =====
import { resolve } from 'node:path'

export default defineNuxtConfig({
  // базовые опции
  components: true,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // глобальные стили и плагины
  css: ['~/assets/css/main.css'],
  // plugins: ['~/plugins/scale.client.ts'],

  // модули
  modules: ['@nuxt/image', 'nuxt-svgo', '@pinia/nuxt', '@nuxt/fonts'],

  fonts: {
    families: [
      {
        name: 'Inter',
        src: [
          { path: '~/assets/fonts/Inter/Inter-Regular.ttf', weight: '400', style: 'normal' },
          { path: '~/assets/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf', weight: '400', style: 'italic' }
        ],
        preload: true,
        display: 'swap'
      }
    ],
    download: false
  },

  // svgo
  svgo: {
    autoImportPath: resolve(__dirname, 'assets/icons/'),
  },

  // рендер / nitro / сервер
  target: 'static',
  nitro: { preset: 'netlify' },
  server: { port: 3000 },
  generate: { cache: false },

  // router hook (оставил как у вас)
  router: {
    extendRoutes(routes, resolve) {
      routes.forEach(route => {
        route.meta = { ...route.meta, version: 2 }
      })
    }
  },

  // head: оставляем серверный meta viewport + лёгкий ранний скрипт для CSS-переменной
  app: {
    head: {
      meta: [
        // начальный масштаб — SSR-мета. Не запрещаем зум пользователю (accessibility)
        { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=yes' }
      ],
      // легкий ранний скрипт, который устанавливает CSS-переменную --app-scale до рендера
      // важно: мы НЕ применяем document.documentElement.style.zoom здесь (устраняем нестабильное поведение)
      script: [
        {
          children: `(function(){try{document.documentElement.style.setProperty('--app-scale','0.8')}catch(e){}})();`
        }
      ]
    }
  }
})
