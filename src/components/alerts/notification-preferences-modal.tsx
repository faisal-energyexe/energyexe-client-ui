/**
 * NotificationPreferencesModal - Modal for managing notification preferences.
 */

import { useState, useEffect } from 'react'
import { Loader2, Bell, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  SEVERITY_DISPLAY_NAMES,
  type NotificationPreferenceUpdate,
  type AlertSeverity,
} from '@/lib/alerts-api'

interface NotificationPreferencesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationPreferencesModal({
  open,
  onOpenChange,
}: NotificationPreferencesModalProps) {
  const { data: preferences, isLoading } = useNotificationPreferences()
  const updateMutation = useUpdateNotificationPreferences()

  const [formData, setFormData] = useState<NotificationPreferenceUpdate>({
    email_enabled: true,
    email_digest_enabled: true,
    in_app_enabled: true,
    digest_frequency_hours: 24,
    quiet_hours_enabled: false,
    quiet_hours_start: 22,
    quiet_hours_end: 7,
    min_severity: 'low',
  })

  // Update form when preferences load
  useEffect(() => {
    if (preferences) {
      setFormData({
        email_enabled: preferences.email_enabled,
        email_digest_enabled: preferences.email_digest_enabled,
        in_app_enabled: preferences.in_app_enabled,
        digest_frequency_hours: preferences.digest_frequency_hours,
        quiet_hours_enabled: preferences.quiet_hours_enabled,
        quiet_hours_start: preferences.quiet_hours_start ?? 22,
        quiet_hours_end: preferences.quiet_hours_end ?? 7,
        min_severity: preferences.min_severity,
      })
    }
  }, [preferences])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateMutation.mutateAsync(formData)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>
            Configure how and when you receive alert notifications.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notification Channels */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Channels
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="in_app" className="font-normal">
                      In-App Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications within the application
                    </p>
                  </div>
                  <Switch
                    id="in_app"
                    checked={formData.in_app_enabled}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        in_app_enabled: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email" className="font-normal">
                      Email Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive immediate email alerts
                    </p>
                  </div>
                  <Switch
                    id="email"
                    checked={formData.email_enabled}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        email_enabled: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="digest" className="font-normal">
                      Email Digest
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive a summary of alerts periodically
                    </p>
                  </div>
                  <Switch
                    id="digest"
                    checked={formData.email_digest_enabled}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        email_digest_enabled: checked,
                      }))
                    }
                  />
                </div>

                {formData.email_digest_enabled && (
                  <div className="pl-4 border-l-2 border-border/50">
                    <Label htmlFor="digest_freq" className="text-sm">
                      Digest Frequency
                    </Label>
                    <Select
                      value={formData.digest_frequency_hours?.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          digest_frequency_hours: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="w-40 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">Every 6 hours</SelectItem>
                        <SelectItem value="12">Every 12 hours</SelectItem>
                        <SelectItem value="24">Daily</SelectItem>
                        <SelectItem value="168">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Quiet Hours
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quiet" className="font-normal">
                      Enable Quiet Hours
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Suppress notifications during specific hours
                    </p>
                  </div>
                  <Switch
                    id="quiet"
                    checked={formData.quiet_hours_enabled}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        quiet_hours_enabled: checked,
                      }))
                    }
                  />
                </div>

                {formData.quiet_hours_enabled && (
                  <div className="pl-4 border-l-2 border-border/50 grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiet_start" className="text-sm">
                        Start Time
                      </Label>
                      <Select
                        value={formData.quiet_hours_start?.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            quiet_hours_start: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quiet_end" className="text-sm">
                        End Time
                      </Label>
                      <Select
                        value={formData.quiet_hours_end?.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            quiet_hours_end: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Minimum Severity */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Minimum Severity</h4>
              <p className="text-xs text-muted-foreground">
                Only receive notifications for alerts at or above this severity
                level
              </p>

              <Select
                value={formData.min_severity}
                onValueChange={(value: AlertSeverity) =>
                  setFormData((prev) => ({
                    ...prev,
                    min_severity: value,
                  }))
                }
              >
                <SelectTrigger className="w-40">
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save Preferences
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
