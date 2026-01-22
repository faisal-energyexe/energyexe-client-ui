import { useState, useMemo } from 'react'
import { BarChart3, TrendingUp, Gauge, Building2, RefreshCw, Trophy, AlertTriangle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  usePortfolioGenerationStats,
  usePortfolioGenerationTimeseries,
} from '@/lib/portfolio-analytics-api'

type TimePeriod = '7d' | '30d' | '90d' | 'ytd' | '1y'
type Aggregation = 'daily' | 'weekly' | 'monthly'

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'ytd', label: 'Year to Date' },
  { value: '1y', label: '1 Year' },
]

function getDateRange(period: TimePeriod): { start: Date; end: Date } {
  const now = new Date()
  const end = endOfDay(now)

  switch (period) {
    case '7d':
      return { start: startOfDay(subDays(now, 7)), end }
    case '30d':
      return { start: startOfDay(subDays(now, 30)), end }
    case '90d':
      return { start: startOfDay(subDays(now, 90)), end }
    case 'ytd':
      return { start: startOfDay(new Date(now.getFullYear(), 0, 1)), end }
    case '1y':
      return { start: startOfDay(subDays(now, 365)), end }
    default:
      return { start: startOfDay(subDays(now, 30)), end }
  }
}

function getAggregation(period: TimePeriod): Aggregation {
  switch (period) {
    case '7d':
      return 'daily'
    case '30d':
      return 'daily'
    case '90d':
      return 'weekly'
    case 'ytd':
      return 'monthly'
    case '1y':
      return 'monthly'
    default:
      return 'daily'
  }
}

export function PortfolioGenerationPage() {
  const [period, setPeriod] = useState<TimePeriod>('30d')

  const dateRange = useMemo(() => getDateRange(period), [period])
  const aggregation = useMemo(() => getAggregation(period), [period])

  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = usePortfolioGenerationStats({
    start_date: dateRange.start.toISOString(),
    end_date: dateRange.end.toISOString(),
  })

  const { data: timeseries, isLoading: isLoadingTimeseries } =
    usePortfolioGenerationTimeseries({
      start_date: dateRange.start.toISOString(),
      end_date: dateRange.end.toISOString(),
      aggregation,
    })

  const isLoading = isLoadingStats || isLoadingTimeseries

  // Format chart data
  const chartData = useMemo(() => {
    if (!timeseries?.timeseries) return []
    return timeseries.timeseries.map((point) => ({
      period: format(new Date(point.period), aggregation === 'monthly' ? 'MMM yyyy' : 'MMM d'),
      generation: point.total_mwh,
      quality: point.avg_quality * 100,
      farms: point.farm_count,
    }))
  }, [timeseries, aggregation])

  // Stacked area chart data by farm
  const stackedData = useMemo(() => {
    if (!timeseries?.by_farm || !timeseries?.timeseries) return []

    const farmNames = Object.keys(timeseries.by_farm).slice(0, 10) // Top 10 farms

    return timeseries.timeseries.map((point) => {
      const row: Record<string, number | string> = {
        period: format(new Date(point.period), aggregation === 'monthly' ? 'MMM yyyy' : 'MMM d'),
      }
      farmNames.forEach((name) => {
        const farmData = timeseries.by_farm[name]?.find(
          (p) => p.period === point.period,
        )
        row[name] = farmData?.mwh ?? 0
      })
      return row
    })
  }, [timeseries, aggregation])

  const farmNames = useMemo(() => {
    if (!timeseries?.by_farm) return []
    return Object.keys(timeseries.by_farm).slice(0, 10)
  }, [timeseries])

  // Generate colors for farms
  const farmColors = useMemo(() => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    ]
    return farmNames.reduce(
      (acc, name, i) => ({ ...acc, [name]: colors[i % colors.length] }),
      {} as Record<string, string>,
    )
  }, [farmNames])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-cyan-500 shadow-lg shadow-primary/25">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Generation Analytics
            </h1>
          </div>
          <p className="text-muted-foreground">
            Portfolio-wide generation performance across all wind farms
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
            <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchStats()}
            disabled={isLoading}
            className="border-border/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Generation"
          value={stats?.total_mwh ?? 0}
          format="mwh"
          icon={BarChart3}
          isLoading={isLoadingStats}
        />
        <KPICard
          title="Avg Capacity Factor"
          value={stats?.avg_capacity_factor ?? 0}
          format="percent"
          icon={Gauge}
          isLoading={isLoadingStats}
        />
        <KPICard
          title="Active Farms"
          value={stats?.farm_count ?? 0}
          format="number"
          icon={Building2}
          isLoading={isLoadingStats}
        />
        <KPICard
          title="Total Capacity"
          value={stats?.total_capacity_mw ?? 0}
          format="mw"
          icon={TrendingUp}
          isLoading={isLoadingStats}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generation Trend Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Generation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTimeseries ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="generationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="period"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#374151' }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${Number(value).toLocaleString()} MWh`, 'Generation']}
                  />
                  <Area
                    type="monotone"
                    dataKey="generation"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#generationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Stacked Farm Contribution */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Farm Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTimeseries ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stackedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="period"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#374151' }}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#374151' }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  {farmNames.map((name) => (
                    <Area
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stackId="1"
                      stroke={farmColors[name]}
                      fill={farmColors[name]}
                      fillOpacity={0.6}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performers Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Wind Farm</TableHead>
                    <TableHead className="text-right">Generation</TableHead>
                    <TableHead className="text-right">CF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.top_performers?.slice(0, 10).map((farm, i) => (
                    <TableRow key={farm.windfarm_id} className="border-border/50">
                      <TableCell>
                        <Link
                          to="/wind-farms/$windfarmId"
                          params={{ windfarmId: farm.windfarm_id.toString() }}
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <span className="text-muted-foreground text-sm">#{i + 1}</span>
                          {farm.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {farm.total_mwh.toLocaleString()} MWh
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        >
                          {farm.capacity_factor.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Bottom Performers */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.bottom_performers && stats.bottom_performers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Wind Farm</TableHead>
                    <TableHead className="text-right">Generation</TableHead>
                    <TableHead className="text-right">CF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.bottom_performers?.slice(0, 10).map((farm) => (
                    <TableRow key={farm.windfarm_id} className="border-border/50">
                      <TableCell>
                        <Link
                          to="/wind-farms/$windfarmId"
                          params={{ windfarmId: farm.windfarm_id.toString() }}
                          className="text-primary hover:underline"
                        >
                          {farm.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {farm.total_mwh.toLocaleString()} MWh
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-400 border-amber-500/20"
                        >
                          {farm.capacity_factor.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No underperforming farms detected
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// KPI Card Component
interface KPICardProps {
  title: string
  value: number
  format: 'mwh' | 'percent' | 'number' | 'mw'
  icon: typeof BarChart3
  isLoading: boolean
}

function KPICard({ title, value, format, icon: Icon, isLoading }: KPICardProps) {
  const formattedValue = useMemo(() => {
    if (format === 'mwh') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(2)} TWh`
      if (value >= 1000) return `${(value / 1000).toFixed(1)} GWh`
      return `${value.toFixed(0)} MWh`
    }
    if (format === 'mw') {
      if (value >= 1000) return `${(value / 1000).toFixed(2)} GW`
      return `${value.toFixed(0)} MW`
    }
    if (format === 'percent') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }, [value, format])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{title}</p>
              <p className="text-xl font-bold text-foreground">{formattedValue}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
