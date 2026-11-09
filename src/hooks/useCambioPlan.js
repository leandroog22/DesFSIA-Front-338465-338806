import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { cambiarPlanService } from '../services/usuarios.services'
import { actualizarUsuario } from '../features/auth/auth.slice'
import { mensajeDeError } from '../utils/errores'
import useRefrescarResumen from './useRefrescarResumen'

// Logica del cambio de plan (requerimiento 6.1.2). La usan varios botones
// "Pasar a Premium" (panel, banner de limite, detalle del aviso) y asi la
// llamada a la API y la actualizacion del store viven en un solo lugar.
const useCambioPlan = () => {
  const dispatch = useDispatch()
  const refrescarResumen = useRefrescarResumen()
  const [procesando, setProcesando] = useState(false)

  const pasarAPremium = async () => {
    setProcesando(true)
    try {
      const { usuario } = await cambiarPlanService()
      dispatch(actualizarUsuario({ plan: usuario.plan }))
      // El uso pasa de porcentaje a cantidad: hay que volver a pedirlo.
      await refrescarResumen()
      toast.success('¡Listo! Ya sos Premium: publicá sin límites.')
      return true
    } catch (error) {
      toast.error(mensajeDeError(error))
      return false
    } finally {
      setProcesando(false)
    }
  }

  return { pasarAPremium, procesando }
}

export default useCambioPlan
