import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { registroSchema } from '../../validators/auth.validators'
import { registroService } from '../../services/auth.services'
import { iniciarSesion } from '../../features/auth/auth.slice'
import { mensajeDeError } from '../../utils/errores'
import AlertaError from '../comunes/AlertaError'
import Spinner from '../comunes/Spinner'
import CampoAuth from './CampoAuth'

const RegisterForm = () => {
  const ids = {
    nombreEmpresa: useId(),
    username: useId(),
    email: useId(),
    password: useId(),
    confirmPassword: useId(),
  }
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Error que devuelve la API. Va en estado local y no con setError de
  // react-hook-form porque setError marca el formulario como invalido y
  // dejaria el boton deshabilitado aunque los datos esten bien (por ejemplo,
  // para reintentar despues de un error de red).
  const [errorServidor, setErrorServidor] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting, dirtyFields },
  } = useForm({
    resolver: joiResolver(registroSchema),
    mode: 'onChange',
    defaultValues: {
      nombreEmpresa: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Un campo se marca "Valido" cuando el usuario ya lo toco y no tiene error.
  const esValido = (campo) => Boolean(dirtyFields[campo]) && !errors[campo]

  const registrar = async (datos) => {
    setErrorServidor(null)
    try {
      // El backend tambien valida confirmPassword, por eso se manda.
      const { token, usuario } = await registroService(datos)

      // Auto-login: el registro ya devuelve el token, no hace falta pasar por
      // la pantalla de login.
      dispatch(iniciarSesion({ token, usuario }))
      toast.success(`¡Bienvenida/o a Tripalium, ${usuario.nombreEmpresa}!`)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const mensaje = mensajeDeError(error)
      setErrorServidor(mensaje)

      // El 409 trae en details que campo esta repetido: ademas del aviso
      // general, se marca ese campo para que el usuario sepa que cambiar.
      const details = error.response?.data?.details
      if (error.response?.status === 409 && details?.username) {
        setError('username', { message: 'Elegí otro nombre de usuario' })
      } else if (error.response?.status === 409 && details?.email) {
        setError('email', { message: 'Usá otro email' })
      }
    }
  }

  return (
    <>
      <AlertaError
        titulo={errorServidor}
        mensaje={errorServidor && 'Revisá los datos marcados y volvé a intentar.'}
      />

      <form onSubmit={handleSubmit(registrar)} noValidate>
        <CampoAuth
          id={ids.nombreEmpresa}
          etiqueta="Nombre de la empresa"
          icono="domain"
          ayuda="Requerido"
          error={errors.nombreEmpresa}
          valido={esValido('nombreEmpresa')}
        >
          <input
            type="text"
            id={ids.nombreEmpresa}
            autoComplete="organization"
            placeholder="Ej. Acme Inc."
            {...register('nombreEmpresa')}
          />
        </CampoAuth>

        <div className="form-fila">
          <CampoAuth
            id={ids.username}
            etiqueta="Usuario"
            icono="badge"
            error={errors.username}
            valido={esValido('username')}
          >
            <input type="text" id={ids.username} autoComplete="username" placeholder="acme" {...register('username')} />
          </CampoAuth>

          <CampoAuth id={ids.email} etiqueta="Email" icono="mail" error={errors.email} valido={esValido('email')}>
            <input
              type="email"
              id={ids.email}
              autoComplete="email"
              placeholder="rrhh@acme.com"
              {...register('email')}
            />
          </CampoAuth>
        </div>

        <div className="form-fila">
          <CampoAuth
            id={ids.password}
            etiqueta="Contraseña"
            icono="lock"
            error={errors.password}
            valido={esValido('password')}
          >
            {/* deps: al cambiar la contraseña se revalida la confirmacion,
                si no "no coinciden" quedaria desactualizado */}
            <input
              type="password"
              id={ids.password}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              {...register('password', { deps: ['confirmPassword'] })}
            />
          </CampoAuth>

          <CampoAuth
            id={ids.confirmPassword}
            etiqueta="Repetir contraseña"
            icono="lock_reset"
            error={errors.confirmPassword}
            valido={esValido('confirmPassword')}
          >
            <input
              type="password"
              id={ids.confirmPassword}
              autoComplete="new-password"
              placeholder="Repetila"
              {...register('confirmPassword')}
            />
          </CampoAuth>
        </div>

        {/* Deshabilitado mientras algun dato sea invalido, como pide la letra */}
        <button type="submit" className="btn btn-primario btn-bloque" disabled={!isValid || isSubmitting}>
          {isSubmitting ? <Spinner enLinea /> : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth-alternativa">
        ¿Ya tenés cuenta? <Link to="/">Iniciá sesión</Link>
      </p>
    </>
  )
}

export default RegisterForm
