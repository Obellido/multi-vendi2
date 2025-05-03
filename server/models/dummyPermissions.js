// models/dummyPermissions.js

export const modulos = [
  { id: 1, nombre: 'Productos' },
  { id: 2, nombre: 'Stock' },
  { id: 3, nombre: 'Ventas' },
  { id: 4, nombre: 'Envios' },
]

export const acciones = [
  { id: 1, nombre: 'Listar', modulo_id: 1 },
  { id: 2, nombre: 'Agregar', modulo_id: 2 },
  { id: 3, nombre: 'Listar', modulo_id: 2 },
  { id: 4, nombre: 'Gestionar', modulo_id: 3 },
  { id: 5, nombre: 'Eliminar', modulo_id: 3 },
  { id: 6, nombre: 'Listar', modulo_id: 4 },
]

export const perfiles = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Acomodador' },
]

export const perfilAcciones = [
  // Admin tiene acceso a todo
  { perfil_id: 1, accion_id: 1 },
  { perfil_id: 1, accion_id: 2 },
  { perfil_id: 1, accion_id: 3 },
  { perfil_id: 1, accion_id: 4 },
  { perfil_id: 1, accion_id: 5 },
  { perfil_id: 1, accion_id: 6 },

  // Acomodador
  { perfil_id: 2, accion_id: 1 }, // Productos - Listar
  { perfil_id: 2, accion_id: 2 }, // Stock - Agregar
  { perfil_id: 2, accion_id: 3 }, // Stock - Listar
]
