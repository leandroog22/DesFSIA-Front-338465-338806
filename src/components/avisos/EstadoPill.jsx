const EstadoPill = ({ estado }) => {
  const estaActivo = estado === 'activo'

  return <span className={`pill ${estaActivo ? 'pill-activo' : 'pill-cerrado'}`}>{estaActivo ? 'Activo' : 'Cerrado'}</span>
}

export default EstadoPill
