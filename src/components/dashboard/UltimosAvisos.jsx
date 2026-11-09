import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { obtenerAvisosService } from '../../services/avisos.services'
import AvisoResumen from '../avisos/AvisoResumen'
import Icono from '../comunes/Icono'

const CANTIDAD = 3

// "Ultimos avisos publicados" del panel. Solo lo usa esta seccion, asi que
// guarda los datos en estado local. Se vuelve a pedir cuando cambian las
// estadisticas (alta, baja, cierre), que es la señal de que algo cambio.
const UltimosAvisos = () => {
  const estadisticas = useSelector((state) => state.estadisticas.datos)
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    let vigente = true
    obtenerAvisosService({ mios: true, limit: CANTIDAD, page: 1 })
      .then((datos) => vigente && setResultado(datos))
      .catch(() => vigente && setResultado({ avisos: [], total: 0 }))
    return () => {
      vigente = false
    }
  }, [estadisticas])

  if (!resultado || resultado.total === 0) return null

  return (
    <section>
      <div className="seccion-encabezado">
        <div>
          <h2>
            Últimos avisos publicados
            <span className="pill pill-plus">
              {resultado.avisos.length} de {resultado.total}
            </span>
          </h2>
          <p className="texto-suave texto-chico">Tus publicaciones más recientes en Tripalium.</p>
        </div>
        <Link to="/avisos" className="link-flecha">
          Ver todos los avisos ({resultado.total}) <Icono nombre="arrow_forward" />
        </Link>
      </div>

      <div className="lista-avisos">
        {resultado.avisos.map((aviso) => (
          <AvisoResumen key={aviso._id} aviso={aviso} />
        ))}
      </div>
    </section>
  )
}

export default UltimosAvisos
