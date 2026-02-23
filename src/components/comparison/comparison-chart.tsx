import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useComparisonData,
  type ComparisonDataPoint,
  formatGeneration,
  getChartColor,
} from '@/lib/comparison-api'

interface ComparisonChartProps {
  selectedIds: number[]
  startDate: string | null
  endDate: string | null
  excludeRampUp?: boolean
}

type MetricType = 'generation' | 'capacity_factor'
type Granularity = 'hourly' | 'daily' | 'weekly' | 'monthly'

interface ChartDataPoint {
  period: string
  [key: string]: string | number | null
}

export function ComparisonChart({ selectedIds, startDate, endDate, excludeRampUp = true }: ComparisonChartProps) {
  const [metricType, setMetricType] = useState<MetricType>('generation')
  const [granularity, setGranularity] = useState<Granularity>('daily')

  const { data, isLoading, error } = useComparisonData(
    selectedIds,
    startDate,
    endDate,
    granularity,
    excludeRampUp
  )

  // Transform data for chart - pivot by period
  const chartData = useMemo(() => {
    if (!data?.data) return []

    // Group by period
    const periodMap = new Map<string, ChartDataPoint>()

    data.data.forEach((point: ComparisonDataPoint) => {
      if (!periodMap.has(point.period)) {
        periodMap.set(point.period, { period: point.period })
      }

      const periodData = periodMap.get(point.period)!
      const value =
        metricType === 'generation'
          ? point.total_generation
          : point.avg_capacity_factor != null
            ? point.avg_capacity_factor * 100
            : null

      periodData[`wf_${point.windfarm_id}`] = value
    })

    return Array.from(periodMap.values()).sort((a, b) =>
      String(a.period).localeCompare(String(b.period))
    )
  }, [data, metricType])

  // Get unique windfarm info for legend
  const windfarmInfo = useMemo(() => {
    if (!data?.data) return []

    const seen = new Set<number>()
    const info: Array<{ id: number; name: string }> = []

    data.data.forEach((point: ComparisonDataPoint) => {
      if (!seen.has(point.windfarm_id)) {
        seen.add(point.windfarm_id)
        info.push({ id: point.windfarm_id, name: point.windfarm_name })
      }
    })

    // Sort by selectedIds order
    return selectedIds
      .map((id) => info.find((i) => i.id === id))
      .filter((i): i is { id: number; name: string } => i != null)
  }, [data, selectedIds])

  const formatXAxis = (value: string) => {
    if (granularity === 'hourly') {
      return value.slice(11, 16) // HH:MM
    }
    if (granularity === 'monthly') {
      return value // Already YYYY-MM
    }
    // Daily/Weekly - show month/day
    const date = new Date(value)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const formatTooltipValue = (value: number | null | undefined) => {
    if (value == null) return 'N/A'
    return metricType === 'generation'
      ? formatGeneration(value)
      : `${value.toFixed(1)}%`
  }

  if (selectedIds.length < 2) {
    return null
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {metricType === 'generation' ? 'Generation Comparison' : 'Capacity Factor Comparison'}
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            <Button
              variant={metricType === 'generation' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMetricType('generation')}
              className="rounded-none"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Generation
            </Button>
            <Button
              variant={metricType === 'capacity_factor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMetricType('capacity_factor')}
              className="rounded-none"
            >
              CF %
            </Button>
          </div>

          {/* Granularity Selector */}
          <Select
            value={granularity}
            onValueChange={(v) => setGranularity(v as Granularity)}
          >
            <SelectTrigger className="w-[120px] bg-muted/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : error || !chartData.length ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {error ? 'Failed to load comparison data' : 'No data available for the selected period'}
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 40%)" opacity={0.3} />
                <XAxis
                  dataKey="period"
                  tickFormatter={formatXAxis}
                  tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
                  tickLine={{ stroke: 'hsl(215, 20%, 40%)' }}
                  axisLine={{ stroke: 'hsl(215, 20%, 40%)' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
                  tickLine={{ stroke: 'hsl(215, 20%, 40%)' }}
                  axisLine={{ stroke: 'hsl(215, 20%, 40%)' }}
                  tickFormatter={(v) =>
                    metricType === 'generation'
                      ? v >= 1000
                        ? `${(v / 1000).toFixed(0)}k`
                        : v.toFixed(0)
                      : `${v}%`
                  }
                  label={{
                    value: metricType === 'generation' ? 'Generation (MWh)' : 'Capacity Factor (%)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: 'hsl(215, 20%, 65%)' },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(215, 20%, 40%)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
                  formatter={(value, name) => {
                    const numValue = typeof value === 'number' ? value : null
                    const strName = String(name)
                    const wfInfo = windfarmInfo.find((i) => `wf_${i.id}` === strName)
                    return [formatTooltipValue(numValue), wfInfo?.name || strName]
                  }}
                  labelFormatter={(label) => {
                    if (granularity === 'hourly') return String(label)
                    return new Date(String(label)).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  }}
                />
                <Legend
                  formatter={(value) => {
                    const wfInfo = windfarmInfo.find((i) => `wf_${i.id}` === value)
                    return wfInfo?.name || value
                  }}
                />
                {windfarmInfo.map((wf, index) => (
                  <Line
                    key={wf.id}
                    type="monotone"
                    dataKey={`wf_${wf.id}`}
                    name={`wf_${wf.id}`}
                    stroke={getChartColor(index)}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
