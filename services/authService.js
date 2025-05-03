// services/authService.js

export const authService = {
    login,
    refreshAccessToken,
  }
  
  async function login(username, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  
    if (!response.ok) {
      throw new Error('Usuario o contraseña incorrectos')
    }
  
    return await response.json()
  }
  
  async function refreshAccessToken(refreshToken) {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
  
    if (!response.ok) {
      throw new Error('No se pudo renovar el token')
    }
  
    return await response.json()
  }
  