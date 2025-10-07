// plugins/pinia-init.client.ts
import { defineNuxtPlugin } from '#app'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(() => {
  const user = useUserStore()
  // не await здесь — запустить и не блокировать рендер
  user.init?.()
})
