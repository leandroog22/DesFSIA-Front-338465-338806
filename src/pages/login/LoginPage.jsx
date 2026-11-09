import AuthLayout from '../../components/auth/AuthLayout'
import LoginForm from '../../components/auth/LoginForm'

const LoginPage = () => {
  return (
    <AuthLayout titulo="Ingresá a tu cuenta" subtitulo="Gestioná los avisos de tu empresa.">
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
