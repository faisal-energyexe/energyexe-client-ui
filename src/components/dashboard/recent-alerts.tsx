import { useState } from 'react'
import { AlertCircle, AlertTriangle, Info, X, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { alertsData, type Alert, type AlertSeverity } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const severityConfig: Record<
  AlertSeverity,
  { icon: typeof AlertCircle; color: string; bg: string }
> = {
  critical: {
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-500/10',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-500/10',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
  },
}

export function RecentAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(alertsData.slice(0, 5))

  const dismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Recent Alerts</CardTitle>
          </div>
          {unacknowledgedCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unacknowledgedCount} new
            </Badge>
          )}
        </div>
        <CardDescription>Latest system notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active alerts
          </p>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity]
            const Icon = config.icon

            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
                  config.bg,
                  !alert.acknowledged && 'ring-1 ring-inset ring-current/10'
                )}
              >
                <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">{alert.title}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0 -mr-1"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    <span>{alert.location}</span>
                    <span>•</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
        {alertsData.length > 5 && (
          <Button variant="ghost" className="w-full text-xs" size="sm">
            View all {alertsData.length} alerts
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
