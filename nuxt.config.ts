import { resolve } from 'node:path'

export default defineNuxtConfig({
  // базовые опции
  components: true, 
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // глобальные стили и модули
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', 'nuxt-svgo', '@pinia/nuxt'],

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

  // Вставляем в <head> мета/стили/скрипт, чтобы viewport и zoom применялись сразу
  app: {
    head: {
      meta: [
        // задаём initial-scale сразу
        { name: 'viewport', content: 'width=device-width, initial-scale=0.8' }
      ],
      // inline стиль для быстрой установки zoom до рендера
      style: [
        {
          // zoom: не CSS-стандарт, но применяется сразу как inline-style
          children: `
           
          `
        }
      ],
      // небольшой ранний скрипт-фоллбек для гарантии установки (выполнится до инициализации Vue)
      script: [
        {
          children: `
            (function () {
              try {
                var m = document.querySelector('meta[name="viewport"]');
                if (m) m.setAttribute('content', 'width=device-width, initial-scale=0.8');
                document.documentElement.style.zoom = '80%';
                if (document.body) document.body.style.zoom = '80%';
              } catch(e) {}
            })();
          `
        }
      ]
    }
  }
})
