/**
 * AlertTriggerList - Display and manage alert triggers.
 */

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Eye, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  useAlertTriggers,
  useAcknowledgeTrigger,
  useResolveTrigger,
  SEVERITY_DISPLAY_NAMES,
  type AlertTrigger,
  type AlertTriggerStatus,
  type AlertSeverity,
} from '@/lib/alerts-api'

export function AlertTriggerList() {
  const [statusFilter, setStatusFilter] = useState<AlertTriggerStatus | 'all'>(
    'all'
  )
  const { data, isLoading, error } = useAlertTriggers(
    statusFilter === 'all' ? undefined : statusFilter
  )
  const acknowledgeMutation = useAcknowledgeTrigger()
  const resolveMutation = useResolveTrigger()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Failed to load alert triggers</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with stats and filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">Alert Triggers</h3>
          {data && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive">{data.active_count} Active</Badge>
              <Badge variant="secondary">
                {data.acknowledged_count} Acknowledged
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as AlertTriggerStatus | 'all')
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Triggers list */}
      {!data || data.triggers.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
            <p className="text-muted-foreground">
              {statusFilter === 'all'
                ? 'No alert triggers'
                : `No ${statusFilter} triggers`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.triggers.map((trigger) => (
            <TriggerCard
              key={trigger.id}
              trigger={trigger}
              onAcknowledge={() => acknowledgeMutation.mutate(trigger.id)}
              onResolve={() => resolveMutation.mutate(trigger.id)}
              isAcknowledging={acknowledgeMutation.isPending}
              isResolving={resolveMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface TriggerCardProps {
  trigger: AlertTrigger
  onAcknowledge: () => void
  onResolve: () => void
  isAcknowledging: boolean
  isResolving: boolean
}

function TriggerCard({
  trigger,
  onAcknowledge,
  onResolve,
  isAcknowledging,
  isResolving,
}: TriggerCardProps) {
  const severityColors: Record<AlertSeverity, string> = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const statusColors: Record<AlertTriggerStatus, string> = {
    active: 'bg-red-500/20 text-red-400 border-red-500/30',
    acknowledged: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }

  const statusIcons: Record<AlertTriggerStatus, React.ReactNode> = {
    active: <AlertTriangle className="h-4 w-4" />,
    acknowledged: <Clock className="h-4 w-4" />,
    resolved: <CheckCircle className="h-4 w-4" />,
  }

  return (
    <Card
      className={cn(
        'bg-card/50 backdrop-blur-sm border-border/50',
        trigger.status === 'active' && 'border-l-2 border-l-red-500'
      )}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            {/* Header row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn('text-xs', severityColors[trigger.severity])}
              >
                {SEVERITY_DISPLAY_NAMES[trigger.severity]}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs gap-1',
                  statusColors[trigger.status]
                )}
              >
                {statusIcons[trigger.status]}
                {trigger.status.charAt(0).toUpperCase() +
                  trigger.status.slice(1)}
              </Badge>
            </div>

            {/* Rule name and message */}
            <div>
              <h4 className="font-medium">{trigger.rule_name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {trigger.message}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>
                <strong>Wind Farm:</strong> {trigger.windfarm_name}
              </span>
              <span>
                <strong>Value:</strong> {trigger.triggered_value.toFixed(2)}
              </span>
              <span>
                <strong>Threshold:</strong> {trigger.threshold_value.toFixed(2)}
              </span>
              <span>
                <strong>Triggered:</strong>{' '}
                {new Date(trigger.triggered_at).toLocaleString()}
              </span>
              {trigger.acknowledged_at && (
                <span>
                  <strong>Acknowledged:</strong>{' '}
                  {new Date(trigger.acknowledged_at).toLocaleString()}
                </span>
              )}
              {trigger.resolved_at && (
                <span>
                  <strong>Resolved:</strong>{' '}
                  {new Date(trigger.resolved_at).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {trigger.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAcknowledge}
                disabled={isAcknowledging}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Acknowledge
              </Button>
            )}
            {(trigger.status === 'active' ||
              trigger.status === 'acknowledged') && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResolve}
                disabled={isResolving}
                className="gap-2 text-emerald-400 hover:text-emerald-400"
              >
                <CheckCircle className="h-4 w-4" />
                Resolve
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
