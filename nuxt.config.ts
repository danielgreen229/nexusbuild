// nuxt.config.ts
import { resolve } from 'node:path'

export default defineNuxtConfig({
  target: 'static',
  nitro: { preset: 'netlify' },
  server: { port: 3000 },
  generate: { cache: false },

  components: true,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/image', 
    '@pinia/nuxt', 
    '@nuxt/fonts', 
    'nuxt-svgo', 
    [
      'yandex-metrika-module-nuxt3',
      {
        id: '105400670',
        webvisor: true,
        consoleLog: true,
        clickmap: true,
        useCDN: false,
        trackLinks: true,
        accurateTrackBounce: true,
      }
    ]
  ],
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
        // уже существующие мета
        { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"' },

        // MS tile (если есть browserconfig.xml)
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'msapplication-config', content: '/favicons/browserconfig.xml' },

        // theme color (для chrome android, taskbar)
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        // стандартные favicon/ico/png
        { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },

        // apple touch
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },

        // android / webapp manifest
        { rel: 'manifest', href: '/favicons/site.webmanifest' },

        // optional: shortcut icon
        { rel: 'shortcut icon', href: '/favicons/favicon.ico' }
      ],
      script: [
        {
          children: `(function(){try{document.documentElement.style.setProperty('--app-scale','0.8')}catch(e){}})();`
        }
      ]
    }
  }
})
