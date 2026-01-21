import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { ThemeProvider } from '@/contexts/theme-context'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context }) => {
    // Check if there's a token first
    const token = localStorage.getItem('auth_token')

    if (!token && !context.auth.isLoading) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <ThemeProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
