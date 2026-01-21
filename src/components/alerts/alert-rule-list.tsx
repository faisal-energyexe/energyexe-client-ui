/**
 * AlertRuleList - Display and manage alert rules.
 */

import { Plus, Trash2, Power, PowerOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import {
  useAlertRules,
  useToggleAlertRule,
  useDeleteAlertRule,
  METRIC_DISPLAY_NAMES,
  CONDITION_DISPLAY_NAMES,
  SCOPE_DISPLAY_NAMES,
  SEVERITY_DISPLAY_NAMES,
  type AlertRule,
  type AlertSeverity,
} from '@/lib/alerts-api'

interface AlertRuleListProps {
  onCreateNew: () => void
}

export function AlertRuleList({ onCreateNew }: AlertRuleListProps) {
  const { data, isLoading, error } = useAlertRules()
  const toggleMutation = useToggleAlertRule()
  const deleteMutation = useDeleteAlertRule()

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
          <p className="text-destructive">Failed to load alert rules</p>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.rules.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No alert rules configured</p>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Alert Rule
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Alert Rules ({data.total})
        </h3>
        <Button size="sm" onClick={onCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Rule
        </Button>
      </div>

      {data.rules.map((rule) => (
        <AlertRuleCard
          key={rule.id}
          rule={rule}
          onToggle={() => toggleMutation.mutate(rule.id)}
          onDelete={() => deleteMutation.mutate(rule.id)}
          isToggling={toggleMutation.isPending}
          isDeleting={deleteMutation.isPending}
        />
      ))}
    </div>
  )
}

interface AlertRuleCardProps {
  rule: AlertRule
  onToggle: () => void
  onDelete: () => void
  isToggling: boolean
  isDeleting: boolean
}

function AlertRuleCard({
  rule,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
}: AlertRuleCardProps) {
  const severityColors: Record<AlertSeverity, string> = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const getConditionText = () => {
    if (rule.condition === 'outside_range') {
      return `${rule.threshold_value} - ${rule.threshold_value_upper}`
    }
    return `${CONDITION_DISPLAY_NAMES[rule.condition]} ${rule.threshold_value}`
  }

  const getScopeText = () => {
    if (rule.scope === 'specific_windfarm' && rule.windfarm) {
      return rule.windfarm.name
    }
    if (rule.scope === 'portfolio' && rule.portfolio) {
      return rule.portfolio.name
    }
    return SCOPE_DISPLAY_NAMES[rule.scope]
  }

  return (
    <Card
      className={cn(
        'bg-card/50 backdrop-blur-sm border-border/50 transition-opacity',
        !rule.is_enabled && 'opacity-60'
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{rule.name}</h4>
              <Badge
                variant="outline"
                className={cn('text-xs', severityColors[rule.severity])}
              >
                {SEVERITY_DISPLAY_NAMES[rule.severity]}
              </Badge>
              {!rule.is_enabled && (
                <Badge variant="secondary" className="text-xs">
                  Disabled
                </Badge>
              )}
            </div>
            {rule.description && (
              <p className="text-sm text-muted-foreground">{rule.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>
                <strong>Metric:</strong> {METRIC_DISPLAY_NAMES[rule.metric]}
              </span>
              <span>
                <strong>Condition:</strong> {getConditionText()}
              </span>
              <span>
                <strong>Scope:</strong> {getScopeText()}
              </span>
              {rule.trigger_count > 0 && (
                <span>
                  <strong>Triggers:</strong> {rule.trigger_count} active
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              disabled={isToggling}
              title={rule.is_enabled ? 'Disable' : 'Enable'}
            >
              {rule.is_enabled ? (
                <Power className="h-4 w-4 text-emerald-400" />
              ) : (
                <PowerOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Alert Rule</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{rule.name}"? This action
                    cannot be undone. All associated triggers will also be
                    deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
