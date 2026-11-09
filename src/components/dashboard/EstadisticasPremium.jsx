import { useSelector } from 'react-redux'
import Icono from '../comunes/Icono'

const cantidadDe = (filas, valor) => filas.find((fila) => fila.valor === valor)?.cantidad ?? 0

// Numeros rapidos de la tarjeta Premium, sacados de GET /avisos/estadisticas.
const EstadisticasPremium = () => {
  const estadisticas = useSelector((state) => state.estadisticas.datos)

  if (!estadisticas) return <div className="premium-stats tarjeta-cargando"></div>

  const datos = [
    { icono: 'work', valor: cantidadDe(estadisticas.porEstado, 'activo'), titulo: 'Avisos activos' },
    { icono: 'task_alt', valor: cantidadDe(estadisticas.porEstado, 'cerrado'), titulo: 'Avisos cerrados' },
    { icono: 'category', valor: estadisticas.porCategoria.length, titulo: 'Áreas con avisos' },
  ]

  return (
    <div className="premium-stats">
      {datos.map((dato) => (
        <div key={dato.titulo} className="premium-stat">
          <Icono nombre={dato.icono} />
          <div>
            <strong>{dato.valor}</strong>
            <small>{dato.titulo}</small>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EstadisticasPremium
