import { useMemo } from 'react'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Legend,
} from 'recharts'
import { Banknote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { RevenueMetricsResponse } from '@/lib/market-api'
import { formatRevenue } from '@/lib/market-api'

interface RevenueChartProps {
  data: RevenueMetricsResponse | undefined
  isLoading: boolean
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
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
        revenue: period.total_revenue_eur,
        generation: period.total_generation_mwh,
        avgPrice: period.avg_day_ahead_price,
        hours: period.hours_with_generation,
      }
    })
  }, [data])

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    if (!data?.periods) return 0
    return data.periods.reduce((sum, p) => sum + p.total_revenue_eur, 0)
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
            <span className="text-muted-foreground">Revenue:</span>
            <span className="font-medium text-emerald-400">
              {formatRevenue(point.revenue, 'EUR')}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Generation:</span>
            <span className="font-medium">
              {point.generation?.toLocaleString()} MWh
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Avg Price:</span>
            <span className="font-medium">
              {point.avgPrice?.toFixed(2)} EUR/MWh
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
            <span className="text-muted-foreground">Hours:</span>
            <span className="font-medium">
              {point.hours?.toLocaleString()}
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
            <Banknote className="h-5 w-5 text-primary" />
            Revenue Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No revenue data available for this period
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
            <Banknote className="h-5 w-5 text-primary" />
            Revenue Over Time
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-medium text-foreground">{formatRevenue(totalRevenue, 'EUR')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(215, 20%, 40%)"
              opacity={0.3}
            />
            <XAxis
              dataKey="period"
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
              tickFormatter={(value) =>
                value >= 1000000
                  ? `${(value / 1000000).toFixed(0)}M`
                  : value >= 1000
                    ? `${(value / 1000).toFixed(0)}k`
                    : `${value}`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
            />
            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              radius={[4, 4, 0, 0]}
              name="Revenue (EUR)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
