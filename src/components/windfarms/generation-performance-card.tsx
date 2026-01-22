/**
 * GenerationPerformanceCard - Shows generation performance metrics for a wind farm.
 * Displays capacity factor, total generation, peak generation, and data availability.
 */

import { useMemo } from 'react'
import { Activity, BarChart3, TrendingUp, Zap, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useGenerationStats, getDateRangePreset } from '@/lib/generation-api'

interface GenerationPerformanceCardProps {
  windfarmId: number
  nameplateCapacityMw?: number | null
  period?: '7D' | '30D' | '90D' | '1Y'
}

export function GenerationPerformanceCard({
  windfarmId,
  nameplateCapacityMw,
  period = '30D',
}: GenerationPerformanceCardProps) {
  const dateRange = useMemo(() => getDateRangePreset(period), [period])

  const { data: stats, isLoading, error } = useGenerationStats({
    windfarmId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  })

  // Calculate performance rating based on capacity factor
  const getPerformanceRating = (capacityFactor: number | null) => {
    if (capacityFactor === null) return { label: 'Unknown', variant: 'outline' as const }
    if (capacityFactor >= 40) return { label: 'Excellent', variant: 'default' as const }
    if (capacityFactor >= 30) return { label: 'Good', variant: 'default' as const }
    if (capacityFactor >= 20) return { label: 'Fair', variant: 'secondary' as const }
    return { label: 'Poor', variant: 'destructive' as const }
  }

  const periodLabel = period === '7D' ? '7 days' : period === '30D' ? '30 days' : period === '90D' ? '90 days' : '1 year'

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Generation Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Generation Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">No generation data available</p>
              <p className="text-xs mt-1">
                Generation data for the last {periodLabel} is not available for this wind farm.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const performanceRating = getPerformanceRating(stats.capacity_factor_percent)

  // Calculate data availability
  const periodDays = period === '7D' ? 7 : period === '30D' ? 30 : period === '90D' ? 90 : 365
  const expectedDataPoints = periodDays * 24
  const availabilityPercent = stats.total_hours > 0
    ? (stats.total_hours / expectedDataPoints) * 100
    : 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Generation Performance
          <Badge variant={performanceRating.variant} className="ml-auto">
            {performanceRating.label}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Last {periodLabel} statistics
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-3 rounded-lg bg-background/50 border border-border/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Capacity Factor
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {stats.capacity_factor_percent !== null
                  ? `${stats.capacity_factor_percent.toFixed(1)}%`
                  : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                Industry avg: ~35%
              </p>
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-background/50 border border-border/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              Total Generation
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {stats.total_generation_mwh >= 1000
                  ? `${(stats.total_generation_mwh / 1000).toFixed(1)}`
                  : stats.total_generation_mwh.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.total_generation_mwh >= 1000 ? 'GWh produced' : 'MWh produced'}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              Peak Generation
            </div>
            <p className="text-lg font-semibold text-foreground">
              {stats.max_hourly_generation_mwh.toFixed(1)} MWh
            </p>
            {nameplateCapacityMw && (
              <p className="text-xs text-muted-foreground">
                {((stats.max_hourly_generation_mwh / nameplateCapacityMw) * 100).toFixed(0)}% of capacity
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Operating Hours</div>
            <p className="text-lg font-semibold text-foreground">
              {stats.operating_hours.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              of {stats.total_hours.toLocaleString()} total
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Data Availability
            </div>
            <p className="text-lg font-semibold text-foreground">
              {availabilityPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">
              Quality: {(stats.avg_quality_score * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Performance Insights */}
        {(stats.capacity_factor_percent !== null || availabilityPercent > 0) && (
          <div className="pt-4 border-t border-border/30 space-y-2">
            <h4 className="text-sm font-medium text-foreground">Performance Insights</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {stats.capacity_factor_percent !== null && stats.capacity_factor_percent >= 35 && (
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Exceeds industry average capacity factor</span>
                </li>
              )}
              {availabilityPercent >= 95 && (
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Excellent data availability and uptime</span>
                </li>
              )}
              {nameplateCapacityMw &&
                stats.max_hourly_generation_mwh / nameplateCapacityMw >= 0.95 && (
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Reaching near-rated capacity at peak</span>
                  </li>
                )}
              {stats.capacity_factor_percent !== null && stats.capacity_factor_percent < 25 && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">⚠</span>
                  <span>Capacity factor below industry average</span>
                </li>
              )}
              {availabilityPercent < 80 && availabilityPercent > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">⚠</span>
                  <span>Significant data gaps detected</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GenerationPerformanceCard
