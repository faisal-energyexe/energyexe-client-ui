import { useMemo, useState } from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from 'recharts'
import { Download, BarChart3, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { GenerationHourlyData } from '@/lib/generation-api'

interface GenerationChartProps {
  data: GenerationHourlyData[] | undefined
  isLoading: boolean
  aggregation: 'hourly' | 'daily' | 'monthly'
  onAggregationChange: (agg: 'hourly' | 'daily' | 'monthly') => void
}

interface ChartDataPoint {
  timestamp: string
  displayLabel: string
  generation: number
  quality: number
}

const aggregationOptions = [
  { value: 'hourly', label: 'Hourly', icon: BarChart3 },
  { value: 'daily', label: 'Daily', icon: TrendingUp },
  { value: 'monthly', label: 'Monthly', icon: TrendingUp },
] as const

export function GenerationChart({
  data,
  isLoading,
  aggregation,
  onAggregationChange,
}: GenerationChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area')

  // Process and aggregate data for chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Group data by aggregation level
    const grouped = new Map<string, { total: number; quality: number; count: number }>()

    data.forEach((item) => {
      const date = new Date(item.hour)
      let key: string

      switch (aggregation) {
        case 'hourly':
          key = item.hour
          break
        case 'daily':
          key = date.toISOString().split('T')[0]
          break
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          break
      }

      const existing = grouped.get(key) || { total: 0, quality: 0, count: 0 }
      grouped.set(key, {
        total: existing.total + item.generation_mwh,
        quality: existing.quality + (item.quality_score || 0),
        count: existing.count + 1,
      })
    })

    // Convert to chart data format
    const result: ChartDataPoint[] = []
    grouped.forEach((value, key) => {
      let displayLabel: string
      const date = new Date(key)

      switch (aggregation) {
        case 'hourly':
          displayLabel = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
          })
          break
        case 'daily':
          displayLabel = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
          break
        case 'monthly':
          displayLabel = date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })
          break
      }

      result.push({
        timestamp: key,
        displayLabel,
        generation: value.total,
        quality: value.count > 0 ? (value.quality / value.count) * 100 : 0,
      })
    })

    return result.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  }, [data, aggregation])

  // Format for tooltip
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} GWh`
    }
    return `${value.toFixed(2)} MWh`
  }

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; dataKey: string; color: string }>
    label?: string
  }) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.dataKey === 'generation' ? 'Generation:' : 'Quality:'}
            </span>
            <span className="font-medium text-foreground">
              {entry.dataKey === 'generation'
                ? formatValue(entry.value)
                : `${entry.value.toFixed(1)}%`}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const handleExportImage = () => {
    // Implementation for chart export
    console.log('Export chart as image')
  }

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Generation Over Time
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Aggregation selector */}
            <div className="flex rounded-lg bg-muted/30 p-1">
              {aggregationOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="sm"
                  className={`px-3 ${
                    aggregation === option.value
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => onAggregationChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Chart type toggle */}
            <Button
              variant="outline"
              size="icon"
              className="bg-card/50 border-border/50"
              onClick={() =>
                setChartType(chartType === 'line' ? 'area' : 'line')
              }
            >
              <BarChart3 className="h-4 w-4" />
            </Button>

            {/* Export button */}
            <Button
              variant="outline"
              size="icon"
              className="bg-card/50 border-border/50"
              onClick={handleExportImage}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            No generation data available for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="generationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="displayLabel"
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
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}G` : `${value}`
                }
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {chartType === 'area' ? (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="generation"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#generationGradient)"
                  name="Generation (MWh)"
                />
              ) : (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="generation"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Generation (MWh)"
                />
              )}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quality"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Quality Score (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
