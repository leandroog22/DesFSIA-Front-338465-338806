import Icono from '../comunes/Icono'
import CampoError from '../comunes/CampoError'

// Campo de los formularios de login y registro: etiqueta, icono a la
// izquierda, estado (valido / invalido) y mensaje de error. El input en si
// llega como children, ya conectado a react-hook-form con register().
const CampoAuth = ({ id, etiqueta, icono, error, valido = false, ayuda, children }) => {
  const estado = error ? 'campo-invalido' : valido ? 'campo-valido' : ''

  return (
    <div className={`form-group ${estado}`}>
      <label htmlFor={id}>
        <span>{etiqueta}</span>
        {valido && !error ? (
          <span className="ayuda-valido">
            <Icono nombre="check_circle" relleno /> Válido
          </span>
        ) : (
          ayuda && <span className="ayuda">{ayuda}</span>
        )}
      </label>
      <div className="input-con-icono">
        <Icono nombre={icono} />
        {children}
        {error && <Icono nombre="error" relleno className="icono-estado icono-estado-invalido" />}
      </div>
      <CampoError error={error} />
    </div>
  )
}

export default CampoAuth
