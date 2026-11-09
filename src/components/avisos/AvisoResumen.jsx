import { Link } from 'react-router'
import { MODALIDADES, etiquetaDe } from '../../constants/avisos.constants'
import { formatearFechaRelativa, formatearSalario } from '../../utils/formato'
import Icono from '../comunes/Icono'
import EstadoPill from './EstadoPill'

const SKILLS_VISIBLES = 5

// Aviso en formato "tarjeta ancha" para el panel: estado, titulo, datos
// principales y las skills que detecto la IA.
const AvisoResumen = ({ aviso }) => {
  const modalidad = etiquetaDe(MODALIDADES, aviso.modalidad)

  return (
    <article className="aviso-item aviso-item-detallado">
      <div className="aviso-item-cuerpo">
        <div className="meta">
          <EstadoPill estado={aviso.estado} />
          <span>
            <Icono nombre="schedule" /> Publicado {formatearFechaRelativa(aviso.createdAt)}
          </span>
        </div>
        <div className="aviso-item-titulo">
          <Link to={`/avisos/${aviso._id}`}>{aviso.titulo}</Link>
        </div>
        <div className="meta">
          <span>
            <Icono nombre={aviso.modalidad === 'remoto' ? 'public' : 'location_on'} />
            {aviso.ubicacion ? `${modalidad} (${aviso.ubicacion})` : modalidad}
          </span>
          {aviso.categoria && (
            <span>
              <Icono nombre="category" /> {aviso.categoria.nombre}
            </span>
          )}
          <span>{formatearSalario(aviso)}</span>
        </div>
        {aviso.skills.length > 0 && (
          <div className="tags">
            {aviso.skills.slice(0, SKILLS_VISIBLES).map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="aviso-item-acciones">
        <Link to={`/avisos/${aviso._id}`} className="btn btn-primario">
          Ver detalle
        </Link>
        <Link to="/avisos" className="btn-icono" title="Gestionar en Mis avisos" aria-label="Gestionar en Mis avisos">
          <Icono nombre="edit" />
        </Link>
      </div>
    </article>
  )
}

export default AvisoResumen
