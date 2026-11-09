import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { obtenerUsoService } from '../services/usuarios.services'
import { obtenerEstadisticasService } from '../services/avisos.services'
import { setUso } from '../features/uso/uso.slice'
import { setEstadisticas } from '../features/estadisticas/estadisticas.slice'
import { mensajeDeError } from '../utils/errores'

// Vuelve a pedir el uso del plan y las estadisticas. Se llama despues de cada
// operacion que los cambia (alta, baja, cierre, reapertura, cambio de plan)
// para que el panel, el header y el grafico queden al dia.
// useCallback mantiene la misma funcion entre renders, asi se puede usar como
// dependencia de un useEffect sin dispararlo en bucle.
const useRefrescarResumen = () => {
  const dispatch = useDispatch()

  return useCallback(async () => {
    try {
      const [uso, estadisticas] = await Promise.all([
        obtenerUsoService(),
        obtenerEstadisticasService(),
      ])
      dispatch(setUso(uso))
      dispatch(setEstadisticas(estadisticas))
    } catch (error) {
      if (error.response?.status !== 401) toast.error(mensajeDeError(error))
    }
  }, [dispatch])
}

export default useRefrescarResumen
