import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import PlanBadge from '../comunes/PlanBadge'

// Informe de uso (requerimiento 6.1.1): porcentaje de avisos usados para
// plan Plus y cantidad a secas para Premium.
const UsoPlan = () => {
  const uso = useSelector((state) => state.uso.datos)

  if (!uso) {
    return <div className="tarjeta tarjeta-cargando" aria-busy="true"></div>
  }

  if (uso.ilimitado) {
    return (
      <div className="tarjeta uso-plan">
        <div className="tarjeta-encabezado">
          <h3>Uso del plan</h3>
          <PlanBadge plan={uso.plan} />
        </div>
        <p className="uso-numero">{uso.usados}</p>
        <p className="texto-suave">
          {uso.usados === 1 ? 'aviso activo' : 'avisos activos'} · sin límite de publicaciones
        </p>
      </div>
    )
  }

  // El color de la barra avisa cuando el cupo se esta por agotar.
  const nivel = uso.porcentaje >= 100 ? 'lleno' : uso.porcentaje >= 75 ? 'alto' : 'normal'
  const restantes = Math.max(uso.limite - uso.usados, 0)

  return (
    <div className="tarjeta uso-plan">
      <div className="tarjeta-encabezado">
        <h3>Uso del plan</h3>
        <PlanBadge plan={uso.plan} />
      </div>

      <p className="uso-numero">
        {uso.porcentaje}
        <span>%</span>
      </p>

      <div
        className={`barra-progreso barra-${nivel}`}
        role="progressbar"
        aria-valuenow={uso.porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ width: `${Math.min(uso.porcentaje, 100)}%` }}></div>
      </div>

      <p className="texto-suave">
        {uso.usados} de {uso.limite} avisos activos ·{' '}
        {restantes === 0 ? (
          <strong className="texto-peligro">sin cupo disponible</strong>
        ) : (
          `te ${restantes === 1 ? 'queda 1 lugar' : `quedan ${restantes} lugares`}`
        )}
      </p>

      {restantes === 0 && (
        <p className="texto-chico">
          Cerrá un aviso en <Link to="/avisos">Mis avisos</Link> para liberar cupo, o pasate a
          Premium.
        </p>
      )}
    </div>
  )
}

export default UsoPlan
