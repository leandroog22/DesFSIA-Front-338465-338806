import Icono from './Icono'

// Error que devuelve la API, mostrado dentro del formulario (la letra pide que
// el mensaje aparezca en la propia interfaz, no solo en un toast).
const AlertaError = ({ mensaje, titulo }) => {
  if (!mensaje) return null

  return (
    <div className="alerta alerta-error" role="alert">
      <Icono nombre="error" relleno />
      <div>
        {titulo && <strong>{titulo}</strong>}
        <span>{mensaje}</span>
      </div>
    </div>
  )
}

export default AlertaError
