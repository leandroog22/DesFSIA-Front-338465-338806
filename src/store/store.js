import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import avisosReducer from '../features/avisos/avisos.slice'
import usoReducer from '../features/uso/uso.slice'
import estadisticasReducer from '../features/estadisticas/estadisticas.slice'
import categoriasReducer from '../features/categorias/categorias.slice'
import temaReducer from '../features/tema/tema.slice'
import { guardarSesion, borrarSesion } from '../utils/sesion'
import { guardarTema } from '../utils/tema'

const store = configureStore({
  reducer: {
    auth: authReducer,
    avisos: avisosReducer,
    uso: usoReducer,
    estadisticas: estadisticasReducer,
    categorias: categoriasReducer,
    tema: temaReducer,
  },
})

// Sincroniza la sesion con localStorage cada vez que cambia el slice de auth.
// Asi los reducers quedan puros (no tocan localStorage) y ningun componente
// tiene que acordarse de guardar o borrar la sesion a mano.
// Redux Toolkit es inmutable: si auth no cambio, sigue siendo el mismo objeto,
// y con comparar referencias alcanza para no escribir en cada accion.
// Lo mismo con el tema: se guarda solo cuando cambia.
let authAnterior = store.getState().auth
let modoAnterior = store.getState().tema.modo

store.subscribe(() => {
  const { auth, tema } = store.getState()

  if (tema.modo !== modoAnterior) {
    modoAnterior = tema.modo
    guardarTema(tema.modo)
  }

  if (auth === authAnterior) return
  authAnterior = auth

  if (auth.token) {
    guardarSesion(auth)
  } else {
    borrarSesion()
  }
})

export default store
