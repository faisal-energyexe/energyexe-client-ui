import { DollarSign, TrendingUp, TrendingDown, Percent, Clock, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PriceStatistics, CaptureRateOverall } from '@/lib/market-api'
import {
  formatPrice,
  formatRevenue,
  formatCaptureRate,
  getCaptureRateColor,
  getCaptureRateLabel,
} from '@/lib/market-api'

interface PriceKPIsProps {
  statistics: PriceStatistics | undefined
  captureRate: CaptureRateOverall | undefined
  isLoading: boolean
  currency?: string
}

interface KPICardProps {
  label: string
  value: string
  subValue?: string
  icon: React.ReactNode
  iconColor?: string
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
}

function KPICard({
  label,
  value,
  subValue,
  icon,
  iconColor = 'text-primary',
  trend,
  trendLabel,
}: KPICardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subValue && (
              <p className="text-xs text-muted-foreground">{subValue}</p>
            )}
            {trend && trendLabel && (
              <div className="flex items-center gap-1 mt-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                ) : null}
                <span
                  className={`text-xs ${
                    trend === 'up'
                      ? 'text-emerald-400'
                      : trend === 'down'
                        ? 'text-red-400'
                        : 'text-muted-foreground'
                  }`}
                >
                  {trendLabel}
                </span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-primary/10 ${iconColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function KPISkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

export function PriceKPIs({
  statistics,
  captureRate,
  isLoading,
  currency = 'EUR',
}: PriceKPIsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPISkeleton key={i} />
        ))}
      </div>
    )
  }

  const avgDayAhead = statistics?.day_ahead?.average ?? null
  const minDayAhead = statistics?.day_ahead?.min ?? null
  const maxDayAhead = statistics?.day_ahead?.max ?? null
  const hoursWithData = statistics?.hours_with_data || 0

  const totalRevenue = captureRate?.total_revenue_eur ?? null
  const achievedPrice = captureRate?.achieved_price ?? null
  const marketPrice = captureRate?.market_average_price ?? null
  const rate = captureRate?.capture_rate ?? null

  // Determine trend based on capture rate
  const captureTrend: 'up' | 'down' | 'neutral' =
    rate === null ? 'neutral' : rate >= 1 ? 'up' : 'down'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Average Day-Ahead Price */}
      <KPICard
        label="Avg Day-Ahead Price"
        value={formatPrice(avgDayAhead, currency)}
        subValue={`/MWh`}
        icon={<DollarSign className="h-5 w-5" />}
      />

      {/* Price Range */}
      <KPICard
        label="Price Range"
        value={`${formatPrice(minDayAhead, currency)} - ${formatPrice(maxDayAhead, currency)}`}
        subValue="/MWh"
        icon={<BarChart3 className="h-5 w-5" />}
        iconColor="text-cyan-400"
      />

      {/* Total Revenue */}
      <KPICard
        label="Total Revenue"
        value={formatRevenue(totalRevenue, currency)}
        subValue="for period"
        icon={<TrendingUp className="h-5 w-5" />}
        iconColor="text-emerald-400"
      />

      {/* Achieved Price */}
      <KPICard
        label="Achieved Price"
        value={formatPrice(achievedPrice, currency)}
        subValue={`Market: ${formatPrice(marketPrice, currency)}`}
        icon={<DollarSign className="h-5 w-5" />}
        iconColor="text-yellow-400"
      />

      {/* Capture Rate */}
      <KPICard
        label="Capture Rate"
        value={formatCaptureRate(rate)}
        subValue={getCaptureRateLabel(rate)}
        icon={<Percent className="h-5 w-5" />}
        iconColor={getCaptureRateColor(rate)}
        trend={captureTrend}
        trendLabel={
          rate !== null
            ? rate >= 1
              ? 'Above market'
              : 'Below market'
            : undefined
        }
      />

      {/* Data Coverage */}
      <KPICard
        label="Data Coverage"
        value={`${hoursWithData.toLocaleString()}`}
        subValue="hours with price data"
        icon={<Clock className="h-5 w-5" />}
        iconColor="text-purple-400"
      />
    </div>
  )
}
