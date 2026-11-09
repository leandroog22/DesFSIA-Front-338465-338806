import { useId, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { loginSchema } from '../../validators/auth.validators'
import { loginService } from '../../services/auth.services'
import { iniciarSesion } from '../../features/auth/auth.slice'
import { mensajeDeError } from '../../utils/errores'
import CampoError from '../comunes/CampoError'
import AlertaError from '../comunes/AlertaError'

const LoginForm = () => {
  const usernameId = useId()
  const passwordId = useId()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Error que devuelve la API. Va en estado local y no con setError de
  // react-hook-form porque setError marca el formulario como invalido y
  // dejaria el boton deshabilitado aunque los datos esten bien (por ejemplo,
  // para reintentar despues de un error de red).
  const [errorServidor, setErrorServidor] = useState(null)

  // mode 'onChange': valida mientras se escribe, asi isValid esta siempre al
  // dia y el boton se habilita apenas los dos campos tienen algo.
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: joiResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { username: '', password: '' },
  })

  const ingresar = async (credenciales) => {
    setErrorServidor(null)
    try {
      const { token, usuario } = await loginService(credenciales)
      dispatch(iniciarSesion({ token, usuario }))
      toast.success(`¡Hola de nuevo, ${usuario.nombreEmpresa}!`)
      // Si el guard lo habia mandado al login, vuelve a donde queria ir.
      navigate(location.state?.desde ?? '/dashboard', { replace: true })
    } catch (error) {
      // Por ejemplo "Datos incorrectos": se muestra arriba del boton.
      setErrorServidor(mensajeDeError(error))
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(ingresar)} noValidate>
        <div className="form-group">
          <label htmlFor={usernameId}>Usuario</label>
          <input
            type="text"
            id={usernameId}
            autoComplete="username"
            placeholder="tu_empresa"
            {...register('username')}
          />
          <CampoError error={errors.username} />
        </div>

        <div className="form-group">
          <label htmlFor={passwordId}>Contraseña</label>
          <input
            type="password"
            id={passwordId}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register('password')}
          />
          <CampoError error={errors.password} />
        </div>

        <AlertaError mensaje={errorServidor} />

        <button type="submit" className="btn btn-primario btn-bloque" disabled={!isValid || isSubmitting}>
          {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Ingresar'}
        </button>
      </form>

      <p className="auth-alternativa">
        ¿Todavía no tenés cuenta? <Link to="/registro">Registrá tu empresa</Link>
      </p>
    </>
  )
}

export default LoginForm
