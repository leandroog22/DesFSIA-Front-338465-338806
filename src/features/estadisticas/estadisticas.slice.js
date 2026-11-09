import { createSlice } from '@reduxjs/toolkit'
import { cerrarSesion } from '../auth/auth.slice'

// Datos agregados para el grafico y los indicadores del panel.
// Forma: { total, porCategoria, porSeniority, porModalidad, porEstado },
// cada "por..." es una lista de { valor, cantidad }.
const initialState = {
  datos: null,
}

const estadisticasSlice = createSlice({
  name: 'estadisticas',
  initialState,
  reducers: {
    setEstadisticas: (state, action) => {
      state.datos = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cerrarSesion, () => initialState)
  },
})

export const { setEstadisticas } = estadisticasSlice.actions
export default estadisticasSlice.reducer
