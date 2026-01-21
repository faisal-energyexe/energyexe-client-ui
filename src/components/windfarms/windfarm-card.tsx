import { Link } from '@tanstack/react-router'
import {
  MapPin,
  Zap,
  Users,
  ArrowUpRight,
  Waves,
  Mountain,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WindfarmStatusBadge } from './windfarm-status-badge'
import { cn } from '@/lib/utils'
import type { WindfarmListItem } from '@/types/windfarm'

interface WindfarmCardProps {
  windfarm: WindfarmListItem
}

export function WindfarmCard({ windfarm }: WindfarmCardProps) {
  const LocationIcon = windfarm.location_type === 'offshore' ? Waves : Mountain

  return (
    <Link
      to="/wind-farms/$windfarmId"
      params={{ windfarmId: windfarm.id.toString() }}
    >
      <Card
        className={cn(
          'group relative overflow-hidden',
          'bg-card/50 backdrop-blur-sm border-border/50',
          'transition-all duration-300',
          'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
          'hover:translate-y-[-2px]',
        )}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-60 group-hover:opacity-100 transition-opacity" />

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {windfarm.name}
                </h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {windfarm.code}
              </p>
            </div>
            <WindfarmStatusBadge status={windfarm.status} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-md bg-primary/10">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-muted-foreground truncate">
                {windfarm.country?.name || 'Unknown'}
              </span>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-md bg-cyan-500/10">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <span className="text-muted-foreground">
                {windfarm.nameplate_capacity_mw
                  ? `${windfarm.nameplate_capacity_mw.toFixed(1)} MW`
                  : 'N/A'}
              </span>
            </div>

            {/* Location Type */}
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-md bg-emerald-500/10">
                <LocationIcon className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-muted-foreground capitalize">
                {windfarm.location_type || 'Unknown'}
              </span>
            </div>

            {/* Owners */}
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-md bg-amber-500/10">
                <Users className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <span className="text-muted-foreground">
                {windfarm.owners?.length || 0} owner
                {windfarm.owners?.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Owners Preview */}
          {windfarm.owners && windfarm.owners.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
              {windfarm.owners.slice(0, 3).map((owner) => (
                <Badge
                  key={owner.id}
                  variant="secondary"
                  className="text-xs bg-muted/50 hover:bg-muted"
                >
                  {owner.name}
                  {owner.ownership_percentage && (
                    <span className="ml-1 text-muted-foreground">
                      {owner.ownership_percentage.toFixed(0)}%
                    </span>
                  )}
                </Badge>
              ))}
              {windfarm.owners.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-muted/50 hover:bg-muted"
                >
                  +{windfarm.owners.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute -inset-px bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10 rounded-xl" />
        </div>
      </Card>
    </Link>
  )
}
