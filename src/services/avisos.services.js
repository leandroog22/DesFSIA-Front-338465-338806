import api from '../api/api'

// Responde { avisos, page, limit, total, totalPages }.
// axios arma el query string a partir de params (?page=1&mios=true...).
export const obtenerAvisosService = async (params) => {
  const res = await api.get('/avisos', { params })
  return res.data
}

export const obtenerAvisoService = async (id) => {
  const res = await api.get(`/avisos/${id}`)
  return res.data
}

export const crearAvisoService = async (aviso) => {
  const res = await api.post('/avisos', aviso)
  return res.data
}

export const actualizarAvisoService = async (id, cambios) => {
  const res = await api.patch(`/avisos/${id}`, cambios)
  return res.data
}

export const eliminarAvisoService = async (id) => {
  const res = await api.delete(`/avisos/${id}`)
  return res.data
}

export const cambiarEstadoAvisoService = async (id, estado) => {
  const res = await api.patch(`/avisos/${id}/estado`, { estado })
  return res.data
}

// La imagen viaja como multipart/form-data en el campo "imagen", que es el
// que espera multer en el backend. Con un FormData axios pone solo el
// Content-Type correcto, con su boundary.
export const subirImagenAvisoService = async (id, archivo) => {
  const formData = new FormData()
  formData.append('imagen', archivo)
  const res = await api.post(`/avisos/${id}/imagen`, formData)
  return res.data
}

export const reintentarAnalisisService = async (id) => {
  const res = await api.post(`/avisos/${id}/analisis`)
  return res.data
}

// Responde { total, porCategoria, porSeniority, porModalidad, porEstado }
export const obtenerEstadisticasService = async () => {
  const res = await api.get('/avisos/estadisticas')
  return res.data
}
