import AuthLayout from '../../components/auth/AuthLayout'
import RegisterForm from '../../components/auth/RegisterForm'

const RegisterPage = () => {
  return (
    <AuthLayout
      titular="Empezá a contratar el mejor talento tech"
      bajada="Registrá tu empresa y publicá hasta 4 avisos activos con el plan Plus. Cuando necesites más, pasate a Premium."
      titulo="Crear cuenta de empresa"
      subtitulo="Completá los datos para registrar tu compañía y publicar búsquedas."
      etiqueta="B2B"
      registro
    >
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage
