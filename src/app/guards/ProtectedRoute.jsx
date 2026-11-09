import { Outlet, Navigate, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { selectEstaLogueado } from '../../features/auth/auth.slice'

// A diferencia del ejemplo de clase, que leia localStorage, aca se lee Redux:
// como useSelector se suscribe al store, cuando la sesion se cierra (logout o
// token vencido) el guard se vuelve a renderizar y redirige solo.
const ProtectedRoute = () => {
  const estaLogueado = useSelector(selectEstaLogueado)
  const location = useLocation()

  if (!estaLogueado) {
    // Se guarda a donde queria ir, para volver ahi despues del login.
    return <Navigate to="/" replace state={{ desde: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
