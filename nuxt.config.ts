import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', 'nuxt-svgo', '@pinia/nuxt'],
  svgo: {
    autoImportPath: resolve(__dirname, 'assets/icons/'),
  },
  target: 'static',
  nitro: { preset: 'netlify' },
  server: { port: 3000 },
  generate: { cache: false },
  router: {
    extendRoutes(routes, resolve) {
      routes.forEach(route => {
        route.meta = { ...route.meta, version: 2 }
      })
    }
  }
})
