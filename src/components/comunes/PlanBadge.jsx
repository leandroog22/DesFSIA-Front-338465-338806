const PlanBadge = ({ plan }) => {
  if (!plan) return null

  const esPremium = plan === 'premium'

  return (
    <span className={`badge ${esPremium ? 'badge-premium' : 'badge-plus'}`}>
      {esPremium && <i className="fa-solid fa-crown"></i>} {esPremium ? 'Premium' : 'Plus'}
    </span>
  )
}

export default PlanBadge
