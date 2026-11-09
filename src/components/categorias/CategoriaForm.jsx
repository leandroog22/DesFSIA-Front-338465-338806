import { useId, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { categoriaSchema } from '../../validators/categorias.validators'
import { crearCategoriaService } from '../../services/categorias.services'
import { agregarCategoria } from '../../features/categorias/categorias.slice'
import { quitarVacios } from '../../utils/objetos'
import { mensajeDeError } from '../../utils/errores'
import CampoError from '../comunes/CampoError'
import AlertaError from '../comunes/AlertaError'

const CategoriaForm = () => {
  const nombreId = useId()
  const descripcionId = useId()
  const dispatch = useDispatch()

  // Error que devuelve la API. Va en estado local y no con setError de
  // react-hook-form porque setError marca el formulario como invalido y
  // dejaria el boton deshabilitado aunque los datos esten bien (por ejemplo,
  // para reintentar despues de un error de red).
  const [errorServidor, setErrorServidor] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: joiResolver(categoriaSchema),
    mode: 'onChange',
    defaultValues: { nombre: '', descripcion: '' },
  })

  const crear = async (datos) => {
    setErrorServidor(null)
    try {
      const categoria = await crearCategoriaService(quitarVacios(datos))
      dispatch(agregarCategoria(categoria))
      toast.success(`Categoría "${categoria.nombre}" creada`)
      reset()
    } catch (error) {
      // 409 = ya existe una categoria con ese nombre.
      if (error.response?.status === 409) {
        setError('nombre', { message: mensajeDeError(error) })
      } else {
        setErrorServidor(mensajeDeError(error))
      }
    }
  }

  return (
    <form className="tarjeta" onSubmit={handleSubmit(crear)} noValidate>
      <h3>Nueva categoría</h3>
      <div className="form-group">
        <label htmlFor={nombreId}>Nombre</label>
        <input id={nombreId} type="text" placeholder="DevOps" {...register('nombre')} />
        <CampoError error={errors.nombre} />
      </div>
      <div className="form-group">
        <label htmlFor={descripcionId}>
          Descripción <span className="opcional">(opcional)</span>
        </label>
        <textarea id={descripcionId} rows={3} placeholder="Integración y despliegue continuo..." {...register('descripcion')}></textarea>
        <CampoError error={errors.descripcion} />
      </div>
      <AlertaError mensaje={errorServidor} />
      <button type="submit" className="btn btn-primario btn-bloque" disabled={!isValid || isSubmitting}>
        {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Crear categoría'}
      </button>
    </form>
  )
}

export default CategoriaForm
