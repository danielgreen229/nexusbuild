import { resolve } from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', 'nuxt-svgo', '@pinia/nuxt',],
  svgo: {
    autoImportPath: resolve(__dirname, 'assets/icons/'),  
  },
  target: 'static',
  nitro: {
    preset: 'netlify'
  },
  generate: {
    cache: false 
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.forEach(route => {
        route.meta = { ...route.meta, version: 2 } // Increment on updates
      })
    }
  }
})