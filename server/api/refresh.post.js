// server/api/refresh.post.js

import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { refreshToken } = body

  if (!refreshToken) {
    throw createError({ statusCode: 400, statusMessage: 'No se envió refresh token' })
  }

  try {
    const userData = jwt.verify(refreshToken, config.REFRESH_SECRET_KEY)

    // Opcional: Verificar si el refreshToken existe en la base de datos

    const newAccessToken = jwt.sign({ id: userData.id, username: userData.username, role: userData.role }, config.SECRET_KEY, { expiresIn: config.TOKEN_EXPIRES_IN })

    return { accessToken: newAccessToken }
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Refresh token inválido' })
  }
})
