import { useEffect, useLayoutEffect } from 'react'
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
import useCambioTema from '../hooks/useCambioTema'
import { obtenerPerfilService, obtenerUsoService } from '../services/usuarios.services'
import { obtenerCategoriasService } from '../services/categorias.services'
import { mensajeDeError } from '../utils/errores'
import PlanBadge from '../components/comunes/PlanBadge'
import Icono from '../components/comunes/Icono'

const ContainerPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const estaLogueado = useSelector(selectEstaLogueado)
  const esAdmin = useSelector(selectEsAdmin)
  const usuario = useSelector((state) => state.auth.usuario)
  const token = useSelector((state) => state.auth.token)
  const modoTema = useSelector((state) => state.tema.modo)
  const esOscuro = modoTema === 'oscuro'
  const cambiarTema = useCambioTema()
  const { pathname } = useLocation()

  // El tema se aplica como atributo en <html>: index.css redefine las
  // variables de color bajo [data-tema='oscuro'] y el resto de los estilos
  // no cambia. El <html> esta fuera de React, por eso se hace en un efecto.
  // Es useLayoutEffect (corre antes de que el navegador pinte) para que al
  // cargar no se vea un parpadeo del tema claro, y para que la transicion
  // de useCambioTema encuentre el tema nuevo ya aplicado.
  useLayoutEffect(() => {
    document.documentElement.dataset.tema = modoTema
  }, [modoTema])

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
          <Link to={estaLogueado ? '/dashboard' : '/'} className="marca">
            <img src="/logo-isotipo.png" alt="" />
            <span>TRIPALIUM</span>
          </Link>

          {estaLogueado && (
            <>
              <nav className="main-nav">
                <NavLink to="/dashboard">Inicio</NavLink>
                <NavLink to="/avisos" end>
                  Mis avisos
                </NavLink>
                <NavLink to="/explorar">Explorar</NavLink>
                {esAdmin && <NavLink to="/categorias">Categorías</NavLink>}
              </nav>

              <div className="header-usuario">
                <Link to="/avisos/nuevo" className="btn btn-primario ocultar-movil">
                  <Icono nombre="add" /> Nuevo aviso
                </Link>
                {esAdmin ? (
                  <span className="pill pill-admin">Admin</span>
                ) : (
                  <PlanBadge plan={usuario?.plan} prefijo={usuario?.plan === 'plus'} />
                )}
                <span className="usuario-chip">
                  <span className="avatar">
                    <Icono nombre="person" />
                  </span>
                  <span>{usuario?.nombreEmpresa}</span>
                </span>
                <span className="separador-vertical ocultar-movil"></span>
                <button type="button" className="boton-salir" onClick={handleLogout} title="Cerrar sesión">
                  <Icono nombre="logout" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            className="boton-tema"
            onClick={cambiarTema}
            title={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <Icono nombre={esOscuro ? 'light_mode' : 'dark_mode'} />
          </button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <span>© 2026 Tripalium Job Board. Infraestructura de talento tecnológico.</span>
          <span>Desarrollo Full Stack integrado con IA · Universidad ORT Uruguay</span>
        </div>
      </footer>
    </div>
  )
}

export default ContainerPage
