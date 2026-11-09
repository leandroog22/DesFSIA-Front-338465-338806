import axios from 'axios'
import { toast } from 'react-toastify'
import store from '../store/store'
import { cerrarSesion } from '../features/auth/auth.slice'

// La URL de la API se puede cambiar con la variable VITE_API_URL (por ejemplo
// para apuntar a un backend local). Si no esta definida se usa la publicada.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://des-fsia-n4-a-338465-338806.vercel.app/v1',
  // El alta de un aviso espera el analisis de la IA, que puede tardar unos segundos.
  timeout: 30000,
})

// Interceptor de request: agrega el token a todas las llamadas, asi ningun
// componente tiene que acordarse de mandarlo a mano.
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de response: el token vence a la hora. Si con una sesion abierta
// la API responde 401, el token ya no sirve y se cierra la sesion. El guard de
// rutas ve el cambio en Redux y manda al usuario al login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const haySesion = store.getState().auth.token !== null
    if (error.response?.status === 401 && haySesion) {
      store.dispatch(cerrarSesion())
      toast.info('Tu sesión expiró. Volvé a ingresar.', { toastId: 'sesion-expirada' })
    }
    return Promise.reject(error)
  }
)

export default api
