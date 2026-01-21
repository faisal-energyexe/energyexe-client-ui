import { useState } from 'react'
import { RefreshCw, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/generation/date-range-picker'
import { getDateRangePreset } from '@/lib/generation-api'
import {
  useWeatherStatistics,
  useWindRose,
  useWindSpeedDistribution,
  useWeatherGenerationCorrelation,
  usePowerCurve,
  useDiurnalPattern,
  useSeasonalPattern,
} from '@/lib/weather-api'
import { WeatherStatistics } from './weather-statistics'
import { WindRoseChart } from './wind-rose-chart'
import { WindDistributionChart } from './wind-distribution-chart'
import { CorrelationScatter } from './correlation-scatter'
import { PowerCurveChart } from './power-curve-chart'
import { DiurnalPatternChart } from './diurnal-pattern-chart'
import { SeasonalPatternChart } from './seasonal-pattern-chart'

interface WeatherTabProps {
  windfarmId: number
  nameplateMW?: number
}

export function WeatherTab({ windfarmId, nameplateMW }: WeatherTabProps) {
  // Date range state - default to 1 year for weather data
  const [preset, setPreset] = useState('1Y')
  const [dateRange, setDateRange] = useState(() => getDateRangePreset('1Y'))

  // Fetch all weather data
  const {
    data: statistics,
    isLoading: isLoadingStats,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useWeatherStatistics(windfarmId, dateRange.startDate, dateRange.endDate)

  const {
    data: windRose,
    isLoading: isLoadingWindRose,
    refetch: refetchWindRose,
  } = useWindRose(windfarmId, dateRange.startDate, dateRange.endDate)

  const {
    data: distribution,
    isLoading: isLoadingDistribution,
    refetch: refetchDistribution,
  } = useWindSpeedDistribution(windfarmId, dateRange.startDate, dateRange.endDate)

  const {
    data: correlation,
    isLoading: isLoadingCorrelation,
    refetch: refetchCorrelation,
  } = useWeatherGenerationCorrelation(windfarmId, dateRange.startDate, dateRange.endDate)

  const {
    data: powerCurve,
    isLoading: isLoadingPowerCurve,
    refetch: refetchPowerCurve,
  } = usePowerCurve(windfarmId, dateRange.startDate, dateRange.endDate)

  const {
    data: diurnalPattern,
    isLoading: isLoadingDiurnal,
    refetch: refetchDiurnal,
  } = useDiurnalPattern(windfarmId, dateRange.startDate, dateRange.endDate)

  const {
    data: seasonalPattern,
    isLoading: isLoadingSeasonal,
    refetch: refetchSeasonal,
  } = useSeasonalPattern(windfarmId, dateRange.startDate, dateRange.endDate)

  // Handle date range change
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate })
  }

  // Handle refresh all
  const handleRefresh = () => {
    refetchStats()
    refetchWindRose()
    refetchDistribution()
    refetchCorrelation()
    refetchPowerCurve()
    refetchDiurnal()
    refetchSeasonal()
  }

  const isRefreshing = isFetchingStats

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cloud className="h-4 w-4 text-primary" />
            <span>Weather Intelligence</span>
          </div>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
            preset={preset}
            onPresetChange={setPreset}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-card/50 border-border/50 gap-2"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Weather Statistics */}
      <WeatherStatistics data={statistics} isLoading={isLoadingStats} />

      {/* Wind Rose and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WindRoseChart data={windRose} isLoading={isLoadingWindRose} />
        <WindDistributionChart data={distribution} isLoading={isLoadingDistribution} />
      </div>

      {/* Correlation and Power Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorrelationScatter data={correlation} isLoading={isLoadingCorrelation} />
        <PowerCurveChart
          data={powerCurve}
          isLoading={isLoadingPowerCurve}
          nameplateMW={nameplateMW}
        />
      </div>

      {/* Temporal Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DiurnalPatternChart data={diurnalPattern} isLoading={isLoadingDiurnal} />
        <SeasonalPatternChart data={seasonalPattern} isLoading={isLoadingSeasonal} />
      </div>

      {/* Data freshness indicator */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Weather data from {new Date(dateRange.startDate).toLocaleDateString()} to{' '}
            {new Date(dateRange.endDate).toLocaleDateString()}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          ERA5 Reanalysis Data
        </span>
      </div>
    </div>
  )
}
