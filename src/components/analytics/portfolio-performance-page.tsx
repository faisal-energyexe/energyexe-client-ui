import { useState, useMemo } from 'react'
import {
  TrendingUp,
  Building2,
  RefreshCw,
  Gauge,
  Zap,
  BarChart3,
  Award,
  AlertTriangle,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
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
import { usePortfolioPerformance } from '@/lib/portfolio-analytics-api'

type TimePeriod = '7d' | '30d' | '90d' | 'ytd' | '1y'

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

export function PortfolioPerformancePage() {
  const [period, setPeriod] = useState<TimePeriod>('30d')

  const dateRange = useMemo(() => getDateRange(period), [period])

  const {
    data: performanceData,
    isLoading,
    refetch,
  } = usePortfolioPerformance({
    start_date: dateRange.start.toISOString(),
    end_date: dateRange.end.toISOString(),
  })

  // Get top and bottom performers
  const { topPerformers, bottomPerformers } = useMemo(() => {
    if (!performanceData?.performance_ranking)
      return { topPerformers: [], bottomPerformers: [] }

    const ranking = [...performanceData.performance_ranking]
    return {
      topPerformers: ranking.slice(0, 5),
      bottomPerformers: ranking.slice(-5).reverse(),
    }
  }, [performanceData])

  // Get color for capacity factor
  const getCFColor = (cf: number) => {
    if (cf >= 40) return '#10b981' // Green - Excellent
    if (cf >= 30) return '#84cc16' // Lime - Good
    if (cf >= 20) return '#f59e0b' // Amber - Average
    return '#ef4444' // Red - Below average
  }

  // Get badge variant for capacity factor
  const getCFBadgeClass = (cf: number) => {
    if (cf >= 40) return 'bg-emerald-500/10 text-emerald-500'
    if (cf >= 30) return 'bg-lime-500/10 text-lime-500'
    if (cf >= 20) return 'bg-amber-500/10 text-amber-500'
    return 'bg-red-500/10 text-red-500'
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Performance
            </h1>
          </div>
          <p className="text-muted-foreground">
            Portfolio-wide capacity factor and performance benchmarks
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
            onClick={() => refetch()}
            disabled={isLoading}
            className="border-border/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Avg Capacity Factor"
          value={performanceData?.statistics.avg_capacity_factor ?? 0}
          format="percent"
          icon={Gauge}
          isLoading={isLoading}
          highlight={
            performanceData?.statistics.avg_capacity_factor
              ? performanceData.statistics.avg_capacity_factor >= 30
              : false
          }
        />
        <KPICard
          title="Max Capacity Factor"
          value={performanceData?.statistics.max_capacity_factor ?? 0}
          format="percent"
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <KPICard
          title="Min Capacity Factor"
          value={performanceData?.statistics.min_capacity_factor ?? 0}
          format="percent"
          icon={AlertTriangle}
          isLoading={isLoading}
        />
        <KPICard
          title="Total Capacity"
          value={performanceData?.statistics.total_capacity_mw ?? 0}
          format="capacity"
          icon={Zap}
          isLoading={isLoading}
        />
        <KPICard
          title="Active Farms"
          value={performanceData?.farm_count ?? 0}
          format="number"
          icon={Building2}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* CF Distribution Histogram */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-violet-500" />
              Capacity Factor Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : !performanceData?.cf_distribution ||
              performanceData.cf_distribution.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No distribution data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData.cf_distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="bin_label"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    label={{
                      value: 'Farms',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: 'hsl(var(--muted-foreground))' },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value} farms`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {performanceData.cf_distribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getCFColor((entry.bin_start + entry.bin_end) / 2)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : !performanceData?.performance_trend ||
              performanceData.performance_trend.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No trend data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData.performance_trend}>
                  <defs>
                    <linearGradient id="cfGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="period"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        year: '2-digit',
                      })
                    }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    label={{
                      value: 'CF %',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: 'hsl(var(--muted-foreground))' },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Capacity Factor']}
                    labelFormatter={(label) => {
                      const date = new Date(label)
                      return date.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="capacity_factor"
                    stroke="#8b5cf6"
                    fill="url(#cfGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top and Bottom Performers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : topPerformers.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No performance data available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Wind Farm</TableHead>
                    <TableHead className="text-right">CF %</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                    <TableHead className="text-right">Generation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((farm, index) => (
                    <TableRow key={farm.windfarm_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <div>
                            <Link
                              to="/wind-farms/$windfarmId"
                              params={{ windfarmId: farm.windfarm_id.toString() }}
                              className="hover:underline font-medium"
                            >
                              {farm.windfarm_name}
                            </Link>
                            <div className="text-xs text-muted-foreground">
                              {farm.country_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={getCFBadgeClass(farm.capacity_factor)}
                        >
                          {farm.capacity_factor.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.capacity_mw.toFixed(0)} MW
                      </TableCell>
                      <TableCell className="text-right">
                        {(farm.total_mwh / 1000).toFixed(1)} GWh
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Bottom Performers (Needs Attention) */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : bottomPerformers.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No performance data available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Wind Farm</TableHead>
                    <TableHead className="text-right">CF %</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                    <TableHead className="text-right">Generation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bottomPerformers.map((farm) => (
                    <TableRow key={farm.windfarm_id}>
                      <TableCell>
                        <Link
                          to="/wind-farms/$windfarmId"
                          params={{ windfarmId: farm.windfarm_id.toString() }}
                          className="hover:underline font-medium"
                        >
                          {farm.windfarm_name}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {farm.country_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={getCFBadgeClass(farm.capacity_factor)}
                        >
                          {farm.capacity_factor.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.capacity_mw.toFixed(0)} MW
                      </TableCell>
                      <TableCell className="text-right">
                        {(farm.total_mwh / 1000).toFixed(1)} GWh
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Technology Comparison */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Performance by Technology</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !performanceData?.by_technology ||
            performanceData.by_technology.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No technology data available for this period
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Rated Power</TableHead>
                    <TableHead className="text-right">Turbines</TableHead>
                    <TableHead className="text-right">Farms</TableHead>
                    <TableHead className="text-right">Total Capacity</TableHead>
                    <TableHead className="text-right">Generation</TableHead>
                    <TableHead className="text-right">CF %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.by_technology.map((tech) => (
                    <TableRow key={tech.model_id}>
                      <TableCell className="font-medium">{tech.manufacturer}</TableCell>
                      <TableCell>{tech.model_name}</TableCell>
                      <TableCell className="text-right">
                        {(tech.rated_power_kw / 1000).toFixed(1)} MW
                      </TableCell>
                      <TableCell className="text-right">{tech.turbine_count}</TableCell>
                      <TableCell className="text-right">{tech.farm_count}</TableCell>
                      <TableCell className="text-right">
                        {tech.total_capacity_mw.toFixed(0)} MW
                      </TableCell>
                      <TableCell className="text-right">
                        {(tech.total_mwh / 1000).toFixed(1)} GWh
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={getCFBadgeClass(tech.capacity_factor)}
                        >
                          {tech.capacity_factor.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Performance Ranking */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Full Performance Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !performanceData?.performance_ranking ||
            performanceData.performance_ranking.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No performance data available for this period
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Rank</TableHead>
                    <TableHead>Wind Farm</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                    <TableHead className="text-right">Generation</TableHead>
                    <TableHead className="text-right">CF %</TableHead>
                    <TableHead className="text-right">Data Quality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.performance_ranking.map((farm, index) => (
                    <TableRow key={farm.windfarm_id}>
                      <TableCell className="font-medium text-muted-foreground">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          to="/wind-farms/$windfarmId"
                          params={{ windfarmId: farm.windfarm_id.toString() }}
                          className="hover:underline font-medium"
                        >
                          {farm.windfarm_name}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {farm.windfarm_code}
                        </div>
                      </TableCell>
                      <TableCell>{farm.country_name}</TableCell>
                      <TableCell className="text-right">
                        {farm.capacity_mw.toFixed(0)} MW
                      </TableCell>
                      <TableCell className="text-right">
                        {(farm.total_mwh / 1000).toFixed(1)} GWh
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={getCFBadgeClass(farm.capacity_factor)}
                        >
                          {farm.capacity_factor.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {farm.avg_quality.toFixed(0)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// KPI Card Component
interface KPICardProps {
  title: string
  value: number
  format: 'percent' | 'capacity' | 'number'
  icon: React.ComponentType<{ className?: string }>
  isLoading?: boolean
  highlight?: boolean
}

function KPICard({ title, value, format, icon: Icon, isLoading, highlight }: KPICardProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'percent':
        return `${val.toFixed(1)}%`
      case 'capacity':
        return `${val.toFixed(0)} MW`
      case 'number':
        return val.toLocaleString()
      default:
        return val.toString()
    }
  }

  return (
    <Card
      className={`border-border/50 bg-card/50 backdrop-blur-sm ${highlight ? 'ring-2 ring-emerald-500/50' : ''}`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold">{formatValue(value, format)}</p>
            )}
          </div>
          <div className="p-2.5 rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
