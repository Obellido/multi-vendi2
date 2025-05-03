// services/fetchAuth.js

import { useAuthStore } from '@/stores/authStore'

export async function fetchAuth(url, options = {}) {
  const authStore = useAuthStore()

  await authStore.refreshTokenIfNeeded()

  const token = authStore.accessToken

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })
}
