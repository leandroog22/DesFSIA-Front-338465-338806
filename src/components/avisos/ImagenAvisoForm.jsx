import { useEffect, useId, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import { toast } from 'react-toastify'
import { subirImagenAvisoService } from '../../services/avisos.services'
import { imagenSchema } from '../../validators/avisos.validators'
import { TAMANIO_MAXIMO_IMAGEN_MB } from '../../constants/avisos.constants'
import { mensajeDeError } from '../../utils/errores'
import CampoError from '../comunes/CampoError'
import Icono from '../comunes/Icono'
import Spinner from '../comunes/Spinner'

// Aca la imagen es obligatoria (el formulario solo sirve para subirla).
// Reusa la validacion de tipo y tamaño del alta.
const subidaSchema = Joi.object({
  imagen: imagenSchema.custom((archivos, helpers) => (archivos?.length ? archivos : helpers.error('any.required'))).messages({
    'any.required': 'Elegí una imagen',
  }),
})

// Subida o reemplazo de la portada de un aviso ya publicado.
const ImagenAvisoForm = ({ avisoId, tieneImagen, onSubida }) => {
  const inputId = useId()
  const [preview, setPreview] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ resolver: joiResolver(subidaSchema), mode: 'onChange' })

  const archivo = useWatch({ control, name: 'imagen' })?.[0]

  // Vista previa local antes de subir. createObjectURL reserva memoria, por
  // eso la funcion de limpieza del efecto la libera al cambiar de archivo.
  useEffect(() => {
    if (!archivo) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(archivo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [archivo])

  const subir = async (datos) => {
    try {
      const aviso = await subirImagenAvisoService(avisoId, datos.imagen[0])
      toast.success('Portada actualizada')
      reset()
      onSubida(aviso)
    } catch (error) {
      toast.error(mensajeDeError(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(subir)} noValidate>
      <label htmlFor={inputId} className="zona-archivo" style={{ minHeight: 170 }}>
        {preview && !errors.imagen ? (
          <img src={preview} alt="Vista previa" style={{ maxHeight: 150, borderRadius: 8 }} />
        ) : (
          <>
            <span className="zona-archivo-icono">
              <Icono nombre="cloud_upload" />
            </span>
            <strong>{tieneImagen ? 'Reemplazar portada' : 'Subir portada'}</strong>
            <span>PNG, JPG o WebP hasta {TAMANIO_MAXIMO_IMAGEN_MB} MB</span>
          </>
        )}
      </label>
      <input id={inputId} type="file" accept="image/*" className="solo-lectores" {...register('imagen')} />
      <CampoError error={errors.imagen} />

      {archivo && (
        <div className="acciones" style={{ marginTop: 12 }}>
          <button type="submit" className="btn btn-primario btn-chico" disabled={!isValid || isSubmitting}>
            {isSubmitting ? <Spinner enLinea /> : 'Subir imagen'}
          </button>
          <button type="button" className="btn btn-fantasma btn-chico" onClick={() => reset()} disabled={isSubmitting}>
            Cancelar
          </button>
        </div>
      )}
    </form>
  )
}

export default ImagenAvisoForm
