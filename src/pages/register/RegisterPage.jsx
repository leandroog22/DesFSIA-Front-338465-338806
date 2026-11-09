import AuthLayout from '../../components/auth/AuthLayout'
import RegisterForm from '../../components/auth/RegisterForm'

const RegisterPage = () => {
  return (
    <AuthLayout
      titulo="Registrá tu empresa"
      subtitulo="Empezás en el plan Plus, con hasta 4 avisos activos."
    >
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage
