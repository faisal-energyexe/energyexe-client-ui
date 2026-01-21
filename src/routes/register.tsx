import { createFileRoute, Navigate, Link } from '@tanstack/react-router'
import { RegisterForm } from '@/components/auth/register-form'
import { useAuth } from '@/contexts/auth-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { ObsidianBackground } from '@/components/layouts/obsidian/ObsidianBackground'
import { Zap } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth()

  // If already authenticated, redirect to home
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <ThemeProvider>
      <div className="theme-obsidian dark min-h-screen relative overflow-hidden">
        {/* Premium animated background */}
        <ObsidianBackground />

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {/* Logo and brand */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent blur-xl opacity-50" />
              </div>
              <span className="text-3xl font-bold gradient-text">EnergyExe</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Energy Data Analytics Platform
            </p>
          </div>

          {/* Register form card */}
          <div className="w-full max-w-md space-y-6">
            <RegisterForm />

            {/* Sign in link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EnergyExe. All rights reserved.</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
