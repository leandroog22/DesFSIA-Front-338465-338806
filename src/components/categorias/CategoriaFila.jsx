import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { categoriaSchema } from '../../validators/categorias.validators'
import {
  actualizarCategoriaService,
  eliminarCategoriaService,
} from '../../services/categorias.services'
import { quitarCategoria, reemplazarCategoria } from '../../features/categorias/categorias.slice'
import { mensajeDeError } from '../../utils/errores'
import CampoError from '../comunes/CampoError'

const CategoriaFila = ({ categoria }) => {
  const dispatch = useDispatch()
  const [editando, setEditando] = useState(false)
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: joiResolver(categoriaSchema),
    mode: 'onChange',
    defaultValues: { nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' },
  })

  const guardar = async (datos) => {
    try {
      const actualizada = await actualizarCategoriaService(categoria._id, datos)
      dispatch(reemplazarCategoria(actualizada))
      reset({ nombre: actualizada.nombre, descripcion: actualizada.descripcion ?? '' })
      toast.success('Categoría actualizada')
      setEditando(false)
    } catch (error) {
      toast.error(mensajeDeError(error))
    }
  }

  // Desactivar en vez de borrar: la categoria deja de ofrecerse en el alta,
  // pero los avisos que ya la usan la conservan.
  const alternarActiva = async () => {
    setProcesando(true)
    try {
      const actualizada = await actualizarCategoriaService(categoria._id, { activa: !categoria.activa })
      dispatch(reemplazarCategoria(actualizada))
      toast.success(actualizada.activa ? 'Categoría activada' : 'Categoría desactivada')
    } catch (error) {
      toast.error(mensajeDeError(error))
    } finally {
      setProcesando(false)
    }
  }

  const eliminar = async () => {
    setProcesando(true)
    try {
      await eliminarCategoriaService(categoria._id)
      dispatch(quitarCategoria(categoria._id))
      toast.success(`Categoría "${categoria.nombre}" eliminada`)
    } catch (error) {
      // 409 si tiene avisos asociados (integridad referencial del backend).
      toast.error(mensajeDeError(error))
      setProcesando(false)
      setConfirmandoBorrado(false)
    }
  }

  if (editando) {
    return (
      <form className="categoria-fila categoria-fila-editando" onSubmit={handleSubmit(guardar)} noValidate>
        <div className="form-group">
          <input type="text" aria-label="Nombre" {...register('nombre')} autoFocus />
          <CampoError error={errors.nombre} />
        </div>
        <div className="form-group">
          <input type="text" aria-label="Descripción" placeholder="Descripción" {...register('descripcion')} />
          <CampoError error={errors.descripcion} />
        </div>
        <div className="acciones">
          <button type="submit" className="btn btn-primario btn-chico" disabled={!isValid || isSubmitting}>
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secundario btn-chico"
            onClick={() => {
              reset()
              setEditando(false)
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className={`categoria-fila ${categoria.activa ? '' : 'categoria-inactiva'}`}>
      <div>
        <p className="categoria-nombre">
          {categoria.nombre}
          {!categoria.activa && <span className="badge badge-cerrado">Inactiva</span>}
        </p>
        <p className="texto-suave texto-chico">{categoria.descripcion || 'Sin descripción'}</p>
      </div>

      {confirmandoBorrado ? (
        <div className="aviso-fila-acciones confirmacion-inline">
          <span>¿Eliminar?</span>
          <button type="button" className="btn btn-peligro btn-chico" onClick={eliminar} disabled={procesando}>
            Sí
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
        <div className="aviso-fila-acciones">
          <button
            type="button"
            className="btn-icono"
            onClick={alternarActiva}
            disabled={procesando}
            title={categoria.activa ? 'Desactivar' : 'Activar'}
            aria-label={categoria.activa ? 'Desactivar categoría' : 'Activar categoría'}
          >
            <i className={`fa-solid ${categoria.activa ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
          </button>
          <button
            type="button"
            className="btn-icono"
            onClick={() => setEditando(true)}
            title="Editar"
            aria-label="Editar categoría"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
          <button
            type="button"
            className="btn-icono btn-icono-peligro"
            onClick={() => setConfirmandoBorrado(true)}
            title="Eliminar"
            aria-label="Eliminar categoría"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoriaFila
