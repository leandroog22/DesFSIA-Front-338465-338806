import api from '../api/api'

// Los services son la unica capa que conoce las URLs de la API. Los
// componentes los llaman y despachan el resultado al store.

// Responde { message, usuario, token }
export const loginService = async (credenciales) => {
  const res = await api.post('/auth/login', credenciales)
  return res.data
}

// Responde { message, usuario, token }: el token permite el auto-login.
export const registroService = async (datos) => {
  const res = await api.post('/auth/register', datos)
  return res.data
}
