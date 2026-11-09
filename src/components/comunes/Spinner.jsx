const Spinner = ({ texto = 'Cargando...' }) => {
  return (
    <div className="spinner-contenedor" role="status">
      <i className="fa-solid fa-circle-notch fa-spin"></i>
      <span>{texto}</span>
    </div>
  )
}

export default Spinner
