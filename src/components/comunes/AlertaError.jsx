// Error que devuelve la API, mostrado dentro del formulario (la letra pide que
// el mensaje aparezca en la propia interfaz, no solo en un toast).
const AlertaError = ({ mensaje }) => {
  if (!mensaje) return null

  return (
    <div className="alerta alerta-error" role="alert">
      <i className="fa-solid fa-circle-exclamation"></i>
      <span>{mensaje}</span>
    </div>
  )
}

export default AlertaError
