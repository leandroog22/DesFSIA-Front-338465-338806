import Joi from 'joi'

// Las reglas replican las del backend (auth.validators.js del servidor):
// lo que el front deja pasar, la API lo acepta. Asi no se hacen requests que
// ya se sabe que van a fallar.

export const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    'string.empty': 'Ingresá tu nombre de usuario',
    'any.required': 'Ingresá tu nombre de usuario',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Ingresá tu contraseña',
    'any.required': 'Ingresá tu contraseña',
  }),
})

export const registroSchema = Joi.object({
  nombreEmpresa: Joi.string().trim().min(2).max(80).required().messages({
    'string.empty': 'El nombre de la empresa es obligatorio',
    'string.min': 'El nombre de la empresa debe tener al menos {#limit} caracteres',
    'string.max': 'El nombre de la empresa no puede superar los {#limit} caracteres',
  }),
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^\S+$/)
    .required()
    .messages({
      'string.empty': 'El nombre de usuario es obligatorio',
      'string.min': 'El nombre de usuario debe tener al menos {#limit} caracteres',
      'string.max': 'El nombre de usuario no puede superar los {#limit} caracteres',
      'string.pattern.base': 'El nombre de usuario no puede tener espacios',
    }),
  // tlds: false porque en el navegador Joi no trae la lista de dominios de
  // primer nivel; sin esto, .email() lanza un error en vez de validar.
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'El email es obligatorio',
      'string.email': 'El email no tiene un formato válido',
    }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.empty': 'La contraseña es obligatoria',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
    'string.max': 'La contraseña no puede superar los {#limit} caracteres',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.empty': 'Repetí la contraseña',
    'any.only': 'Las contraseñas no coinciden',
  }),
})
