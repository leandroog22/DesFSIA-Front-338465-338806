import { useSelector } from 'react-redux'
import CategoriaForm from '../../components/categorias/CategoriaForm'
import CategoriaFila from '../../components/categorias/CategoriaFila'

// ABM del catalogo de areas, solo para el administrador. Las categorias ya
// estan en Redux (las carga ContainerPage al iniciar sesion).
const CategoriasPage = () => {
  const categorias = useSelector((state) => state.categorias.lista)

  return (
    <div className="contenedor">
      <div className="pagina-encabezado">
        <div>
          <h1>Categorías</h1>
          <p className="texto-suave">
            Las áreas en las que las empresas clasifican sus avisos. Una categoría con avisos no se puede
            eliminar, pero sí desactivar.
          </p>
        </div>
      </div>

      <div className="panel-grilla">
        <section className="tarjeta panel-principal">
          <h3>
            {categorias.length} {categorias.length === 1 ? 'categoría' : 'categorías'}
          </h3>
          <div className="lista-categorias">
            {categorias.map((categoria) => (
              <CategoriaFila key={categoria._id} categoria={categoria} />
            ))}
          </div>
        </section>
        <aside className="panel-lateral">
          <CategoriaForm />
        </aside>
      </div>
    </div>
  )
}

export default CategoriasPage
