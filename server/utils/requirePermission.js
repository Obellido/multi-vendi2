import { requireAuth } from './requireAuth'

export function requirePermission(event, module, action) {
  const user = requireAuth(event)

  const hasPermission = user.permissions.some(p => p.module === module && p.action === action)

  if (!hasPermission) {
    throw createError({ statusCode: 403, statusMessage: 'No tienes permiso para esta acción' })
  }

  return user
}
