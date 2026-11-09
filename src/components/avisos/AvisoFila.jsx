import { useState } from 'react'
import { Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { cambiarEstadoAvisoService, eliminarAvisoService } from '../../services/avisos.services'
import { actualizarAvisoEnLista } from '../../features/avisos/avisos.slice'
import { formatearFechaRelativa, formatearSalario } from '../../utils/formato'
import { mensajeDeError } from '../../utils/errores'
import AvisoLogo from './AvisoLogo'
import AvisoEtiquetas from './AvisoEtiquetas'
import AvisoEdicionInline from './AvisoEdicionInline'
import Icono from '../comunes/Icono'
import Spinner from '../comunes/Spinner'

// Una fila del listado de "Mis avisos" con sus acciones: editar en linea,
// cerrar/reabrir y eliminar (requerimientos 5.1.2 y 5.1.3).
const AvisoFila = ({ aviso, onEliminado, onEstadoCambiado }) => {
  const dispatch = useDispatch()
  const [editando, setEditando] = useState(false)
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const estaActivo = aviso.estado === 'activo'

  const eliminar = async () => {
    setProcesando(true)
    try {
      await eliminarAvisoService(aviso._id)
      toast.success(`Eliminaste "${aviso.titulo}"`)
      onEliminado(aviso._id)
    } catch (error) {
      toast.error(mensajeDeError(error))
      setProcesando(false)
      setConfirmandoBorrado(false)
    }
  }

  // Cerrar libera cupo del plan; reabrir lo consume (y puede fallar con 403
  // si el plan Plus ya tiene 4 activos).
  const alternarEstado = async () => {
    setProcesando(true)
    try {
      const nuevoEstado = estaActivo ? 'cerrado' : 'activo'
      const actualizado = await cambiarEstadoAvisoService(aviso._id, nuevoEstado)
      dispatch(actualizarAvisoEnLista(actualizado))
      toast.success(estaActivo ? 'Aviso cerrado: liberaste un lugar' : 'Aviso reabierto')
      onEstadoCambiado()
    } catch (error) {
      toast.error(mensajeDeError(error))
    } finally {
      setProcesando(false)
    }
  }

  if (editando) {
    return <AvisoEdicionInline aviso={aviso} onCerrar={() => setEditando(false)} />
  }

  return (
    <article className={`aviso-item ${estaActivo ? '' : 'aviso-item-cerrado'}`}>
      <AvisoLogo aviso={aviso} />

      <div className="aviso-item-cuerpo">
        <div className="aviso-item-titulo">
          <Link to={`/avisos/${aviso._id}`}>{aviso.titulo}</Link>
          <span className={`pill ${estaActivo ? 'pill-activo' : 'pill-cerrado'}`}>
            {estaActivo ? 'Activo' : 'Cerrado'}
          </span>
          {!aviso.iaProcesado && (
            <span className="pill pill-alerta" title="La IA no pudo analizar este aviso">
              <Icono nombre="warning" /> Sin análisis IA
            </span>
          )}
        </div>
        <AvisoEtiquetas aviso={aviso} />
        <p className="meta">
          <span>{formatearSalario(aviso)}</span>
          <span>·</span>
          <span>Publicado {formatearFechaRelativa(aviso.createdAt)}</span>
        </p>
      </div>

      {confirmandoBorrado ? (
        <div className="aviso-item-acciones confirmacion-inline">
          <span>¿Eliminar este aviso?</span>
          <button type="button" className="btn btn-peligro btn-chico" onClick={eliminar} disabled={procesando}>
            {procesando ? <Spinner enLinea /> : 'Sí, eliminar'}
          </button>
          <button
            type="button"
            className="btn btn-secundario btn-chico"
            onClick={() => setConfirmandoBorrado(false)}
            disabled={procesando}
          >
            No
          </button>
        </div>
      ) : (
        <div className="aviso-item-acciones">
          <button
            type="button"
            className="btn-icono"
            onClick={alternarEstado}
            disabled={procesando}
            title={estaActivo ? 'Cerrar aviso' : 'Reabrir aviso'}
            aria-label={estaActivo ? 'Cerrar aviso' : 'Reabrir aviso'}
          >
            <Icono nombre={estaActivo ? 'inventory_2' : 'unarchive'} />
          </button>
          <button
            type="button"
            className="btn-icono"
            onClick={() => setEditando(true)}
            disabled={procesando}
            title="Editar"
            aria-label="Editar aviso"
          >
            <Icono nombre="edit" />
          </button>
          <button
            type="button"
            className="btn-icono btn-icono-peligro"
            onClick={() => setConfirmandoBorrado(true)}
            disabled={procesando}
            title="Eliminar"
            aria-label="Eliminar aviso"
          >
            <Icono nombre="delete" />
          </button>
        </div>
      )}
    </article>
  )
}

export default AvisoFila
