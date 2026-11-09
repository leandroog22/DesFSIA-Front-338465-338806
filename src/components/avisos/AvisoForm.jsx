import { useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useForm, useWatch } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { avisoSchema } from '../../validators/avisos.validators'
import { crearAvisoService, subirImagenAvisoService } from '../../services/avisos.services'
import { selectCategoriasActivas } from '../../features/categorias/categorias.slice'
import useRefrescarResumen from '../../hooks/useRefrescarResumen'
import { MODALIDADES, SENIORITIES, TAMANIO_MAXIMO_IMAGEN_MB } from '../../constants/avisos.constants'
import { aNumeroOpcional, quitarVacios } from '../../utils/objetos'
import { mensajeDeError } from '../../utils/errores'
import { inicial } from '../../utils/formato'
import CampoError from '../comunes/CampoError'
import AlertaError from '../comunes/AlertaError'
import Icono from '../comunes/Icono'
import Spinner from '../comunes/Spinner'

const MAXIMO_DESCRIPCION = 5000

// Alta de un aviso (requerimiento 4). Al guardar, el backend manda la
// descripcion a Gemini, que extrae las skills y arma un resumen. Si se eligio
// una portada, se sube despues de crear el aviso (el endpoint de imagen
// necesita el id del aviso).
// Con bloqueado=true se muestra deshabilitado, de fondo, cuando el plan no
// tiene cupo.
const AvisoForm = ({ bloqueado = false }) => {
  const navigate = useNavigate()
  const refrescarResumen = useRefrescarResumen()
  const categorias = useSelector(selectCategoriasActivas)
  const nombreEmpresa = useSelector((state) => state.auth.usuario?.nombreEmpresa)
  const [errorServidor, setErrorServidor] = useState(null)
  const [preview, setPreview] = useState(null)
  const [paso, setPaso] = useState(null)
  const id = {
    titulo: useId(),
    descripcion: useId(),
    categoria: useId(),
    modalidad: useId(),
    seniority: useId(),
    ubicacion: useId(),
    salarioMin: useId(),
    salarioMax: useId(),
    imagen: useId(),
  }

  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: joiResolver(avisoSchema),
    mode: 'onChange',
    defaultValues: {
      titulo: '',
      descripcion: '',
      categoria: '',
      modalidad: '',
      seniority: '',
      ubicacion: '',
      moneda: 'USD',
    },
  })

  // useWatch se suscribe a un campo y re-renderiza cuando cambia: alimenta el
  // contador de caracteres, el simbolo de la moneda y la vista previa.
  const descripcion = useWatch({ control, name: 'descripcion' })
  const moneda = useWatch({ control, name: 'moneda' })
  const archivo = useWatch({ control, name: 'imagen' })?.[0]
  const simbolo = moneda === 'USD' ? 'US$' : '$'

  // Vista previa local de la portada. createObjectURL reserva memoria, por
  // eso la funcion de limpieza del efecto la libera al cambiar de archivo.
  useEffect(() => {
    if (!archivo || errors.imagen) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(archivo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [archivo, errors.imagen])

  const publicar = async (datos) => {
    setErrorServidor(null)
    // La imagen no viaja con el aviso: va despues, a su propio endpoint.
    const { imagen, ...aviso } = datos

    try {
      setPaso('Publicando y analizando con IA...')
      let creado = await crearAvisoService(quitarVacios(aviso))

      if (imagen?.[0]) {
        setPaso('Subiendo la portada...')
        try {
          creado = await subirImagenAvisoService(creado._id, imagen[0])
        } catch (error) {
          // El aviso ya existe: si falla solo la imagen se avisa y se sigue.
          toast.warning(`El aviso se publicó, pero la portada no: ${mensajeDeError(error)}`)
        }
      }

      refrescarResumen()
      if (creado.iaProcesado) {
        toast.success(`Aviso publicado. La IA detectó ${creado.skills.length} skills.`)
      }
      // recienCreado le indica al detalle que muestre la franja de exito.
      navigate(`/avisos/${creado._id}`, { state: { recienCreado: true } })
    } catch (error) {
      setErrorServidor(mensajeDeError(error))
      // 403 = limite del plan. Se refresca el uso y la pagina muestra el bloqueo.
      if (error.response?.status === 403) refrescarResumen()
    } finally {
      setPaso(null)
    }
  }

  const largoDescripcion = descripcion?.length ?? 0

  return (
    <form className="tarjeta formulario-aviso" onSubmit={handleSubmit(publicar)} noValidate>
      <fieldset disabled={bloqueado || isSubmitting} style={{ border: 'none' }}>
        <div className="form-group">
          <label htmlFor={id.titulo}>
            <span>
              Título de la vacante <span className="requerido">*</span>
            </span>
            <span className="ayuda">Claridad y stack clave</span>
          </label>
          <input
            id={id.titulo}
            type="text"
            placeholder="Ej: Senior Full Stack Engineer (React / Python)"
            {...register('titulo')}
          />
          <CampoError error={errors.titulo} />
        </div>

        <div className="form-fila form-fila-3">
          <div className="form-group">
            <label htmlFor={id.categoria}>
              <span>
                Categoría <span className="requerido">*</span>
              </span>
            </label>
            <select id={id.categoria} {...register('categoria')}>
              <option value="">Seleccionar área</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <CampoError error={errors.categoria} />
          </div>

          <div className="form-group">
            <label htmlFor={id.modalidad}>
              <span>
                Modalidad <span className="requerido">*</span>
              </span>
            </label>
            <select id={id.modalidad} {...register('modalidad')}>
              <option value="">Seleccionar</option>
              {MODALIDADES.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
            <CampoError error={errors.modalidad} />
          </div>

          <div className="form-group">
            <label htmlFor={id.seniority}>
              <span>
                Nivel de seniority <span className="requerido">*</span>
              </span>
            </label>
            <select id={id.seniority} {...register('seniority')}>
              <option value="">Seleccionar</option>
              {SENIORITIES.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
            <CampoError error={errors.seniority} />
          </div>
        </div>

        <div className="panel-salario">
          <div>
            <div className="panel-salario-titulo">
              <strong>Rango salarial</strong>
              <div className="segmentado" role="radiogroup" aria-label="Moneda">
                <label>
                  <input type="radio" value="USD" {...register('moneda')} /> USD (US$)
                </label>
                <label>
                  <input type="radio" value="UYU" {...register('moneda')} /> UYU ($)
                </label>
              </div>
            </div>
            <div className="form-fila">
              <div className="form-group">
                <div className="input-moneda">
                  <span>{simbolo}</span>
                  {/* deps: si cambia el minimo, se revalida que el maximo no quede por debajo */}
                  <input
                    id={id.salarioMin}
                    type="number"
                    min="0"
                    placeholder="4.500"
                    aria-label="Salario mínimo"
                    {...register('salarioMin', { setValueAs: aNumeroOpcional, deps: ['salarioMax'] })}
                  />
                </div>
                <small className="ayuda">Salario mínimo</small>
                <CampoError error={errors.salarioMin} />
              </div>
              <div className="form-group">
                <div className="input-moneda">
                  <span>{simbolo}</span>
                  <input
                    id={id.salarioMax}
                    type="number"
                    min="0"
                    placeholder="6.500"
                    aria-label="Salario máximo"
                    {...register('salarioMax', { setValueAs: aNumeroOpcional })}
                  />
                </div>
                <small className="ayuda">Salario máximo</small>
                <CampoError error={errors.salarioMax} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="ubicacion-titulo">
              <label htmlFor={id.ubicacion}>
                <strong>Ubicación de referencia</strong>
              </label>
              <small>Sede o zona horaria preferida</small>
            </div>
            <input
              id={id.ubicacion}
              type="text"
              placeholder="Montevideo, Uruguay (o Remoto LATAM)"
              {...register('ubicacion')}
            />
            <CampoError error={errors.ubicacion} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={id.descripcion}>
            <span>
              Descripción y requisitos técnicos <span className="requerido">*</span>
            </span>
            <span className="ayuda">Mínimo 20 caracteres</span>
          </label>
          <div className="textarea-contenedor">
            <textarea
              id={id.descripcion}
              rows={9}
              placeholder="Contá qué va a hacer la persona, con qué tecnologías trabaja el equipo y qué ofrecen. La IA va a leer este texto para extraer las skills."
              {...register('descripcion')}
            ></textarea>
            <div className="textarea-pie">
              <span>
                <Icono nombre="auto_awesome" /> La IA usa este texto para detectar skills
              </span>
              <span className={largoDescripcion > MAXIMO_DESCRIPCION ? 'texto-peligro' : ''}>
                {largoDescripcion} / {MAXIMO_DESCRIPCION} caracteres
              </span>
            </div>
          </div>
          <CampoError error={errors.descripcion} />
        </div>

        <div className="form-group">
          <div className="etiqueta-campo">
            <span>Portada corporativa o logo del aviso</span>
            <span className="ayuda">Opcional (recomendado para visibilidad)</span>
          </div>
          <div className="portada-grilla">
            <label htmlFor={id.imagen} className="zona-archivo">
              <span className="zona-archivo-icono">
                <Icono nombre="cloud_upload" />
              </span>
              <strong>{archivo ? archivo.name : 'Hacé clic para elegir una imagen'}</strong>
              <span>PNG, JPG o WebP hasta {TAMANIO_MAXIMO_IMAGEN_MB} MB</span>
              {archivo ? (
                <button type="button" className="btn-link" onClick={() => resetField('imagen')}>
                  Quitar imagen
                </button>
              ) : (
                <em>Proporción sugerida: 1200 x 400 px</em>
              )}
            </label>
            <input id={id.imagen} type="file" accept="image/*" className="solo-lectores" {...register('imagen')} />

            <div className="portada-preview">
              {preview && <img src={preview} alt="Vista previa de la portada" />}
              <div className="portada-preview-pie">
                <span className="portada-preview-inicial">{inicial(nombreEmpresa)}</span>
                <div>
                  <strong>{nombreEmpresa}</strong>
                  <small>{preview ? 'Vista previa activa' : 'Sin portada: se usará la inicial'}</small>
                </div>
              </div>
            </div>
          </div>
          <CampoError error={errors.imagen} />
        </div>
      </fieldset>

      <AlertaError mensaje={errorServidor} />

      <div className="formulario-pie">
        <div className="acciones">
          <button type="button" className="btn btn-fantasma" onClick={() => navigate('/avisos')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario" disabled={bloqueado || !isValid || isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner enLinea /> {paso}
              </>
            ) : (
              <>
                <Icono nombre={bloqueado ? 'lock' : 'send'} /> Publicar aviso
              </>
            )}
          </button>
        </div>
        <p>Al publicar, analizamos el aviso con IA para extraer skills y un resumen.</p>
      </div>
    </form>
  )
}

export default AvisoForm
