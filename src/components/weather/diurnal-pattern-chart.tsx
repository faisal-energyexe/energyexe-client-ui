import { useMemo } from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Legend,
} from 'recharts'
import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DiurnalPattern } from '@/lib/weather-api'

interface DiurnalPatternChartProps {
  data: DiurnalPattern | undefined
  isLoading: boolean
}

interface ChartDataPoint {
  hour: number
  hourLabel: string
  avgSpeed: number
  minSpeed: number
  maxSpeed: number
  medianSpeed: number
}

export function DiurnalPatternChart({ data, isLoading }: DiurnalPatternChartProps) {
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data) return []

    return data.hours.map((hour, index) => ({
      hour,
      hourLabel: `${hour.toString().padStart(2, '0')}:00`,
      avgSpeed: data.avgWindSpeed[index] || 0,
      minSpeed: data.minWindSpeed[index] || 0,
      maxSpeed: data.maxWindSpeed[index] || 0,
      medianSpeed: data.medianWindSpeed[index] || 0,
    }))
  }, [data])

  // Find peak and low hours
  const peakHour = useMemo(() => {
    if (!chartData.length) return null
    return chartData.reduce((max, curr) => (curr.avgSpeed > max.avgSpeed ? curr : max), chartData[0])
  }, [chartData])

  const lowHour = useMemo(() => {
    if (!chartData.length) return null
    return chartData.reduce((min, curr) => (curr.avgSpeed < min.avgSpeed ? curr : min), chartData[0])
  }, [chartData])

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: ChartDataPoint }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const point = payload[0].payload

    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">
          {point.hourLabel}
        </p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Average:</span>
            <span className="font-medium">{point.avgSpeed.toFixed(2)} m/s</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Median:</span>
            <span className="font-medium">{point.medianSpeed.toFixed(2)} m/s</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Range:</span>
            <span className="font-medium">
              {point.minSpeed.toFixed(1)} - {point.maxSpeed.toFixed(1)} m/s
            </span>
          </div>
        </div>
      </div>
    )
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

  if (!data || chartData.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Diurnal Wind Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No diurnal pattern data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Diurnal Wind Pattern (24-Hour)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="diurnalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="hourLabel"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              label={{
                value: 'Wind Speed (m/s)',
                angle: -90,
                position: 'insideLeft',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 12,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
            />

            {/* Range band (min to max) */}
            <Area
              type="monotone"
              dataKey="maxSpeed"
              stroke="none"
              fill="url(#diurnalGradient)"
              name="Range"
            />

            {/* Average line */}
            <Line
              type="monotone"
              dataKey="avgSpeed"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Average"
            />

            {/* Median line */}
            <Line
              type="monotone"
              dataKey="medianSpeed"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Median"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Peak and low hours */}
        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
          {peakHour && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Clock className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Peak Wind Hour</p>
                <p className="text-sm font-medium">
                  {peakHour.hourLabel} ({peakHour.avgSpeed.toFixed(1)} m/s)
                </p>
              </div>
            </div>
          )}
          {lowHour && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lowest Wind Hour</p>
                <p className="text-sm font-medium">
                  {lowHour.hourLabel} ({lowHour.avgSpeed.toFixed(1)} m/s)
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
