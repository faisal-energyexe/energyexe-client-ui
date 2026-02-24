import { useState } from 'react'
import { Scale, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RampUpToggle } from '@/components/ui/ramp-up-toggle'
import { getDateRangePreset } from '@/lib/generation-api'
import { DateRangePicker } from '@/components/generation/date-range-picker'
import { ComparisonSelector } from './comparison-selector'
import { ComparisonTable } from './comparison-table'
import { ComparisonChart } from './comparison-chart'
import { RadarComparison } from './radar-comparison'

export function ComparisonPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [preset, setPreset] = useState('30D')
  const initialRange = getDateRangePreset('30D')
  const [startDate, setStartDate] = useState(initialRange.startDate)
  const [endDate, setEndDate] = useState(initialRange.endDate)
  const [includeRampUp, setIncludeRampUp] = useState(false)

  const canCompare = selectedIds.length >= 2

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleReset = () => {
    setSelectedIds([])
    setPreset('30D')
    const range = getDateRangePreset('30D')
    setStartDate(range.startDate)
    setEndDate(range.endDate)
  }

  // Calculate period days for statistics
  const periodDays = Math.max(
    1,
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Wind Farm Comparison
          </h1>
          <p className="text-muted-foreground mt-1">
            Compare performance metrics across multiple wind farms
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canCompare && (
            <>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={handleDateRangeChange}
                preset={preset}
                onPresetChange={setPreset}
              />
              <RampUpToggle checked={includeRampUp} onCheckedChange={setIncludeRampUp} />
            </>
          )}
          {selectedIds.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Selector */}
      <ComparisonSelector
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        maxSelection={6}
      />

      {/* Comparison Results */}
      {canCompare && (
        <div className="space-y-6">
          {/* Statistics Table */}
          <ComparisonTable selectedIds={selectedIds} periodDays={periodDays} excludeRampUp={!includeRampUp} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Time Series Chart */}
            <ComparisonChart
              selectedIds={selectedIds}
              startDate={startDate}
              endDate={endDate}
              excludeRampUp={!includeRampUp}
              includeRampUp={includeRampUp}
            />

            {/* Radar Chart */}
            <RadarComparison selectedIds={selectedIds} periodDays={periodDays} excludeRampUp={!includeRampUp} />
          </div>
        </div>
      )}
    </div>
  )
}
