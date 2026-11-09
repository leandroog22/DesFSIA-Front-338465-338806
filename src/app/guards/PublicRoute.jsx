import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { selectEstaLogueado } from '../../features/auth/auth.slice'

// Login y registro no tienen sentido con una sesion abierta: se va al panel.
const PublicRoute = () => {
  const estaLogueado = useSelector(selectEstaLogueado)

  if (estaLogueado) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default PublicRoute
