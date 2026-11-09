// Mismos valores que los enums del modelo Aviso del backend.
export const MODALIDADES = [
  { valor: 'presencial', etiqueta: 'Presencial' },
  { valor: 'hibrido', etiqueta: 'Híbrido' },
  { valor: 'remoto', etiqueta: 'Remoto' },
]

export const SENIORITIES = [
  { valor: 'junior', etiqueta: 'Junior' },
  { valor: 'semi', etiqueta: 'Semi Senior' },
  { valor: 'senior', etiqueta: 'Senior' },
]

export const ESTADOS = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'cerrado', etiqueta: 'Cerrado' },
]

export const MONEDAS = [
  { valor: 'UYU', etiqueta: 'Pesos (UYU)' },
  { valor: 'USD', etiqueta: 'Dólares (USD)' },
]

export const etiquetaDe = (opciones, valor) =>
  opciones.find((opcion) => opcion.valor === valor)?.etiqueta ?? valor

// El backend corta en 4.5 MB (limite del body en Vercel). Se valida antes de
// subir para no mandar un archivo que igual va a rebotar.
export const TAMANIO_MAXIMO_IMAGEN_MB = 4.5

export const AVISOS_POR_PAGINA = 10
