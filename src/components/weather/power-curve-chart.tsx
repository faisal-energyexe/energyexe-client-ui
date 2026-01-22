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
  ReferenceLine,
  Legend,
} from 'recharts'
import { Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { PowerCurveData } from '@/lib/weather-api'

interface PowerCurveChartProps {
  data: PowerCurveData | undefined
  isLoading: boolean
  nameplateMW?: number
}

interface ChartDataPoint {
  windSpeed: number
  generation: number
  upperBound: number
  lowerBound: number
  sampleCount: number
}

export function PowerCurveChart({ data, isLoading, nameplateMW }: PowerCurveChartProps) {
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data) return []

    return data.windSpeed.map((speed, index) => ({
      windSpeed: speed,
      generation: data.generationMw[index] || 0,
      upperBound: (data.generationMw[index] || 0) + (data.stdDev[index] || 0),
      lowerBound: Math.max(0, (data.generationMw[index] || 0) - (data.stdDev[index] || 0)),
      sampleCount: data.sampleCount[index] || 0,
    }))
  }, [data])

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
          Wind Speed: {point.windSpeed.toFixed(1)} m/s
        </p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Generation:</span>
            <span className="font-medium">{point.generation.toFixed(2)} MW</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">± Std Dev:</span>
            <span className="font-medium">
              {point.lowerBound.toFixed(2)} - {point.upperBound.toFixed(2)} MW
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Samples:</span>
            <span className="font-medium">{point.sampleCount.toLocaleString()}</span>
          </div>
          {nameplateMW && (
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
              <span className="text-muted-foreground">Capacity Factor:</span>
              <span className="font-medium">
                {((point.generation / nameplateMW) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
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
            <Zap className="h-5 w-5 text-primary" />
            Empirical Power Curve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No power curve data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Empirical Power Curve
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            R² = {data.rSquared.toFixed(3)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="powerCurveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(215, 20%, 40%)"
              opacity={0.3}
            />
            <XAxis
              dataKey="windSpeed"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Wind Speed (m/s)',
                position: 'insideBottom',
                offset: -5,
                fill: 'hsl(215, 20%, 65%)',
                fontSize: 12,
              }}
            />
            <YAxis
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Generation (MW)',
                angle: -90,
                position: 'insideLeft',
                fill: 'hsl(215, 20%, 65%)',
                fontSize: 12,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
            />

            {/* Confidence band (std dev) */}
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="url(#powerCurveGradient)"
              name="Confidence Band"
            />

            {/* Main power curve */}
            <Line
              type="monotone"
              dataKey="generation"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(221, 83%, 53%)', r: 3 }}
              name="Power Output"
            />

            {/* Reference lines for key speeds */}
            {data.cutInSpeed && (
              <ReferenceLine
                x={data.cutInSpeed}
                stroke="hsl(142, 71%, 45%)"
                strokeDasharray="3 3"
                label={{
                  value: `Cut-in: ${data.cutInSpeed}m/s`,
                  fill: 'hsl(215, 20%, 65%)',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            )}
            {data.ratedSpeed && (
              <ReferenceLine
                x={data.ratedSpeed}
                stroke="hsl(45, 90%, 50%)"
                strokeDasharray="3 3"
                label={{
                  value: `Rated: ${data.ratedSpeed}m/s`,
                  fill: 'hsl(215, 20%, 65%)',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            )}
            {data.cutOutSpeed && (
              <ReferenceLine
                x={data.cutOutSpeed}
                stroke="hsl(0, 85%, 60%)"
                strokeDasharray="3 3"
                label={{
                  value: `Cut-out: ${data.cutOutSpeed}m/s`,
                  fill: 'hsl(215, 20%, 65%)',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            )}

            {/* Rated power reference line */}
            {data.ratedPower && (
              <ReferenceLine
                y={data.ratedPower}
                stroke="hsl(215, 20%, 65%)"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Key parameters */}
        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.cutInSpeed && (
            <div>
              <p className="text-xs text-muted-foreground">Cut-in Speed</p>
              <p className="text-sm font-medium text-emerald-400">{data.cutInSpeed} m/s</p>
            </div>
          )}
          {data.ratedSpeed && (
            <div>
              <p className="text-xs text-muted-foreground">Rated Speed</p>
              <p className="text-sm font-medium text-yellow-400">{data.ratedSpeed} m/s</p>
            </div>
          )}
          {data.cutOutSpeed && (
            <div>
              <p className="text-xs text-muted-foreground">Cut-out Speed</p>
              <p className="text-sm font-medium text-red-400">{data.cutOutSpeed} m/s</p>
            </div>
          )}
          {data.ratedPower && (
            <div>
              <p className="text-xs text-muted-foreground">Rated Power</p>
              <p className="text-sm font-medium">{data.ratedPower.toFixed(1)} MW</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
