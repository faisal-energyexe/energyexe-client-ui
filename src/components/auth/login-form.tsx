import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useNavigate, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { LogIn, User, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useAuth } from '../../contexts/auth-context'
import { ApiError } from '../../lib/api'

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onChange: ({ value }) => {
        // Clear error when user starts typing
        if (error) setError(null)

        // Form-level validation to control canSubmit
        const result = loginSchema.safeParse(value)
        if (!result.success) {
          return 'Form has validation errors'
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null)
        setIsSubmitting(true)

        await login(value.username, value.password)
        onSuccess?.()

        // Small delay to ensure auth context updates before navigation
        setTimeout(() => {
          navigate({ to: '/dashboard', replace: true })
        }, 100)
      } catch (err: any) {
        if (err instanceof ApiError) {
          const details = err.data?.detail
          if (Array.isArray(details)) {
            setError(details.map((d) => d.msg).join('\n'))
          } else if (typeof details === 'string') {
            const lowerDetails = details.toLowerCase()
            // Handle special authentication states
            if (lowerDetails.includes('email not verified')) {
              navigate({ to: '/verify-email', search: { email: value.username } })
              return
            } else if (lowerDetails.includes('pending approval')) {
              navigate({ to: '/pending-approval' })
              return
            } else if (
              lowerDetails.includes('user not found') ||
              lowerDetails.includes('invalid credentials') ||
              lowerDetails.includes('incorrect username or password')
            ) {
              setError('Invalid username or password')
            } else if (lowerDetails.includes('account has been deactivated')) {
              setError('Your account has been deactivated. Please contact support.')
            } else {
              setError(details)
            }
          } else {
            setError('Login failed. Please try again.')
          }
        } else {
          setError('An unexpected error occurred.')
        }
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const isFormDisabled = isSubmitting || isLoading

  return (
    <div className="w-full max-w-md">
      {/* Glass card with animated border */}
      <div className="obsidian-card-glow p-[1px]">
        <div className="glass-panel rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-5"
          >
            <form.Field
              name="username"
              validators={{
                onBlur: ({ value }) => {
                  return value.length < 3
                    ? 'Username must be at least 3 characters'
                    : undefined
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your username"
                      autoComplete="username"
                      disabled={isFormDisabled}
                      className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="password"
              validators={{
                onBlur: ({ value }) => {
                  const result = loginSchema.shape.password.safeParse(value)
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isFormDisabled}
                      className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive whitespace-pre-line">
                {error}
              </div>
            )}

            {/* Submit button */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, formIsSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  disabled={!canSubmit || isFormDisabled}
                >
                  {formIsSubmitting || isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            />
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground">New to EnergyExe?</span>
            </div>
          </div>

          {/* Sign up link */}
          <Link
            to="/register"
            className="flex items-center justify-center w-full h-11 rounded-lg border border-border/50 bg-background/30 text-foreground hover:bg-background/50 hover:border-primary/30 transition-all duration-200 text-sm font-medium"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
