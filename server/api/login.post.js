import jwt from 'jsonwebtoken'
import { getPermissionsForPerfil } from '@/server/repositories/userRepository'
import { getUserByUsername } from '@/server/services/userService'

export default defineEventHandler(async (event) => {
  
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { username, password } = body

  const user = await getUserByUsername(event,username)

  if (!user || user.password !== password) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' })
  }

  const permissions = await getPermissionsForPerfil(user.perfil_id)
  const userAgent = getHeader(event, 'user-agent') || 'unknown'

  const userData = {
    id: user._id,
    username: user.username,
    profileId: user.perfil_id,
    permissions,
    userAgent,
  }

  const accessToken = jwt.sign(userData, config.JWT_SECRET, { expiresIn: config.TOKEN_EXPIRES_IN })
  const refreshToken = jwt.sign(userData, config.JWT_REFRESH_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, permissions },
  }
})
