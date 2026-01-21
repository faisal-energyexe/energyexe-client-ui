/**
 * NotificationList - Display and manage notifications.
 */

import { useState } from 'react'
import {
  Bell,
  BellOff,
  CheckCheck,
  Filter,
  Mail,
  Trash2,
} from 'lucide-react'
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
  useNotifications,
  useMarkNotificationsRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  SEVERITY_DISPLAY_NAMES,
  CHANNEL_DISPLAY_NAMES,
  type Notification,
  type NotificationStatus,
  type AlertSeverity,
  type NotificationChannel,
} from '@/lib/alerts-api'

export function NotificationList() {
  const [statusFilter, setStatusFilter] = useState<NotificationStatus | 'all'>(
    'all'
  )
  const { data, isLoading, error } = useNotifications(
    statusFilter === 'all' ? undefined : statusFilter
  )
  const markReadMutation = useMarkNotificationsRead()
  const markAllReadMutation = useMarkAllNotificationsRead()
  const deleteMutation = useDeleteNotification()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Failed to load notifications</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with stats and actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          {data && data.unread_count > 0 && (
            <Badge variant="secondary">{data.unread_count} Unread</Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {data && data.unread_count > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as NotificationStatus | 'all')
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notifications list */}
      {!data || data.notifications.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="py-12 text-center">
            <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {statusFilter === 'all'
                ? 'No notifications'
                : `No ${statusFilter} notifications`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={() => markReadMutation.mutate([notification.id])}
              onDelete={() => deleteMutation.mutate(notification.id)}
              isMarkingRead={markReadMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface NotificationCardProps {
  notification: Notification
  onMarkRead: () => void
  onDelete: () => void
  isMarkingRead: boolean
  isDeleting: boolean
}

function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  isMarkingRead,
  isDeleting,
}: NotificationCardProps) {
  const severityColors: Record<AlertSeverity, string> = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const channelIcons: Record<NotificationChannel, React.ReactNode> = {
    in_app: <Bell className="h-3 w-3" />,
    email: <Mail className="h-3 w-3" />,
    email_digest: <Mail className="h-3 w-3" />,
  }

  const isUnread = notification.status === 'unread'

  return (
    <Card
      className={cn(
        'bg-card/50 backdrop-blur-sm border-border/50 transition-all',
        isUnread && 'border-l-2 border-l-primary bg-primary/5'
      )}
    >
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              {isUnread && (
                <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
              )}
              <h4
                className={cn(
                  'text-sm truncate',
                  isUnread ? 'font-medium' : 'font-normal'
                )}
              >
                {notification.title}
              </h4>
            </div>

            {/* Message */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {notification.message}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  severityColors[notification.severity]
                )}
              >
                {SEVERITY_DISPLAY_NAMES[notification.severity]}
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                {channelIcons[notification.channel]}
                {CHANNEL_DISPLAY_NAMES[notification.channel]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {isUnread && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMarkRead}
                disabled={isMarkingRead}
                title="Mark as read"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this notification? This
                    action cannot be undone.
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
