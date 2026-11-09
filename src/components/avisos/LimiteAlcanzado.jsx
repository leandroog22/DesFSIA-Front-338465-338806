import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import Icono from '../comunes/Icono'
import BotonPasarPremium from '../dashboard/BotonPasarPremium'

// Banner que reemplaza al formulario de alta cuando el plan Plus no tiene
// cupo (requerimiento 4): explica por que y ofrece las dos salidas.
const LimiteAlcanzado = () => {
  const uso = useSelector((state) => state.uso.datos)

  return (
    <section className="banner-ambar">
      <span className="banner-ambar-icono">
        <Icono nombre="warning" relleno />
      </span>

      <div className="banner-ambar-cuerpo">
        <div className="banner-ambar-etiqueta">
          <span className="pill pill-limite">Límite alcanzado</span>
          <span>· Publicaciones activas</span>
        </div>
        <h2>
          Llegaste al límite de {uso?.limite ?? 4} avisos activos del plan Plus. Cerrá uno o pasate a Premium
        </h2>
        <p>
          Tu cupo de avisos activos está al 100%. Podés liberar un lugar cerrando un aviso o actualizar tu cuenta al
          plan Premium para publicar vacantes ilimitadas.
        </p>
        {uso && (
          <div className="banner-ambar-uso">
            <div>
              <span>
                {uso.usados} de {uso.limite} avisos activos utilizados
              </span>
              <span>{uso.porcentaje}% ocupado</span>
            </div>
            <div className="barra barra-fina barra-llena">
              <div style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="acciones">
        <Link to="/avisos" className="btn btn-secundario">
          <Icono nombre="list_alt" /> Ver mis avisos
        </Link>
        <BotonPasarPremium variante="btn-premium" icono="stars" />
      </div>
    </section>
  )
}

export default LimiteAlcanzado
