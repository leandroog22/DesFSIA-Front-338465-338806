import { useEffect } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import useRefrescarResumen from '../../hooks/useRefrescarResumen'
import Indicadores from '../../components/dashboard/Indicadores'
import UsoPlan from '../../components/dashboard/UsoPlan'
import CambioPlan from '../../components/dashboard/CambioPlan'
import EstadisticasChart from '../../components/dashboard/EstadisticasChart'

const saludo = () => {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buen día'
  if (hora < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

const DashboardPage = () => {
  const usuario = useSelector((state) => state.auth.usuario)
  const refrescarResumen = useRefrescarResumen()

  // Al entrar al panel se piden datos frescos de uso y estadisticas.
  useEffect(() => {
    refrescarResumen()
  }, [refrescarResumen])

  return (
    <div className="contenedor">
      <div className="pagina-encabezado">
        <div>
          <h1>
            {saludo()}, {usuario?.nombreEmpresa}
          </h1>
          <p className="texto-suave">Así vienen tus búsquedas en Tripalium.</p>
        </div>
        <Link to="/avisos/nuevo" className="btn btn-primario">
          <i className="fa-solid fa-plus"></i> Publicar aviso
        </Link>
      </div>

      <Indicadores />

      <div className="panel-grilla">
        <div className="panel-principal">
          <EstadisticasChart />
        </div>
        <aside className="panel-lateral">
          <UsoPlan />
          <CambioPlan />
        </aside>
      </div>
    </div>
  )
}

export default DashboardPage
