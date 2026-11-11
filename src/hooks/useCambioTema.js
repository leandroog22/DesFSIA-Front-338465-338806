import { flushSync } from 'react-dom'
import { useDispatch } from 'react-redux'
import { alternarTema } from '../features/tema/tema.slice'

const DURACION_MS = 900
// Ancho del borde difuso del circulo, en pixeles.
const DIFUMINADO_PX = 140

// Cambio de tema con transicion: el tema nuevo aparece como un circulo de
// borde difuso que crece desde el boton hasta cubrir toda la pantalla.
//
// Usa la View Transitions API del navegador: startViewTransition saca una
// "foto" de la pagina antes del cambio, aplica el cambio y saca otra foto
// despues. Con esas dos fotos (::view-transition-old y ::view-transition-new)
// se anima el pasaje. A la foto nueva se le pone una mascara con un degradado
// radial (index.css) y aca se anima su radio, la variable --tema-radio.
const useCambioTema = () => {
  const dispatch = useDispatch()

  const cambiarTema = (evento) => {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Navegadores sin la API (o usuarios que pidieron menos movimiento):
    // el tema cambia de golpe, sin animacion.
    if (!document.startViewTransition || sinMovimiento) {
      dispatch(alternarTema())
      return
    }

    // Centro del boton: el circulo crece desde ahi (funciona igual si se
    // activo con el teclado, que no tiene coordenadas de mouse).
    const boton = evento.currentTarget.getBoundingClientRect()
    const x = boton.left + boton.width / 2
    const y = boton.top + boton.height / 2
    // Radio final: la distancia hasta la esquina mas lejana, mas el borde
    // difuso, para que al terminar no quede ninguna esquina a medio pintar.
    const radio =
      Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + DIFUMINADO_PX

    // El centro y el ancho del borde los lee el degradado de index.css; los
    // pseudo-elementos de la transicion heredan las variables de <html>.
    const raiz = document.documentElement
    raiz.style.setProperty('--tema-x', `${x}px`)
    raiz.style.setProperty('--tema-y', `${y}px`)
    raiz.style.setProperty('--tema-difuminado', `${DIFUMINADO_PX}px`)

    // flushSync obliga a React a actualizar el DOM dentro del callback; si no,
    // la "foto" de despues se sacaria antes de que cambie el tema.
    const transicion = document.startViewTransition(() => {
      flushSync(() => dispatch(alternarTema()))
    })

    transicion.ready
      .then(() => {
        const animacion = raiz.animate(
          { '--tema-radio': ['0px', `${radio}px`] },
          {
            duration: DURACION_MS,
            // Arranca y termina despacio (ease-in-out suave).
            easing: 'cubic-bezier(0.45, 0, 0.25, 1)',
            // Mantiene el radio final hasta que el navegador cierre la
            // transicion; sin esto volveria a 0 y parpadearia el tema viejo.
            fill: 'forwards',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        // Con fill: 'forwards' la animacion queda guardada en <html> aunque
        // ya termino; cuando el navegador cierra la transicion se descarta.
        transicion.finished.then(() => animacion.cancel())
      })
      // Si se toca el boton de nuevo antes de que termine, el navegador
      // saltea la transicion anterior y "ready" falla. No es un error: el
      // tema ya cambio y la transicion nueva se encarga de la animacion.
      .catch(() => {})
  }

  return cambiarTema
}

export default useCambioTema
