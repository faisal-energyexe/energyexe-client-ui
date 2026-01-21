import { useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GenerationKPIs } from './generation-kpis'
import { GenerationChart } from './generation-chart'
import { GenerationHeatmap } from './generation-heatmap'
import { DateRangePicker } from './date-range-picker'
import { DataQualityIndicator } from './data-quality-indicator'
import {
  useGenerationHourly,
  useGenerationStats,
  getDateRangePreset,
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

  // Fetch generation data
  const {
    data: hourlyData,
    isLoading: isLoadingHourly,
    refetch: refetchHourly,
    isFetching: isFetchingHourly,
  } = useGenerationHourly({
    windfarmId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  })

  // Fetch stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGenerationStats({
    windfarmId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  })

  // Handle date range change
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate })
  }

  // Handle refresh
  const handleRefresh = () => {
    refetchHourly()
    refetchStats()
  }

  // Handle export
  const handleExport = (format: 'csv' | 'json') => {
    if (!hourlyData || hourlyData.length === 0) return

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(hourlyData, null, 2)], {
        type: 'application/json',
      })
      downloadBlob(blob, `generation-${windfarmId}-${dateRange.startDate}-${dateRange.endDate}.json`)
    } else {
      // CSV export
      const headers = ['Hour', 'Generation (MWh)', 'Source', 'Quality Score', 'Quality Flag']
      const rows = hourlyData.map((item) => [
        item.hour,
        item.generation_mwh.toString(),
        item.source,
        item.quality_score?.toString() || '',
        item.quality_flag || '',
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

  // Calculate overall quality score
  const overallQuality = stats?.avg_quality_score ?? 0

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-4">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
            preset={preset}
            onPresetChange={setPreset}
          />
          <DataQualityIndicator score={overallQuality} label />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-card/50 border-border/50 gap-2"
            onClick={handleRefresh}
            disabled={isFetchingHourly}
          >
            <RefreshCw className={`h-4 w-4 ${isFetchingHourly ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="bg-card/50 border-border/50 gap-2"
              onClick={() => handleExport('csv')}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <GenerationKPIs
        stats={stats}
        isLoading={isLoadingStats}
        nameplateMW={nameplateMW}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <GenerationChart
            data={hourlyData}
            isLoading={isLoadingHourly}
            aggregation={aggregation}
            onAggregationChange={setAggregation}
          />
        </div>
        <div>
          <GenerationHeatmap data={hourlyData} isLoading={isLoadingHourly} />
        </div>
      </div>

      {/* Data freshness indicator */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Showing data from {new Date(dateRange.startDate).toLocaleDateString()} to{' '}
            {new Date(dateRange.endDate).toLocaleDateString()}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {hourlyData?.length.toLocaleString() || 0} data points
        </span>
      </div>
    </div>
  )
}
