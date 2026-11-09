import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { obtenerAvisoService } from '../../services/avisos.services'
import { actualizarAvisoEnLista } from '../../features/avisos/avisos.slice'
import { puedeEditar } from '../../utils/permisos'
import { mensajeDeError } from '../../utils/errores'
import { formatearFechaRelativa, formatearSalario } from '../../utils/formato'
import AvisoLogo from '../../components/avisos/AvisoLogo'
import AvisoEtiquetas from '../../components/avisos/AvisoEtiquetas'
import AnalisisIA from '../../components/avisos/AnalisisIA'
import ImagenAvisoForm from '../../components/avisos/ImagenAvisoForm'
import Spinner from '../../components/comunes/Spinner'

const AvisoDetallePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const usuario = useSelector((state) => state.auth.usuario)
  // El detalle solo lo usa esta pantalla: alcanza con estado local.
  const [aviso, setAviso] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si el usuario cambia de aviso antes de que llegue la respuesta, la
    // respuesta vieja se descarta para no pisar la nueva.
    let vigente = true

    const cargar = async () => {
      setAviso(null)
      setError(null)
      try {
        const datos = await obtenerAvisoService(id)
        if (vigente) setAviso(datos)
      } catch (err) {
        if (!vigente) return
        // 400 = id con formato invalido, 404 = no existe: para el usuario es lo mismo.
        const noExiste = [400, 404].includes(err.response?.status)
        setError(noExiste ? 'Este aviso no existe o fue eliminado.' : mensajeDeError(err))
      }
    }

    cargar()
    return () => {
      vigente = false
    }
  }, [id])

  // La imagen y el analisis devuelven el aviso actualizado: se refleja aca y
  // en el listado de Redux, para que al volver ya aparezca el cambio.
  const actualizarAviso = (actualizado) => {
    setAviso(actualizado)
    dispatch(actualizarAvisoEnLista(actualizado))
  }

  if (error) {
    return (
      <div className="contenedor">
        <div className="estado-vacio">
          <span className="estado-vacio-icono">
            <i className="fa-solid fa-ghost"></i>
          </span>
          <h2>No pudimos mostrar el aviso</h2>
          <p className="texto-suave">{error}</p>
          <button type="button" className="btn btn-primario" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    )
  }

  if (!aviso) {
    return (
      <div className="contenedor">
        <Spinner texto="Cargando aviso..." />
      </div>
    )
  }

  const esEditable = puedeEditar(aviso, usuario)
  const estaActivo = aviso.estado === 'activo'

  return (
    <div className="contenedor">
      <button type="button" className="link-volver" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i> Volver
      </button>

      <header className="tarjeta detalle-encabezado">
        <AvisoLogo aviso={aviso} tamanio="grande" />
        <div className="detalle-encabezado-texto">
          <div className="aviso-fila-titulo">
            <h1>{aviso.titulo}</h1>
            <span className={`badge ${estaActivo ? 'badge-activo' : 'badge-cerrado'}`}>
              {estaActivo ? 'Activo' : 'Cerrado'}
            </span>
          </div>
          <p className="detalle-empresa">
            {aviso.autor?.nombreEmpresa} · publicado {formatearFechaRelativa(aviso.createdAt)}
          </p>
          <AvisoEtiquetas aviso={aviso} />
          <p className="detalle-salario">
            <i className="fa-solid fa-money-bill-wave"></i> {formatearSalario(aviso)}
          </p>
        </div>
        {esEditable && (
          <Link to="/avisos" className="btn btn-secundario btn-chico">
            <i className="fa-solid fa-pen"></i> Gestionar en Mis avisos
          </Link>
        )}
      </header>

      <div className="panel-grilla">
        <section className="tarjeta panel-principal">
          <h3>Descripción del puesto</h3>
          <p className="detalle-descripcion">{aviso.descripcion}</p>
        </section>

        <aside className="panel-lateral">
          <AnalisisIA aviso={aviso} puedeReintentar={esEditable} onAnalizado={actualizarAviso} />

          {esEditable && (
            <div className="tarjeta">
              <h3>Logo del aviso</h3>
              <ImagenAvisoForm avisoId={aviso._id} tieneImagen={Boolean(aviso.imagenUrl)} onSubida={actualizarAviso} />
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default AvisoDetallePage
