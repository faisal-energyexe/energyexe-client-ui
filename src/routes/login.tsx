import { createFileRoute, Navigate } from '@tanstack/react-router'
import { LoginForm } from '@/components/auth/login-form'
import { useAuth } from '@/contexts/auth-context'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()

  // If already authenticated, redirect to home
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <LoginForm />
    </div>
  )
}
