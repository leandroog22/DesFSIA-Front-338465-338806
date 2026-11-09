import { useEffect } from 'react'
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  actualizarUsuario,
  cerrarSesion,
  selectEsAdmin,
  selectEstaLogueado,
} from '../features/auth/auth.slice'
import { setCategorias } from '../features/categorias/categorias.slice'
import { setUso } from '../features/uso/uso.slice'
import { obtenerPerfilService, obtenerUsoService } from '../services/usuarios.services'
import { obtenerCategoriasService } from '../services/categorias.services'
import { mensajeDeError } from '../utils/errores'
import PlanBadge from '../components/comunes/PlanBadge'

const ContainerPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const estaLogueado = useSelector(selectEstaLogueado)
  const esAdmin = useSelector(selectEsAdmin)
  const usuario = useSelector((state) => state.auth.usuario)
  const token = useSelector((state) => state.auth.token)
  const { pathname } = useLocation()

  // En una SPA el navegador no vuelve arriba solo al cambiar de pantalla:
  // sin esto, ir del formulario al detalle deja la vista scrolleada.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Cada vez que hay un token nuevo (login, registro o recarga con sesion
  // guardada) se cargan los datos que usan varias pantallas. El perfil se pide
  // de nuevo porque el plan pudo haber cambiado desde que se guardo la sesion.
  useEffect(() => {
    if (!token) return

    const cargarDatosDeSesion = async () => {
      try {
        const [perfil, categorias, uso] = await Promise.all([
          obtenerPerfilService(),
          obtenerCategoriasService(),
          obtenerUsoService(),
        ])
        dispatch(
          actualizarUsuario({
            username: perfil.username,
            email: perfil.email,
            nombreEmpresa: perfil.nombreEmpresa,
            rol: perfil.rol,
            plan: perfil.plan,
          })
        )
        dispatch(setCategorias(categorias))
        dispatch(setUso(uso))
      } catch (error) {
        // El 401 ya lo resuelve el interceptor de axios cerrando la sesion.
        if (error.response?.status !== 401) toast.error(mensajeDeError(error))
      }
    }

    cargarDatosDeSesion()
  }, [token, dispatch])

  const handleLogout = () => {
    // Los slices escuchan cerrarSesion y vuelven a su estado inicial; el store
    // borra la sesion de localStorage.
    dispatch(cerrarSesion())
    toast.info('Cerraste sesión. ¡Hasta pronto!')
    navigate('/')
  }

  return (
    <div className="app">
      <header className="main-header">
        <div className="header-content">
          <Link to={estaLogueado ? '/dashboard' : '/'} className="app-logo">
            <span className="app-logo-icono">
              <i className="fa-solid fa-briefcase"></i>
            </span>
            <span>Tripalium</span>
          </Link>

          {estaLogueado && (
            <>
              <nav className="main-nav">
                <NavLink to="/dashboard">
                  <i className="fa-solid fa-chart-pie"></i> Panel
                </NavLink>
                <NavLink to="/avisos" end>
                  <i className="fa-solid fa-list-ul"></i> Mis avisos
                </NavLink>
                <NavLink to="/explorar">
                  <i className="fa-solid fa-compass"></i> Explorar
                </NavLink>
                {esAdmin && (
                  <NavLink to="/categorias">
                    <i className="fa-solid fa-tags"></i> Categorías
                  </NavLink>
                )}
              </nav>

              <div className="header-usuario">
                <Link to="/avisos/nuevo" className="btn btn-primario btn-chico ocultar-movil">
                  <i className="fa-solid fa-plus"></i> Publicar
                </Link>
                <div className="usuario-info">
                  <span className="usuario-nombre">{usuario?.nombreEmpresa}</span>
                  {esAdmin ? (
                    <span className="badge badge-admin">Admin</span>
                  ) : (
                    <PlanBadge plan={usuario?.plan} />
                  )}
                </div>
                <button
                  type="button"
                  className="btn-icono"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="main-footer">
        Tripalium · Desarrollo Full Stack integrado con IA · Universidad ORT Uruguay
      </footer>
    </div>
  )
}

export default ContainerPage
