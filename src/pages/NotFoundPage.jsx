import { Link } from 'react-router'

const NotFoundPage = () => {
  return (
    <div className="contenedor">
      <div className="estado-vacio">
        <span className="estado-vacio-icono">
          <i className="fa-solid fa-map-signs"></i>
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
