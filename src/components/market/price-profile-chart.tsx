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
} from 'recharts'
import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PriceProfileResponse } from '@/lib/market-api'
import { formatPrice } from '@/lib/market-api'

interface PriceProfileChartProps {
  data: PriceProfileResponse | undefined
  isLoading: boolean
  aggregation: 'hourly' | 'daily'
}

export function PriceProfileChart({ data, isLoading, aggregation }: PriceProfileChartProps) {
  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data?.profile) return []

    return data.profile.map((entry) => {
      let label = ''
      if (aggregation === 'hourly' && entry.hour_of_day !== undefined) {
        label = `${entry.hour_of_day.toString().padStart(2, '0')}:00`
      } else if (aggregation === 'daily' && entry.day_name) {
        label = entry.day_name.slice(0, 3) // Mon, Tue, etc.
      }

      return {
        label,
        hour: entry.hour_of_day,
        day: entry.day_of_week,
        avgPrice: entry.avg_price,
        minPrice: entry.min_price,
        maxPrice: entry.max_price,
        stddev: entry.stddev,
        sampleCount: entry.sample_count,
      }
    })
  }, [data, aggregation])

  // Calculate average price for reference line
  const averagePrice = useMemo(() => {
    if (!chartData.length) return 0
    const validPrices = chartData.filter((d) => d.avgPrice !== null)
    if (!validPrices.length) return 0
    return validPrices.reduce((sum, d) => sum + (d.avgPrice ?? 0), 0) / validPrices.length
  }, [chartData])

  // Identify peak and low price periods
  const { peakPeriod, lowPeriod } = useMemo(() => {
    if (!chartData.length) return { peakPeriod: null, lowPeriod: null }

    const validData = chartData.filter((d) => d.avgPrice !== null)
    if (!validData.length) return { peakPeriod: null, lowPeriod: null }

    const peak = validData.reduce((max, d) =>
      (d.avgPrice ?? 0) > (max.avgPrice ?? 0) ? d : max
    )
    const low = validData.reduce((min, d) =>
      (d.avgPrice ?? 0) < (min.avgPrice ?? 0) ? d : min
    )

    return { peakPeriod: peak, lowPeriod: low }
  }, [chartData])

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
            <span className="text-muted-foreground">Average:</span>
            <span className="font-medium text-primary">
              {formatPrice(point.avgPrice, 'EUR')}/MWh
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Range:</span>
            <span className="font-medium">
              {formatPrice(point.minPrice, 'EUR')} - {formatPrice(point.maxPrice, 'EUR')}
            </span>
          </div>
          {point.stddev !== null && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Std Dev:</span>
              <span className="font-medium">
                {point.stddev.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
            <span className="text-muted-foreground">Samples:</span>
            <span className="font-medium">
              {point.sampleCount?.toLocaleString()}
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
            {aggregation === 'hourly' ? 'Hourly' : 'Daily'} Price Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No price profile data available
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
            <Clock className="h-5 w-5 text-primary" />
            {aggregation === 'hourly' ? 'Hourly' : 'Daily'} Price Profile
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {peakPeriod && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-muted-foreground">
                  Peak: {peakPeriod.label} ({formatPrice(peakPeriod.avgPrice, 'EUR')})
                </span>
              </div>
            )}
            {lowPeriod && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-muted-foreground">
                  Low: {lowPeriod.label} ({formatPrice(lowPeriod.avgPrice, 'EUR')})
                </span>
              </div>
            )}
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
              dataKey="label"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Average reference line */}
            <ReferenceLine
              y={averagePrice}
              stroke="hsl(215, 20%, 65%)"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
              label={{
                value: `Avg: ${formatPrice(averagePrice, 'EUR')}`,
                fill: 'hsl(215, 20%, 65%)',
                fontSize: 10,
                position: 'right',
              }}
            />

            {/* Price bars */}
            <Bar
              dataKey="avgPrice"
              fill="hsl(221, 83%, 53%)"
              fillOpacity={0.7}
              radius={[4, 4, 0, 0]}
              name="Average Price"
            />

            {/* Price range line */}
            <Line
              type="monotone"
              dataKey="maxPrice"
              stroke="hsl(0, 80%, 60%)"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              name="Max Price"
            />
            <Line
              type="monotone"
              dataKey="minPrice"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              name="Min Price"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Period insights */}
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Bidzone</p>
              <p className="font-medium">
                {data.bidzone_name || data.bidzone_code || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Average Price</p>
              <p className="font-medium">
                {formatPrice(averagePrice, 'EUR')}/MWh
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
