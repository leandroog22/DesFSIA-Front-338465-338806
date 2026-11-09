import { createSlice } from '@reduxjs/toolkit'
import { leerSesion } from '../../utils/sesion'

// El estado inicial se reconstruye desde localStorage: si habia una sesion
// guardada, el usuario sigue logueado despues de recargar.
const sesionGuardada = leerSesion()

const initialState = {
  token: sesionGuardada?.token ?? null,
  usuario: sesionGuardada?.usuario ?? null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    iniciarSesion: (state, action) => {
      state.token = action.payload.token
      state.usuario = action.payload.usuario
    },
    cerrarSesion: () => {
      return { token: null, usuario: null }
    },
    // Se usa al cambiar de plan y al refrescar el perfil: actualiza solo
    // los campos que llegan, sin perder el resto.
    actualizarUsuario: (state, action) => {
      state.usuario = { ...state.usuario, ...action.payload }
    },
  },
})

export const { iniciarSesion, cerrarSesion, actualizarUsuario } = authSlice.actions

export const selectEstaLogueado = (state) => state.auth.token !== null
export const selectEsAdmin = (state) => state.auth.usuario?.rol === 'admin'

export default authSlice.reducer
