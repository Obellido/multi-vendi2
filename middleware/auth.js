// middleware/auth.js
import { useAuthStore } from '@/stores/authStore'

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const auth = useAuthStore()
    auth.loadFromStorage()

    if (!auth.isAuthenticated) {
      return navigateTo('/login')
    }
  }
})
