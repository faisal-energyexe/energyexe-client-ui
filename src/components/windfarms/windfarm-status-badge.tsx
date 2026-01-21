import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { WindfarmStatus } from '@/types/windfarm'

interface WindfarmStatusBadgeProps {
  status: WindfarmStatus | null | undefined
  className?: string
}

const statusConfig: Record<
  WindfarmStatus,
  { label: string; className: string }
> = {
  operational: {
    label: 'Operational',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  under_installation: {
    label: 'Under Installation',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  decommissioned: {
    label: 'Decommissioned',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
  repowered: {
    label: 'Repowered',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
}

export function WindfarmStatusBadge({
  status,
  className,
}: WindfarmStatusBadgeProps) {
  if (!status) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'bg-gray-500/10 text-gray-400 border-gray-500/20',
          className,
        )}
      >
        Unknown
      </Badge>
    )
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
