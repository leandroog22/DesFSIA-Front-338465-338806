import { useSelector } from 'react-redux'
import { MODALIDADES, SENIORITIES } from '../../constants/avisos.constants'
import DistribucionCategorias from './DistribucionCategorias'
import DonaEstadistica from './DonaEstadistica'
import { selectEsOscuro } from '../../features/tema/tema.slice'

// Colores de cada valor, tomados de la paleta del diseño. Chart.js dibuja en
// un canvas y no lee variables CSS, por eso hay una paleta por tema: en el
// oscuro los tonos son mas claros para que se distingan sobre el fondo navy.
const COLORES = {
  claro: {
    seniority: { senior: '#3730a3', semi: '#6366f1', junior: '#f59e0b' },
    modalidad: { remoto: '#004d33', hibrido: '#3730a3', presencial: '#c8c4d5' },
  },
  oscuro: {
    seniority: { senior: '#6366f1', semi: '#a5b4fc', junior: '#f59e0b' },
    modalidad: { remoto: '#10b981', hibrido: '#6366f1', presencial: '#475569' },
  },
}

const conColores = (opciones, colores) => opciones.map((opcion) => ({ ...opcion, color: colores[opcion.valor] }))

// Graficos del panel (requerimiento 7), alimentados por GET /avisos/estadisticas.
const Graficos = () => {
  const estadisticas = useSelector((state) => state.estadisticas.datos)
  const paleta = useSelector(selectEsOscuro) ? COLORES.oscuro : COLORES.claro

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
              opciones={conColores(SENIORITIES, paleta.seniority)}
            />
            <DonaEstadistica
              titulo="Por modalidad"
              icono="public"
              filas={estadisticas.porModalidad}
              opciones={conColores(MODALIDADES, paleta.modalidad)}
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
