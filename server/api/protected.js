// server/api/stock/addStock.post.js
import { requirePermission } from '@/server/utils/requirePermission'

export default defineEventHandler(async (event) => {
  const user = requirePermission(event, 'Stock', 'Eliminar') // 👈 Protegido

  const body = await readBody(event)

  // Simula agregar stock...
  return {
    message: `Stock agregado exitosamente por ${user.username}`,
    cantidad: body.cantidad,
  }
})
