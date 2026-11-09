// Iconos de Material Symbols (los mismos que usa el diseño de Stitch).
// La fuente dibuja el icono a partir del nombre escrito como texto.
const Icono = ({ nombre, relleno = false, className = '' }) => {
  return (
    <span
      className={`material-symbols-outlined icono ${relleno ? 'icono-relleno' : ''} ${className}`}
      aria-hidden="true"
    >
      {nombre}
    </span>
  )
}

export default Icono
