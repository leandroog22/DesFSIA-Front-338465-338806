import Joi from 'joi'

const VALORES_MODALIDAD = ['presencial', 'hibrido', 'remoto']
const VALORES_SENIORITY = ['junior', 'semi', 'senior']

// Cada campo se define una sola vez y se combina en los dos esquemas: el de
// alta (todo el formulario) y el de edicion en linea (algunos campos).
const campos = {
  titulo: Joi.string().trim().min(5).max(120).required().messages({
    'string.empty': 'El título es obligatorio',
    'string.min': 'El título debe tener al menos {#limit} caracteres',
    'string.max': 'El título no puede superar los {#limit} caracteres',
  }),
  descripcion: Joi.string().trim().min(20).max(5000).required().messages({
    'string.empty': 'La descripción es obligatoria',
    'string.min': 'Contá un poco más: al menos {#limit} caracteres',
    'string.max': 'La descripción no puede superar los {#limit} caracteres',
  }),
  categoria: Joi.string().required().messages({
    'string.empty': 'Elegí una categoría',
  }),
  modalidad: Joi.string()
    .valid(...VALORES_MODALIDAD)
    .required()
    .messages({
      'string.empty': 'Elegí una modalidad',
      'any.only': 'Elegí una modalidad',
    }),
  seniority: Joi.string()
    .valid(...VALORES_SENIORITY)
    .required()
    .messages({
      'string.empty': 'Elegí el seniority',
      'any.only': 'Elegí el seniority',
    }),
  // Los salarios son opcionales: un input vacio llega como undefined (ver
  // aNumeroOpcional en utils/objetos.js).
  salarioMin: Joi.number().min(0).max(100000000).messages({
    'number.base': 'Ingresá un número',
    'number.min': 'El salario no puede ser negativo',
    'number.max': 'Revisá el monto ingresado',
  }),
  salarioMax: Joi.number()
    .min(0)
    .max(100000000)
    .when('salarioMin', {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref('salarioMin')),
    })
    .messages({
      'number.base': 'Ingresá un número',
      'number.min': 'El máximo no puede ser menor que el mínimo',
      'number.max': 'Revisá el monto ingresado',
    }),
  moneda: Joi.string().valid('UYU', 'USD').required(),
  ubicacion: Joi.string().trim().max(80).allow('').messages({
    'string.max': 'La ubicación no puede superar los {#limit} caracteres',
  }),
}

export const avisoSchema = Joi.object(campos)

export const edicionAvisoSchema = Joi.object({
  titulo: campos.titulo,
  categoria: campos.categoria,
  modalidad: campos.modalidad,
  seniority: campos.seniority,
  salarioMin: campos.salarioMin,
  salarioMax: campos.salarioMax,
  moneda: campos.moneda,
})
