import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Construction } from 'lucide-react'

export const Route = createFileRoute('/_protected/anomalies')({
  component: AnomaliesPage,
})

function AnomaliesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Anomalies</h1>
            <p className="text-muted-foreground">
              Data quality monitoring and anomaly detection
            </p>
          </div>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-amber-500" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The anomaly detection dashboard is currently under development. This page will
            provide active anomalies list with severity badges, trend charts, filtering options,
            and the ability to mark anomalies as resolved or acknowledged.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
