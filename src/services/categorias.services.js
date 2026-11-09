import api from '../api/api'

export const obtenerCategoriasService = async () => {
  const res = await api.get('/categorias')
  return res.data
}

// Alta, modificacion y baja: solo el administrador (el backend responde 403
// a cualquier otro rol).
export const crearCategoriaService = async (categoria) => {
  const res = await api.post('/categorias', categoria)
  return res.data
}

export const actualizarCategoriaService = async (id, cambios) => {
  const res = await api.patch(`/categorias/${id}`, cambios)
  return res.data
}

export const eliminarCategoriaService = async (id) => {
  const res = await api.delete(`/categorias/${id}`)
  return res.data
}
