// ===== file: nuxt.config.ts =====
import { resolve } from 'node:path'

export default defineNuxtConfig({
   // рендер / nitro / сервер
  target: 'static',
  nitro: { preset: 'netlify' },
  server: { port: 3000 },
  generate: { cache: false },

  // базовые опции
  components: true,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // глобальные стили и плагины
  css: ['~/assets/css/main.css'],
  // plugins: ['~/plugins/scale.client.ts'],

  // модули
  modules: ['@nuxt/image', '@pinia/nuxt', '@nuxt/fonts', 'nuxt-svgo'],

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
  router: {
    extendRoutes(routes, resolve) {
      routes.forEach(route => {
        route.meta = { ...route.meta, version: 2 }
      })
    }
  },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=yes' }
      ],
      script: [
        {
          children: `(function(){try{document.documentElement.style.setProperty('--app-scale','0.8')}catch(e){}})();`
        }
      ]
    }
  }
})