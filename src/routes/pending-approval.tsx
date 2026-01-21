import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/pending-approval')({
  component: PendingApprovalPage,
})

function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle>Account Pending Approval</CardTitle>
          <CardDescription>
            Your account is currently being reviewed by our team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-gray-700">
              Thank you for registering with EnergyExe. Your account is pending
              approval from our administrators.
            </p>
            <p className="text-gray-700">
              Once approved, you'll receive an email notification and will be able
              to log in to access all features.
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">Need help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you have any questions about your application or need assistance,
              please contact our support team.
            </p>
            <a
              href="mailto:hello@energyexe.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Mail className="h-4 w-4" />
              hello@energyexe.com
            </a>
          </div>

          <div className="border-t pt-4 text-center">
            <Button asChild variant="outline">
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
