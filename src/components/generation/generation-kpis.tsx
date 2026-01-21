import { Zap, TrendingUp, TrendingDown, Clock, Activity, Gauge } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { GenerationStats } from '@/lib/generation-api'
import { formatGeneration, formatCapacityFactor } from '@/lib/generation-api'

interface GenerationKPIsProps {
  stats: GenerationStats | undefined
  isLoading: boolean
  previousPeriodStats?: GenerationStats | null
  nameplateMW?: number
}

interface KPICardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
  color: string
  isLoading?: boolean
}

function KPICard({
  icon: Icon,
  label,
  value,
  trend,
  subtitle,
  color,
  isLoading,
}: KPICardProps) {
  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm ${
                trend.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function GenerationKPIs({
  stats,
  isLoading,
  previousPeriodStats,
  nameplateMW,
}: GenerationKPIsProps) {
  // Calculate trends if previous period data is available
  const calculateTrend = (
    current: number | null | undefined,
    previous: number | null | undefined
  ): { value: number; isPositive: boolean } | undefined => {
    if (
      current === null ||
      current === undefined ||
      previous === null ||
      previous === undefined ||
      previous === 0
    ) {
      return undefined
    }
    const percentChange = ((current - previous) / previous) * 100
    return {
      value: percentChange,
      isPositive: percentChange >= 0,
    }
  }

  const kpis = [
    {
      icon: Zap,
      label: 'Total Generation',
      value: stats ? formatGeneration(stats.total_generation_mwh) : 'N/A',
      trend: calculateTrend(
        stats?.total_generation_mwh,
        previousPeriodStats?.total_generation_mwh
      ),
      subtitle: stats ? `${stats.total_hours.toLocaleString()} hours of data` : undefined,
      color: 'bg-primary',
    },
    {
      icon: Gauge,
      label: 'Capacity Factor',
      value: stats ? formatCapacityFactor(stats.capacity_factor_percent) : 'N/A',
      trend: calculateTrend(
        stats?.capacity_factor_percent,
        previousPeriodStats?.capacity_factor_percent
      ),
      subtitle: nameplateMW ? `${nameplateMW.toFixed(1)} MW nameplate` : undefined,
      color: 'bg-cyan-500',
    },
    {
      icon: Activity,
      label: 'Peak Generation',
      value: stats
        ? `${stats.max_hourly_generation_mwh.toFixed(2)} MWh`
        : 'N/A',
      trend: calculateTrend(
        stats?.max_hourly_generation_mwh,
        previousPeriodStats?.max_hourly_generation_mwh
      ),
      subtitle: stats?.peak_hour
        ? `Peak at ${new Date(stats.peak_hour).toLocaleString()}`
        : undefined,
      color: 'bg-emerald-500',
    },
    {
      icon: TrendingUp,
      label: 'Average Output',
      value: stats
        ? `${stats.avg_hourly_generation_mwh.toFixed(2)} MWh/h`
        : 'N/A',
      trend: calculateTrend(
        stats?.avg_hourly_generation_mwh,
        previousPeriodStats?.avg_hourly_generation_mwh
      ),
      color: 'bg-amber-500',
    },
    {
      icon: Clock,
      label: 'Operating Hours',
      value: stats ? stats.operating_hours.toLocaleString() : 'N/A',
      trend: calculateTrend(
        stats?.operating_hours,
        previousPeriodStats?.operating_hours
      ),
      subtitle: stats
        ? `${((stats.operating_hours / stats.total_hours) * 100).toFixed(1)}% availability`
        : undefined,
      color: 'bg-purple-500',
    },
    {
      icon: Activity,
      label: 'Data Quality',
      value: stats
        ? `${(stats.avg_quality_score * 100).toFixed(1)}%`
        : 'N/A',
      subtitle: 'Average quality score',
      color: 'bg-pink-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.label}
          icon={kpi.icon}
          label={kpi.label}
          value={kpi.value}
          trend={kpi.trend}
          subtitle={kpi.subtitle}
          color={kpi.color}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}
