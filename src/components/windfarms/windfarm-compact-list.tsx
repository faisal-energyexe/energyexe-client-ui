import { Link } from '@tanstack/react-router'
import { ChevronRight, MapPin, Zap } from 'lucide-react'
import { WindfarmStatusBadge } from './windfarm-status-badge'
import { cn } from '@/lib/utils'
import type { WindfarmListItem } from '@/types/windfarm'

interface WindfarmCompactListProps {
  data: WindfarmListItem[]
  isLoading?: boolean
}

export function WindfarmCompactList({
  data,
  isLoading,
}: WindfarmCompactListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-lg bg-muted/30 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No wind farms found.
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {data.map((windfarm) => (
        <Link
          key={windfarm.id}
          to="/wind-farms/$windfarmId"
          params={{ windfarmId: windfarm.id.toString() }}
          className={cn(
            'group flex items-center gap-4 p-3 rounded-lg',
            'bg-card/30 border border-transparent',
            'hover:bg-card/50 hover:border-border/50',
            'transition-all duration-200',
          )}
        >
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {windfarm.name}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                {windfarm.code}
              </span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {windfarm.country?.name || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>
                {windfarm.nameplate_capacity_mw
                  ? `${windfarm.nameplate_capacity_mw.toFixed(1)} MW`
                  : 'N/A'}
              </span>
            </div>

            <WindfarmStatusBadge status={windfarm.status} className="hidden md:flex" />
          </div>

          {/* Arrow */}
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      ))}
    </div>
  )
}
