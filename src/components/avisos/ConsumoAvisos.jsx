import { useSelector } from 'react-redux'
import BotonPasarPremium from '../dashboard/BotonPasarPremium'

// Uso del plan en la columna lateral del detalle. Solo tiene sentido para
// Plus, que es el plan con limite.
const ConsumoAvisos = () => {
  const uso = useSelector((state) => state.uso.datos)

  if (!uso || uso.ilimitado) return null

  return (
    <section className="tarjeta">
      <div className="consumo-titulo">
        <h3>Consumo de avisos</h3>
        <span>
          {uso.usados} de {uso.limite} avisos activos
        </span>
      </div>
      <div className={`barra ${uso.porcentaje >= 100 ? 'barra-llena' : uso.porcentaje >= 75 ? 'barra-alta' : ''}`}>
        <div style={{ width: `${Math.min(uso.porcentaje, 100)}%` }}></div>
      </div>
      <div style={{ marginTop: 18 }}>
        <BotonPasarPremium variante="btn-tonal" icono="star" bloque />
      </div>
    </section>
  )
}

export default ConsumoAvisos
