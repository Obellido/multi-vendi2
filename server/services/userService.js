// services/userService.js
import DbService from './DbService.js'

export async function getUserByUsername(event,username) {
  try {
    // Using design view to query users by username
    const result = await DbService.view(event,'user', 'byUsername', {
      key: username.toLowerCase(),
      include_docs: true
    });


    // Return first matching user document or null if none found
    return result.rows.length > 0? result.rows[0].doc : null;
    
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