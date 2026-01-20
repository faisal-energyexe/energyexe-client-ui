import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
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
            if (
              details.toLowerCase().includes('user not found') ||
              details.toLowerCase().includes('invalid credentials')
            ) {
              setError('Invalid username or password')
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your username and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
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
                <Label htmlFor={field.name}>Username</Label>
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
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
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
                <Label htmlFor={field.name}>Password</Label>
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
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          />

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md whitespace-pre-line">
              {error}
            </div>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, formIsSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isFormDisabled}
              >
                {formIsSubmitting || isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  )
}
