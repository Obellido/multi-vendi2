// services/DbService.js
import nano from 'nano'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const user = config.USERDB
const pass = config.PASSDB
const url = config.URLDB
const dbName = config.NAMEDB

const fullUrl = url.includes('://') ? url.replace(/\/$/, '') : `http://${url.replace(/\/$/, '')}`
const authUrl = fullUrl.replace('://', `://${user}:${pass}@`)

const couch = nano(authUrl)
const db = couch.db.use(dbName)

class DbService {
  static async find(selector) {
    try {
      const result = await db.find({ selector })
      return result.docs
    } catch (error) {
      console.error('Error en consulta general:', error)
      throw error
    }
  }

  static async insert(doc) {
    try {
      const response = await db.insert(doc)
      return response
    } catch (error) {
      console.error('Error insertando documento:', error)
      throw error
    }
  }

  static async update(id, doc) {
    try {
      const existing = await db.get(id)
      const response = await db.insert({ ...existing, ...doc })
      return response
    } catch (error) {
      console.error('Error actualizando documento:', error)
      throw error
    }
  }

  static async delete(id) {
    try {
      const doc = await db.get(id)
      const response = await db.destroy(id, doc._rev)
      return response
    } catch (error) {
      console.error('Error eliminando documento:', error)
      throw error
    }
  }
}

export default DbService
