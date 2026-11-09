import { useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ESTADOS, MODALIDADES, SENIORITIES, etiquetaDe } from '../../constants/avisos.constants'

// Chart.js solo incluye lo que se registra. Se hace una vez, al cargar el
// modulo, y no en cada render del componente.
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// Cada vista del grafico toma una de las agrupaciones que devuelve
// GET /avisos/estadisticas. "etiquetas" traduce los valores crudos de la base.
const VISTAS = [
  { clave: 'porCategoria', titulo: 'Categoría', etiquetas: null },
  { clave: 'porSeniority', titulo: 'Seniority', etiquetas: SENIORITIES },
  { clave: 'porModalidad', titulo: 'Modalidad', etiquetas: MODALIDADES },
  { clave: 'porEstado', titulo: 'Estado', etiquetas: ESTADOS },
]

const COLORES = ['#5b5bd6', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444']

const EstadisticasChart = () => {
  const estadisticas = useSelector((state) => state.estadisticas.datos)
  const [vistaActual, setVistaActual] = useState(VISTAS[0])

  if (!estadisticas) {
    return <div className="tarjeta tarjeta-cargando tarjeta-alta" aria-busy="true"></div>
  }

  if (estadisticas.total === 0) {
    return (
      <div className="tarjeta">
        <h3>Tus avisos en números</h3>
        <div className="estado-vacio estado-vacio-chico">
          <p className="texto-suave">Cuando publiques tu primer aviso vas a ver acá cómo se reparten.</p>
          <Link to="/avisos/nuevo" className="btn btn-primario btn-chico">
            Publicar aviso
          </Link>
        </div>
      </div>
    )
  }

  const filas = estadisticas[vistaActual.clave]
  const labels = filas.map((fila) =>
    vistaActual.etiquetas ? etiquetaDe(vistaActual.etiquetas, fila.valor) : fila.valor
  )

  const data = {
    labels,
    datasets: [
      {
        label: 'Avisos',
        data: filas.map((fila) => fila.cantidad),
        backgroundColor: filas.map((_, i) => COLORES[i % COLORES.length]),
        borderRadius: 8,
        maxBarThickness: 56,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (contexto) => `${contexto.parsed.y} ${contexto.parsed.y === 1 ? 'aviso' : 'avisos'}`,
        },
      },
    },
    scales: {
      // Son cantidades: sin decimales en el eje.
      y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#eceef5' } },
      x: { grid: { display: false } },
    },
  }

  return (
    <div className="tarjeta">
      <div className="tarjeta-encabezado">
        <h3>Tus avisos por {vistaActual.titulo.toLowerCase()}</h3>
        <div className="segmentado" role="tablist">
          {VISTAS.map((vista) => (
            <button
              key={vista.clave}
              type="button"
              role="tab"
              aria-selected={vista.clave === vistaActual.clave}
              className={vista.clave === vistaActual.clave ? 'activo' : ''}
              onClick={() => setVistaActual(vista)}
            >
              {vista.titulo}
            </button>
          ))}
        </div>
      </div>
      <div className="grafico">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default EstadisticasChart
