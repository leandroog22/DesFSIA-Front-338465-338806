import { useSelector } from 'react-redux'
import UsoPlan from './UsoPlan'
import CambioPlan from './CambioPlan'
import EstadisticasPremium from './EstadisticasPremium'

// Tarjeta del plan en el panel. Junta dos componentes separados, como pide
// la letra: el informe de uso (UsoPlan) y el cambio de plan (CambioPlan).
// En Premium no hay cambio de plan posible, asi que el lugar lo ocupan los
// numeros de la cuenta.
const PlanResumen = () => {
  const esPremium = useSelector((state) => state.uso.datos?.ilimitado)

  return (
    <section className={`tarjeta plan-tarjeta ${esPremium ? 'plan-tarjeta-premium' : ''}`}>
      <UsoPlan />
      {esPremium ? <EstadisticasPremium /> : <CambioPlan />}
    </section>
  )
}

export default PlanResumen
