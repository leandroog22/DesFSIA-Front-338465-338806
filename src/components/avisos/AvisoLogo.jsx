import { inicial } from '../../utils/formato'

// Logo del aviso subido a Cloudinary o, si no tiene, la inicial de la empresa.
const AvisoLogo = ({ aviso, tamanio = 'mediano' }) => {
  const nombre = aviso.autor?.nombreEmpresa ?? aviso.titulo

  if (aviso.imagenUrl) {
    return <img className={`aviso-logo aviso-logo-${tamanio}`} src={aviso.imagenUrl} alt={`Logo de ${nombre}`} />
  }

  return (
    <span className={`aviso-logo aviso-logo-${tamanio} aviso-logo-inicial`} aria-hidden="true">
      {inicial(nombre)}
    </span>
  )
}

export default AvisoLogo
