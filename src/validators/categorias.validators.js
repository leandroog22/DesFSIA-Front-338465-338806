import Joi from 'joi'

export const categoriaSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(40).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres',
    'string.max': 'El nombre no puede superar los {#limit} caracteres',
  }),
  descripcion: Joi.string().trim().max(200).allow('').messages({
    'string.max': 'La descripción no puede superar los {#limit} caracteres',
  }),
})
