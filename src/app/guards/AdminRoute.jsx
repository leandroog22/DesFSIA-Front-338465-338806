import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { selectEsAdmin } from '../../features/auth/auth.slice'

// Va anidado dentro de ProtectedRoute, asi que aca ya se sabe que hay sesion.
// Ocultar la pantalla es comodidad de UI: la proteccion real es el
// authorizeMiddleware('admin') del backend.
const AdminRoute = () => {
  const esAdmin = useSelector(selectEsAdmin)

  if (!esAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute
