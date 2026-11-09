import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { cambiarPlanService } from '../../services/usuarios.services'
import { actualizarUsuario, selectEsAdmin } from '../../features/auth/auth.slice'
import useRefrescarResumen from '../../hooks/useRefrescarResumen'
import { mensajeDeError } from '../../utils/errores'

// Cambio de plan (requerimiento 6.1.2). Solo se ofrece a quien esta en Plus;
// el administrador no gestiona planes (el backend responde 403).
const CambioPlan = () => {
  const dispatch = useDispatch()
  const refrescarResumen = useRefrescarResumen()
  const plan = useSelector((state) => state.auth.usuario?.plan)
  const esAdmin = useSelector(selectEsAdmin)
  const [confirmando, setConfirmando] = useState(false)
  const [procesando, setProcesando] = useState(false)

  if (esAdmin) return null

  if (plan === 'premium') {
    return (
      <div className="tarjeta cambio-plan cambio-plan-premium">
        <span className="cambio-plan-icono">
          <i className="fa-solid fa-crown"></i>
        </span>
        <h3>Tenés plan Premium</h3>
        <p className="texto-suave">Publicá todos los avisos que necesites, sin límite.</p>
      </div>
    )
  }

  const pasarAPremium = async () => {
    setProcesando(true)
    try {
      const { usuario } = await cambiarPlanService()
      dispatch(actualizarUsuario({ plan: usuario.plan }))
      // El uso pasa de porcentaje a cantidad: hay que volver a pedirlo.
      await refrescarResumen()
      toast.success('¡Listo! Ya sos Premium: publicá sin límites.')
    } catch (error) {
      toast.error(mensajeDeError(error))
    } finally {
      setProcesando(false)
      setConfirmando(false)
    }
  }

  return (
    <div className="tarjeta cambio-plan">
      <span className="cambio-plan-icono">
        <i className="fa-solid fa-rocket"></i>
      </span>
      <h3>Pasate a Premium</h3>
      <ul className="lista-check">
        <li>
          <i className="fa-solid fa-check"></i> Avisos activos ilimitados
        </li>
        <li>
          <i className="fa-solid fa-check"></i> Análisis con IA en cada aviso
        </li>
        <li>
          <i className="fa-solid fa-check"></i> Sin cerrar avisos para liberar cupo
        </li>
      </ul>

      {confirmando ? (
        <div className="confirmacion">
          <p>¿Confirmás el cambio a Premium?</p>
          <div className="acciones">
            <button type="button" className="btn btn-primario" onClick={pasarAPremium} disabled={procesando}>
              {procesando ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Sí, cambiar'}
            </button>
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => setConfirmando(false)}
              disabled={procesando}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn-premium btn-bloque" onClick={() => setConfirmando(true)}>
          <i className="fa-solid fa-crown"></i> Cambiar a Premium
        </button>
      )}
    </div>
  )
}

export default CambioPlan
