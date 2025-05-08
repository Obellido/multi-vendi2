import fs from 'fs'
import path from 'path'
import nano from 'nano'
import { useRuntimeConfig } from '#imports'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  const fullUrl = config.URLDB.replace(/\/$/, '')
  const authUrl = fullUrl.replace('://', `://${config.USERDB}:${config.PASSDB}@`)
  const nanoInstance = nano(authUrl)

  const baseDir = path.join(process.cwd(), '/server/design-views')
  if (!fs.existsSync(baseDir)) {
    console.warn('⚠️ Carpeta design-views no encontrada, se omite sincronización.')
    return
  }

  // --- Función para sincronizar design docs a una base específica ---
  async function syncViewsIn(dbInstance, viewsRoot) {
    const modules = fs.readdirSync(viewsRoot)
    for (const module of modules) {
      const modulePath = path.join(viewsRoot, module)
      if (!fs.statSync(modulePath).isDirectory()) continue

      const designDocId = `_design/${module}`
      const files = fs.readdirSync(modulePath)
      const views = {}

      for (const file of files) {
        const viewName = path.basename(file, path.extname(file))
        const filePath = path.join(modulePath, file)
        console.log(`🔍 Procesando: ${filePath}`)

        const designUrl = new URL('file://' + filePath.replace(/\\/g, '/'))
        const viewModule = (await import(designUrl)).default

        if (typeof viewModule === 'string') {
          views[viewName] = { map: viewModule }
        } else if (typeof viewModule === 'object' && viewModule.map) {
          views[viewName] = {
            map: viewModule.map,
            ...(viewModule.reduce ? { reduce: viewModule.reduce } : {})
          }
        } else {
          console.warn(`⚠️ View inválida en ${file}.`)
          continue
        }
      }

      const designDoc = { _id: designDocId, views }

      try {
        const existing = await dbInstance.get(designDoc._id)
        const hasChanged = JSON.stringify(existing.views) !== JSON.stringify(designDoc.views)

        if (hasChanged) {
          designDoc._rev = existing._rev
          await dbInstance.insert(designDoc)
          console.log(`🔄 Actualizado: ${designDocId}`)
        } else {
          console.log(`✅ Sin cambios: ${designDocId}`)
        }
      } catch (err) {
        if (err.statusCode === 404) {
          await dbInstance.insert(designDoc)
          console.log(`🆕 Creado: ${designDocId}`)
        } else {
          console.error(`❌ Error en ${designDocId}:`, err.message)
        }
      }
    }
  }

  // --- 1. Sincronizar vistas de la BD ADMIN ---
  const adminDb = nanoInstance.use(config.NAMEDB)
  const adminViewsDir = path.join(baseDir, 'admin')

  if (fs.existsSync(adminViewsDir)) {
    console.log('🛠️ Sincronizando vistas en base ADMIN...')
    await syncViewsIn(adminDb, adminViewsDir)
  }

  // --- 2. Sincronizar vistas en todas las BD de tenants ---
  const tenantViewsDir = path.join(baseDir, 'tenant')

  if (fs.existsSync(tenantViewsDir)) {
    console.log('🛠️ Buscando tenants activos...')

    let tenants = []
    try {
      const result = await adminDb.view('tenant', 'activos') // requiere esta vista en admin
      tenants = result.rows.map(row => row.value.basedb)
    } catch (err) {
      console.error('❌ No se pudo obtener la lista de tenants desde admin:', err.message)
      return
    }

    for (const dbName of tenants) { 
      try {
        // Verifica si la base existe
        const allDbs = await nanoInstance.db.list()
        if (!allDbs.includes(dbName)) {
          await nanoInstance.db.create(dbName)
          console.log(`📁 Base creada: ${dbName}`)
        }

        const tenantDb = nanoInstance.use(dbName)
        console.log(`📦 Sincronizando tenant: ${dbName}`)
        await syncViewsIn(tenantDb, tenantViewsDir)
      } catch (err) {
        console.error(`❌ Error en tenant "${dbName}":`, err.message)
      }
    }
  }

  console.log('🎉 Sincronización de design views completada.')
})
