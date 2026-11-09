import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { obtenerAvisosService } from '../../services/avisos.services'
import {
  quitarAvisoDeLista,
  setAvisos,
  setFiltros,
  setPagina,
} from '../../features/avisos/avisos.slice'
import { selectHayCupo } from '../../features/uso/uso.slice'
import useRefrescarResumen from '../../hooks/useRefrescarResumen'
import { AVISOS_POR_PAGINA } from '../../constants/avisos.constants'
import { mensajeDeError } from '../../utils/errores'
import FiltrosAvisos from '../../components/avisos/FiltrosAvisos'
import AvisoFila from '../../components/avisos/AvisoFila'
import Paginacion from '../../components/comunes/Paginacion'
import Spinner from '../../components/comunes/Spinner'

// Listado de los avisos del usuario (requerimiento 5.1.1).
const MisAvisosPage = () => {
  const dispatch = useDispatch()
  const refrescarResumen = useRefrescarResumen()
  const { lista, page, totalPages, total, filtros } = useSelector((state) => state.avisos)
  const uso = useSelector((state) => state.uso.datos)
  const hayCupo = useSelector(selectHayCupo)
  const [cargando, setCargando] = useState(true)

  // Se vuelve a crear solo cuando cambian los filtros o la pagina, y eso
  // dispara el useEffect de abajo: cambiar un filtro = nueva consulta.
  const cargarAvisos = useCallback(async () => {
    setCargando(true)
    try {
      const resultado = await obtenerAvisosService({
        ...filtros,
        page,
        limit: AVISOS_POR_PAGINA,
        // Solo los avisos de la empresa logueada.
        mios: true,
      })

      // Si se borro el ultimo aviso de la ultima pagina, se retrocede una.
      if (resultado.avisos.length === 0 && page > 1) {
        dispatch(setPagina(page - 1))
        return
      }
      dispatch(setAvisos(resultado))
    } catch (error) {
      if (error.response?.status !== 401) toast.error(mensajeDeError(error))
    } finally {
      setCargando(false)
    }
  }, [dispatch, filtros, page])

  useEffect(() => {
    cargarAvisos()
  }, [cargarAvisos])

  // Borrar o cerrar cambia el cupo y las estadisticas, ademas del listado.
  const handleEliminado = (id) => {
    dispatch(quitarAvisoDeLista(id))
    cargarAvisos()
    refrescarResumen()
  }

  const handleEstadoCambiado = () => {
    cargarAvisos()
    refrescarResumen()
  }

  const hayFiltros = Object.keys(filtros).length > 0

  return (
    <div className="contenedor">
      <div className="pagina-encabezado">
        <div>
          <h1>Mis avisos</h1>
          <p className="texto-suave">
            {total} {total === 1 ? 'aviso' : 'avisos'}
            {hayFiltros ? ' con estos filtros' : ' publicados'}
            {uso && !uso.ilimitado && ` · ${uso.usados} de ${uso.limite} activos en tu plan`}
          </p>
        </div>
        {hayCupo ? (
          <Link to="/avisos/nuevo" className="btn btn-primario">
            <i className="fa-solid fa-plus"></i> Nuevo aviso
          </Link>
        ) : (
          <div className="sin-cupo">
            <button type="button" className="btn btn-primario" disabled>
              <i className="fa-solid fa-lock"></i> Nuevo aviso
            </button>
            <Link to="/dashboard" className="texto-chico">
              Llegaste al límite. Ver planes
            </Link>
          </div>
        )}
      </div>

      <FiltrosAvisos valores={filtros} onAplicar={(nuevos) => dispatch(setFiltros(nuevos))} mostrarEstado />

      {cargando && lista.length === 0 ? (
        <Spinner texto="Cargando tus avisos..." />
      ) : lista.length === 0 ? (
        <div className="estado-vacio">
          <span className="estado-vacio-icono">
            <i className={`fa-solid ${hayFiltros ? 'fa-filter-circle-xmark' : 'fa-file-circle-plus'}`}></i>
          </span>
          {hayFiltros ? (
            <>
              <h2>Ningún aviso coincide</h2>
              <p className="texto-suave">Probá con otros filtros o limpiá la búsqueda.</p>
            </>
          ) : (
            <>
              <h2>Todavía no publicaste avisos</h2>
              <p className="texto-suave">Publicá el primero y la IA va a detectar las skills por vos.</p>
              <Link to="/avisos/nuevo" className="btn btn-primario">
                Publicar mi primer aviso
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className={`lista-avisos ${cargando ? 'cargando' : ''}`}>
          {lista.map((aviso) => (
            <AvisoFila
              key={aviso._id}
              aviso={aviso}
              onEliminado={handleEliminado}
              onEstadoCambiado={handleEstadoCambiado}
            />
          ))}
        </div>
      )}

      <Paginacion page={page} totalPages={totalPages} onCambiar={(nueva) => dispatch(setPagina(nueva))} />
    </div>
  )
}

export default MisAvisosPage
