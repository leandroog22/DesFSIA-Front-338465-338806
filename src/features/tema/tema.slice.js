import { createSlice } from '@reduxjs/toolkit'
import { leerTema } from '../../utils/tema'

// Tema de la interfaz. Es estado global porque lo usan el header (el boton
// que lo cambia), el layout (que lo aplica al documento) y los graficos (que
// eligen sus colores segun el tema). No se resetea al cerrar sesion: es una
// preferencia del navegador, no del usuario logueado.
const initialState = {
  modo: leerTema(),
}

const temaSlice = createSlice({
  name: 'tema',
  initialState,
  reducers: {
    alternarTema: (state) => {
      state.modo = state.modo === 'oscuro' ? 'claro' : 'oscuro'
    },
  },
})

export const { alternarTema } = temaSlice.actions

export const selectEsOscuro = (state) => state.tema.modo === 'oscuro'

export default temaSlice.reducer
