import AuthLayout from '../../components/auth/AuthLayout'
import LoginForm from '../../components/auth/LoginForm'

const LoginPage = () => {
  return (
    <AuthLayout
      titular="Encontrá talento tech"
      bajada="Publicá tus búsquedas, dejá que la IA detecte las skills y seguí todo desde un solo panel."
      titulo="Iniciar sesión"
      subtitulo="Ingresá tus credenciales para acceder a tu panel de empresa."
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
