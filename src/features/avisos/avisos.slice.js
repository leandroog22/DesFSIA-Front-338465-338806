import { createSlice } from '@reduxjs/toolkit'
import { cerrarSesion } from '../auth/auth.slice'

// Listado de "Mis avisos". Los filtros y la pagina viven aca y no en el
// componente para que se conserven al ir al detalle de un aviso y volver.
const initialState = {
  lista: [],
  page: 1,
  totalPages: 0,
  total: 0,
  filtros: {},
}

const avisosSlice = createSlice({
  name: 'avisos',
  initialState,
  reducers: {
    setAvisos: (state, action) => {
      state.lista = action.payload.avisos
      state.totalPages = action.payload.totalPages
      state.total = action.payload.total
    },
    setFiltros: (state, action) => {
      state.filtros = action.payload
      // Con filtros nuevos la pagina actual puede no existir: se vuelve a la 1.
      state.page = 1
    },
    setPagina: (state, action) => {
      state.page = action.payload
    },
    // Reemplaza un aviso editado sin volver a pedir todo el listado.
    actualizarAvisoEnLista: (state, action) => {
      const indice = state.lista.findIndex((aviso) => aviso._id === action.payload._id)
      if (indice !== -1) state.lista[indice] = action.payload
    },
    quitarAvisoDeLista: (state, action) => {
      state.lista = state.lista.filter((aviso) => aviso._id !== action.payload)
      state.total -= 1
    },
  },
  // Al cerrar sesion se limpia el listado, para que el proximo usuario no vea
  // ni por un instante los avisos del anterior.
  extraReducers: (builder) => {
    builder.addCase(cerrarSesion, () => initialState)
  },
})

export const { setAvisos, setFiltros, setPagina, actualizarAvisoEnLista, quitarAvisoDeLista } =
  avisosSlice.actions

export default avisosSlice.reducer
