import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { etiquetaDe } from '../../constants/avisos.constants'
import Icono from '../comunes/Icono'

// Chart.js solo incluye lo que se registra. Se hace una vez, al cargar el
// modulo, y no en cada render del componente.
ChartJS.register(ArcElement, Tooltip)

// Grafico de dona (requerimiento 7) para una agrupacion de las estadisticas:
// por seniority o por modalidad. En el centro muestra el valor con mas avisos.
// "opciones" traduce los valores de la base ("semi") a texto ("Semi Senior")
// y define el color de cada uno.
const DonaEstadistica = ({ titulo, icono, filas, opciones }) => {
  const total = filas.reduce((suma, fila) => suma + fila.cantidad, 0)

  // Se recorre "opciones" y no "filas" para que el orden y los colores sean
  // siempre los mismos, aunque algun valor no tenga avisos.
  const items = opciones
    .map((opcion) => {
      const cantidad = filas.find((fila) => fila.valor === opcion.valor)?.cantidad ?? 0
      return {
        ...opcion,
        cantidad,
        porcentaje: total ? Math.round((cantidad / total) * 100) : 0,
      }
    })
    .filter((item) => item.cantidad > 0)

  const principal = [...items].sort((a, b) => b.cantidad - a.cantidad)[0]

  const data = {
    labels: items.map((item) => item.etiqueta),
    datasets: [
      {
        data: items.map((item) => item.cantidad),
        backgroundColor: items.map((item) => item.color),
        borderWidth: 0,
        spacing: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (contexto) => ` ${contexto.parsed} ${contexto.parsed === 1 ? 'aviso' : 'avisos'}`,
        },
      },
    },
  }

  return (
    <section className="tarjeta">
      <div className="tarjeta-encabezado">
        <h3>{titulo}</h3>
        <Icono nombre={icono} className="texto-suave" />
      </div>

      {total === 0 ? (
        <p className="texto-suave">Sin datos todavía.</p>
      ) : (
        <div className="dona">
          <div className="dona-grafico">
            <Doughnut data={data} options={options} />
            <div className="dona-centro">
              <strong>{principal.porcentaje}%</strong>
              <small>{etiquetaDe(opciones, principal.valor)}</small>
            </div>
          </div>

          <ul className="leyenda">
            {items.map((item) => (
              <li key={item.valor}>
                <span className="leyenda-color" style={{ background: item.color }}></span>
                <span>{item.etiqueta}</span>
                <span>{item.porcentaje}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default DonaEstadistica
