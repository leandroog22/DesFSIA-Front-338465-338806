import { MODALIDADES, SENIORITIES, etiquetaDe } from '../../constants/avisos.constants'

// Chips con categoria, modalidad, seniority y ubicacion.
const AvisoEtiquetas = ({ aviso }) => {
  return (
    <div className="chips">
      {aviso.categoria && (
        <span className="chip chip-categoria">
          <i className="fa-solid fa-layer-group"></i> {aviso.categoria.nombre}
        </span>
      )}
      <span className="chip">
        <i className="fa-solid fa-house-laptop"></i> {etiquetaDe(MODALIDADES, aviso.modalidad)}
      </span>
      <span className="chip">
        <i className="fa-solid fa-signal"></i> {etiquetaDe(SENIORITIES, aviso.seniority)}
      </span>
      {aviso.ubicacion && (
        <span className="chip">
          <i className="fa-solid fa-location-dot"></i> {aviso.ubicacion}
        </span>
      )}
    </div>
  )
}

export default AvisoEtiquetas
