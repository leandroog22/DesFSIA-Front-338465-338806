import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import Icono from '../comunes/Icono'
import PlanBadge from '../comunes/PlanBadge'

// Version compacta del uso del plan, arriba del formulario de alta: avisa
// cuantos lugares quedan antes de que el usuario complete todo el aviso.
const UsoCompacto = () => {
  const uso = useSelector((state) => state.uso.datos)

  if (!uso) return null

  if (uso.ilimitado) {
    return (
      <div className="tarjeta uso-compacto">
        <div className="uso-compacto-fila" style={{ marginBottom: 0 }}>
          <span className="uso-compacto-icono">
            <Icono nombre="all_inclusive" />
          </span>
          <div>
            <h3>
              {uso.usados} {uso.usados === 1 ? 'aviso activo' : 'avisos activos'} <PlanBadge plan="premium" prefijo />
            </h3>
            <p className="texto-suave texto-chico">Tu plan no tiene límite de publicaciones.</p>
          </div>
        </div>
      </div>
    )
  }

  const restantes = Math.max(uso.limite - uso.usados, 0)

  return (
    <div className="tarjeta uso-compacto">
      <div className="uso-compacto-fila">
        <span className="uso-compacto-icono">
          <Icono nombre="insights" />
        </span>
        <div>
          <h3>
            Usaste {uso.usados} de {uso.limite} avisos activos <PlanBadge plan="plus" prefijo />
          </h3>
          <p className="texto-suave texto-chico">
            Te {restantes === 1 ? 'queda 1 aviso activo disponible' : `quedan ${restantes} avisos activos disponibles`}
          </p>
        </div>
        <Link to="/dashboard" className="link-flecha ocultar-movil">
          Pasar a Premium <Icono nombre="chevron_right" />
        </Link>
      </div>
      <div className={`barra barra-fina ${uso.porcentaje >= 75 ? 'barra-alta' : ''}`}>
        <div style={{ width: `${uso.porcentaje}%` }}></div>
      </div>
      <div className="uso-compacto-pie">
        <span>{uso.porcentaje}% de capacidad utilizada</span>
        <span>
          {restantes} {restantes === 1 ? 'vacante libre' : 'vacantes libres'}
        </span>
      </div>
    </div>
  )
}

export default UsoCompacto
