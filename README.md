# Tripalium · Frontend

Frontend del **Obligatorio 2** de Desarrollo Full Stack integrado con IA (Universidad ORT Uruguay, grupo N4A, estudiantes 338465 y 338806).

Consume la API REST del Obligatorio 1: <https://des-fsia-n4-a-338465-338806.vercel.app/v1>

## Stack

Las mismas librerías vistas en clase (material de Clase 17 y 18):

| Para qué | Librería |
|---|---|
| Proyecto | Vite + React 19 |
| Estado global | Redux Toolkit (`createSlice`, `configureStore`) + react-redux |
| Ruteo | react-router |
| Formularios | react-hook-form + Joi (`@hookform/resolvers/joi`) |
| HTTP | axios |
| Gráfico | chart.js + react-chartjs-2 |
| Notificaciones | react-toastify |

## Diseño

La interfaz sigue los diseños hechos en Stitch y el design system **Executive Trust Matrix**: tipografía Inter, índigo `#3730A3` como color de marca, ámbar reservado para Premium y avisos de límite, neutros slate, tarjetas de 12px y controles de 8px. Los colores y medidas están como variables CSS al principio de `src/index.css`, y los íconos son Material Symbols (`components/comunes/Icono.jsx`).

## Estructura

```
src/
├── api/api.js            instancia de axios + interceptores (token y sesión vencida)
├── app/guards/           ProtectedRoute · PublicRoute · AdminRoute
├── store/store.js        configureStore + sincronización de la sesión con localStorage
├── features/             un slice por dominio: auth · avisos · uso · estadisticas · categorias
├── services/             única capa que conoce las URLs de la API
├── validators/           esquemas Joi (los mismos límites que el backend)
├── hooks/                useRefrescarResumen
├── pages/                una carpeta por pantalla
├── components/           componentes por área (auth, avisos, dashboard, categorias, comunes)
├── constants/ · utils/
└── index.css             estilos globales con variables CSS
```

Flujo de una acción: **componente → service → API**, y la respuesta vuelve con **dispatch → slice → useSelector** en todos los componentes que la muestran.

## Requerimientos de la letra

| # | Requerimiento | Dónde |
|---|---|---|
| 1 | Registro con repetir contraseña, botón deshabilitado mientras haya datos inválidos, error en la interfaz y auto-login | `components/auth/RegisterForm.jsx` |
| 2 | Login con botón deshabilitado si falta un campo y error en la interfaz | `components/auth/LoginForm.jsx` |
| 3 | Logout | `pages/ContainerPage.jsx` |
| 4 | Alta de aviso solo si el plan tiene cupo | `pages/avisos/NuevoAvisoPage.jsx`, `components/avisos/AvisoForm.jsx` |
| 5.1.1 | Listado de los avisos del usuario | `pages/avisos/MisAvisosPage.jsx` |
| 5.1.2 | Eliminar | `components/avisos/AvisoFila.jsx` |
| 5.1.3 | Edición en línea | `components/avisos/AvisoEdicionInline.jsx` |
| 5.1.4 | Filtros | `components/avisos/FiltrosAvisos.jsx` |
| 6.1.1 | Porcentaje (Plus) o cantidad (Premium) | `components/dashboard/UsoPlan.jsx` |
| 6.1.2 | Cambio de plan | `components/dashboard/CambioPlan.jsx` |
| 7 | Gráficos (donas de Chart.js y barras por categoría) | `components/dashboard/Graficos.jsx`, `DonaEstadistica.jsx` |
| — | Manejo de imágenes (portada en el alta y reemplazo en el detalle) | `components/avisos/AvisoForm.jsx`, `ImagenAvisoForm.jsx` |

Además: pantalla **Explorar** (bolsa de trabajo con los avisos activos de todas las empresas), detalle de aviso con el **análisis de IA** y reintento, cerrar/reabrir avisos para liberar cupo, ABM de **categorías** para el administrador y cierre automático de la sesión cuando vence el token.

## Cómo levantarlo

```bash
npm install
npm run dev
```

Por defecto usa la API publicada. Para apuntar a un backend local, crear `.env.local` con:

```
VITE_API_URL=http://localhost:3000/v1
```

## Deploy

En Vercel, con el preset de Vite. `vercel.json` redirige todas las rutas a `index.html` para que funcionen los links directos (por ejemplo `/avisos/123`) con `BrowserRouter`.
