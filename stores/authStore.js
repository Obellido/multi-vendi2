// stores/authStore.js

import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    expiration: 0
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    loadFromStorage() {
        this.accessToken = localStorage.getItem('accessToken')
        this.refreshToken = localStorage.getItem('refreshToken')
        this.user = JSON.parse(localStorage.getItem('user') || 'null')
        this.expiration = parseInt(localStorage.getItem('expiration') || '0', 10)
    },
    async login(username, password) {
      const data = await authService.login(username, password)
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      this.user = data.user
      this.expiration = Date.now() + 15 * 60 * 1000 // 15 minutos

      localStorage.setItem('accessToken', this.accessToken)
      localStorage.setItem('refreshToken', this.refreshToken)
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('expiration', this.expiration.toString())
    },

    async logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.expiration = 0

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('expiration')

      // NO usar useRouter aquí, simplemente return un indicador
    },

    async refreshTokenIfNeeded() {
      if (!this.refreshToken) return

      const threshold = 60 * 1000 // 1 minuto antes de expirar
      if (Date.now() > this.expiration - threshold) {
        try {
          const data = await authService.refreshAccessToken(this.refreshToken)
          this.accessToken = data.accessToken
          this.expiration = Date.now() + 15 * 60 * 1000

          localStorage.setItem('accessToken', this.accessToken)
          localStorage.setItem('expiration', this.expiration.toString())
        } catch (error) {
          console.error('Refresh token falló:', error)
          this.logout()
        }
      }
    },
  },
})
