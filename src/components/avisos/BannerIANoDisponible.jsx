import Icono from '../comunes/Icono'
import Spinner from '../comunes/Spinner'

// Degradacion controlada del backend: si Gemini no respondio al publicar, el
// aviso se creo igual con iaProcesado = false. Este banner lo cuenta y deja
// reintentar el analisis (POST /avisos/:id/analisis).
const BannerIANoDisponible = ({ puedeReintentar, onReintentar, analizando }) => {
  return (
    <section className="banner-ambar banner-ambar-compacto" role="status">
      <span className="banner-ambar-icono banner-ambar-icono-suave">
        <Icono nombre="auto_awesome" />
      </span>
      <div className="banner-ambar-cuerpo">
        <div className="banner-ambar-etiqueta">
          <span className="pill pill-limite">Análisis IA no disponible</span>
        </div>
        <h2 style={{ marginBottom: 0 }}>No pudimos analizar el aviso automáticamente. Se publicó igual.</h2>
      </div>
      {puedeReintentar && (
        <button type="button" className="btn btn-oscuro" onClick={onReintentar} disabled={analizando}>
          {analizando ? <Spinner enLinea /> : <Icono nombre="sync" />} Reintentar análisis
        </button>
      )}
    </section>
  )
}

export default BannerIANoDisponible
