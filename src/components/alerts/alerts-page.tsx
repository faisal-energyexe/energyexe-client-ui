/**
 * AlertsPage - Main alerts management page.
 */

import { useState } from 'react'
import { Bell, Plus, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  useAlertRules,
  useAlertTriggers,
  useNotifications,
  useAlertsSummary,
  SEVERITY_DISPLAY_NAMES,
  type AlertSeverity,
} from '@/lib/alerts-api'
import { AlertRuleList } from './alert-rule-list'
import { AlertTriggerList } from './alert-trigger-list'
import { NotificationList } from './notification-list'
import { CreateAlertRuleModal } from './create-alert-rule-modal'
import { NotificationPreferencesModal } from './notification-preferences-modal'

export function AlertsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false)

  const { data: summary, isLoading: summaryLoading } = useAlertsSummary()
  const { data: rulesData } = useAlertRules()
  const { data: triggersData } = useAlertTriggers()
  const { data: notificationsData } = useNotifications()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Alerts & Notifications
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor your wind farms and receive alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreferencesModalOpen(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Preferences
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Alert Rule
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            title="Alert Rules"
            value={summary.active_rules}
            subtitle={`${summary.total_rules} total`}
            icon={Bell}
          />
          <SummaryCard
            title="Active Triggers"
            value={summary.active_triggers}
            subtitle={
              summary.active_triggers > 0 ? 'Requires attention' : 'All clear'
            }
            icon={AlertTriangle}
            variant={summary.active_triggers > 0 ? 'warning' : 'default'}
          />
          <SummaryCard
            title="Acknowledged"
            value={summary.acknowledged_triggers}
            subtitle="Waiting for resolution"
            icon={Clock}
          />
          <SummaryCard
            title="Unread"
            value={summary.unread_notifications}
            subtitle="Notifications"
            icon={Bell}
            variant={summary.unread_notifications > 0 ? 'info' : 'default'}
          />
        </div>
      ) : null}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card/50 border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">
            Alert Rules
            {rulesData && rulesData.total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {rulesData.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="triggers">
            Triggers
            {triggersData && triggersData.active_count > 0 && (
              <Badge variant="destructive" className="ml-2">
                {triggersData.active_count}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {notificationsData && notificationsData.unread_count > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notificationsData.unread_count}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Recent Triggers */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Recent Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary?.recent_triggers && summary.recent_triggers.length > 0 ? (
                <div className="space-y-3">
                  {summary.recent_triggers.map((trigger) => (
                    <div
                      key={trigger.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <SeverityBadge severity={trigger.severity} />
                        <div>
                          <p className="text-sm font-medium">
                            {trigger.rule_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {trigger.windfarm_name} -{' '}
                            {new Date(trigger.triggered_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={trigger.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                  <p>No recent triggers</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">New Alert Rule</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setActiveTab('triggers')}
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-xs">View Triggers</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="h-5 w-5" />
                  <span className="text-xs">Notifications</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setIsPreferencesModalOpen(true)}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Preferences</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="mt-6">
          <AlertRuleList onCreateNew={() => setIsCreateModalOpen(true)} />
        </TabsContent>

        {/* Triggers Tab */}
        <TabsContent value="triggers" className="mt-6">
          <AlertTriggerList />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <NotificationList />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateAlertRuleModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      <NotificationPreferencesModal
        open={isPreferencesModalOpen}
        onOpenChange={setIsPreferencesModalOpen}
      />
    </div>
  )
}

interface SummaryCardProps {
  title: string
  value: number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'warning' | 'info'
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}: SummaryCardProps) {
  return (
    <Card
      className={cn(
        'bg-card/50 backdrop-blur-sm border-border/50',
        variant === 'warning' && 'border-amber-500/30 bg-amber-500/5',
        variant === 'info' && 'border-blue-500/30 bg-blue-500/5'
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p
              className={cn(
                'text-2xl font-bold',
                variant === 'warning' && 'text-amber-400',
                variant === 'info' && 'text-blue-400'
              )}
            >
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <Icon
            className={cn(
              'h-8 w-8',
              variant === 'default' && 'text-muted-foreground/50',
              variant === 'warning' && 'text-amber-400/50',
              variant === 'info' && 'text-blue-400/50'
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const colors: Record<AlertSeverity, string> = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <Badge variant="outline" className={cn('text-xs', colors[severity])}>
      {SEVERITY_DISPLAY_NAMES[severity]}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-red-500/20 text-red-400 border-red-500/30',
    acknowledged: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }

  const labels: Record<string, string> = {
    active: 'Active',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
  }

  return (
    <Badge variant="outline" className={cn('text-xs', colors[status])}>
      {labels[status]}
    </Badge>
  )
}

export default AlertsPage
