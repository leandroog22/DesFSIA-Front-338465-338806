import { MODALIDADES, SENIORITIES, etiquetaDe } from '../../constants/avisos.constants'
import Icono from '../comunes/Icono'

// Linea de datos del aviso: categoria, modalidad, seniority y ubicacion.
const AvisoEtiquetas = ({ aviso }) => {
  return (
    <div className="meta">
      {aviso.categoria && (
        <span>
          <Icono nombre="category" /> {aviso.categoria.nombre}
        </span>
      )}
      <span>
        <Icono nombre={aviso.modalidad === 'remoto' ? 'public' : 'home_work'} /> {etiquetaDe(MODALIDADES, aviso.modalidad)}
      </span>
      <span>
        <Icono nombre="signal_cellular_alt" /> {etiquetaDe(SENIORITIES, aviso.seniority)}
      </span>
      {aviso.ubicacion && (
        <span>
          <Icono nombre="location_on" /> {aviso.ubicacion}
        </span>
      )}
    </div>
  )
}

export default AvisoEtiquetas
