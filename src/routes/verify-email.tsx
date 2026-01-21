import { useEffect, useState } from 'react'
import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { z } from 'zod'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useVerifyEmail, useResendVerification } from '@/lib/auth-api'

const searchSchema = z.object({
  token: z.string().optional(),
  email: z.string().optional(),
})

export const Route = createFileRoute('/verify-email')({
  validateSearch: searchSchema,
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { token, email } = useSearch({ from: '/verify-email' })
  const [verificationStatus, setVerificationStatus] = useState<
    'idle' | 'verifying' | 'success' | 'error'
  >('idle')
  const [isApproved, setIsApproved] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyEmail = useVerifyEmail()
  const resendVerification = useResendVerification()

  useEffect(() => {
    if (token && verificationStatus === 'idle') {
      setVerificationStatus('verifying')
      verifyEmail.mutate(token, {
        onSuccess: (data) => {
          setVerificationStatus('success')
          setIsApproved(data.is_approved)
        },
        onError: (error: Error) => {
          setVerificationStatus('error')
          setErrorMessage(error.message || 'Verification failed')
        },
      })
    }
  }, [token])

  const handleResend = () => {
    if (!email) return
    resendVerification.mutate(email)
  }

  // Waiting for verification token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent you a verification email. Click the link in the email to
              verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {email && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive the email?
                </p>
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={resendVerification.isPending}
                >
                  {resendVerification.isPending
                    ? 'Sending...'
                    : 'Resend Verification Email'}
                </Button>
                {resendVerification.isSuccess && (
                  <p className="text-sm text-green-600 mt-2">
                    Verification email sent!
                  </p>
                )}
              </div>
            )}
            <div className="text-center pt-4 border-t">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Verifying...
  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <h2 className="text-xl font-semibold">Verifying your email...</h2>
              <p className="text-gray-600 mt-2">Please wait a moment.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Verification successful
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {isApproved ? (
              <>
                <p className="text-gray-600">
                  Your account is ready to use. You can now log in.
                </p>
                <Button asChild className="w-full">
                  <Link to="/login">Go to Login</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-600">
                  Your account is pending admin approval. You'll receive an email
                  once your account has been approved.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/pending-approval">View Status</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Verification error
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            The verification link may have expired or is invalid.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
