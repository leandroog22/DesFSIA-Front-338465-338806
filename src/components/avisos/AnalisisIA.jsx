import { useState } from 'react'
import { toast } from 'react-toastify'
import { reintentarAnalisisService } from '../../services/avisos.services'
import { mensajeDeError } from '../../utils/errores'

// Resultado del analisis de Gemini: resumen y skills. Si la IA no respondio
// al publicar (iaProcesado: false), el autor puede reintentar.
const AnalisisIA = ({ aviso, puedeReintentar, onAnalizado }) => {
  const [analizando, setAnalizando] = useState(false)

  const reintentar = async () => {
    setAnalizando(true)
    try {
      const actualizado = await reintentarAnalisisService(aviso._id)
      if (actualizado.iaProcesado) {
        toast.success('Análisis completado')
      } else {
        toast.warning('La IA sigue sin responder. Probá de nuevo en un rato.')
      }
      onAnalizado(actualizado)
    } catch (error) {
      toast.error(mensajeDeError(error))
    } finally {
      setAnalizando(false)
    }
  }

  return (
    <div className="tarjeta analisis-ia">
      <div className="tarjeta-encabezado">
        <h3>
          <i className="fa-solid fa-wand-magic-sparkles"></i> Análisis con IA
        </h3>
        {aviso.iaProcesado && <span className="badge badge-activo">Procesado</span>}
      </div>

      {aviso.iaProcesado ? (
        <>
          {aviso.resumen && <p className="analisis-resumen">{aviso.resumen}</p>}
          <p className="etiqueta-seccion">Skills detectadas</p>
          {aviso.skills.length > 0 ? (
            <div className="chips">
              {aviso.skills.map((skill) => (
                <span key={skill} className="chip chip-skill">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="texto-suave texto-chico">La IA no encontró skills en la descripción.</p>
          )}
        </>
      ) : (
        <p className="texto-suave">
          El servicio de IA no respondió cuando se publicó el aviso. El aviso está publicado igual, solo
          falta el análisis.
        </p>
      )}

      {puedeReintentar && (
        <button type="button" className="btn btn-secundario btn-chico" onClick={reintentar} disabled={analizando}>
          {analizando ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i> Analizando...
            </>
          ) : (
            <>
              <i className="fa-solid fa-rotate"></i> {aviso.iaProcesado ? 'Volver a analizar' : 'Reintentar análisis'}
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default AnalisisIA
