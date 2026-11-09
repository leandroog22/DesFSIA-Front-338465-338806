import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { selectHayCupo } from '../../features/uso/uso.slice'
import AvisoForm from '../../components/avisos/AvisoForm'
import UsoCompacto from '../../components/avisos/UsoCompacto'
import LimiteAlcanzado from '../../components/avisos/LimiteAlcanzado'
import Icono from '../../components/comunes/Icono'

// El formulario solo se puede usar si el plan tiene cupo (requerimiento 4).
// Si no, se muestra el banner de limite y el formulario queda bloqueado de
// fondo. Al pasar a Premium, selectHayCupo cambia a true y el formulario se
// habilita sin recargar.
const NuevoAvisoPage = () => {
  const hayCupo = useSelector(selectHayCupo)
  const plan = useSelector((state) => state.uso.datos?.plan)

  if (!hayCupo) {
    return (
      <div className="contenedor">
        <div className="pagina-encabezado">
          <div>
            <nav className="migas">
              <Link to="/avisos">
                <Icono nombre="arrow_back" /> Mis avisos
              </Link>
              / <strong>Crear vacante</strong>
            </nav>
            <h1>Nuevo aviso de empleo</h1>
            <p className="texto-suave">Completá los datos técnicos para publicar la vacante en la plataforma.</p>
          </div>
          <div className="suscripcion-chip">
            <Icono nombre="workspace_premium" />
            <div>
              <span className="eyebrow">Tu suscripción</span>
              <strong>Plan {plan === 'premium' ? 'Premium' : 'Plus'}</strong>
            </div>
          </div>
        </div>

        <LimiteAlcanzado />

        <div className="formulario-bloqueado">
          <div className="formulario-bloqueado-aviso">
            <Icono nombre="lock" />
            <div>
              <h3>Formulario bloqueado temporalmente</h3>
              <p>Límite de publicaciones alcanzado para la suscripción actual.</p>
            </div>
            <Link to="/dashboard" className="btn btn-primario btn-chico">
              Ver planes
            </Link>
          </div>
          <AvisoForm bloqueado />
        </div>
      </div>
    )
  }

  return (
    <div className="contenedor contenedor-medio">
      <div className="pagina-encabezado">
        <div>
          <h1>Nuevo aviso de empleo</h1>
          <p className="texto-suave">Completá los datos técnicos para publicar la vacante en la plataforma.</p>
        </div>
        <Link to="/avisos" className="link-volver">
          <Icono nombre="arrow_back" /> Volver a mis avisos
        </Link>
      </div>

      <UsoCompacto />
      <AvisoForm />
    </div>
  )
}

export default NuevoAvisoPage
