// plugins/axios.client.js
import axios from 'axios'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('axios', axios)
})
