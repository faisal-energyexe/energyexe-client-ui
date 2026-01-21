/**
 * CreateAlertRuleModal - Modal for creating new alert rules.
 */

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useCreateAlertRule,
  METRIC_DISPLAY_NAMES,
  CONDITION_DISPLAY_NAMES,
  SCOPE_DISPLAY_NAMES,
  SEVERITY_DISPLAY_NAMES,
  CHANNEL_DISPLAY_NAMES,
  type AlertRuleCreate,
  type AlertMetric,
  type AlertCondition,
  type AlertScope,
  type AlertSeverity,
  type NotificationChannel,
} from '@/lib/alerts-api'
import { useWindfarms } from '@/lib/windfarms-api'
import { usePortfolios } from '@/lib/portfolio-api'

interface CreateAlertRuleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  name: string
  description: string
  metric: AlertMetric
  condition: AlertCondition
  threshold_value: number
  threshold_value_upper: number
  scope: AlertScope
  windfarm_id: number | null
  portfolio_id: number | null
  severity: AlertSeverity
  sustained_minutes: number
  channels: NotificationChannel[]
}

const DEFAULT_FORM_DATA: FormData = {
  name: '',
  description: '',
  metric: 'capacity_factor',
  condition: 'below',
  threshold_value: 0,
  threshold_value_upper: 0,
  scope: 'all_windfarms',
  windfarm_id: null,
  portfolio_id: null,
  severity: 'medium',
  sustained_minutes: 0,
  channels: ['in_app'],
}

export function CreateAlertRuleModal({
  open,
  onOpenChange,
}: CreateAlertRuleModalProps) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const createMutation = useCreateAlertRule()
  const { data: windfarms, isLoading: windfarmsLoading } = useWindfarms({
    limit: 100,
  })
  const { data: portfolios, isLoading: portfoliosLoading } = usePortfolios()

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData(DEFAULT_FORM_DATA)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: AlertRuleCreate = {
      name: formData.name,
      description: formData.description || undefined,
      metric: formData.metric,
      condition: formData.condition,
      threshold_value: formData.threshold_value,
      threshold_value_upper:
        formData.condition === 'outside_range'
          ? formData.threshold_value_upper
          : undefined,
      scope: formData.scope,
      windfarm_id:
        formData.scope === 'specific_windfarm'
          ? formData.windfarm_id ?? undefined
          : undefined,
      portfolio_id:
        formData.scope === 'portfolio'
          ? formData.portfolio_id ?? undefined
          : undefined,
      severity: formData.severity,
      sustained_minutes: formData.sustained_minutes,
      channels: formData.channels,
    }

    try {
      await createMutation.mutateAsync(payload)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleChannelToggle = (channel: NotificationChannel) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }))
  }

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.channels.length > 0 &&
    (formData.scope !== 'specific_windfarm' || formData.windfarm_id !== null) &&
    (formData.scope !== 'portfolio' || formData.portfolio_id !== null) &&
    (formData.condition !== 'outside_range' ||
      formData.threshold_value_upper > formData.threshold_value)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Alert Rule</DialogTitle>
          <DialogDescription>
            Configure alerts to monitor your wind farm performance metrics.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Low Capacity Factor Alert"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description of this alert rule"
                rows={2}
              />
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Alert Condition</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Metric</Label>
                <Select
                  value={formData.metric}
                  onValueChange={(value: AlertMetric) =>
                    setFormData((prev) => ({ ...prev, metric: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.keys(METRIC_DISPLAY_NAMES) as AlertMetric[]
                    ).map((metric) => (
                      <SelectItem key={metric} value={metric}>
                        {METRIC_DISPLAY_NAMES[metric]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value: AlertCondition) =>
                    setFormData((prev) => ({ ...prev, condition: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.keys(CONDITION_DISPLAY_NAMES) as AlertCondition[]
                    ).map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {CONDITION_DISPLAY_NAMES[condition]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="threshold">
                  {formData.condition === 'outside_range'
                    ? 'Lower Threshold'
                    : 'Threshold Value'}
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  step="0.01"
                  value={formData.threshold_value}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      threshold_value: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              {formData.condition === 'outside_range' && (
                <div className="space-y-2">
                  <Label htmlFor="threshold_upper">Upper Threshold</Label>
                  <Input
                    id="threshold_upper"
                    type="number"
                    step="0.01"
                    value={formData.threshold_value_upper}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        threshold_value_upper: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="sustained">Sustained Duration (minutes)</Label>
                <Input
                  id="sustained"
                  type="number"
                  min="0"
                  value={formData.sustained_minutes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sustained_minutes: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  0 = trigger immediately
                </p>
              </div>
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Alert Scope</h4>

            <div className="space-y-2">
              <Label>Apply To</Label>
              <Select
                value={formData.scope}
                onValueChange={(value: AlertScope) =>
                  setFormData((prev) => ({
                    ...prev,
                    scope: value,
                    windfarm_id: null,
                    portfolio_id: null,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SCOPE_DISPLAY_NAMES) as AlertScope[]).map(
                    (scope) => (
                      <SelectItem key={scope} value={scope}>
                        {SCOPE_DISPLAY_NAMES[scope]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {formData.scope === 'specific_windfarm' && (
              <div className="space-y-2">
                <Label>Wind Farm *</Label>
                <Select
                  value={formData.windfarm_id?.toString() || ''}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      windfarm_id: parseInt(value),
                    }))
                  }
                  disabled={windfarmsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a wind farm" />
                  </SelectTrigger>
                  <SelectContent>
                    {windfarms?.map((wf) => (
                      <SelectItem key={wf.id} value={wf.id.toString()}>
                        {wf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.scope === 'portfolio' && (
              <div className="space-y-2">
                <Label>Portfolio *</Label>
                <Select
                  value={formData.portfolio_id?.toString() || ''}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      portfolio_id: parseInt(value),
                    }))
                  }
                  disabled={portfoliosLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios?.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Severity & Channels */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Severity & Notifications</h4>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value: AlertSeverity) =>
                  setFormData((prev) => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.keys(SEVERITY_DISPLAY_NAMES) as AlertSeverity[]
                  ).map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {SEVERITY_DISPLAY_NAMES[severity]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notification Channels *</Label>
              <div className="flex flex-wrap gap-4 pt-2">
                {(
                  Object.keys(CHANNEL_DISPLAY_NAMES) as NotificationChannel[]
                ).map((channel) => (
                  <div key={channel} className="flex items-center gap-2">
                    <Checkbox
                      id={`channel-${channel}`}
                      checked={formData.channels.includes(channel)}
                      onCheckedChange={() => handleChannelToggle(channel)}
                    />
                    <Label
                      htmlFor={`channel-${channel}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {CHANNEL_DISPLAY_NAMES[channel]}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.channels.length === 0 && (
                <p className="text-xs text-destructive">
                  Select at least one notification channel
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create Rule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
