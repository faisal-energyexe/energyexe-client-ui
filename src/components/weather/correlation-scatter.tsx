import { useMemo } from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Legend,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { CorrelationData } from '@/lib/weather-api'

interface CorrelationScatterProps {
  data: CorrelationData | undefined
  isLoading: boolean
}

interface ChartDataPoint {
  windSpeed: number
  avgGeneration: number
  minGeneration: number
  maxGeneration: number
  errorBar: [number, number]
  recordCount: number
}

export function CorrelationScatter({ data, isLoading }: CorrelationScatterProps) {
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data) return []

    return data.windSpeedBins.map((windSpeed, index) => ({
      windSpeed,
      avgGeneration: data.avgGenerationMw[index] || 0,
      minGeneration: data.minGenerationMw[index] || 0,
      maxGeneration: data.maxGenerationMw[index] || 0,
      errorBar: [
        data.avgGenerationMw[index] - data.minGenerationMw[index],
        data.maxGenerationMw[index] - data.avgGenerationMw[index],
      ] as [number, number],
      recordCount: data.recordCount[index] || 0,
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
            <span className="text-muted-foreground">Avg Generation:</span>
            <span className="font-medium">{point.avgGeneration.toFixed(2)} MW</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Range:</span>
            <span className="font-medium">
              {point.minGeneration.toFixed(2)} - {point.maxGeneration.toFixed(2)} MW
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Data Points:</span>
            <span className="font-medium">{point.recordCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    )
  }

  // Get correlation quality label
  const getCorrelationQuality = (r2: number) => {
    if (r2 >= 0.9) return { label: 'Excellent', variant: 'default' as const }
    if (r2 >= 0.7) return { label: 'Good', variant: 'secondary' as const }
    if (r2 >= 0.5) return { label: 'Moderate', variant: 'outline' as const }
    return { label: 'Weak', variant: 'destructive' as const }
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-56" />
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
            <TrendingUp className="h-5 w-5 text-primary" />
            Wind-Generation Correlation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No correlation data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const correlationQuality = getCorrelationQuality(data.rSquared)

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Wind-Generation Correlation
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={correlationQuality.variant}>
              R² = {data.rSquared.toFixed(3)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              r = {data.correlationCoefficient.toFixed(3)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
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
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">
                  {value === 'avgGeneration' ? 'Avg Generation' : value}
                </span>
              )}
            />
            {/* Scatter points for binned averages */}
            <Scatter
              dataKey="avgGeneration"
              fill="hsl(221, 83%, 53%)"
              name="avgGeneration"
            />
            {/* Line connecting the points */}
            <Line
              type="monotone"
              dataKey="avgGeneration"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={false}
              name="Trend"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Correlation interpretation */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{correlationQuality.label}</span> correlation between wind speed and generation output.
            {data.rSquared >= 0.7 && ' Higher wind speeds consistently result in higher generation.'}
            {data.rSquared < 0.5 && ' The relationship shows significant variability due to other factors.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
