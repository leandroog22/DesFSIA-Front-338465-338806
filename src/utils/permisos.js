// Un aviso lo puede editar su autor o el administrador. Es la misma regla que
// aplica el backend (verificarPropiedad); aca solo decide que botones mostrar.
export const puedeEditar = (aviso, usuario) => {
  if (!aviso || !usuario) return false
  if (usuario.rol === 'admin') return true
  return aviso.autor?._id === usuario.id
}
