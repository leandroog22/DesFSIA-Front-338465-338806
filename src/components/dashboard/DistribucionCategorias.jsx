import { useSelector } from 'react-redux'

// "Avisos por categoria": una barra por area, proporcional a la que mas
// avisos tiene. Los datos vienen agregados del backend (porCategoria).
const DistribucionCategorias = () => {
  const filas = useSelector((state) => state.estadisticas.datos?.porCategoria)

  if (!filas) return <div className="tarjeta tarjeta-cargando"></div>

  const maximo = Math.max(...filas.map((fila) => fila.cantidad), 1)

  return (
    <section className="tarjeta">
      <span className="eyebrow eyebrow-primario">Demanda de talento</span>
      <h3 style={{ margin: '4px 0 24px' }}>Avisos por categoría</h3>

      {filas.length === 0 ? (
        <p className="texto-suave">Todavía no hay avisos para mostrar.</p>
      ) : (
        filas.map((fila) => (
          <div key={fila.valor} className="distribucion-fila">
            <div className="distribucion-fila-titulo">
              <span>{fila.valor}</span>
              <span>
                {fila.cantidad} {fila.cantidad === 1 ? 'aviso' : 'avisos'}
              </span>
            </div>
            <div className="barra">
              <div style={{ width: `${(fila.cantidad / maximo) * 100}%` }}></div>
            </div>
          </div>
        ))
      )}
    </section>
  )
}

export default DistribucionCategorias
