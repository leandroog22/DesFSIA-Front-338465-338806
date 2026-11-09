import { useSelector } from 'react-redux'
import { selectEsAdmin } from '../../features/auth/auth.slice'
import Icono from '../comunes/Icono'
import BotonPasarPremium from './BotonPasarPremium'

// Cambio de plan (requerimiento 6.1.2), en un componente aparte del informe
// de uso. Solo se ofrece a quien esta en Plus ("si corresponde").
const CambioPlan = () => {
  const plan = useSelector((state) => state.auth.usuario?.plan)
  const esAdmin = useSelector(selectEsAdmin)

  if (esAdmin || plan !== 'plus') return null

  return (
    <div className="upsell">
      <h3>
        <Icono nombre="bolt" relleno /> ¿Necesitás más escala?
      </h3>
      <p>Con Premium publicás avisos ilimitados y no tenés que cerrar búsquedas para abrir nuevas.</p>
      <BotonPasarPremium bloque />
    </div>
  )
}

export default CambioPlan
