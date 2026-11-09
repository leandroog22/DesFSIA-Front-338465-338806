import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

import store from './store/store'
import ContainerPage from './pages/ContainerPage'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import MisAvisosPage from './pages/avisos/MisAvisosPage'
import NuevoAvisoPage from './pages/avisos/NuevoAvisoPage'
import AvisoDetallePage from './pages/avisos/AvisoDetallePage'
import ExplorarPage from './pages/explorar/ExplorarPage'
import CategoriasPage from './pages/categorias/CategoriasPage'
import NotFoundPage from './pages/NotFoundPage'
import PublicRoute from './app/guards/PublicRoute'
import ProtectedRoute from './app/guards/ProtectedRoute'
import AdminRoute from './app/guards/AdminRoute'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ContainerPage />}>
            {/* Solo para quien NO esta logueado */}
            <Route element={<PublicRoute />}>
              <Route index element={<LoginPage />} />
              <Route path="registro" element={<RegisterPage />} />
            </Route>

            {/* Requieren sesion */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="avisos" element={<MisAvisosPage />} />
              <Route path="avisos/nuevo" element={<NuevoAvisoPage />} />
              <Route path="avisos/:id" element={<AvisoDetallePage />} />
              <Route path="explorar" element={<ExplorarPage />} />

              {/* Requieren rol admin */}
              <Route element={<AdminRoute />}>
                <Route path="categorias" element={<CategoriasPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3500} newestOnTop theme="colored" />
    </Provider>
  )
}

export default App
