import { useEffect, useId, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { subirImagenAvisoService } from '../../services/avisos.services'
import { TAMANIO_MAXIMO_IMAGEN_MB } from '../../constants/avisos.constants'
import { mensajeDeError } from '../../utils/errores'
import CampoError from '../comunes/CampoError'

const BYTES_MAXIMOS = TAMANIO_MAXIMO_IMAGEN_MB * 1024 * 1024

// Subida del logo del aviso a Cloudinary, a traves del backend.
const ImagenAvisoForm = ({ avisoId, tieneImagen, onSubida }) => {
  const inputId = useId()
  const [preview, setPreview] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: 'onChange' })

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
      toast.success('Imagen actualizada')
      reset()
      onSubida(aviso)
    } catch (error) {
      toast.error(mensajeDeError(error))
    }
  }

  return (
    <form className="imagen-form" onSubmit={handleSubmit(subir)} noValidate>
      <label htmlFor={inputId} className="zona-archivo">
        {preview ? (
          <img src={preview} alt="Vista previa" />
        ) : (
          <>
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <span>{tieneImagen ? 'Reemplazar logo' : 'Subir el logo de tu empresa'}</span>
            <span className="texto-chico texto-suave">JPG, PNG o WebP · hasta {TAMANIO_MAXIMO_IMAGEN_MB} MB</span>
          </>
        )}
      </label>
      {/* Las validaciones corren en orden y frenan en la primera que falla.
          Son las mismas que aplica multer en el backend. */}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="solo-lectores"
        {...register('imagen', {
          validate: {
            requerida: (archivos) => archivos?.length > 0 || 'Elegí una imagen',
            esImagen: (archivos) =>
              archivos[0].type.startsWith('image/') || 'El archivo tiene que ser una imagen',
            tamanio: (archivos) =>
              archivos[0].size <= BYTES_MAXIMOS ||
              `La imagen no puede superar los ${TAMANIO_MAXIMO_IMAGEN_MB} MB`,
          },
        })}
      />
      <CampoError error={errors.imagen} />

      {archivo && (
        <div className="acciones">
          <button type="submit" className="btn btn-primario btn-chico" disabled={!isValid || isSubmitting}>
            {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Subir imagen'}
          </button>
          <button type="button" className="btn btn-secundario btn-chico" onClick={() => reset()} disabled={isSubmitting}>
            Cancelar
          </button>
        </div>
      )}
    </form>
  )
}

export default ImagenAvisoForm
