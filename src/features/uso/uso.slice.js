import { createSlice } from '@reduxjs/toolkit'
import { cerrarSesion } from '../auth/auth.slice'

// Informe de uso del plan: lo leen el panel, el header, el listado y el alta
// de avisos, por eso es estado global.
// Forma que devuelve la API: { plan, usados, limite, porcentaje, ilimitado }
const initialState = {
  datos: null,
}

const usoSlice = createSlice({
  name: 'uso',
  initialState,
  reducers: {
    setUso: (state, action) => {
      state.datos = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cerrarSesion, () => initialState)
  },
})

export const { setUso } = usoSlice.actions

// Mientras el uso no cargo se asume que hay cupo: el backend igual valida el
// limite y responde 403 si no lo hay.
export const selectHayCupo = (state) => {
  const uso = state.uso.datos
  if (!uso) return true
  return uso.ilimitado || uso.usados < uso.limite
}

export default usoSlice.reducer
