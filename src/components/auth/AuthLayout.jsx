// Estructura compartida por login y registro: panel de marca a la izquierda y
// el formulario a la derecha.
const AuthLayout = ({ titulo, subtitulo, children }) => {
  return (
    <div className="auth-pantalla">
      <section className="auth-marca">
        <div className="auth-marca-contenido">
          <span className="auth-marca-logo">
            <i className="fa-solid fa-briefcase"></i>
          </span>
          <h2>Contratá talento tech sin vueltas.</h2>
          <p>
            Publicá tus avisos, dejá que la IA extraiga las skills y seguí todo desde un solo
            panel.
          </p>
          <ul className="auth-beneficios">
            <li>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Skills y resumen generados con IA
            </li>
            <li>
              <i className="fa-solid fa-chart-column"></i> Estadísticas de tus búsquedas
            </li>
            <li>
              <i className="fa-solid fa-crown"></i> Avisos ilimitados con Premium
            </li>
          </ul>
        </div>
      </section>

      <section className="auth-formulario">
        <div className="auth-tarjeta">
          <h1>{titulo}</h1>
          <p className="texto-suave">{subtitulo}</p>
          {children}
        </div>
      </section>
    </div>
  )
}

export default AuthLayout
