// Con texto: indicador de carga de una pantalla o seccion.
// Sin texto (enLinea): circulito para usar dentro de un boton.
const Spinner = ({ texto = 'Cargando...', enLinea = false }) => {
  if (enLinea) return <span className="spinner" role="status" aria-label="Cargando"></span>

  return (
    <div className="spinner-contenedor" role="status">
      <span className="spinner spinner-grande"></span>
      <span>{texto}</span>
    </div>
  )
}

export default Spinner
