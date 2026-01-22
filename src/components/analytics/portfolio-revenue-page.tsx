import { useState, useMemo } from 'react'
import {
  DollarSign,
  TrendingUp,
  Gauge,
  Building2,
  RefreshCw,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
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
import {
  usePortfolioRevenue,
  usePortfolioCaptureRates,
} from '@/lib/portfolio-analytics-api'

type TimePeriod = '7d' | '30d' | '90d' | 'ytd' | '1y'
type Aggregation = 'day' | 'week' | 'month'

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
      return 'day'
    case '30d':
      return 'day'
    case '90d':
      return 'week'
    case 'ytd':
      return 'month'
    case '1y':
      return 'month'
    default:
      return 'day'
  }
}

export function PortfolioRevenuePage() {
  const [period, setPeriod] = useState<TimePeriod>('30d')

  const dateRange = useMemo(() => getDateRange(period), [period])
  const aggregation = useMemo(() => getAggregation(period), [period])

  const {
    data: revenueData,
    isLoading: isLoadingRevenue,
    refetch: refetchRevenue,
  } = usePortfolioRevenue({
    start_date: dateRange.start.toISOString(),
    end_date: dateRange.end.toISOString(),
    aggregation,
  })

  const { data: captureRatesData, isLoading: isLoadingCaptureRates } =
    usePortfolioCaptureRates({
      start_date: dateRange.start.toISOString(),
      end_date: dateRange.end.toISOString(),
      sort_by: 'capture_rate',
    })

  const isLoading = isLoadingRevenue || isLoadingCaptureRates

  // Format revenue trend chart data
  const trendChartData = useMemo(() => {
    if (!revenueData?.by_period) return []
    return revenueData.by_period.map((point) => ({
      period: format(
        new Date(point.period),
        aggregation === 'month' ? 'MMM yyyy' : 'MMM d',
      ),
      revenue: point.total_revenue_eur,
      generation: point.total_generation_mwh,
      price: point.avg_price,
    }))
  }, [revenueData, aggregation])

  // Format revenue by farm chart data
  const farmChartData = useMemo(() => {
    if (!revenueData?.by_farm) return []
    return revenueData.by_farm.slice(0, 10).map((farm) => ({
      name: farm.name.length > 15 ? farm.name.substring(0, 15) + '...' : farm.name,
      fullName: farm.name,
      revenue: farm.total_revenue_eur,
      capture_rate: farm.capture_rate,
      windfarm_id: farm.windfarm_id,
    }))
  }, [revenueData])

  // Generate colors based on capture rate
  const getBarColor = (captureRate: number) => {
    if (captureRate >= 100) return '#10b981' // Green
    if (captureRate >= 90) return '#84cc16' // Lime
    if (captureRate >= 80) return '#f59e0b' // Amber
    return '#ef4444' // Red
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Revenue & Pricing
            </h1>
          </div>
          <p className="text-muted-foreground">
            Portfolio-wide revenue and capture rate analytics
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
            onClick={() => refetchRevenue()}
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
          title="Total Revenue"
          value={revenueData?.total_revenue_eur ?? 0}
          format="currency"
          icon={DollarSign}
          isLoading={isLoadingRevenue}
        />
        <KPICard
          title="Avg. Achieved Price"
          value={revenueData?.avg_achieved_price ?? 0}
          format="price"
          icon={TrendingUp}
          isLoading={isLoadingRevenue}
        />
        <KPICard
          title="Market Avg. Price"
          value={revenueData?.avg_market_price ?? 0}
          format="price"
          icon={TrendingUp}
          isLoading={isLoadingRevenue}
        />
        <KPICard
          title="Capture Rate"
          value={revenueData?.avg_capture_rate ?? 0}
          format="percent"
          icon={Gauge}
          isLoading={isLoadingRevenue}
          highlight={revenueData?.avg_capture_rate ? revenueData.avg_capture_rate >= 100 : false}
        />
        <KPICard
          title="Active Farms"
          value={revenueData?.farm_count ?? 0}
          format="number"
          icon={Building2}
          isLoading={isLoadingRevenue}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendChartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                    formatter={(value) => [
                      `€${Number(value).toLocaleString()}`,
                      'Revenue',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Farm Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top Farms by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={farmChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    type="number"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#374151' }}
                    tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={{ stroke: '#374151' }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    formatter={(value, _, props) => [
                      `€${Number(value).toLocaleString()}`,
                      props.payload.fullName,
                    ]}
                  />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {farmChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.capture_rate)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Capture Rate Ranking Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Capture Rate Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCaptureRates ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Rank</TableHead>
                  <TableHead>Wind Farm</TableHead>
                  <TableHead>Bidzone</TableHead>
                  <TableHead className="text-right">Generation</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Achieved Price</TableHead>
                  <TableHead className="text-right">Capture Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {captureRatesData?.farms?.slice(0, 20).map((farm, i) => (
                  <TableRow key={farm.windfarm_id} className="border-border/50">
                    <TableCell>
                      <span className="text-muted-foreground font-medium">#{i + 1}</span>
                    </TableCell>
                    <TableCell>
                      <Link
                        to="/wind-farms/$windfarmId"
                        params={{ windfarmId: farm.windfarm_id.toString() }}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {farm.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/50">
                        {farm.bidzone_code || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {farm.total_generation_mwh.toLocaleString()} MWh
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      €{farm.total_revenue_eur.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      €{farm.achieved_price.toFixed(2)}/MWh
                    </TableCell>
                    <TableCell className="text-right">
                      <CaptureRateBadge rate={farm.capture_rate} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
  format: 'currency' | 'price' | 'percent' | 'number'
  icon: typeof DollarSign
  isLoading: boolean
  highlight?: boolean
}

function KPICard({
  title,
  value,
  format,
  icon: Icon,
  isLoading,
  highlight,
}: KPICardProps) {
  const formattedValue = useMemo(() => {
    if (format === 'currency') {
      if (value >= 1000000) return `€${(value / 1000000).toFixed(2)}M`
      if (value >= 1000) return `€${(value / 1000).toFixed(1)}k`
      return `€${value.toFixed(0)}`
    }
    if (format === 'price') return `€${value.toFixed(2)}/MWh`
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
            <div
              className={`p-2 rounded-lg ${highlight ? 'bg-emerald-500/20' : 'bg-primary/10'}`}
            >
              <Icon
                className={`h-5 w-5 ${highlight ? 'text-emerald-400' : 'text-primary'}`}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{title}</p>
              <p
                className={`text-xl font-bold ${highlight ? 'text-emerald-400' : 'text-foreground'}`}
              >
                {formattedValue}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Capture Rate Badge Component
function CaptureRateBadge({ rate }: { rate: number }) {
  const isPositive = rate >= 100

  return (
    <Badge
      variant="outline"
      className={`${
        isPositive
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : rate >= 90
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            : 'bg-red-500/10 text-red-400 border-red-500/20'
      }`}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3 w-3 mr-1" />
      ) : (
        <ArrowDownRight className="h-3 w-3 mr-1" />
      )}
      {rate.toFixed(1)}%
    </Badge>
  )
}
