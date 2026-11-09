// Persistencia de la sesion en localStorage, para que recargar la pagina no
// obligue a loguearse de nuevo. Redux es la fuente de verdad mientras la app
// esta abierta; localStorage solo sirve para reconstruir el estado al arrancar.
const CLAVE = 'tripalium_sesion'

export const leerSesion = () => {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE))
    return sesion?.token ? sesion : null
  } catch {
    // JSON corrupto o localStorage bloqueado: se arranca sin sesion.
    return null
  }
}

export const guardarSesion = ({ token, usuario }) => {
  localStorage.setItem(CLAVE, JSON.stringify({ token, usuario }))
}

export const borrarSesion = () => {
  localStorage.removeItem(CLAVE)
}
