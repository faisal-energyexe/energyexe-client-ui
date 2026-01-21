import { useMemo } from 'react'
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from 'recharts'
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SeasonalPattern } from '@/lib/weather-api'

interface SeasonalPatternChartProps {
  data: SeasonalPattern | undefined
  isLoading: boolean
}

interface ChartDataPoint {
  month: string
  monthNum: number
  avgSpeed: number
  minSpeed: number
  maxSpeed: number
  avgTemp: number
}

export function SeasonalPatternChart({ data, isLoading }: SeasonalPatternChartProps) {
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data) return []

    return data.months.map((month, index) => ({
      month,
      monthNum: data.monthNumbers[index],
      avgSpeed: data.avgWindSpeed[index] || 0,
      minSpeed: data.minWindSpeed[index] || 0,
      maxSpeed: data.maxWindSpeed[index] || 0,
      avgTemp: data.avgTemperature[index] || 0,
    }))
  }, [data])

  // Find best and worst months
  const bestMonth = useMemo(() => {
    if (!chartData.length) return null
    return chartData.reduce((max, curr) => (curr.avgSpeed > max.avgSpeed ? curr : max), chartData[0])
  }, [chartData])

  const worstMonth = useMemo(() => {
    if (!chartData.length) return null
    return chartData.reduce((min, curr) => (curr.avgSpeed < min.avgSpeed ? curr : min), chartData[0])
  }, [chartData])

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: ChartDataPoint; dataKey: string; color: string; value: number }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const point = payload[0].payload

    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">
          {point.month}
        </p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Avg Wind Speed:</span>
            <span className="font-medium">{point.avgSpeed.toFixed(2)} m/s</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Range:</span>
            <span className="font-medium">
              {point.minSpeed.toFixed(1)} - {point.maxSpeed.toFixed(1)} m/s
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Avg Temperature:</span>
            <span className="font-medium">{point.avgTemp.toFixed(1)}°C</span>
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
            <Calendar className="h-5 w-5 text-primary" />
            Seasonal Wind Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No seasonal pattern data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Seasonal Wind Pattern (12-Month)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
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
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°C`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
            />

            {/* Wind speed bars */}
            <Bar
              yAxisId="left"
              dataKey="avgSpeed"
              fill="hsl(var(--primary))"
              fillOpacity={0.7}
              radius={[4, 4, 0, 0]}
              name="Wind Speed"
            />

            {/* Temperature line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgTemp"
              stroke="hsl(45, 90%, 50%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(45, 90%, 50%)', r: 3 }}
              name="Temperature"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Best and worst months */}
        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
          {bestMonth && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Calendar className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Best Wind Month</p>
                <p className="text-sm font-medium">
                  {bestMonth.month} ({bestMonth.avgSpeed.toFixed(1)} m/s)
                </p>
              </div>
            </div>
          )}
          {worstMonth && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Calendar className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lowest Wind Month</p>
                <p className="text-sm font-medium">
                  {worstMonth.month} ({worstMonth.avgSpeed.toFixed(1)} m/s)
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
