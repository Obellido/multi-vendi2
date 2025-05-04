// models/userRepository.js

import { perfiles, perfilAcciones, acciones, modulos } from '@/server/models/dummyPermissions'
import { getUserByUsername } from '@/server/services/userService'

// const users = [
//   { id: 1, username: 'admin', password: '123456', perfil_id: 1 },
//   { id: 2, username: 'acomodador', password: '123456', perfil_id: 2 },
// ]

export async function findUserByUsername(username) {
  return await getUserByUsername(username)
}

export async function getPermissionsForPerfil(perfil_id) {
  const accionesPermitidas = perfilAcciones
    .filter(pa => pa.perfil_id === perfil_id)
    .map(pa => {
      const accion = acciones.find(a => a.id === pa.accion_id)
      const modulo = modulos.find(m => m.id === accion.modulo_id)
      return {
        module: modulo.nombre,
        action: accion.nombre,
      }
    })

  return accionesPermitidas
}