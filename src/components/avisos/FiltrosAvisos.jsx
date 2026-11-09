import { useId } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { ESTADOS, MODALIDADES, SENIORITIES } from '../../constants/avisos.constants'
import { quitarVacios } from '../../utils/objetos'
import CampoError from '../comunes/CampoError'
import Icono from '../comunes/Icono'

const FILTROS_VACIOS = { q: '', categoria: '', modalidad: '', seniority: '', estado: '' }

// Filtros del listado (requerimiento 5.1.4). Lo usan "Mis avisos" y
// "Explorar": cada pagina decide que hacer con los filtros en onAplicar.
// Los desplegables aplican al cambiar; la busqueda por texto, al enviar.
const FiltrosAvisos = ({ valores = {}, onAplicar, mostrarEstado = false }) => {
  const busquedaId = useId()
  const categorias = useSelector((state) => state.categorias.lista)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { ...FILTROS_VACIOS, ...valores } })

  const aplicar = (datos) => onAplicar(quitarVacios(datos))
  const aplicarAlCambiar = { onChange: () => handleSubmit(aplicar)() }

  const limpiar = () => {
    reset(FILTROS_VACIOS)
    onAplicar({})
  }

  const hayFiltros = Object.keys(valores).length > 0

  return (
    <form className="filtros" onSubmit={handleSubmit(aplicar)} noValidate>
      <div className="filtro-busqueda">
        <label htmlFor={busquedaId} className="solo-lectores">
          Buscar
        </label>
        <div className="input-con-icono">
          <Icono nombre="search" />
          <input
            id={busquedaId}
            type="search"
            placeholder="Buscar por título o descripción..."
            {...register('q', {
              maxLength: { value: 80, message: 'La búsqueda no puede superar los 80 caracteres' },
            })}
          />
        </div>
        <CampoError error={errors.q} />
      </div>

      <select aria-label="Categoría" {...register('categoria', aplicarAlCambiar)}>
        <option value="">Todas las categorías</option>
        {categorias.map((categoria) => (
          <option key={categoria._id} value={categoria._id}>
            {categoria.nombre}
          </option>
        ))}
      </select>

      <select aria-label="Modalidad" {...register('modalidad', aplicarAlCambiar)}>
        <option value="">Cualquier modalidad</option>
        {MODALIDADES.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>

      <select aria-label="Seniority" {...register('seniority', aplicarAlCambiar)}>
        <option value="">Cualquier seniority</option>
        {SENIORITIES.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>

      {mostrarEstado && (
        <select aria-label="Estado" {...register('estado', aplicarAlCambiar)}>
          <option value="">Activos y cerrados</option>
          {ESTADOS.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.etiqueta}s
            </option>
          ))}
        </select>
      )}

      <button type="submit" className="btn btn-secundario">
        Buscar
      </button>
      {hayFiltros && (
        <button type="button" className="btn btn-fantasma" onClick={limpiar}>
          <Icono nombre="close" /> Limpiar
        </button>
      )}
    </form>
  )
}

export default FiltrosAvisos
