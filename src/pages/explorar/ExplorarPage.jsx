import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { obtenerAvisosService } from '../../services/avisos.services'
import { mensajeDeError } from '../../utils/errores'
import FiltrosAvisos from '../../components/avisos/FiltrosAvisos'
import AvisoCard from '../../components/avisos/AvisoCard'
import Paginacion from '../../components/comunes/Paginacion'
import Spinner from '../../components/comunes/Spinner'

const AVISOS_POR_PAGINA = 12

// Bolsa de trabajo: los avisos activos de todas las empresas. Estos datos no
// los comparte ninguna otra pantalla, por eso viven en estado local y no en
// Redux (que se reserva para lo que usan varios componentes).
const ExplorarPage = () => {
  const [filtros, setFiltros] = useState({})
  const [page, setPage] = useState(1)
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vigente = true

    const cargar = async () => {
      setCargando(true)
      try {
        const datos = await obtenerAvisosService({
          ...filtros,
          estado: 'activo',
          page,
          limit: AVISOS_POR_PAGINA,
        })
        if (vigente) setResultado(datos)
      } catch (error) {
        if (vigente && error.response?.status !== 401) toast.error(mensajeDeError(error))
      } finally {
        if (vigente) setCargando(false)
      }
    }

    cargar()
    return () => {
      vigente = false
    }
  }, [filtros, page])

  const aplicarFiltros = (nuevos) => {
    setFiltros(nuevos)
    setPage(1)
  }

  return (
    <div className="contenedor">
      <div className="pagina-encabezado">
        <div>
          <h1>Explorar avisos</h1>
          <p className="texto-suave">
            {resultado
              ? `${resultado.total} ${resultado.total === 1 ? 'búsqueda abierta' : 'búsquedas abiertas'} en el mercado tech`
              : 'Lo que están buscando las empresas en Tripalium'}
          </p>
        </div>
      </div>

      <FiltrosAvisos valores={filtros} onAplicar={aplicarFiltros} />

      {!resultado ? (
        <Spinner texto="Buscando avisos..." />
      ) : resultado.avisos.length === 0 ? (
        <div className="estado-vacio">
          <span className="estado-vacio-icono">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <h2>No hay avisos con esos filtros</h2>
          <p className="texto-suave">Probá ampliando la búsqueda.</p>
        </div>
      ) : (
        <div className={`grilla-avisos ${cargando ? 'cargando' : ''}`}>
          {resultado.avisos.map((aviso) => (
            <AvisoCard key={aviso._id} aviso={aviso} />
          ))}
        </div>
      )}

      {resultado && <Paginacion page={page} totalPages={resultado.totalPages} onCambiar={setPage} />}
    </div>
  )
}

export default ExplorarPage
