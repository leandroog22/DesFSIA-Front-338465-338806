import Icono from '../comunes/Icono'

const FEATURES = [
  { icono: 'auto_awesome', titulo: 'Análisis con IA', texto: 'Skills y resumen extraídos de cada aviso.' },
  { icono: 'monitoring', titulo: 'Estadísticas', texto: 'Seguí tus búsquedas por área y seniority.' },
  { icono: 'workspace_premium', titulo: 'Plan Premium', texto: 'Avisos activos ilimitados.' },
  { icono: 'bolt', titulo: 'Publicación ágil', texto: 'Tu vacante online en segundos.' },
]

// Estructura compartida por login y registro: panel de marca a la izquierda
// (se oculta en pantallas chicas) y la tarjeta con el formulario a la derecha.
const AuthLayout = ({ titular, bajada, titulo, subtitulo, etiqueta, registro = false, children }) => {
  return (
    <div className="auth-pantalla">
      <section className="auth-marca">
        <div className="auth-marca-logo">
          <span>
            <img src="/logo-isotipo.png" alt="" />
          </span>
          <div>
            <strong>TRIPALIUM</strong>
            <small>Talent Infrastructure</small>
          </div>
        </div>

        <div>
          <span className="auth-pulso">Acceso corporativo</span>
          <h2>{titular}</h2>
          <p>{bajada}</p>
        </div>

        <div className="auth-features">
          {FEATURES.map((feature) => (
            <div key={feature.titulo} className="auth-feature">
              <Icono nombre={feature.icono} />
              <div>
                <strong>{feature.titulo}</strong>
                <small>{feature.texto}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-formulario">
        <div className={`auth-tarjeta ${registro ? 'auth-tarjeta-registro' : ''}`}>
          <div className="auth-tarjeta-titulo">
            <h1>{titulo}</h1>
            {etiqueta && <span className="pill pill-neutra">{etiqueta}</span>}
          </div>
          <p>{subtitulo}</p>
          {children}
        </div>
      </section>
    </div>
  )
}

export default AuthLayout
