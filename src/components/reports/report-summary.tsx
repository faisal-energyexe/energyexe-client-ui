/**
 * ReportSummary - Key performance metrics summary card.
 */

import {
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Calendar,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { type PerformanceSummary } from '@/lib/reports-api'

interface ReportSummaryProps {
  summary: PerformanceSummary
  className?: string
}

export function ReportSummary({ summary, className }: ReportSummaryProps) {
  const abovePeerPercentage =
    summary.total_months > 0
      ? Math.round((summary.months_above_peer_average / summary.total_months) * 100)
      : 0

  return (
    <Card className={cn('bg-card/50 backdrop-blur-sm border-border/50', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Avg Capacity Factor */}
          <MetricCard
            label="Avg Capacity Factor"
            value={`${(summary.avg_capacity_factor * 100).toFixed(1)}%`}
            icon={Target}
            iconColor="text-primary"
          />

          {/* Total Generation */}
          <MetricCard
            label="Total Generation"
            value={`${summary.total_generation_gwh.toFixed(1)} GWh`}
            icon={Zap}
            iconColor="text-amber-400"
          />

          {/* Monthly Avg Generation */}
          <MetricCard
            label="Monthly Avg"
            value={`${summary.avg_monthly_generation_gwh.toFixed(2)} GWh`}
            icon={Calendar}
            iconColor="text-blue-400"
          />

          {/* Max CF */}
          <MetricCard
            label="Max Monthly CF"
            value={`${(summary.max_monthly_cf * 100).toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="text-emerald-400"
            trend="up"
          />

          {/* Min CF */}
          <MetricCard
            label="Min Monthly CF"
            value={`${(summary.min_monthly_cf * 100).toFixed(1)}%`}
            icon={TrendingDown}
            iconColor="text-red-400"
            trend="down"
          />

          {/* Above Peer Average */}
          <MetricCard
            label="Above Peer Avg"
            value={`${summary.months_above_peer_average}/${summary.total_months}`}
            subValue={`${abovePeerPercentage}%`}
            icon={Target}
            iconColor={abovePeerPercentage >= 50 ? 'text-emerald-400' : 'text-orange-400'}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricCardProps {
  label: string
  value: string
  subValue?: string
  icon: React.ElementType
  iconColor: string
  trend?: 'up' | 'down'
}

function MetricCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor,
  trend,
}: MetricCardProps) {
  return (
    <div className="p-3 rounded-lg bg-background/50 border border-border/30">
      <div className="flex items-start justify-between mb-2">
        <Icon className={cn('h-4 w-4', iconColor)} />
        {trend && (
          <Badge
            variant="outline"
            className={cn(
              'text-[10px] px-1.5 py-0',
              trend === 'up'
                ? 'text-emerald-400 border-emerald-400/50'
                : 'text-red-400 border-red-400/50'
            )}
          >
            {trend === 'up' ? 'Peak' : 'Low'}
          </Badge>
        )}
      </div>
      <div className="text-lg font-bold">{value}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground">{subValue}</div>
      )}
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

/**
 * Compact summary for report preview.
 */
interface ReportSummaryCompactProps {
  summary: PerformanceSummary
}

export function ReportSummaryCompact({ summary }: ReportSummaryCompactProps) {
  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      <div className="p-2 rounded-lg bg-primary/10">
        <div className="text-lg font-bold text-primary">
          {(summary.avg_capacity_factor * 100).toFixed(1)}%
        </div>
        <div className="text-xs text-muted-foreground">Avg CF</div>
      </div>
      <div className="p-2 rounded-lg bg-amber-500/10">
        <div className="text-lg font-bold text-amber-400">
          {summary.total_generation_gwh.toFixed(1)}
        </div>
        <div className="text-xs text-muted-foreground">GWh Total</div>
      </div>
      <div className="p-2 rounded-lg bg-emerald-500/10">
        <div className="text-lg font-bold text-emerald-400">
          {summary.months_above_peer_average}/{summary.total_months}
        </div>
        <div className="text-xs text-muted-foreground">Above Peers</div>
      </div>
    </div>
  )
}
