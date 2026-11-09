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
import CampoError from '../comunes/CampoError'
import AlertaError from '../comunes/AlertaError'

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
    formState: { errors, isValid, isSubmitting },
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
      // El 409 trae en details que campo esta repetido: se marca ese campo.
      const details = error.response?.data?.details
      const mensaje = mensajeDeError(error)
      if (error.response?.status === 409 && details?.username) {
        setError('username', { message: mensaje })
      } else if (error.response?.status === 409 && details?.email) {
        setError('email', { message: mensaje })
      } else {
        setErrorServidor(mensaje)
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(registrar)} noValidate>
        <div className="form-group">
          <label htmlFor={ids.nombreEmpresa}>Nombre de la empresa</label>
          <input
            type="text"
            id={ids.nombreEmpresa}
            autoComplete="organization"
            placeholder="Acme Software"
            {...register('nombreEmpresa')}
          />
          <CampoError error={errors.nombreEmpresa} />
        </div>

        <div className="form-fila">
          <div className="form-group">
            <label htmlFor={ids.username}>Usuario</label>
            <input
              type="text"
              id={ids.username}
              autoComplete="username"
              placeholder="acme"
              {...register('username')}
            />
            <CampoError error={errors.username} />
          </div>

          <div className="form-group">
            <label htmlFor={ids.email}>Email</label>
            <input
              type="email"
              id={ids.email}
              autoComplete="email"
              placeholder="rrhh@acme.com"
              {...register('email')}
            />
            <CampoError error={errors.email} />
          </div>
        </div>

        <div className="form-fila">
          <div className="form-group">
            <label htmlFor={ids.password}>Contraseña</label>
            {/* deps: al cambiar la contraseña se revalida la confirmacion,
                si no "no coinciden" quedaria desactualizado */}
            <input
              type="password"
              id={ids.password}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              {...register('password', { deps: ['confirmPassword'] })}
            />
            <CampoError error={errors.password} />
          </div>

          <div className="form-group">
            <label htmlFor={ids.confirmPassword}>Repetir contraseña</label>
            <input
              type="password"
              id={ids.confirmPassword}
              autoComplete="new-password"
              placeholder="Repetila"
              {...register('confirmPassword')}
            />
            <CampoError error={errors.confirmPassword} />
          </div>
        </div>

        <AlertaError mensaje={errorServidor} />

        {/* Deshabilitado mientras algun dato sea invalido, como pide la letra */}
        <button type="submit" className="btn btn-primario btn-bloque" disabled={!isValid || isSubmitting}>
          {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth-alternativa">
        ¿Ya tenés cuenta? <Link to="/">Ingresá acá</Link>
      </p>
    </>
  )
}

export default RegisterForm
