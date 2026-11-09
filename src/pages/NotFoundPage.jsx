import { Link } from 'react-router'
import Icono from '../components/comunes/Icono'

const NotFoundPage = () => {
  return (
    <div className="contenedor">
      <div className="estado-vacio">
        <span className="estado-vacio-icono">
          <Icono nombre="explore_off" />
        </span>
        <h2>Esta página no existe</h2>
        <p className="texto-suave">Puede que el enlace esté mal escrito o que el aviso se haya eliminado.</p>
        <Link to="/" className="btn btn-primario">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
