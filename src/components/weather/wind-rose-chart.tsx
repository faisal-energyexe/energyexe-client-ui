import { useMemo } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Compass } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { WindRoseData } from '@/lib/weather-api'

interface WindRoseChartProps {
  data: WindRoseData | undefined
  isLoading: boolean
}

// Direction labels for 16-point compass
const DIRECTION_LABELS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

// Speed bin colors
const SPEED_COLORS = [
  'hsl(210, 100%, 60%)',  // Light blue - 0-5
  'hsl(180, 70%, 50%)',   // Cyan - 5-10
  'hsl(120, 60%, 50%)',   // Green - 10-15
  'hsl(45, 90%, 50%)',    // Yellow - 15-20
  'hsl(15, 90%, 50%)',    // Orange - 20+
]

export function WindRoseChart({ data, isLoading }: WindRoseChartProps) {
  // Transform data for radar chart
  const chartData = useMemo(() => {
    if (!data || !data.frequency || data.frequency.length === 0) return []

    return DIRECTION_LABELS.map((direction, dirIndex) => {
      const point: Record<string, string | number> = { direction }

      // Sum frequencies for each speed bin at this direction
      data.speedBins.forEach((speedBin, speedIndex) => {
        const frequency = data.frequency[dirIndex]?.[speedIndex] || 0
        point[speedBin.label] = frequency
      })

      return point
    })
  }, [data])

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; name: string; color: string }>
    label?: string
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0)

    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-medium text-foreground">
              {entry.value?.toFixed(1)}%
            </span>
          </div>
        ))}
        <div className="border-t border-border/50 mt-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium text-foreground">{total.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data || chartData.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            Wind Rose
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            No wind direction data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            Wind Rose
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {data.totalHours.toLocaleString()} hours · {data.calmPercentage.toFixed(1)}% calm
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={chartData} outerRadius="80%">
            <PolarGrid
              stroke="hsl(215, 20%, 40%)"
              strokeOpacity={0.5}
            />
            <PolarAngleAxis
              dataKey="direction"
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 'auto']}
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
            />
            {data.speedBins.map((speedBin, index) => (
              <Radar
                key={speedBin.label}
                name={speedBin.label}
                dataKey={speedBin.label}
                stroke={SPEED_COLORS[index % SPEED_COLORS.length]}
                fill={SPEED_COLORS[index % SPEED_COLORS.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
