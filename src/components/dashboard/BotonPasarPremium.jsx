import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectEsAdmin } from '../../features/auth/auth.slice'
import useCambioPlan from '../../hooks/useCambioPlan'
import Icono from '../comunes/Icono'
import Spinner from '../comunes/Spinner'

// Boton "Pasar a Premium" con confirmacion en dos pasos: el primer clic pide
// confirmar y recien el segundo llama a la API. No se muestra si el usuario
// ya es Premium o es administrador (el admin no gestiona planes).
// "variante" elige el estilo del boton segun donde se use.
const BotonPasarPremium = ({ variante = 'btn-acento', texto = 'Pasar a Premium', icono = 'verified', bloque = false }) => {
  const plan = useSelector((state) => state.auth.usuario?.plan)
  const esAdmin = useSelector(selectEsAdmin)
  const { pasarAPremium, procesando } = useCambioPlan()
  const [confirmando, setConfirmando] = useState(false)

  if (esAdmin || plan !== 'plus') return null

  if (confirmando) {
    return (
      <div className={`acciones ${bloque ? 'btn-bloque' : ''}`}>
        <button
          type="button"
          className={`btn ${variante}`}
          onClick={async () => {
            await pasarAPremium()
            setConfirmando(false)
          }}
          disabled={procesando}
        >
          {procesando ? <Spinner enLinea /> : 'Confirmar cambio'}
        </button>
        <button type="button" className="btn btn-fantasma" onClick={() => setConfirmando(false)} disabled={procesando}>
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`btn ${variante} ${bloque ? 'btn-bloque' : ''}`}
      onClick={() => setConfirmando(true)}
    >
      {icono && <Icono nombre={icono} />} {texto}
    </button>
  )
}

export default BotonPasarPremium
