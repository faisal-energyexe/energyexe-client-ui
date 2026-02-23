import { useState, useMemo } from 'react'
import { Download, RefreshCw, BarChart3, TrendingUp, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RampUpToggle } from '@/components/ui/ramp-up-toggle'
import { GenerationChart } from './generation-chart'
import { GenerationHeatmap } from './generation-heatmap'
import { DateRangePicker } from './date-range-picker'
import { DataQualityIndicator } from './data-quality-indicator'
import {
  useSingleWindfarmGeneration,
  useSingleWindfarmStats,
  getDateRangePreset,
  formatGeneration,
  formatCapacityFactor,
  type GenerationHourlyData,
} from '@/lib/generation-api'

interface GenerationTabProps {
  windfarmId: number
  nameplateMW?: number
}

export function GenerationTab({ windfarmId, nameplateMW }: GenerationTabProps) {
  // Date range state
  const [preset, setPreset] = useState('30D')
  const [dateRange, setDateRange] = useState(() => getDateRangePreset('30D'))
  const [aggregation, setAggregation] = useState<'hourly' | 'daily' | 'monthly'>('daily')
  const [includeRampUp, setIncludeRampUp] = useState(false)

  // Calculate period days for stats
  const periodDays = useMemo(() => {
    const start = new Date(dateRange.startDate)
    const end = new Date(dateRange.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }, [dateRange])

  // Fetch generation data using comparison API
  const {
    data: generationData,
    isLoading: isLoadingGeneration,
    refetch: refetchGeneration,
    isFetching: isFetchingGeneration,
    error: generationError,
  } = useSingleWindfarmGeneration(windfarmId, dateRange.startDate, dateRange.endDate, aggregation, !includeRampUp)

  // Fetch stats using comparison API
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
    error: statsError,
  } = useSingleWindfarmStats(windfarmId, periodDays, !includeRampUp)

  // Log errors for debugging
  if (generationError) {
    console.error('Generation data error:', generationError)
  }
  if (statsError) {
    console.error('Stats error:', statsError)
  }

  // Transform generation data to the format expected by GenerationChart
  const chartData: GenerationHourlyData[] = useMemo(() => {
    if (!generationData?.data) return []

    return generationData.data.map((point) => ({
      hour: point.period,
      generation_mwh: point.total_generation,
      generation_unit_id: null,
      windfarm_id: windfarmId,
      source: 'comparison',
      quality_score: point.data_points > 0 ? 100 : 0,
      quality_flag: 'measured' as const,
      is_manual_override: false,
    }))
  }, [generationData, windfarmId])

  // Handle date range change
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate })
  }

  // Handle refresh
  const handleRefresh = () => {
    refetchGeneration()
    refetchStats()
  }

  // Handle export
  const handleExport = (format: 'csv' | 'json') => {
    if (!generationData?.data || generationData.data.length === 0) return

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(generationData.data, null, 2)], {
        type: 'application/json',
      })
      downloadBlob(blob, `generation-${windfarmId}-${dateRange.startDate}-${dateRange.endDate}.json`)
    } else {
      // CSV export
      const headers = ['Period', 'Total Generation (MWh)', 'Avg Generation (MWh)', 'Max Generation (MWh)', 'Capacity Factor (%)']
      const rows = generationData.data.map((item) => [
        item.period,
        item.total_generation.toFixed(2),
        item.avg_generation.toFixed(2),
        item.max_generation.toFixed(2),
        item.avg_capacity_factor ? (item.avg_capacity_factor * 100).toFixed(1) : 'N/A',
      ])

      const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      downloadBlob(blob, `generation-${windfarmId}-${dateRange.startDate}-${dateRange.endDate}.csv`)
    }
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Calculate overall quality score from data completeness
  const overallQuality = stats?.data_completeness ? stats.data_completeness * 100 : 0

  return (
    <div className="space-y-6">
      {/* Error display for debugging */}
      {(generationError || statsError) && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive">
          <p className="font-medium">Error loading data:</p>
          {generationError && <p className="text-sm">Generation: {String(generationError)}</p>}
          {statsError && <p className="text-sm">Stats: {String(statsError)}</p>}
          <p className="text-xs mt-2 text-muted-foreground">
            Debug: windfarmId={windfarmId}, dates={dateRange.startDate} to {dateRange.endDate}
          </p>
        </div>
      )}

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-4 flex-wrap">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
            preset={preset}
            onPresetChange={setPreset}
          />
          <DataQualityIndicator score={overallQuality} label />
          <RampUpToggle checked={includeRampUp} onCheckedChange={setIncludeRampUp} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-card/50 border-border/50 gap-2"
            onClick={handleRefresh}
            disabled={isFetchingGeneration}
          >
            <RefreshCw className={`h-4 w-4 ${isFetchingGeneration ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-card/50 border-border/50 gap-2"
            onClick={() => handleExport('csv')}
            disabled={!generationData?.data?.length}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Generation */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Total Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {stats ? formatGeneration(stats.total_generation) : 'N/A'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Capacity Factor */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Capacity Factor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-500">
                {stats ? formatCapacityFactor(stats.avg_capacity_factor) : 'N/A'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Peak Generation */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-500" />
              Peak Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-amber-500">
                {stats ? formatGeneration(stats.peak_generation) : 'N/A'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-500" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-cyan-500">
                {stats ? `${stats.availability_percent.toFixed(1)}%` : 'N/A'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 rounded-lg bg-card/30 border border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Avg Generation</p>
            <p className="text-sm font-medium">{formatGeneration(stats.avg_generation)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Min Generation</p>
            <p className="text-sm font-medium">{formatGeneration(stats.min_generation)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Max Capacity Factor</p>
            <p className="text-sm font-medium">{formatCapacityFactor(stats.max_capacity_factor)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Min Capacity Factor</p>
            <p className="text-sm font-medium">{formatCapacityFactor(stats.min_capacity_factor)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data Points</p>
            <p className="text-sm font-medium">{stats.data_points.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Period Days</p>
            <p className="text-sm font-medium">{stats.period_days}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <GenerationChart
            data={chartData}
            isLoading={isLoadingGeneration}
            aggregation={aggregation}
            onAggregationChange={setAggregation}
            nameplateMW={nameplateMW}
          />
        </div>
        <div>
          <GenerationHeatmap data={chartData} isLoading={isLoadingGeneration} />
        </div>
      </div>

      {/* Data freshness indicator */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${chartData.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
          <span className="text-sm text-muted-foreground">
            {chartData.length > 0
              ? `Showing data from ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`
              : 'No data available for the selected period'
            }
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {chartData.length.toLocaleString()} data points
        </span>
      </div>
    </div>
  )
}
