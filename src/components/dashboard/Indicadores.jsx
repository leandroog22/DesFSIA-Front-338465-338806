import { useSelector } from 'react-redux'

const cantidadDe = (filas, valor) => filas.find((fila) => fila.valor === valor)?.cantidad ?? 0

// Tres numeros rapidos arriba del panel, sacados de las estadisticas.
const Indicadores = () => {
  const estadisticas = useSelector((state) => state.estadisticas.datos)

  if (!estadisticas) return null

  const indicadores = [
    { titulo: 'Avisos publicados', valor: estadisticas.total, icono: 'fa-file-lines' },
    { titulo: 'Activos', valor: cantidadDe(estadisticas.porEstado, 'activo'), icono: 'fa-circle-check' },
    { titulo: 'Cerrados', valor: cantidadDe(estadisticas.porEstado, 'cerrado'), icono: 'fa-box-archive' },
    { titulo: 'Áreas', valor: estadisticas.porCategoria.length, icono: 'fa-layer-group' },
  ]

  return (
    <div className="indicadores">
      {indicadores.map((indicador) => (
        <div key={indicador.titulo} className="indicador">
          <span className="indicador-icono">
            <i className={`fa-solid ${indicador.icono}`}></i>
          </span>
          <div>
            <p className="indicador-valor">{indicador.valor}</p>
            <p className="indicador-titulo">{indicador.titulo}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Indicadores
