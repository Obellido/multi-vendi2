// services/userService.js
import DbService from './DbService.js'

export async function getUserByUsername(username) {
  try {
    const docs = await DbService.find({ username: username, tipo: 'Usuario' })
    return docs[0] || null
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    throw error
  }
}

export async function createUser(user) {
  try {
    const response = await DbService.insert(user)
    return response
  } catch (error) {
    console.error('Error creando usuario:', error)
    throw error
  }
}

export async function updateUser(id, user) {
  try {
    const response = await DbService.update(id, user)
    return response
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    throw error
  }
}

export async function deleteUser(id) {
  try {
    const response = await DbService.delete(id)
    return response
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    throw error
  }
}