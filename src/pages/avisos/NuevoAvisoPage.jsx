import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { selectHayCupo } from '../../features/uso/uso.slice'
import AvisoForm from '../../components/avisos/AvisoForm'
import UsoPlan from '../../components/dashboard/UsoPlan'
import CambioPlan from '../../components/dashboard/CambioPlan'

// El formulario solo aparece si el plan tiene cupo (requerimiento 4). Si no,
// se muestra el uso y la opcion de pasar a Premium; al cambiar de plan,
// selectHayCupo pasa a true y el formulario aparece sin recargar.
const NuevoAvisoPage = () => {
  const hayCupo = useSelector(selectHayCupo)

  return (
    <div className="contenedor contenedor-angosto">
      <div className="pagina-encabezado">
        <div>
          <Link to="/avisos" className="link-volver">
            <i className="fa-solid fa-arrow-left"></i> Mis avisos
          </Link>
          <h1>Publicar un aviso</h1>
        </div>
      </div>

      {hayCupo ? (
        <AvisoForm />
      ) : (
        <>
          <div className="alerta alerta-advertencia">
            <i className="fa-solid fa-lock"></i>
            <span>
              Llegaste al máximo de avisos activos de tu plan. Cerrá alguno en{' '}
              <Link to="/avisos">Mis avisos</Link> o pasate a Premium para seguir publicando.
            </span>
          </div>
          <div className="grilla-2">
            <UsoPlan />
            <CambioPlan />
          </div>
        </>
      )}
    </div>
  )
}

export default NuevoAvisoPage
