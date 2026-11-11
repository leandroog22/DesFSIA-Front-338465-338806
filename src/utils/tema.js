// Persistencia del tema (claro u oscuro) en localStorage, igual que la sesion:
// Redux es la fuente de verdad y localStorage solo sirve para arrancar con la
// ultima eleccion del usuario.
const CLAVE = 'tripalium_tema'

// Si el usuario nunca eligio, se respeta la preferencia del sistema operativo.
export const leerTema = () => {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado === 'claro' || guardado === 'oscuro') return guardado
  } catch {
    // localStorage bloqueado: se usa la preferencia del sistema.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export const guardarTema = (modo) => {
  try {
    localStorage.setItem(CLAVE, modo)
  } catch {
    // Sin localStorage el tema vale solo para esta visita.
  }
}
