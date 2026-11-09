import { useSelector } from 'react-redux'
import { MODALIDADES, SENIORITIES } from '../../constants/avisos.constants'
import DistribucionCategorias from './DistribucionCategorias'
import DonaEstadistica from './DonaEstadistica'

// Colores de cada valor, tomados de la paleta del diseño.
const COLORES_SENIORITY = { senior: '#3730a3', semi: '#6366f1', junior: '#f59e0b' }
const COLORES_MODALIDAD = { remoto: '#004d33', hibrido: '#3730a3', presencial: '#c8c4d5' }

const conColores = (opciones, colores) => opciones.map((opcion) => ({ ...opcion, color: colores[opcion.valor] }))

// Graficos del panel (requerimiento 7), alimentados por GET /avisos/estadisticas.
const Graficos = () => {
  const estadisticas = useSelector((state) => state.estadisticas.datos)

  return (
    <div className="graficos-grilla">
      <DistribucionCategorias />
      <div className="graficos-columna">
        {estadisticas ? (
          <>
            <DonaEstadistica
              titulo="Por seniority"
              icono="military_tech"
              filas={estadisticas.porSeniority}
              opciones={conColores(SENIORITIES, COLORES_SENIORITY)}
            />
            <DonaEstadistica
              titulo="Por modalidad"
              icono="public"
              filas={estadisticas.porModalidad}
              opciones={conColores(MODALIDADES, COLORES_MODALIDAD)}
            />
          </>
        ) : (
          <>
            <div className="tarjeta tarjeta-cargando"></div>
            <div className="tarjeta tarjeta-cargando"></div>
          </>
        )}
      </div>
    </div>
  )
}

export default Graficos
