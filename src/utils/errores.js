// Convierte un error de axios en un mensaje para mostrar en pantalla.
// El backend siempre responde { message, details }: details es un array con
// los errores de Joi cuando falla una validacion, o un objeto con contexto.
export const mensajeDeError = (error) => {
  if (!error.response) {
    return 'No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.'
  }

  const { message, details } = error.response.data ?? {}

  if (Array.isArray(details) && details.length > 0) {
    return details.map((detalle) => detalle.message).join('. ')
  }

  return message || 'Ocurrió un error inesperado. Intentá de nuevo.'
}
