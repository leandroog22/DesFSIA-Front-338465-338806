import { useSelector } from 'react-redux'
import PlanBadge from '../comunes/PlanBadge'

// Informe de uso (requerimiento 6.1.1): porcentaje de avisos usados para
// plan Plus y cantidad a secas para Premium.
const UsoPlan = () => {
  const uso = useSelector((state) => state.uso.datos)

  if (!uso) {
    return <div className="tarjeta-cargando" aria-busy="true"></div>
  }

  if (uso.ilimitado) {
    return (
      <div className="uso-plan">
        <PlanBadge plan="premium" prefijo />
        <h2>
          {uso.usados} {uso.usados === 1 ? 'aviso activo' : 'avisos activos'} · Ilimitados
        </h2>
        <p className="texto-suave">
          Tu cuenta tiene publicación de vacantes ilimitada: no hace falta cerrar avisos para publicar nuevos.
        </p>
      </div>
    )
  }

  const restantes = Math.max(uso.limite - uso.usados, 0)
  // El color de la barra avisa cuando el cupo se esta por agotar.
  const claseBarra = uso.porcentaje >= 100 ? 'barra-llena' : uso.porcentaje >= 75 ? 'barra-alta' : ''

  return (
    <div className="uso-plan">
      <span className="eyebrow">Uso del plan Plus</span>
      <h2>
        Usaste {uso.usados} de {uso.limite} avisos activos
      </h2>
      <div
        className={`barra ${claseBarra}`}
        role="progressbar"
        aria-valuenow={uso.porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ width: `${Math.min(uso.porcentaje, 100)}%` }}></div>
      </div>
      <div className="uso-plan-cifras">
        <span>{uso.porcentaje}% de capacidad utilizada</span>
        <strong className={restantes === 0 ? 'texto-peligro' : ''}>
          {restantes === 0 ? 'Sin cupo disponible' : `${restantes} ${restantes === 1 ? 'lugar libre' : 'lugares libres'}`}
        </strong>
      </div>
    </div>
  )
}

export default UsoPlan
