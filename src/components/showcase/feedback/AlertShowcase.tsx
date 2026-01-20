import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export function AlertShowcase() {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Scheduled maintenance window: January 25, 2025 from 02:00 to 06:00 UTC.
        </AlertDescription>
      </Alert>

      <Alert className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 [&>svg]:text-green-600">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          All turbines are operating within normal parameters. System health: Excellent.
        </AlertDescription>
      </Alert>

      <Alert className="border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Wind speed at North Sea site is below optimal levels. Generation may be reduced.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Lost connection to T-009 Iota monitoring system. Please check network connectivity.
        </AlertDescription>
      </Alert>
    </div>
  )
}
