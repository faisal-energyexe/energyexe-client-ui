import { Navigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '../../contexts/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, token } = useAuth()
  const location = useLocation()

  // If we're still loading the user data, show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    )
  }

  // Only redirect to login if we're certain the user is not authenticated
  // Check both token and isAuthenticated to avoid race conditions
  if (!token && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        search={{
          redirect: location.href,
        }}
        replace
      />
    )
  }

  // If we have a token but user fetch failed, still show the content
  // This prevents infinite loops when the API is temporarily down
  return <>{children}</>
}
