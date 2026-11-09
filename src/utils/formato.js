const formatoNumero = new Intl.NumberFormat('es-UY')

export const formatearSalario = ({ salarioMin, salarioMax, moneda = 'UYU' }) => {
  const simbolo = moneda === 'USD' ? 'US$' : '$'
  const hayMin = salarioMin !== undefined && salarioMin !== null
  const hayMax = salarioMax !== undefined && salarioMax !== null

  if (hayMin && hayMax) {
    return `${simbolo} ${formatoNumero.format(salarioMin)} – ${formatoNumero.format(salarioMax)}`
  }
  if (hayMin) return `Desde ${simbolo} ${formatoNumero.format(salarioMin)}`
  if (hayMax) return `Hasta ${simbolo} ${formatoNumero.format(salarioMax)}`
  return 'Salario a convenir'
}

const relativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

const UNIDADES = [
  { unidad: 'year', segundos: 31536000 },
  { unidad: 'month', segundos: 2592000 },
  { unidad: 'week', segundos: 604800 },
  { unidad: 'day', segundos: 86400 },
  { unidad: 'hour', segundos: 3600 },
  { unidad: 'minute', segundos: 60 },
]

// "hace 3 días", "ayer", "hace 2 horas"...
export const formatearFechaRelativa = (fecha) => {
  const segundos = (new Date(fecha).getTime() - Date.now()) / 1000

  for (const { unidad, segundos: tamanio } of UNIDADES) {
    if (Math.abs(segundos) >= tamanio) {
      return relativo.format(Math.round(segundos / tamanio), unidad)
    }
  }
  return 'recién'
}

// Inicial del nombre para el avatar cuando el aviso no tiene logo.
export const inicial = (texto = '') => texto.trim().charAt(0).toUpperCase() || '?'
