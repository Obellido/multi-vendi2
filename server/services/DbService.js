// services/DbService.js
class DbService {
  static resolveDb(event) {
    const db = event.context?.db
    if (!db) throw new Error('❌ No se ha definido una base de datos en el contexto del request.')
    return db
  }

  static async view(event, designDoc, viewName, options = {}) {
    const db = this.resolveDb(event)
    return await db.view(designDoc, viewName, options)
  }

  static async get(event, id) {
    const db = this.resolveDb(event)
    return await db.get(id)
  }

  static async find(event, selector, options = {}) {
    const db = this.resolveDb(event)
    const query = { selector }
    if (options.limit) query.limit = options.limit
    if (options.skip) query.skip = options.skip
    return (await db.find(query)).docs
  }

  static async insert(event, doc) {
    const db = this.resolveDb(event)
    return await db.insert(doc)
  }

  static async update(event, id, doc) {
    const db = this.resolveDb(event)
    const existing = await db.get(id)
    return await db.insert({ ...existing, ...doc })
  }

  static async delete(event, id) {
    const db = this.resolveDb(event)
    const doc = await db.get(id)
    return await db.destroy(id, doc._rev)
  }
}

export default DbService
