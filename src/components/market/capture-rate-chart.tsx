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
  ReferenceLine,
  Legend,
} from 'recharts'
import { Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { CaptureRateResponse } from '@/lib/market-api'
import { formatCaptureRate, getCaptureRateColor, getCaptureRateLabel } from '@/lib/market-api'

interface CaptureRateChartProps {
  data: CaptureRateResponse | undefined
  isLoading: boolean
}

export function CaptureRateChart({ data, isLoading }: CaptureRateChartProps) {
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data?.periods) return []

    return data.periods.map((period) => {
      // Parse period for display label
      let displayLabel = period.period || 'Unknown'
      if (period.period) {
        const date = new Date(period.period)
        if (!isNaN(date.getTime())) {
          displayLabel = date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })
        }
      }

      return {
        period: displayLabel,
        captureRate: period.capture_rate ? period.capture_rate * 100 : null,
        achievedPrice: period.achieved_price,
        marketPrice: period.market_average_price,
        revenue: period.revenue_eur,
        generation: period.total_generation_mwh,
      }
    })
  }, [data])

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; name: string; color: string; payload: typeof chartData[0] }>
    label?: string
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const point = payload[0]?.payload

    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Capture Rate:</span>
            <span className={`font-medium ${getCaptureRateColor(point.captureRate ? point.captureRate / 100 : null)}`}>
              {point.captureRate?.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Achieved Price:</span>
            <span className="font-medium">
              {point.achievedPrice?.toFixed(2)} EUR/MWh
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Market Price:</span>
            <span className="font-medium">
              {point.marketPrice?.toFixed(2)} EUR/MWh
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
            <span className="text-muted-foreground">Revenue:</span>
            <span className="font-medium">
              {point.revenue?.toLocaleString()} EUR
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
            <Percent className="h-5 w-5 text-primary" />
            Capture Rate Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No capture rate data available for this period
          </div>
        </CardContent>
      </Card>
    )
  }

  const overallRate = data.overall.capture_rate

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Capture Rate Trend
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getCaptureRateColor(overallRate)}>
              Overall: {formatCaptureRate(overallRate)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {getCaptureRateLabel(overallRate)}
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
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="period"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 'auto']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
            />

            {/* 100% reference line */}
            <ReferenceLine
              yAxisId="left"
              y={100}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
              label={{
                value: 'Market Rate',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 10,
              }}
            />

            {/* Capture rate bars */}
            <Bar
              yAxisId="left"
              dataKey="captureRate"
              fill="hsl(var(--primary))"
              fillOpacity={0.7}
              radius={[4, 4, 0, 0]}
              name="Capture Rate (%)"
            />

            {/* Price lines */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="achievedPrice"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(142, 71%, 45%)', r: 3 }}
              name="Achieved Price (EUR/MWh)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="marketPrice"
              stroke="hsl(45, 90%, 50%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(45, 90%, 50%)', r: 3 }}
              name="Market Price (EUR/MWh)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
