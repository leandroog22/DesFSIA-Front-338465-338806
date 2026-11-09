import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { edicionAvisoSchema } from '../../validators/avisos.validators'
import { actualizarAvisoService } from '../../services/avisos.services'
import { actualizarAvisoEnLista } from '../../features/avisos/avisos.slice'
import { selectCategoriasActivas } from '../../features/categorias/categorias.slice'
import { MODALIDADES, MONEDAS, SENIORITIES } from '../../constants/avisos.constants'
import { aNumeroOpcional, quitarVacios } from '../../utils/objetos'
import { mensajeDeError } from '../../utils/errores'
import CampoError from '../comunes/CampoError'
import AlertaError from '../comunes/AlertaError'

// Edicion sencilla en linea (requerimiento 5.1.3): reemplaza la fila del
// listado por un formulario con los datos principales del aviso.
const AvisoEdicionInline = ({ aviso, onCerrar }) => {
  const dispatch = useDispatch()
  const categorias = useSelector(selectCategoriasActivas)

  // Error que devuelve la API. Va en estado local y no con setError de
  // react-hook-form porque setError marca el formulario como invalido y
  // dejaria el boton deshabilitado aunque los datos esten bien (por ejemplo,
  // para reintentar despues de un error de red).
  const [errorServidor, setErrorServidor] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm({
    resolver: joiResolver(edicionAvisoSchema),
    mode: 'onChange',
    defaultValues: {
      titulo: aviso.titulo,
      categoria: aviso.categoria?._id ?? '',
      modalidad: aviso.modalidad,
      seniority: aviso.seniority,
      // undefined y no '': un string vacio no es un numero y Joi lo rechazaria.
      salarioMin: aviso.salarioMin ?? undefined,
      salarioMax: aviso.salarioMax ?? undefined,
      moneda: aviso.moneda ?? 'UYU',
    },
  })

  const guardar = async (datos) => {
    setErrorServidor(null)
    // dirtyFields dice que campos toco el usuario: el PATCH manda solo esos.
    const cambios = quitarVacios(
      Object.fromEntries(Object.keys(dirtyFields).map((campo) => [campo, datos[campo]]))
    )

    if (Object.keys(cambios).length === 0) {
      onCerrar()
      return
    }

    try {
      const actualizado = await actualizarAvisoService(aviso._id, cambios)
      dispatch(actualizarAvisoEnLista(actualizado))
      toast.success('Aviso actualizado')
      onCerrar()
    } catch (error) {
      setErrorServidor(mensajeDeError(error))
    }
  }

  // La categoria del aviso puede estar desactivada: igual se muestra para no
  // perderla del desplegable, pero no se ofrece para elegir.
  const categoriaActualInactiva =
    aviso.categoria && !categorias.some((c) => c._id === aviso.categoria._id)

  return (
    <form className="aviso-fila aviso-fila-editando" onSubmit={handleSubmit(guardar)} noValidate>
      <div className="edicion-grilla">
        <div className="form-group edicion-titulo">
          <label>Título</label>
          <input type="text" {...register('titulo')} autoFocus />
          <CampoError error={errors.titulo} />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <select {...register('categoria')}>
            {categoriaActualInactiva && (
              <option value={aviso.categoria._id} disabled>
                {aviso.categoria.nombre} (inactiva)
              </option>
            )}
            {categorias.map((categoria) => (
              <option key={categoria._id} value={categoria._id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          <CampoError error={errors.categoria} />
        </div>

        <div className="form-group">
          <label>Modalidad</label>
          <select {...register('modalidad')}>
            {MODALIDADES.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Seniority</label>
          <select {...register('seniority')}>
            {SENIORITIES.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Moneda</label>
          <select {...register('moneda')}>
            {MONEDAS.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.valor}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Salario mínimo</label>
          <input
            type="number"
            min="0"
            {...register('salarioMin', { setValueAs: aNumeroOpcional, deps: ['salarioMax'] })}
          />
          <CampoError error={errors.salarioMin} />
        </div>

        <div className="form-group">
          <label>Salario máximo</label>
          <input type="number" min="0" {...register('salarioMax', { setValueAs: aNumeroOpcional })} />
          <CampoError error={errors.salarioMax} />
        </div>
      </div>

      <AlertaError mensaje={errorServidor} />

      <div className="acciones">
        <button type="submit" className="btn btn-primario btn-chico" disabled={!isValid || isSubmitting}>
          {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Guardar cambios'}
        </button>
        <button type="button" className="btn btn-secundario btn-chico" onClick={onCerrar} disabled={isSubmitting}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default AvisoEdicionInline
