import Icono from './Icono'

const PlanBadge = ({ plan, prefijo = false }) => {
  if (!plan) return null

  const esPremium = plan === 'premium'

  return (
    <span className={`pill ${esPremium ? 'pill-premium' : 'pill-plus'}`}>
      {esPremium && <Icono nombre="workspace_premium" relleno />}
      {prefijo ? 'Plan ' : ''}
      {esPremium ? 'Premium' : 'Plus'}
    </span>
  )
}

export default PlanBadge
