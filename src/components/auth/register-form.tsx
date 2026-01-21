import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  User,
  Building2,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/lib/auth-api'

export function RegisterForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const register = useRegister()

  const form = useForm({
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      company_name: '',
      phone: '',
      password: '',
      confirm_password: '',
    },
    onSubmit: async ({ value }) => {
      setError('')
      try {
        await register.mutateAsync({
          email: value.email,
          first_name: value.first_name,
          last_name: value.last_name,
          company_name: value.company_name,
          phone: value.phone || undefined,
          password: value.password,
        })
        // Redirect to verify email page
        navigate({
          to: '/verify-email',
          search: { email: value.email },
        })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
      }
    },
  })

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(form.state.values.password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = [
    'bg-destructive',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-emerald-400',
    'bg-emerald-500',
  ]

  return (
    <div className="w-full">
      {/* Glass card with animated border */}
      <div className="obsidian-card-glow p-[1px]">
        <div className="glass-panel rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30 flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Create Account</h1>
            <p className="text-sm text-muted-foreground">
              Join EnergyExe to access energy data analytics
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
            {/* Email */}
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Email is required'
                  if (!value.includes('@')) return 'Please enter a valid email'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Name fields - side by side */}
            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="first_name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Required'
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-sm font-medium text-foreground">
                      First Name
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                      <Input
                        id="first_name"
                        placeholder="John"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="last_name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Required'
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm font-medium text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Company Name */}
            <form.Field
              name="company_name"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Company name is required'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-sm font-medium text-foreground">
                    Company Name
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <Input
                      id="company_name"
                      placeholder="Acme Inc."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Phone (Optional) */}
            <form.Field name="phone">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number{' '}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </form.Field>

            {/* Password */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'Password is required'
                  if (value.length < 8) return 'Password must be at least 8 characters'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="pl-10 pr-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password strength indicator */}
                  {field.state.value && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength:{' '}
                        <span
                          className={
                            passwordStrength >= 4
                              ? 'text-emerald-500'
                              : passwordStrength >= 3
                                ? 'text-yellow-500'
                                : 'text-destructive'
                          }
                        >
                          {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                        </span>
                      </p>
                    </div>
                  )}
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Confirm Password */}
            <form.Field
              name="confirm_password"
              validators={{
                onChangeListenTo: ['password'],
                onChange: ({ value, fieldApi }) => {
                  if (!value) return 'Please confirm your password'
                  if (value !== fieldApi.form.getFieldValue('password'))
                    return 'Passwords do not match'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {field.state.value &&
                      field.state.value === form.state.values.password &&
                      !field.state.meta.errors.length ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="pl-10 pr-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Terms notice */}
            <p className="text-xs text-muted-foreground text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>

            {/* Submit button */}
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-medium transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40"
                  disabled={!canSubmit || isSubmitting || register.isPending}
                >
                  {register.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>
    </div>
  )
}
