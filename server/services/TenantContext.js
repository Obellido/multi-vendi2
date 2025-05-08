import nano from 'nano'
import { useRuntimeConfig, createError } from '#imports'

const config = useRuntimeConfig()
const fullUrl = config.URLDB.replace(/\/$/, '')
const authUrl = fullUrl.replace('://', `://${config.USERDB}:${config.PASSDB}@`)
const couch = nano(authUrl)

// Cache en memoria de bases ya instanciadas
const dbCache = {}

export async function getDbForRequest(req) {
  const hostname = req.headers.host || ''
  const mainDomain = config.MAIN_DOMAIN || 's3.local:3000'

  const isMain = hostname === mainDomain || !hostname.endsWith(`.${mainDomain}`)
  const subdomain = isMain ? null : hostname.replace(`.${mainDomain}`, '')

  console.info(`🌐 Subdominio detectado: ${subdomain || '[main]'}`)

  // Caso principal (sin subdominio): usar BD principal
  if (!subdomain) {
    if (!dbCache[config.NAMEDB]) {
      dbCache[config.NAMEDB] = couch.db.use(config.NAMEDB)
    }
    return dbCache[config.NAMEDB]
  }

  try {
    if (!dbCache[subdomain]) {
      const adminDb = couch.db.use(config.NAMEDB)
      const tenant = await adminDb.get(`tenant-${subdomain}`)

      if (!tenant?.basedb) {
        throw createError({
          statusCode: 404,
          statusMessage: `El tenant "${subdomain}" no tiene base de datos asignada`
        })
      }

      const allDbs = await couch.db.list()
      if (!allDbs.includes(tenant.basedb)) {
        throw createError({
          statusCode: 404,
          statusMessage: `La base de datos "${tenant.basedb}" para el tenant "${subdomain}" no existe`
        })
      }

      dbCache[subdomain] = couch.db.use(tenant.basedb)
    }

    return dbCache[subdomain]

  } catch (err) {
    if (err.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: `Empresa "${subdomain}" no encontrado`
      })
    }

    console.error(`❌ Error al obtener DB para tenant "${subdomain}":`, err)
    throw createError({
      statusCode: 500,
      statusMessage: `Error interno al procesar tenant "${subdomain}"`
    })
  }
}
