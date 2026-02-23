import { useMemo } from 'react'
import { TrendingUp, Trophy, Activity, Zap, Gauge } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  useComparisonStatistics,
  type WindfarmStatistics,
  formatGeneration,
  formatCapacityFactor,
  formatCapacityMW,
  getChartColor,
} from '@/lib/comparison-api'

interface ComparisonTableProps {
  selectedIds: number[]
  periodDays?: number
  excludeRampUp?: boolean
}

interface MetricRowProps {
  label: string
  icon?: React.ReactNode
  values: (string | number | null)[]
  highlightBest?: 'high' | 'low' | 'none'
  format?: (value: number | null) => string
  unit?: string
}

function MetricRow({
  label,
  icon,
  values,
  highlightBest = 'high',
  format = (v) => v?.toFixed(2) ?? 'N/A',
  unit = '',
}: MetricRowProps) {
  const numericValues = values.map((v) =>
    typeof v === 'string' ? parseFloat(v) : v
  )
  const validValues = numericValues.filter((v): v is number => v != null && !isNaN(v))

  const bestValue =
    highlightBest === 'none'
      ? null
      : highlightBest === 'high'
        ? Math.max(...validValues)
        : Math.min(...validValues)

  return (
    <tr className="border-b border-border/30 hover:bg-muted/20 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="font-medium text-sm">{label}</span>
        </div>
      </td>
      {values.map((value, index) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value
        const isBest = highlightBest !== 'none' && numValue === bestValue && validValues.length > 1
        const formattedValue =
          typeof value === 'string' ? value : numValue != null ? format(numValue) : 'N/A'

        return (
          <td
            key={index}
            className={`py-3 px-4 text-center ${isBest ? 'bg-primary/10' : ''}`}
          >
            <div className="flex items-center justify-center gap-1">
              <span className={isBest ? 'font-semibold text-primary' : ''}>
                {formattedValue}
                {unit && numValue != null && ` ${unit}`}
              </span>
              {isBest && <Trophy className="h-3 w-3 text-primary" />}
            </div>
          </td>
        )
      })}
    </tr>
  )
}

export function ComparisonTable({ selectedIds, periodDays = 30, excludeRampUp = true }: ComparisonTableProps) {
  const { data: statistics, isLoading, error } = useComparisonStatistics(selectedIds, periodDays, excludeRampUp)

  const sortedStats = useMemo(() => {
    if (!statistics) return []
    // Maintain the order based on selectedIds
    return selectedIds
      .map((id) => statistics.find((s) => s.windfarm_id === id))
      .filter((s): s is WindfarmStatistics => s != null)
  }, [statistics, selectedIds])

  if (selectedIds.length < 2) {
    return null
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !sortedStats.length) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-8 text-center text-muted-foreground">
          Failed to load comparison statistics
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Performance Comparison
          <Badge variant="outline" className="ml-2">
            Last {periodDays} days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="py-3 px-4 text-left font-semibold text-sm">Metric</th>
                {sortedStats.map((stat, index) => (
                  <th key={stat.windfarm_id} className="py-3 px-4 text-center min-w-[150px]">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getChartColor(index) }}
                      />
                      <span className="font-semibold text-sm truncate max-w-[120px]">
                        {stat.windfarm_name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Technical Specifications */}
              <tr className="bg-muted/10">
                <td
                  colSpan={sortedStats.length + 1}
                  className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Technical Specifications
                </td>
              </tr>
              <MetricRow
                label="Capacity"
                icon={<Zap className="h-4 w-4" />}
                values={sortedStats.map((s) => formatCapacityMW(s.capacity_mw))}
                highlightBest="none"
              />
              <MetricRow
                label="Data Points"
                values={sortedStats.map((s) => s.data_points.toLocaleString())}
                highlightBest="high"
              />
              <MetricRow
                label="Data Completeness"
                values={sortedStats.map((s) => s.data_completeness)}
                highlightBest="high"
                format={(v) => `${v?.toFixed(1)}%`}
              />

              {/* Generation Performance */}
              <tr className="bg-muted/10">
                <td
                  colSpan={sortedStats.length + 1}
                  className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Generation Performance
                </td>
              </tr>
              <MetricRow
                label="Total Generation"
                icon={<TrendingUp className="h-4 w-4" />}
                values={sortedStats.map((s) => formatGeneration(s.total_generation))}
                highlightBest="none"
              />
              <MetricRow
                label="Average Generation"
                values={sortedStats.map((s) => s.avg_generation)}
                highlightBest="high"
                format={(v) => `${v?.toFixed(2)} MWh`}
              />
              <MetricRow
                label="Peak Generation"
                values={sortedStats.map((s) => s.peak_generation)}
                highlightBest="high"
                format={(v) => `${v?.toFixed(2)} MWh`}
              />
              <MetricRow
                label="Min Generation"
                values={sortedStats.map((s) => s.min_generation)}
                highlightBest="none"
                format={(v) => `${v?.toFixed(2)} MWh`}
              />
              <MetricRow
                label="Std Dev"
                values={sortedStats.map((s) => s.stddev_generation)}
                highlightBest="low"
                format={(v) => `${v?.toFixed(2)}`}
              />

              {/* Capacity Factor */}
              <tr className="bg-muted/10">
                <td
                  colSpan={sortedStats.length + 1}
                  className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Capacity Factor
                </td>
              </tr>
              <MetricRow
                label="Average CF"
                icon={<Gauge className="h-4 w-4" />}
                values={sortedStats.map((s) => formatCapacityFactor(s.avg_capacity_factor))}
                highlightBest="none"
              />
              <MetricRow
                label="Max CF"
                values={sortedStats.map((s) => s.max_capacity_factor * 100)}
                highlightBest="high"
                format={(v) => `${v?.toFixed(1)}%`}
              />
              <MetricRow
                label="Min CF"
                values={sortedStats.map((s) => s.min_capacity_factor * 100)}
                highlightBest="high"
                format={(v) => `${v?.toFixed(1)}%`}
              />
              <MetricRow
                label="Raw Avg CF"
                values={sortedStats.map((s) => s.avg_raw_capacity_factor * 100)}
                highlightBest="high"
                format={(v) => `${v?.toFixed(1)}%`}
              />

              {/* Availability */}
              <tr className="bg-muted/10">
                <td
                  colSpan={sortedStats.length + 1}
                  className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Availability
                </td>
              </tr>
              <MetricRow
                label="Availability"
                icon={<Activity className="h-4 w-4" />}
                values={sortedStats.map((s) => s.availability_percent)}
                highlightBest="high"
                format={(v) => `${v?.toFixed(1)}%`}
              />
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
