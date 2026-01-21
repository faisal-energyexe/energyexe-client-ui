import { Wind, MapPin, Zap, Calendar, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WindfarmStatusBadge } from './windfarm-status-badge'
import type { WindfarmWithOwners } from '@/types/windfarm'

interface WindfarmHeroProps {
  windfarm: WindfarmWithOwners
}

export function WindfarmHero({ windfarm }: WindfarmHeroProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/80 via-card/50 to-primary/5 border border-border/50 p-6 lg:p-8">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative">
        {/* Back button */}
        <Link to="/wind-farms">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Wind Farms
          </Button>
        </Link>

        {/* Main header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl animate-pulse" />
              <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary to-cyan-500 shadow-lg shadow-primary/25">
                <Wind className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Title and meta */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {windfarm.name}
                </h1>
                <WindfarmStatusBadge status={windfarm.status} />
              </div>

              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                <span className="font-mono bg-muted/50 px-2 py-0.5 rounded">
                  {windfarm.code}
                </span>

                {windfarm.alternate_name && (
                  <span className="text-muted-foreground">
                    aka {windfarm.alternate_name}
                  </span>
                )}
              </div>

              {/* Quick info row */}
              <div className="flex items-center gap-4 flex-wrap pt-2">
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    {windfarm.country?.name || 'Unknown'}
                    {windfarm.region?.name && `, ${windfarm.region.name}`}
                  </span>
                </div>

                {windfarm.nameplate_capacity_mw && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <span className="text-foreground font-medium">
                      {windfarm.nameplate_capacity_mw.toFixed(1)} MW
                    </span>
                  </div>
                )}

                {windfarm.commercial_operational_date && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <span className="text-foreground">
                      {formatDate(windfarm.commercial_operational_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="flex gap-4 flex-wrap">
            <MetricCard
              label="Capacity"
              value={
                windfarm.nameplate_capacity_mw
                  ? `${windfarm.nameplate_capacity_mw.toFixed(1)} MW`
                  : 'N/A'
              }
              gradient="from-primary to-blue-400"
            />
            <MetricCard
              label="Type"
              value={windfarm.location_type || 'Unknown'}
              gradient="from-emerald-500 to-teal-400"
              capitalize
            />
            <MetricCard
              label="Owners"
              value={windfarm.windfarm_owners?.length?.toString() || '0'}
              gradient="from-amber-500 to-yellow-400"
            />
          </div>
        </div>

        {/* Location badges */}
        {(windfarm.bidzone?.name || windfarm.market_balance_area?.name) && (
          <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-border/50">
            {windfarm.bidzone?.name && (
              <Badge variant="outline" className="bg-card/50">
                Bidzone: {windfarm.bidzone.name}
              </Badge>
            )}
            {windfarm.market_balance_area?.name && (
              <Badge variant="outline" className="bg-card/50">
                MBA: {windfarm.market_balance_area.name}
              </Badge>
            )}
            {windfarm.control_area?.name && (
              <Badge variant="outline" className="bg-card/50">
                Control Area: {windfarm.control_area.name}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  gradient,
  capitalize = false,
}: {
  label: string
  value: string
  gradient: string
  capitalize?: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 p-4 min-w-[100px]">
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
      />
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={`text-lg font-bold text-foreground ${
          capitalize ? 'capitalize' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}
