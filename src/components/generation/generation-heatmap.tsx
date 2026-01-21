import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Grid3x3 } from 'lucide-react'
import type { GenerationHourlyData } from '@/lib/generation-api'

interface GenerationHeatmapProps {
  data: GenerationHourlyData[] | undefined
  isLoading: boolean
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function GenerationHeatmap({ data, isLoading }: GenerationHeatmapProps) {
  // Process data into hour x day matrix
  const heatmapData = useMemo(() => {
    if (!data || data.length === 0) return null

    // Initialize matrix with empty values
    const matrix: { total: number; count: number }[][] = DAYS.map(() =>
      HOURS.map(() => ({ total: 0, count: 0 }))
    )

    // Fill matrix with data
    data.forEach((item) => {
      const date = new Date(item.hour)
      const dayIndex = date.getDay() // 0 = Sunday
      const hour = date.getHours()
      matrix[dayIndex][hour].total += item.generation_mwh
      matrix[dayIndex][hour].count += 1
    })

    // Calculate averages
    const averages: (number | null)[][] = matrix.map((day) =>
      day.map((cell) => (cell.count > 0 ? cell.total / cell.count : null))
    )

    // Find min and max for color scaling
    let minVal = Infinity
    let maxVal = -Infinity
    averages.forEach((day) => {
      day.forEach((val) => {
        if (val !== null) {
          minVal = Math.min(minVal, val)
          maxVal = Math.max(maxVal, val)
        }
      })
    })

    return {
      averages,
      minVal: minVal === Infinity ? 0 : minVal,
      maxVal: maxVal === -Infinity ? 0 : maxVal,
    }
  }, [data])

  // Get color for cell based on value
  const getCellColor = (value: number | null, minVal: number, maxVal: number) => {
    if (value === null) return 'bg-muted/20'

    const range = maxVal - minVal
    if (range === 0) return 'bg-primary/30'

    const normalized = (value - minVal) / range

    // Color gradient from low (cool) to high (warm)
    if (normalized < 0.2) return 'bg-blue-500/30'
    if (normalized < 0.4) return 'bg-cyan-500/40'
    if (normalized < 0.6) return 'bg-emerald-500/50'
    if (normalized < 0.8) return 'bg-amber-500/60'
    return 'bg-primary/70'
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3x3 className="h-5 w-5 text-primary" />
          Generation Pattern (Hour × Day)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!heatmapData ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for heatmap
          </div>
        ) : (
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center justify-end gap-4">
              <span className="text-xs text-muted-foreground">Low</span>
              <div className="flex gap-0.5">
                <div className="w-6 h-3 rounded bg-blue-500/30" />
                <div className="w-6 h-3 rounded bg-cyan-500/40" />
                <div className="w-6 h-3 rounded bg-emerald-500/50" />
                <div className="w-6 h-3 rounded bg-amber-500/60" />
                <div className="w-6 h-3 rounded bg-primary/70" />
              </div>
              <span className="text-xs text-muted-foreground">High</span>
            </div>

            {/* Heatmap grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Hour labels */}
                <div className="flex gap-0.5 mb-1 ml-10">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="flex-1 text-center text-xs text-muted-foreground"
                    >
                      {hour % 4 === 0 ? `${hour}:00` : ''}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {DAYS.map((day, dayIndex) => (
                  <div key={day} className="flex items-center gap-0.5 mb-0.5">
                    <div className="w-10 text-xs text-muted-foreground font-medium">
                      {day}
                    </div>
                    {HOURS.map((hour) => {
                      const value = heatmapData.averages[dayIndex][hour]
                      return (
                        <div
                          key={hour}
                          className={`flex-1 h-8 rounded-sm ${getCellColor(
                            value,
                            heatmapData.minVal,
                            heatmapData.maxVal
                          )} transition-colors hover:ring-2 hover:ring-primary/50 cursor-pointer`}
                          title={
                            value !== null
                              ? `${day} ${hour}:00 - ${value.toFixed(2)} MWh avg`
                              : `${day} ${hour}:00 - No data`
                          }
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary stats */}
            <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
              <span>
                Min:{' '}
                <span className="text-foreground">
                  {heatmapData.minVal.toFixed(2)} MWh
                </span>
              </span>
              <span>
                Max:{' '}
                <span className="text-foreground">
                  {heatmapData.maxVal.toFixed(2)} MWh
                </span>
              </span>
              <span>
                Range:{' '}
                <span className="text-foreground">
                  {(heatmapData.maxVal - heatmapData.minVal).toFixed(2)} MWh
                </span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
