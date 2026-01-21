import { Wind, Thermometer, Compass, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { WindStatistics } from '@/lib/weather-api'
import { formatWindSpeed, formatTemperature, getWindSpeedCategory } from '@/lib/weather-api'

interface WeatherStatisticsProps {
  data: WindStatistics | undefined
  isLoading: boolean
}

interface StatItemProps {
  label: string
  value: string
  subValue?: string
  icon?: React.ReactNode
  className?: string
}

function StatItem({ label, value, subValue, icon, className }: StatItemProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {icon && (
        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground truncate">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
      </div>
    </div>
  )
}

export function WeatherStatistics({ data, isLoading }: WeatherStatisticsProps) {
  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weather Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No weather data available for this period
          </div>
        </CardContent>
      </Card>
    )
  }

  const windCategory = getWindSpeedCategory(data.meanSpeed)

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Weather Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Wind Speed Stats */}
          <StatItem
            label="Mean Wind Speed"
            value={formatWindSpeed(data.meanSpeed)}
            subValue={windCategory.label}
            icon={<Wind className={`h-4 w-4 ${windCategory.color}`} />}
          />
          <StatItem
            label="Median Wind Speed"
            value={formatWindSpeed(data.medianSpeed)}
            icon={<Wind className="h-4 w-4 text-primary" />}
          />
          <StatItem
            label="Max Wind Speed"
            value={formatWindSpeed(data.maxSpeed)}
            subValue={`Min: ${formatWindSpeed(data.minSpeed)}`}
            icon={<Wind className="h-4 w-4 text-orange-400" />}
          />
          <StatItem
            label="Std Deviation"
            value={formatWindSpeed(data.stdDev)}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />

          {/* Percentiles */}
          <StatItem
            label="P10 / P50 / P90"
            value={`${data.p10Speed.toFixed(1)} / ${data.p50Speed.toFixed(1)} / ${data.p90Speed.toFixed(1)}`}
            subValue="m/s"
            icon={<TrendingUp className="h-4 w-4 text-cyan-400" />}
          />

          {/* Temperature Stats */}
          <StatItem
            label="Mean Temperature"
            value={formatTemperature(data.meanTemperature)}
            subValue={`Range: ${formatTemperature(data.minTemperature)} to ${formatTemperature(data.maxTemperature)}`}
            icon={<Thermometer className="h-4 w-4 text-amber-400" />}
          />

          {/* Direction Stats */}
          <StatItem
            label="Prevailing Direction"
            value={data.prevailingDirectionName}
            subValue={`${data.prevailingDirection.toFixed(0)}°`}
            icon={<Compass className="h-4 w-4 text-emerald-400" />}
          />

          {/* Hours Stats */}
          <StatItem
            label="Data Coverage"
            value={`${data.totalHours.toLocaleString()} hrs`}
            subValue={`${data.calmPercentage.toFixed(1)}% calm`}
            icon={<Clock className="h-4 w-4 text-purple-400" />}
          />
        </div>

        {/* Capacity Factor Estimate */}
        {data.capacityFactorEstimate > 0 && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Estimated Capacity Factor (Wind-based)
              </span>
              <span className="text-lg font-semibold text-primary">
                {(data.capacityFactorEstimate * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
