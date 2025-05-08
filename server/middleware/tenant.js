// server/middleware/tenant.js
import { getDbForRequest } from '@/server/services/TenantContext'

export default defineEventHandler(async (event) => {
  event.context.db = await getDbForRequest(event.node.req)
})
