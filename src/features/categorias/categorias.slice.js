import { createSlice } from '@reduxjs/toolkit'
import { cerrarSesion } from '../auth/auth.slice'

// Catalogo de areas. Lo usan el alta de avisos, la edicion, los filtros y la
// pantalla de administracion: si el admin crea o desactiva una categoria, los
// desplegables se actualizan sin recargar.
const initialState = {
  lista: [],
}

const ordenarPorNombre = (lista) => lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {
    setCategorias: (state, action) => {
      state.lista = action.payload
    },
    agregarCategoria: (state, action) => {
      state.lista.push(action.payload)
      ordenarPorNombre(state.lista)
    },
    reemplazarCategoria: (state, action) => {
      const indice = state.lista.findIndex((c) => c._id === action.payload._id)
      if (indice !== -1) state.lista[indice] = action.payload
      ordenarPorNombre(state.lista)
    },
    quitarCategoria: (state, action) => {
      state.lista = state.lista.filter((c) => c._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cerrarSesion, () => initialState)
  },
})

export const { setCategorias, agregarCategoria, reemplazarCategoria, quitarCategoria } =
  categoriasSlice.actions

export const selectCategoriasActivas = (state) => state.categorias.lista.filter((c) => c.activa)

export default categoriasSlice.reducer
