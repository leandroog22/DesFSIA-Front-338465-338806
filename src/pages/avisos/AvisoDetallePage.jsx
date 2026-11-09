import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { obtenerAvisoService, reintentarAnalisisService } from '../../services/avisos.services'
import { actualizarAvisoEnLista } from '../../features/avisos/avisos.slice'
import { MODALIDADES, SENIORITIES, etiquetaDe } from '../../constants/avisos.constants'
import { puedeEditar } from '../../utils/permisos'
import { mensajeDeError } from '../../utils/errores'
import { formatearFechaRelativa, formatearSalario } from '../../utils/formato'
import AvisoLogo from '../../components/avisos/AvisoLogo'
import EstadoPill from '../../components/avisos/EstadoPill'
import CompetenciasIA from '../../components/avisos/CompetenciasIA'
import BannerIANoDisponible from '../../components/avisos/BannerIANoDisponible'
import ConsumoAvisos from '../../components/avisos/ConsumoAvisos'
import ImagenAvisoForm from '../../components/avisos/ImagenAvisoForm'
import Icono from '../../components/comunes/Icono'
import Spinner from '../../components/comunes/Spinner'

const AvisoDetallePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const usuario = useSelector((state) => state.auth.usuario)
  // El detalle solo lo usa esta pantalla: alcanza con estado local.
  const [aviso, setAviso] = useState(null)
  const [error, setError] = useState(null)
  const [analizando, setAnalizando] = useState(false)

  // El formulario de alta navega hasta aca con recienCreado = true.
  const recienCreado = Boolean(location.state?.recienCreado)

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

  const reintentarAnalisis = async () => {
    setAnalizando(true)
    try {
      const actualizado = await reintentarAnalisisService(aviso._id)
      if (actualizado.iaProcesado) {
        toast.success('Análisis completado')
      } else {
        toast.warning('La IA sigue sin responder. Probá de nuevo en un rato.')
      }
      actualizarAviso(actualizado)
    } catch (err) {
      toast.error(mensajeDeError(err))
    } finally {
      setAnalizando(false)
    }
  }

  if (error) {
    return (
      <div className="contenedor">
        <div className="estado-vacio">
          <span className="estado-vacio-icono">
            <Icono nombre="search_off" />
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
  const salario = formatearSalario(aviso)

  return (
    <div className="contenedor">
      {!aviso.iaProcesado && (
        <BannerIANoDisponible puedeReintentar={esEditable} onReintentar={reintentarAnalisis} analizando={analizando} />
      )}

      {recienCreado && (
        <section className="tarjeta franja-exito">
          <span className="franja-exito-icono">
            <Icono nombre="check_circle" relleno />
          </span>
          <span>Aviso publicado con éxito</span>
          <EstadoPill estado={aviso.estado} />
        </section>
      )}

      {!recienCreado && (
        <button type="button" className="link-volver" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
          <Icono nombre="arrow_back" /> Volver
        </button>
      )}

      <div className="panel-grilla">
        <article className="tarjeta">
          <header className="detalle-cabecera">
            <AvisoLogo aviso={aviso} tamanio="grande" conImagen={false} />
            <div className="detalle-cabecera-texto">
              <div className="acciones">
                {aviso.categoria && <span className="pill pill-categoria">{aviso.categoria.nombre}</span>}
                <span className="pill pill-plus">{etiquetaDe(SENIORITIES, aviso.seniority)}</span>
                {!recienCreado && <EstadoPill estado={aviso.estado} />}
              </div>
              <h1>{aviso.titulo}</h1>
              <div className="meta">
                <span>
                  <Icono nombre="apartment" /> {aviso.autor?.nombreEmpresa}
                </span>
                {aviso.ubicacion && (
                  <span>
                    <Icono nombre="location_on" /> {aviso.ubicacion}
                  </span>
                )}
                <span>
                  <Icono nombre="schedule" /> {formatearFechaRelativa(aviso.createdAt)}
                </span>
              </div>
            </div>
            <div className="rango-salarial">
              <small>Rango ofrecido</small>
              <strong>
                {salario} {salario !== 'Salario a convenir' && <Icono nombre="verified" />}
              </strong>
            </div>
          </header>

          {aviso.imagenUrl && (
            <div className="detalle-portada">
              <img src={aviso.imagenUrl} alt={`Portada del aviso ${aviso.titulo}`} />
            </div>
          )}

          <div className="detalle-datos">
            <div>
              <small>Categoría</small>
              <span>{aviso.categoria?.nombre ?? '—'}</span>
            </div>
            <div>
              <small>Seniority</small>
              <span>{etiquetaDe(SENIORITIES, aviso.seniority)}</span>
            </div>
            <div>
              <small>Modalidad</small>
              <span>{etiquetaDe(MODALIDADES, aviso.modalidad)}</span>
            </div>
            <div>
              <small>Estado</small>
              <span>{aviso.estado === 'activo' ? 'Activo' : 'Cerrado'}</span>
            </div>
          </div>

          <section className="detalle-seccion">
            <h2>Descripción del puesto</h2>
            <p className="detalle-descripcion">{aviso.descripcion}</p>
          </section>

          <CompetenciasIA
            aviso={aviso}
            puedeReanalizar={esEditable}
            onReanalizar={reintentarAnalisis}
            analizando={analizando}
          />
        </article>

        <aside className="panel-lateral">
          <section className="tarjeta">
            <h3>Próximas acciones</h3>
            <div className="acciones-columna" style={{ marginTop: 16 }}>
              {esEditable ? (
                <>
                  <Link to="/avisos" className="btn btn-primario">
                    Ver mis avisos <Icono nombre="list_alt" />
                  </Link>
                  <Link to="/dashboard" className="btn btn-tonal">
                    <Icono nombre="space_dashboard" /> Volver al dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/explorar" className="btn btn-primario">
                    <Icono nombre="explore" /> Seguir explorando
                  </Link>
                  <Link to="/dashboard" className="btn btn-tonal">
                    <Icono nombre="space_dashboard" /> Volver al dashboard
                  </Link>
                </>
              )}
            </div>
          </section>

          {esEditable && (
            <section className="tarjeta">
              <h3 style={{ marginBottom: 16 }}>Portada del aviso</h3>
              <ImagenAvisoForm avisoId={aviso._id} tieneImagen={Boolean(aviso.imagenUrl)} onSubida={actualizarAviso} />
            </section>
          )}

          {esEditable && <ConsumoAvisos />}
        </aside>
      </div>
    </div>
  )
}

export default AvisoDetallePage
