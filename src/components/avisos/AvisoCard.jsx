import { Link } from 'react-router'
import { formatearFechaRelativa, formatearSalario } from '../../utils/formato'
import AvisoLogo from './AvisoLogo'
import AvisoEtiquetas from './AvisoEtiquetas'

const SKILLS_VISIBLES = 4

// Tarjeta de un aviso en la bolsa de trabajo publica (Explorar).
const AvisoCard = ({ aviso }) => {
  const skillsRestantes = aviso.skills.length - SKILLS_VISIBLES

  return (
    <Link to={`/avisos/${aviso._id}`} className="aviso-card">
      <div className="aviso-card-encabezado">
        <AvisoLogo aviso={aviso} />
        <div>
          <h3>{aviso.titulo}</h3>
          <p className="texto-suave texto-chico">{aviso.autor?.nombreEmpresa}</p>
        </div>
      </div>

      <AvisoEtiquetas aviso={aviso} />

      {aviso.skills.length > 0 && (
        <div className="chips">
          {aviso.skills.slice(0, SKILLS_VISIBLES).map((skill) => (
            <span key={skill} className="chip chip-skill">
              {skill}
            </span>
          ))}
          {skillsRestantes > 0 && <span className="chip chip-skill">+{skillsRestantes}</span>}
        </div>
      )}

      <div className="aviso-card-pie">
        <span>{formatearSalario(aviso)}</span>
        <span className="texto-suave">{formatearFechaRelativa(aviso.createdAt)}</span>
      </div>
    </Link>
  )
}

export default AvisoCard
