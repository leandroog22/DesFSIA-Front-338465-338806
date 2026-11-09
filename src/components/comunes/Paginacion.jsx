// El backend pagina los avisos ({ page, totalPages }); este componente solo
// avisa que pagina se pidio y la pagina se encarga de volver a consultar.
const Paginacion = ({ page, totalPages, onCambiar }) => {
  if (totalPages <= 1) return null

  return (
    <nav className="paginacion" aria-label="Paginación">
      <button
        type="button"
        className="btn btn-secundario btn-chico"
        onClick={() => onCambiar(page - 1)}
        disabled={page <= 1}
      >
        <i className="fa-solid fa-chevron-left"></i> Anterior
      </button>
      <span>
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-secundario btn-chico"
        onClick={() => onCambiar(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente <i className="fa-solid fa-chevron-right"></i>
      </button>
    </nav>
  )
}

export default Paginacion
