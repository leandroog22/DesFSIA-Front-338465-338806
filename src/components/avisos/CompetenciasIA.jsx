import Icono from '../comunes/Icono'
import Spinner from '../comunes/Spinner'

// Resultado del analisis de Gemini: resumen y skills ("Tecnologias y
// competencias"). Si la IA no respondio al publicar, lo explica; el reintento
// esta en el banner de arriba de la pagina.
const CompetenciasIA = ({ aviso, puedeReanalizar, onReanalizar, analizando }) => {
  return (
    <section className="detalle-seccion">
      <div className="detalle-seccion-titulo">
        <span className="eyebrow">Tecnologías y competencias</span>
        {aviso.iaProcesado && puedeReanalizar && (
          <button type="button" className="btn btn-fantasma btn-chico" onClick={onReanalizar} disabled={analizando}>
            {analizando ? <Spinner enLinea /> : <Icono nombre="refresh" />} Volver a analizar
          </button>
        )}
      </div>

      {aviso.iaProcesado ? (
        <>
          {aviso.resumen && (
            <div className="resumen-ia">
              <Icono nombre="auto_awesome" relleno />
              <p>{aviso.resumen}</p>
            </div>
          )}
          {aviso.skills.length > 0 ? (
            <div className="tags">
              {aviso.skills.map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="nota-info">
              <Icono nombre="info" /> La IA no encontró skills en la descripción.
            </p>
          )}
        </>
      ) : (
        <p className="nota-info">
          <Icono nombre="info" /> Las skills se generan con el análisis de IA. Reintentá el análisis para obtenerlas.
        </p>
      )}
    </section>
  )
}

export default CompetenciasIA
