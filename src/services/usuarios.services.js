import api from '../api/api'

export const obtenerPerfilService = async () => {
  const res = await api.get('/usuarios/me')
  return res.data
}

// Responde { plan, usados, limite, porcentaje, ilimitado }
export const obtenerUsoService = async () => {
  const res = await api.get('/usuarios/me/uso')
  return res.data
}

// Responde { message, usuario }
export const cambiarPlanService = async () => {
  const res = await api.patch('/usuarios/me/plan')
  return res.data
}
