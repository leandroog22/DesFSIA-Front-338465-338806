import { useEffect } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import useRefrescarResumen from '../../hooks/useRefrescarResumen'
import PlanResumen from '../../components/dashboard/PlanResumen'
import Graficos from '../../components/dashboard/Graficos'
import UltimosAvisos from '../../components/dashboard/UltimosAvisos'
import Icono from '../../components/comunes/Icono'

const DashboardPage = () => {
  const usuario = useSelector((state) => state.auth.usuario)
  const esPremium = useSelector((state) => state.uso.datos?.ilimitado)
  const refrescarResumen = useRefrescarResumen()

  // Al entrar al panel se piden datos frescos de uso y estadisticas.
  useEffect(() => {
    refrescarResumen()
  }, [refrescarResumen])

  return (
    <div className="contenedor">
      <div className={`panel-hero ${esPremium ? 'panel-hero-premium' : ''}`}>
        <div className="pagina-encabezado">
          <div>
            <span className="eyebrow">Consola corporativa</span>
            <h1>Hola, {usuario?.nombreEmpresa}</h1>
            <p className="texto-suave">
              Gestioná tus búsquedas de talento técnico y revisá el rendimiento de tus publicaciones activas.
            </p>
          </div>
          {esPremium ? (
            <Link to="/avisos/nuevo" className="btn btn-primario">
              <Icono nombre="add" /> Publicar nuevo aviso
            </Link>
          ) : (
            <Link to="/avisos" className="btn btn-tonal">
              <Icono nombre="list_alt" /> Gestionar avisos
            </Link>
          )}
        </div>
      </div>

      <PlanResumen />
      <Graficos />
      <UltimosAvisos />
    </div>
  )
}

export default DashboardPage
