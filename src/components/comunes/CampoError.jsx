// Mensaje de error debajo de un campo de formulario. Recibe el objeto de error
// que arma react-hook-form (errors.campo) y no muestra nada si no hay error.
const CampoError = ({ error }) => {
  if (!error) return null

  return (
    <span className="campo-error" role="alert">
      {error.message}
    </span>
  )
}

export default CampoError
