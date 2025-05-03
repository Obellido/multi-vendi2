import jwt from 'jsonwebtoken'

export function requireAuth(event) {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)

    const currentUserAgent = getHeader(event, 'user-agent') || 'unknown'
    if (decoded.userAgent !== currentUserAgent) {
      throw createError({ statusCode: 401, statusMessage: 'User-Agent no coincide' })
    }

    return decoded
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido o expirado' })
  }
}
