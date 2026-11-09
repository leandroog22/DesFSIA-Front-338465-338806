import { useId, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useForm, useWatch } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { avisoSchema } from '../../validators/avisos.validators'
import { crearAvisoService } from '../../services/avisos.services'
import { selectCategoriasActivas } from '../../features/categorias/categorias.slice'
import useRefrescarResumen from '../../hooks/useRefrescarResumen'
import { MODALIDADES, MONEDAS, SENIORITIES } from '../../constants/avisos.constants'
import { aNumeroOpcional, quitarVacios } from '../../utils/objetos'
import { mensajeDeError } from '../../utils/errores'
import CampoError from '../comunes/CampoError'
import AlertaError from '../comunes/AlertaError'

const MAXIMO_DESCRIPCION = 5000

// Alta de un aviso (requerimiento 4). Al guardar, el backend manda la
// descripcion a Gemini, que extrae las skills y arma un resumen.
const AvisoForm = () => {
  const navigate = useNavigate()
  const refrescarResumen = useRefrescarResumen()
  const categorias = useSelector(selectCategoriasActivas)
  const id = {
    titulo: useId(),
    descripcion: useId(),
    categoria: useId(),
    modalidad: useId(),
    seniority: useId(),
    ubicacion: useId(),
    moneda: useId(),
    salarioMin: useId(),
    salarioMax: useId(),
  }

  // Error que devuelve la API. Va en estado local y no con setError de
  // react-hook-form porque setError marca el formulario como invalido y
  // dejaria el boton deshabilitado aunque los datos esten bien (por ejemplo,
  // para reintentar despues de un error de red).
  const [errorServidor, setErrorServidor] = useState(null)

  const {
    register,
    handleSubmit,
    control,
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
      moneda: 'UYU',
    },
  })

  // useWatch se suscribe al campo y re-renderiza al escribir: alimenta el
  // contador de caracteres.
  const largoDescripcion = useWatch({ control, name: 'descripcion' })?.length ?? 0

  const publicar = async (datos) => {
    setErrorServidor(null)
    try {
      const aviso = await crearAvisoService(quitarVacios(datos))
      refrescarResumen()

      if (aviso.iaProcesado) {
        toast.success(`Aviso publicado. La IA detectó ${aviso.skills.length} skills.`)
      } else {
        // Degradacion controlada del backend: el aviso se crea igual aunque la
        // IA no responda, y se puede reintentar desde el detalle.
        toast.warning('Aviso publicado. La IA no respondió: podés reintentar el análisis.')
      }
      navigate(`/avisos/${aviso._id}`)
    } catch (error) {
      setErrorServidor(mensajeDeError(error))
      // 403 = limite del plan. Se refresca el uso y la pagina muestra el bloqueo.
      if (error.response?.status === 403) refrescarResumen()
    }
  }

  return (
    <form className="tarjeta formulario-aviso" onSubmit={handleSubmit(publicar)} noValidate>
      <section className="formulario-seccion">
        <h3>El puesto</h3>

        <div className="form-group">
          <label htmlFor={id.titulo}>Título del aviso</label>
          <input
            id={id.titulo}
            type="text"
            placeholder="Desarrollador/a Frontend React"
            {...register('titulo')}
          />
          <CampoError error={errors.titulo} />
        </div>

        <div className="form-group">
          <label htmlFor={id.descripcion}>Descripción</label>
          <textarea
            id={id.descripcion}
            rows={8}
            placeholder="Contá qué va a hacer la persona, con qué tecnologías trabaja el equipo, qué ofrecen... La IA va a leer este texto para extraer las skills."
            {...register('descripcion')}
          ></textarea>
          <div className="campo-pie">
            <CampoError error={errors.descripcion} />
            <span className={`contador ${largoDescripcion > MAXIMO_DESCRIPCION ? 'texto-peligro' : ''}`}>
              {largoDescripcion} / {MAXIMO_DESCRIPCION}
            </span>
          </div>
        </div>

        <div className="form-fila form-fila-3">
          <div className="form-group">
            <label htmlFor={id.categoria}>Categoría</label>
            <select id={id.categoria} {...register('categoria')}>
              <option value="">Elegí un área</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <CampoError error={errors.categoria} />
          </div>

          <div className="form-group">
            <label htmlFor={id.modalidad}>Modalidad</label>
            <select id={id.modalidad} {...register('modalidad')}>
              <option value="">Elegí</option>
              {MODALIDADES.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
            <CampoError error={errors.modalidad} />
          </div>

          <div className="form-group">
            <label htmlFor={id.seniority}>Seniority</label>
            <select id={id.seniority} {...register('seniority')}>
              <option value="">Elegí</option>
              {SENIORITIES.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
            <CampoError error={errors.seniority} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={id.ubicacion}>
            Ubicación <span className="opcional">(opcional)</span>
          </label>
          <input id={id.ubicacion} type="text" placeholder="Montevideo, Uruguay" {...register('ubicacion')} />
          <CampoError error={errors.ubicacion} />
        </div>
      </section>

      <section className="formulario-seccion">
        <h3>
          Remuneración <span className="opcional">(opcional)</span>
        </h3>
        <div className="form-fila form-fila-3">
          <div className="form-group">
            <label htmlFor={id.moneda}>Moneda</label>
            <select id={id.moneda} {...register('moneda')}>
              {MONEDAS.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={id.salarioMin}>Mínimo</label>
            {/* deps: si cambia el minimo, se revalida que el maximo no quede por debajo */}
            <input
              id={id.salarioMin}
              type="number"
              min="0"
              placeholder="0"
              {...register('salarioMin', { setValueAs: aNumeroOpcional, deps: ['salarioMax'] })}
            />
            <CampoError error={errors.salarioMin} />
          </div>

          <div className="form-group">
            <label htmlFor={id.salarioMax}>Máximo</label>
            <input
              id={id.salarioMax}
              type="number"
              min="0"
              placeholder="0"
              {...register('salarioMax', { setValueAs: aNumeroOpcional })}
            />
            <CampoError error={errors.salarioMax} />
          </div>
        </div>
      </section>

      <AlertaError mensaje={errorServidor} />

      <div className="formulario-pie">
        <p className="texto-chico texto-suave">
          <i className="fa-solid fa-wand-magic-sparkles"></i> Al publicar, la IA analiza la descripción. Puede
          tardar unos segundos.
        </p>
        <button type="submit" className="btn btn-primario" disabled={!isValid || isSubmitting}>
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i> Publicando y analizando...
            </>
          ) : (
            'Publicar aviso'
          )}
        </button>
      </div>
    </form>
  )
}

export default AvisoForm
