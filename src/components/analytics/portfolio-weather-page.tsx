import { useState, useMemo } from 'react'
import {
  Wind,
  Thermometer,
  Building2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Globe,
  BarChart3,
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
import { usePortfolioWeatherSummary } from '@/lib/portfolio-analytics-api'

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

export function PortfolioWeatherPage() {
  const [period, setPeriod] = useState<TimePeriod>('30d')

  const dateRange = useMemo(() => getDateRange(period), [period])

  const {
    data: weatherData,
    isLoading,
    refetch,
  } = usePortfolioWeatherSummary({
    start_date: dateRange.start.toISOString(),
    end_date: dateRange.end.toISOString(),
  })

  // Format seasonal chart data
  const seasonalChartData = useMemo(() => {
    if (!weatherData?.seasonal_patterns) return []
    return weatherData.seasonal_patterns.map((point) => ({
      month: point.month_name.substring(0, 3),
      fullMonth: point.month_name,
      wind_speed: point.avg_wind_speed,
      temperature: point.avg_temperature,
    }))
  }, [weatherData])

  // Format country chart data
  const countryChartData = useMemo(() => {
    if (!weatherData?.by_country) return []
    return weatherData.by_country.map((country) => ({
      name:
        country.country_name.length > 12
          ? country.country_name.substring(0, 12) + '...'
          : country.country_name,
      fullName: country.country_name,
      country_code: country.country_code,
      wind_speed: country.avg_wind_speed,
      farm_count: country.farm_count,
    }))
  }, [weatherData])

  // Get top and bottom performers by correlation
  const { topPerformers, bottomPerformers } = useMemo(() => {
    if (!weatherData?.correlation_summary)
      return { topPerformers: [], bottomPerformers: [] }

    const withCorrelation = weatherData.correlation_summary.filter(
      (f) => f.wind_gen_correlation !== null,
    )
    const sorted = [...withCorrelation].sort(
      (a, b) => (b.wind_gen_correlation ?? 0) - (a.wind_gen_correlation ?? 0),
    )

    return {
      topPerformers: sorted.slice(0, 5),
      bottomPerformers: sorted.slice(-5).reverse(),
    }
  }, [weatherData])

  // Generate bar colors based on wind speed
  const getBarColor = (windSpeed: number) => {
    if (windSpeed >= 10) return '#10b981' // Green - Excellent wind
    if (windSpeed >= 7) return '#84cc16' // Lime - Good wind
    if (windSpeed >= 5) return '#f59e0b' // Amber - Moderate wind
    return '#ef4444' // Red - Low wind
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25">
              <Wind className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Weather Impact
            </h1>
          </div>
          <p className="text-muted-foreground">
            Portfolio-wide weather conditions and wind-generation correlation
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
          title="Avg Wind Speed"
          value={weatherData?.avg_wind_speed ?? 0}
          format="windspeed"
          icon={Wind}
          isLoading={isLoading}
        />
        <KPICard
          title="Min Wind Speed"
          value={weatherData?.min_wind_speed ?? 0}
          format="windspeed"
          icon={TrendingDown}
          isLoading={isLoading}
        />
        <KPICard
          title="Max Wind Speed"
          value={weatherData?.max_wind_speed ?? 0}
          format="windspeed"
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <KPICard
          title="Avg Temperature"
          value={weatherData?.avg_temperature ?? 0}
          format="temperature"
          icon={Thermometer}
          isLoading={isLoading}
        />
        <KPICard
          title="Active Farms"
          value={weatherData?.farm_count ?? 0}
          format="number"
          icon={Building2}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Seasonal Patterns Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-500" />
              Seasonal Wind Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : seasonalChartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No seasonal data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={seasonalChartData}>
                  <defs>
                    <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    yAxisId="wind"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    label={{
                      value: 'm/s',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: 'hsl(var(--muted-foreground))' },
                    }}
                  />
                  <YAxis
                    yAxisId="temp"
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    label={{
                      value: '°C',
                      angle: 90,
                      position: 'insideRight',
                      style: { fill: 'hsl(var(--muted-foreground))' },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value, name) => {
                      if (name === 'wind_speed') return [`${value} m/s`, 'Wind Speed']
                      if (name === 'temperature') return [`${value}°C`, 'Temperature']
                      return [value, name]
                    }}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Area
                    yAxisId="wind"
                    type="monotone"
                    dataKey="wind_speed"
                    stroke="#06b6d4"
                    fill="url(#windGradient)"
                    strokeWidth={2}
                    name="Wind Speed"
                  />
                  <Area
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#f59e0b"
                    fill="url(#tempGradient)"
                    strokeWidth={2}
                    name="Temperature"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Wind Speed by Country */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Wind Speed by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : countryChartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No country data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    label={{
                      value: 'Wind Speed (m/s)',
                      position: 'insideBottom',
                      offset: -5,
                      style: { fill: 'hsl(var(--muted-foreground))' },
                    }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value} m/s`, 'Avg Wind Speed']}
                    labelFormatter={(_, payload) => {
                      if (payload?.[0]?.payload) {
                        return payload[0].payload.fullName
                      }
                      return ''
                    }}
                  />
                  <Bar dataKey="wind_speed" radius={[0, 4, 4, 0]}>
                    {countryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.wind_speed)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Correlation Summary Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Best Wind-Generation Correlation
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
                No correlation data available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Wind Farm</TableHead>
                    <TableHead className="text-right">Correlation</TableHead>
                    <TableHead className="text-right">Avg Wind</TableHead>
                    <TableHead className="text-right">CF %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((farm) => (
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
                        <Badge variant="outline" className="bg-emerald-500/10">
                          {farm.wind_gen_correlation?.toFixed(3) ?? 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.avg_wind_speed.toFixed(1)} m/s
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.capacity_factor.toFixed(1)}%
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
              <TrendingDown className="h-5 w-5 text-amber-500" />
              Lowest Wind-Generation Correlation
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
                No correlation data available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Wind Farm</TableHead>
                    <TableHead className="text-right">Correlation</TableHead>
                    <TableHead className="text-right">Avg Wind</TableHead>
                    <TableHead className="text-right">CF %</TableHead>
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
                        <Badge variant="outline" className="bg-amber-500/10">
                          {farm.wind_gen_correlation?.toFixed(3) ?? 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.avg_wind_speed.toFixed(1)} m/s
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.capacity_factor.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Correlation Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">All Farm Correlations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !weatherData?.correlation_summary ||
            weatherData.correlation_summary.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No correlation data available for this period
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Wind Farm</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Correlation</TableHead>
                    <TableHead className="text-right">Avg Wind Speed</TableHead>
                    <TableHead className="text-right">Avg Generation</TableHead>
                    <TableHead className="text-right">Capacity Factor</TableHead>
                    <TableHead className="text-right">Data Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weatherData.correlation_summary.map((farm) => (
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
                          {farm.windfarm_code}
                        </div>
                      </TableCell>
                      <TableCell>{farm.country_name}</TableCell>
                      <TableCell className="text-right">
                        {farm.wind_gen_correlation !== null ? (
                          <Badge
                            variant="outline"
                            className={
                              farm.wind_gen_correlation >= 0.7
                                ? 'bg-emerald-500/10'
                                : farm.wind_gen_correlation >= 0.5
                                  ? 'bg-cyan-500/10'
                                  : 'bg-amber-500/10'
                            }
                          >
                            {farm.wind_gen_correlation.toFixed(3)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.avg_wind_speed.toFixed(2)} m/s
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.avg_generation_mwh.toFixed(2)} MWh
                      </TableCell>
                      <TableCell className="text-right">
                        {farm.capacity_factor.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {farm.data_points.toLocaleString()}
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
  format: 'windspeed' | 'temperature' | 'number' | 'percent'
  icon: React.ComponentType<{ className?: string }>
  isLoading?: boolean
  highlight?: boolean
}

function KPICard({ title, value, format, icon: Icon, isLoading, highlight }: KPICardProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'windspeed':
        return `${val.toFixed(1)} m/s`
      case 'temperature':
        return `${val.toFixed(1)}°C`
      case 'percent':
        return `${val.toFixed(1)}%`
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
