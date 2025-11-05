import { resolve } from 'node:path'
import removePreloadsPlugin from './utils/remove-preloads';

export default defineNuxtConfig({
  // базовые опции
  components: true,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // глобальные стили и модули
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', 'nuxt-svgo', '@pinia/nuxt', '@nuxt/fonts'],
  vite: {
    plugins: [
      removePreloadsPlugin() // удалит ссылки на payload/meta json
    ]
  },
  // шрифты (оставил ваши файлы, при необходимости можно добавить woff2/woff версии для лучшей поддержки)
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

  // router hook
  router: {
    extendRoutes(routes, resolve) {
      routes.forEach(route => {
        route.meta = { ...route.meta, version: 2 }
      })
    }
  },

  // Вставляем в <head> мета/стили/скрипт, чтобы масштаб/zoom применялись сразу и устойчиво в Safari
  app: {
    head: {
      meta: [
        // Устанавливаем базовый viewport = 1.0 — сам эффект масштабирования будем гарантированно применять через JS/CSS
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      // inline стиль, который применяется максимально рано (предотвращает FOUC и текстовые автоподгонки в iOS)
      style: [
        {
          children: `
            /* быстрые правки до инициализации Vue:
               - запрет авто-увеличения текста на iOS
               - подготовка контейнера, чтобы transform не ломал layout сильно
            */
            html,body {
              -webkit-text-size-adjust: 100%;
              text-size-adjust: 100%;
              /* видимость оставляем, масштаб будем применять скриптом, но эти правила убирают дерганье */
              min-height: 100%;
            }
          `
        }
      ],
      // ранний скрипт-фоллбек для установки масштабирования:
      script: [
        {
          // Применяем:
          //  - Safari / iOS Safari: transform:scale(...) + width compensation
          //  - Другие браузеры: meta initial-scale (если нужно) + style.zoom (быстрее)
          children: `
            (function () {
              try {
                var scale = 0.8; // желаемый визуальный масштаб (80%)
                var ua = navigator.userAgent || '';
                var isIOS = /iP(ad|hone|od)/.test(ua);
                // простая детекция Safari (исключаем Chrome и Android browsers)
                var isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);

                var meta = document.querySelector('meta[name="viewport"]');
                // по умолчанию оставляем viewport initial-scale=1 — чтобы мобильные браузеры не применяли странные автоподстройки.
                if (meta) {
                  meta.setAttribute('content', 'width=device-width, initial-scale=1');
                }

                if (isSafari || isIOS) {
                  // Safari / iOS: zoom через style.zoom ненадёжен -> используем transform
                  var css = ''
                    + 'html,body{'
                    + 'transform-origin: 0 0; -webkit-transform-origin: 0 0;'
                    + 'transform: scale(' + scale + '); -webkit-transform: scale(' + scale + ');'
                    + 'width: calc(100% / ' + scale + ');'
                    + 'height: calc(100% / ' + scale + ');'
                    + 'overflow-x: hidden;'
                    + ' -webkit-text-size-adjust: 100%;'
                    + '}'
                    + '/* Селектор для корректной работы приложений с фиксированными элементами */'
                    + 'body > #__nuxt { min-height: 100vh; }';

                  var s = document.createElement('style');
                  s.setAttribute('data-name', 'early-safari-scale');
                  s.appendChild(document.createTextNode(css));
                  document.head.appendChild(s);

                  // Если вы хотите, чтобы в браузерах, отличных от Safari, также использовался transform,
                  // можно убрать ветвление и всегда вставлять этот стиль.
                } else {
                  // Для остальных браузеров можно попробовать meta initial-scale + zoom (быстро применяется)
                  if (meta) {
                    meta.setAttribute('content', 'width=device-width, initial-scale=' + scale);
                  }
                  try {
                    document.documentElement.style.zoom = (scale * 100) + '%';
                    if (document.body) document.body.style.zoom = (scale * 100) + '%';
                  } catch (e) {
                    // если не сработает — ничего фатального
                  }
                }
              } catch (e) {
                // fail silently
              }
            })();
          `
        }
      ]
    }
  }
})
