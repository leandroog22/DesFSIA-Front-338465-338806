import { inicial } from '../../utils/formato'

// Logo del aviso subido a Cloudinary o, si no tiene, la inicial de la empresa.
// En el detalle la imagen ya se muestra grande como portada, asi que ahi se
// pide solo la inicial (conImagen=false).
const AvisoLogo = ({ aviso, tamanio = 'mediano', conImagen = true }) => {
  const nombre = aviso.autor?.nombreEmpresa ?? aviso.titulo

  if (aviso.imagenUrl && conImagen) {
    return <img className={`aviso-logo aviso-logo-${tamanio}`} src={aviso.imagenUrl} alt={`Logo de ${nombre}`} />
  }

  return (
    <span className={`aviso-logo aviso-logo-${tamanio} aviso-logo-inicial`} aria-hidden="true">
      {inicial(nombre)}
    </span>
  )
}

export default AvisoLogo
