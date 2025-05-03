// services/idleService.js
import { useIdle, useIntervalFn } from '@vueuse/core'
import { useAuthStore } from '@/stores/authStore'
import { ref, watch } from 'vue'

const IDLE_LIMIT_MS = 60 * 29 * 1000  // 29 minutos
const COUNTDOWN_SECONDS = 60 // 60 segundos

const isIdle = ref(false)
const countdown = ref(COUNTDOWN_SECONDS)

const idleEvent = ref(false) // <-- nueva bandera de evento

let countdownInterval

const lastUsername = ref('')


export function startIdleWatcher() {
  if (import.meta.client) {
    const { idle } = useIdle(IDLE_LIMIT_MS)

    watch(idle, (newIdle) => {
      console.log('[IDLE WATCHER] Cambio detectado:', newIdle)

      if (newIdle) {
        isIdle.value = true
        startCountdown()
      } else {
        isIdle.value = false
        resetCountdown()
      }
    })
  }
}

function startCountdown() {
  resetCountdown()

  countdownInterval = useIntervalFn(() => {
    countdown.value--
    if (countdown.value <= 0) {
      console.log('[IDLE WATCHER] Tiempo agotado. Emite evento para reautenticar.')

      const auth = useAuthStore()
      lastUsername.value = auth.user?.username || ''
      auth.logout() // esto limpia localStorage como quieres

      idleEvent.value = true // disparamos el evento
      stopCountdown()
    }
  }, 1000)
}

function resetCountdown() {
  countdown.value = COUNTDOWN_SECONDS
  if (countdownInterval?.pause) {
    countdownInterval.pause()
  }
}

function stopCountdown() {
  if (countdownInterval?.pause) {
    countdownInterval.pause()
  }
}

export function useIdleStatus() {
  return { isIdle, countdown, idleEvent }
}

export function clearIdleEvent() {
  idleEvent.value = false
}
