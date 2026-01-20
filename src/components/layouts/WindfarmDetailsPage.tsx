'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ObsidianBackground, ObsidianParticleCanvas } from './obsidian'
import {
  windfarmInfo,
  realtimeMetrics,
  generationTimeSeries,
  weeklyGeneration,
  capacityFactorTrend,
  weatherForecast,
  powerPrices,
  captureRates,
  turbineData,
  powerCurveData,
  revenueMetrics,
  environmentalMetrics,
  windfarmAlerts,
  kpis,
  generationByTimeOfDay,
  benchmarkData,
  // Generation Units data
  generationUnits,
  unitProductionComparison,
  unitEfficiencyScatter,
  unitStatusDistribution,
  unitHourlyProduction,
  unitRankings,
  modelPerformanceComparison,
  clusterPerformanceData,
} from '@/lib/windfarm-data'
import {
  Zap,
  Wind,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Thermometer,
  Droplets,
  Cloud,
  MapPin,
  Clock,
  TrendingUp,
  BarChart3,
  LineChart as LineChartIcon,
  Settings,
  Bell,
  Search,
  Leaf,
  Home,
  Factory,
  Navigation,
  AlertTriangle,
  Info,
  Target,
  RefreshCw,
  Cpu,
  Layers,
  Award,
  RotateCw,
  Gauge,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  ReferenceLine,
  Scatter,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
} from 'recharts'

// Premium color palette for charts (hex values for Recharts)
const HEX_COLORS = {
  primary: '#3B82F6',
  secondary: '#22D3EE',
  tertiary: '#14B8A6',
  accent: '#A855F7',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  muted: '#64748B',
}

/**
 * WindfarmDetailsPage - World-Class Windfarm Monitoring Dashboard
 * Comprehensive visualization of all windfarm metrics
 */
export function WindfarmDetailsPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('24h')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate summary metrics
  const onlineTurbines = turbineData.filter(t => t.status === 'running').length
  const warningTurbines = turbineData.filter(t => t.status === 'warning').length
  const maintenanceTurbines = turbineData.filter(t => t.status === 'maintenance').length
  const unacknowledgedAlerts = windfarmAlerts.filter(a => !a.acknowledged).length

  return (
    <div className="obsidian-layout min-h-screen relative">
      {/* Premium Animated Background */}
      <ObsidianBackground />
      <ObsidianParticleCanvas />

      {/* Content Container */}
      <div className="relative z-10 space-y-6 pb-8">
        {/* Premium Header */}
        <header className="glass-panel sticky top-0 z-50 -mx-4 px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Windfarm Info */}
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight gradient-text">
                    {windfarmInfo.name}
                  </h1>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <span className="status-dot online mr-1.5" style={{ width: 6, height: 6 }} />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {windfarmInfo.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    {windfarmInfo.capacity} MW
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5" />
                    {windfarmInfo.turbineCount} Turbines
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button className="icon-btn">
                <Search className="h-4 w-4" />
              </button>
              <button className="icon-btn relative">
                <Bell className="h-4 w-4" />
                {unacknowledgedAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
                    {unacknowledgedAlerts}
                  </span>
                )}
              </button>
              <button className="icon-btn">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button className="icon-btn">
                <Settings className="h-4 w-4" />
              </button>
            </div>

            {/* Right: Time & Status */}
            <div className="text-right">
              <div className="text-2xl font-light tabular-nums tracking-tight neon-text">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
              <div className="text-xs text-muted-foreground tracking-wider uppercase">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        {/* Glowing Accent Line */}
        <div className="glow-line" />

        {/* Real-time Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-1">
          <div className="flex flex-wrap items-center gap-6">
            <StatusIndicator
              icon={<Wind className="h-4 w-4" />}
              label="Wind Speed"
              value={`${realtimeMetrics.windSpeed} m/s`}
              color="text-cyan-400"
            />
            <StatusIndicator
              icon={<Navigation className="h-4 w-4" style={{ transform: `rotate(${realtimeMetrics.windDirection}deg)` }} />}
              label="Direction"
              value={`${realtimeMetrics.windDirection}°`}
              color="text-primary"
            />
            <StatusIndicator
              icon={<Thermometer className="h-4 w-4" />}
              label="Temperature"
              value={`${realtimeMetrics.temperature}°C`}
              color="text-amber-400"
            />
            <StatusIndicator
              icon={<Activity className="h-4 w-4" />}
              label="Grid Status"
              value="Connected"
              color="text-emerald-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              Last updated: Just now
            </Badge>
            <Badge className="premium-badge">
              <TrendingUp className="h-3 w-3" />
              Above Target
            </Badge>
          </div>
        </div>

        {/* Primary KPI Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
          {Object.entries(kpis).map(([key, kpi], index) => (
            <KPICard key={key} kpi={kpi} index={index} />
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-panel p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="generation" className="gap-2">
              <Zap className="h-4 w-4" />
              Generation
            </TabsTrigger>
            <TabsTrigger value="weather" className="gap-2">
              <Cloud className="h-4 w-4" />
              Weather
            </TabsTrigger>
            <TabsTrigger value="market" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Market & Revenue
            </TabsTrigger>
            <TabsTrigger value="turbines" className="gap-2">
              <Wind className="h-4 w-4" />
              Turbines
            </TabsTrigger>
            <TabsTrigger value="units" className="gap-2">
              <Cpu className="h-4 w-4" />
              Generation Units
            </TabsTrigger>
            <TabsTrigger value="environment" className="gap-2">
              <Leaf className="h-4 w-4" />
              Environment
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Generation Chart */}
              <Card className="obsidian-card lg:col-span-8 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Real-Time Generation</CardTitle>
                        <p className="text-xs text-muted-foreground">Live power output vs forecast</p>
                      </div>
                    </div>
                    <TimeRangeSelector value={selectedTimeRange} onChange={setSelectedTimeRange} />
                  </div>
                </CardHeader>
                <CardContent className="chart-container">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={generationTimeSeries.slice(-48)}>
                        <defs>
                          <linearGradient id="generationGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={HEX_COLORS.primary} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={HEX_COLORS.primary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                          dataKey="time"
                          stroke="rgba(255,255,255,0.3)"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.3)"
                          fontSize={11}
                          tickLine={false}
                          domain={[0, 500]}
                          tickFormatter={(v) => `${v}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={450} stroke={HEX_COLORS.muted} strokeDasharray="5 5" label={{ value: 'Capacity', fill: HEX_COLORS.muted, fontSize: 10 }} />
                        <Area
                          type="monotone"
                          dataKey="actual"
                          stroke={HEX_COLORS.primary}
                          strokeWidth={2}
                          fill="url(#generationGradient)"
                          name="Actual"
                        />
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          stroke={HEX_COLORS.secondary}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Forecast"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Output Gauge */}
                <Card className="obsidian-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Current Output
                      <Badge variant="outline" className="ml-auto text-xs">Live</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OutputGauge
                      value={realtimeMetrics.currentOutput}
                      max={realtimeMetrics.maxCapacity}
                    />
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="obsidian-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Fleet Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <FleetStatusRow
                      label="Online"
                      value={onlineTurbines}
                      total={turbineData.length}
                      color="emerald"
                    />
                    <FleetStatusRow
                      label="Maintenance"
                      value={maintenanceTurbines}
                      total={turbineData.length}
                      color="amber"
                    />
                    <FleetStatusRow
                      label="Warning"
                      value={warningTurbines}
                      total={turbineData.length}
                      color="red"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Secondary Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Weekly Generation */}
              <Card className="obsidian-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Weekly Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyGeneration}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="generation" fill={HEX_COLORS.primary} radius={[4, 4, 0, 0]} name="Generation (MWh)" />
                        <Bar dataKey="forecast" fill={HEX_COLORS.muted} radius={[4, 4, 0, 0]} name="Forecast (MWh)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Factor Trend */}
              <Card className="obsidian-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Capacity Factor Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={capacityFactorTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} domain={[20, 50]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="actual" stroke={HEX_COLORS.primary} strokeWidth={2} dot={{ fill: HEX_COLORS.primary, r: 3 }} name="Actual %" />
                        <Line type="monotone" dataKey="target" stroke={HEX_COLORS.secondary} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target %" />
                        <Line type="monotone" dataKey="industry" stroke={HEX_COLORS.muted} strokeWidth={1} dot={false} name="Industry Avg %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card className="obsidian-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Active Alerts</CardTitle>
                    <Badge variant="outline">{unacknowledgedAlerts} New</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {windfarmAlerts.slice(0, 4).map((alert) => (
                      <AlertRow key={alert.id} alert={alert} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Generation Tab */}
          <TabsContent value="generation" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Power Curve */}
              <Card className="obsidian-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <LineChartIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Power Curve Analysis</CardTitle>
                      <p className="text-xs text-muted-foreground">Theoretical vs Actual Performance</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={powerCurveData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="windSpeed" stroke="rgba(255,255,255,0.3)" fontSize={11} label={{ value: 'Wind Speed (m/s)', position: 'bottom', fill: 'rgba(255,255,255,0.5)' }} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} label={{ value: 'Power (MW)', angle: -90, position: 'left', fill: 'rgba(255,255,255,0.5)' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="theoretical" stroke={HEX_COLORS.muted} strokeWidth={2} name="Theoretical" dot={false} />
                        <Scatter dataKey="actual" fill={HEX_COLORS.primary} name="Actual" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Generation by Time of Day */}
              <Card className="obsidian-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <Clock className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Generation by Hour</CardTitle>
                      <p className="text-xs text-muted-foreground">Daily pattern analysis</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generationByTimeOfDay}>
                        <defs>
                          <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={HEX_COLORS.secondary} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={HEX_COLORS.secondary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="timeLabel" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="maxGeneration" stroke="transparent" fill={HEX_COLORS.muted} fillOpacity={0.2} name="Max" />
                        <Area type="monotone" dataKey="avgGeneration" stroke={HEX_COLORS.secondary} strokeWidth={2} fill="url(#hourlyGradient)" name="Average (MW)" />
                        <Area type="monotone" dataKey="minGeneration" stroke="transparent" fill={HEX_COLORS.muted} fillOpacity={0.2} name="Min" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benchmark Comparison */}
            <Card className="obsidian-card border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Target className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Portfolio Benchmark</CardTitle>
                    <p className="text-xs text-muted-foreground">Performance comparison with similar assets</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarkData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={11} domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} width={120} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="capacityFactor" fill={HEX_COLORS.primary} name="Capacity Factor %" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="availability" fill={HEX_COLORS.tertiary} name="Availability %" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Wind Forecast */}
              <Card className="obsidian-card lg:col-span-8 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <Wind className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">48-Hour Wind Forecast</CardTitle>
                      <p className="text-xs text-muted-foreground">Wind speed and direction prediction</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={weatherForecast}>
                        <defs>
                          <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={HEX_COLORS.secondary} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={HEX_COLORS.secondary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <YAxis yAxisId="wind" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <YAxis yAxisId="temp" orientation="right" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine yAxisId="wind" y={25} stroke={HEX_COLORS.error} strokeDasharray="5 5" label={{ value: 'Cut-out', fill: HEX_COLORS.error, fontSize: 10 }} />
                        <ReferenceLine yAxisId="wind" y={3} stroke={HEX_COLORS.warning} strokeDasharray="5 5" label={{ value: 'Cut-in', fill: HEX_COLORS.warning, fontSize: 10 }} />
                        <Area yAxisId="wind" type="monotone" dataKey="windSpeed" stroke={HEX_COLORS.secondary} strokeWidth={2} fill="url(#windGradient)" name="Wind (m/s)" />
                        <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke={HEX_COLORS.warning} strokeWidth={2} dot={false} name="Temp (°C)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Current Conditions */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="obsidian-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Current Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <WeatherMetric
                      icon={<Wind className="h-5 w-5" />}
                      label="Wind Speed"
                      value={`${realtimeMetrics.windSpeed} m/s`}
                      subvalue="Optimal range"
                      color="cyan"
                    />
                    <WeatherMetric
                      icon={<Navigation className="h-5 w-5" style={{ transform: `rotate(${realtimeMetrics.windDirection}deg)` }} />}
                      label="Wind Direction"
                      value={`${realtimeMetrics.windDirection}° WSW`}
                      subvalue="Prevailing direction"
                      color="primary"
                    />
                    <WeatherMetric
                      icon={<Thermometer className="h-5 w-5" />}
                      label="Temperature"
                      value={`${realtimeMetrics.temperature}°C`}
                      subvalue="Air density: 1.225 kg/m³"
                      color="amber"
                    />
                    <WeatherMetric
                      icon={<Droplets className="h-5 w-5" />}
                      label="Humidity"
                      value="72%"
                      subvalue="No icing risk"
                      color="blue"
                    />
                  </CardContent>
                </Card>

                {/* Wind Direction Compass */}
                <Card className="obsidian-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Wind Direction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WindCompass direction={realtimeMetrics.windDirection} speed={realtimeMetrics.windSpeed} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Market & Revenue Tab */}
          <TabsContent value="market" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Price Forecast */}
              <Card className="obsidian-card lg:col-span-8 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Power Price Forecast</CardTitle>
                      <p className="text-xs text-muted-foreground">Day-ahead and intraday prices (€/MWh)</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={powerPrices.slice(0, 24)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="dayAhead" fill={HEX_COLORS.success} radius={[4, 4, 0, 0]} name="Day-Ahead (€)" />
                        <Line type="monotone" dataKey="intraday" stroke={HEX_COLORS.secondary} strokeWidth={2} dot={false} name="Intraday (€)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Summary */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="obsidian-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Revenue Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RevenueMetric
                      label="Today"
                      value={`€${(revenueMetrics.today.revenue / 1000000).toFixed(2)}M`}
                      change={revenueMetrics.today.vsYesterday}
                      subvalue={`${revenueMetrics.today.generation.toLocaleString()} MWh`}
                    />
                    <RevenueMetric
                      label="Month to Date"
                      value={`€${(revenueMetrics.mtd.revenue / 1000000).toFixed(1)}M`}
                      change={revenueMetrics.mtd.vsLastMonth}
                      subvalue={`Target: €${(revenueMetrics.mtd.target / 1000000).toFixed(1)}M`}
                    />
                    <RevenueMetric
                      label="Year to Date"
                      value={`€${(revenueMetrics.ytd.revenue / 1000000).toFixed(0)}M`}
                      change={revenueMetrics.ytd.vsLastYear}
                      subvalue={`Target: €${(revenueMetrics.ytd.target / 1000000).toFixed(0)}M`}
                    />
                  </CardContent>
                </Card>

                <Card className="obsidian-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Capture Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CaptureRateGauge value={captureRates.current.captureRate} />
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Capture Price</div>
                        <div className="font-semibold">€{captureRates.current.capturePrice}/MWh</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Market Avg</div>
                        <div className="font-semibold">€{captureRates.current.marketAverage}/MWh</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Capture Rate Trend */}
            <Card className="obsidian-card border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Monthly Capture Rate</CardTitle>
                    <p className="text-xs text-muted-foreground">Price capture performance over time</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={captureRates.monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis yAxisId="rate" stroke="rgba(255,255,255,0.3)" fontSize={11} domain={[80, 100]} />
                      <YAxis yAxisId="price" orientation="right" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar yAxisId="price" dataKey="marketPrice" fill={HEX_COLORS.muted} radius={[4, 4, 0, 0]} name="Market Price (€)" />
                      <Bar yAxisId="price" dataKey="capturedPrice" fill={HEX_COLORS.success} radius={[4, 4, 0, 0]} name="Captured Price (€)" />
                      <Line yAxisId="rate" type="monotone" dataKey="captureRate" stroke={HEX_COLORS.accent} strokeWidth={3} dot={{ fill: HEX_COLORS.accent, r: 4 }} name="Capture Rate (%)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Turbines Tab */}
          <TabsContent value="turbines" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Turbine Grid */}
              <Card className="obsidian-card lg:col-span-8 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Wind className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Turbine Fleet</CardTitle>
                        <p className="text-xs text-muted-foreground">{onlineTurbines} of {turbineData.length} online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">Running</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-muted-foreground">Maintenance</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">Warning</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-10 gap-1.5">
                    {turbineData.map((turbine) => (
                      <TurbineCell key={turbine.id} turbine={turbine} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Turbine Summary */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="obsidian-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg Efficiency</span>
                      <span className="font-semibold success-glow">
                        {(turbineData.filter(t => t.status === 'running').reduce((acc, t) => acc + t.efficiency, 0) / onlineTurbines).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg Availability</span>
                      <span className="font-semibold">
                        {(turbineData.reduce((acc, t) => acc + t.availability, 0) / turbineData.length).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Output</span>
                      <span className="font-semibold text-primary">
                        {turbineData.filter(t => t.status === 'running').reduce((acc, t) => acc + t.output, 0).toFixed(1)} MW
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg Wind Speed</span>
                      <span className="font-semibold text-cyan-400">
                        {(turbineData.filter(t => t.status === 'running').reduce((acc, t) => acc + t.windSpeed, 0) / onlineTurbines).toFixed(1)} m/s
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performers */}
                <Card className="obsidian-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {turbineData
                        .filter(t => t.status === 'running')
                        .sort((a, b) => b.efficiency - a.efficiency)
                        .slice(0, 5)
                        .map((turbine, i) => (
                          <div key={turbine.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/10">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-4">#{i + 1}</span>
                              <span className="font-medium">{turbine.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-muted-foreground">{turbine.output} MW</span>
                              <span className="success-glow font-semibold">{turbine.efficiency}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Generation Units Tab */}
          <TabsContent value="units" className="space-y-6">
            {/* Summary Stats Row */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <UnitSummaryCard
                icon={<Cpu className="h-5 w-5" />}
                label="Total Units"
                value={generationUnits.length.toString()}
                color="text-primary"
              />
              <UnitSummaryCard
                icon={<Activity className="h-5 w-5" />}
                label="Online"
                value={generationUnits.filter(u => u.status === 'online').length.toString()}
                color="text-emerald-400"
              />
              <UnitSummaryCard
                icon={<Zap className="h-5 w-5" />}
                label="Total Output"
                value={`${generationUnits.filter(u => u.status === 'online' || u.status === 'curtailed').reduce((s, u) => s + u.currentOutput, 0).toFixed(0)} MW`}
                color="text-cyan-400"
              />
              <UnitSummaryCard
                icon={<Gauge className="h-5 w-5" />}
                label="Avg Efficiency"
                value={`${(generationUnits.filter(u => u.status === 'online').reduce((s, u) => s + u.efficiency, 0) / generationUnits.filter(u => u.status === 'online').length).toFixed(1)}%`}
                color="text-purple-400"
              />
              <UnitSummaryCard
                icon={<AlertTriangle className="h-5 w-5" />}
                label="Alerts"
                value={generationUnits.reduce((s, u) => s + u.activeAlerts, 0).toString()}
                color="text-amber-400"
              />
              <UnitSummaryCard
                icon={<RotateCw className="h-5 w-5" />}
                label="In Maintenance"
                value={generationUnits.filter(u => u.status === 'maintenance').length.toString()}
                color="text-orange-400"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              {/* Status Distribution Pie Chart */}
              <Card className="obsidian-card lg:col-span-4 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Unit Status Distribution</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={unitStatusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="count"
                          label={({ payload }) => `${payload.status}: ${payload.count}`}
                          labelLine={false}
                        >
                          {unitStatusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {unitStatusDistribution.map((item) => (
                      <div key={item.status} className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.status}</span>
                        <span className="font-semibold ml-auto">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Production Comparison Bar Chart */}
              <Card className="obsidian-card lg:col-span-8 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <BarChart3 className="h-5 w-5 text-cyan-400" />
                    </div>
                    <CardTitle className="text-lg">Top 15 Units - Monthly Production vs Target</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={unitProductionComparison} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} tickFormatter={(v) => `${v} MWh`} />
                        <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={11} width={60} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                          }}
                          formatter={(value, name) => [
                            `${Number(value).toFixed(1)} MWh`,
                            name === 'actual' ? 'Actual' : 'Target',
                          ]}
                        />
                        <Bar dataKey="target" fill="rgba(100, 116, 139, 0.3)" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="actual" fill={HEX_COLORS.primary} radius={[0, 4, 4, 0]} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cluster Performance Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {clusterPerformanceData.map((cluster) => (
                <ClusterCard key={cluster.id} cluster={cluster} />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              {/* Efficiency vs Wind Speed Scatter */}
              <Card className="obsidian-card lg:col-span-6 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Target className="h-5 w-5 text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Efficiency vs Wind Speed</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                          type="number"
                          dataKey="windSpeed"
                          name="Wind Speed"
                          unit=" m/s"
                          stroke="rgba(255,255,255,0.5)"
                          fontSize={11}
                          domain={[8, 18]}
                        />
                        <YAxis
                          type="number"
                          dataKey="efficiency"
                          name="Efficiency"
                          unit="%"
                          stroke="rgba(255,255,255,0.5)"
                          fontSize={11}
                          domain={[85, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                          }}
                          formatter={(value, name) => [
                            name === 'efficiency' ? `${Number(value).toFixed(1)}%` : `${Number(value).toFixed(1)} m/s`,
                            name === 'efficiency' ? 'Efficiency' : 'Wind Speed',
                          ]}
                          labelFormatter={(_, payload) => payload[0]?.payload?.name || ''}
                        />
                        <Scatter
                          name="Units"
                          data={unitEfficiencyScatter}
                          fill={HEX_COLORS.accent}
                        >
                          {unitEfficiencyScatter.map((entry, index) => (
                            <Cell
                              key={`scatter-${index}`}
                              fill={
                                entry.model === 'V164-9.5'
                                  ? HEX_COLORS.primary
                                  : entry.model === 'SG-8.0'
                                    ? HEX_COLORS.secondary
                                    : HEX_COLORS.accent
                              }
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: HEX_COLORS.primary }} />
                      <span className="text-muted-foreground">Vestas V164</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: HEX_COLORS.secondary }} />
                      <span className="text-muted-foreground">SG 8.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: HEX_COLORS.accent }} />
                      <span className="text-muted-foreground">Haliade-X</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Model Performance Comparison */}
              <Card className="obsidian-card lg:col-span-6 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Factory className="h-5 w-5 text-emerald-400" />
                    </div>
                    <CardTitle className="text-lg">Model Performance Comparison</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={modelPerformanceComparison} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                        <YAxis type="category" dataKey="modelId" stroke="rgba(255,255,255,0.5)" fontSize={11} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="avgEfficiency" name="Avg Efficiency %" fill={HEX_COLORS.success} radius={[0, 4, 4, 0]} />
                        <Bar dataKey="avgAvailability" name="Avg Availability %" fill={HEX_COLORS.primary} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
                    {modelPerformanceComparison.map((model) => (
                      <div key={model.modelId} className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">{model.modelId}</div>
                        <div className="text-lg font-semibold text-primary">{model.totalOutput.toFixed(0)} MW</div>
                        <div className="text-xs text-muted-foreground">{model.onlineCount}/{model.unitCount} online</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hourly Production Timeline */}
            <Card className="obsidian-card border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <LineChartIcon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <CardTitle className="text-lg">24-Hour Production Timeline (Top 5 Units)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={unitHourlyProduction}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickFormatter={(v) => `${v} MW`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [`${Number(value).toFixed(1)} MW`]}
                      />
                      <Line type="monotone" dataKey="unit1" name="WTG-01" stroke={HEX_COLORS.primary} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="unit2" name="WTG-02" stroke={HEX_COLORS.secondary} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="unit3" name="WTG-03" stroke={HEX_COLORS.success} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="unit4" name="WTG-04" stroke={HEX_COLORS.accent} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="unit5" name="WTG-05" stroke={HEX_COLORS.warning} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-12">
              {/* Unit Rankings */}
              <Card className="obsidian-card lg:col-span-4 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Award className="h-5 w-5 text-amber-400" />
                    </div>
                    <CardTitle className="text-lg">Top Performers - Efficiency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {unitRankings.byEfficiency.slice(0, 8).map((unit) => (
                      <UnitRankRow key={unit.id} unit={unit} metric="efficiency" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="obsidian-card lg:col-span-4 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <Zap className="h-5 w-5 text-cyan-400" />
                    </div>
                    <CardTitle className="text-lg">Top Performers - Output</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {unitRankings.byOutput.slice(0, 8).map((unit) => (
                      <UnitRankRow key={unit.id} unit={unit} metric="output" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="obsidian-card lg:col-span-4 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <CardTitle className="text-lg">Underperforming Units</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {unitRankings.underperforming.length > 0 ? (
                      unitRankings.underperforming.map((unit) => (
                        <UnitRankRow key={unit.id} unit={unit} metric="deviation" />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>All units performing within tolerance</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generation Unit Grid */}
            <Card className="obsidian-card border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Generation Unit Fleet</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Click on a unit to view details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">Online</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Curtailed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">Maintenance</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">Warning</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-500" />
                      <span className="text-muted-foreground">Offline</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-25 gap-1">
                  {generationUnits.map((unit) => (
                    <GenerationUnitCell key={unit.id} unit={unit} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environment Tab */}
          <TabsContent value="environment" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* CO2 Avoided */}
              <Card className="obsidian-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Leaf className="h-5 w-5 text-emerald-400" />
                    </div>
                    <CardTitle className="text-lg">CO₂ Avoided</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold success-glow mb-2">
                      {environmentalMetrics.co2Avoided.today.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">tonnes today</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                    <div className="text-center">
                      <div className="text-xl font-semibold">{(environmentalMetrics.co2Avoided.mtd / 1000).toFixed(1)}k</div>
                      <div className="text-xs text-muted-foreground">tonnes MTD</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">{(environmentalMetrics.co2Avoided.ytd / 1000).toFixed(0)}k</div>
                      <div className="text-xs text-muted-foreground">tonnes YTD</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Homes Powered */}
              <Card className="obsidian-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <Home className="h-5 w-5 text-cyan-400" />
                    </div>
                    <CardTitle className="text-lg">Homes Powered</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-cyan-400 mb-2">
                      {(environmentalMetrics.homesPowered.current / 1000).toFixed(0)}k
                    </div>
                    <div className="text-muted-foreground">households right now</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Annual Average</span>
                      <span className="font-semibold">{(environmentalMetrics.homesPowered.annual / 1000).toFixed(0)}k homes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Environmental */}
              <Card className="obsidian-card border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Factory className="h-5 w-5 text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Resources Saved</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Water Saved</span>
                      <span className="font-semibold">{(environmentalMetrics.waterSaved / 1000000).toFixed(0)}M liters</span>
                    </div>
                    <div className="text-xs text-muted-foreground">vs thermal generation</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Fossil Fuel Avoided</span>
                      <span className="font-semibold">{(environmentalMetrics.fossilFuelAvoided / 1000).toFixed(0)}k tonnes</span>
                    </div>
                    <div className="text-xs text-muted-foreground">coal equivalent</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ============ Helper Components ============

function StatusIndicator({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={color}>{icon}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  )
}

type KPIData = {
  value: string
  trend: 'up' | 'down'
  change: string
  target: string
  unit: string
}

function KPICard({ kpi, index }: { kpi: KPIData; index: number }) {
  return (
    <div className="obsidian-card stat-card rounded-2xl p-4 group" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.unit}</span>
        <span className={`flex items-center text-xs font-semibold ${kpi.trend === 'up' ? 'success-glow' : 'error-glow'}`}>
          {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {kpi.change}
        </span>
      </div>
      <div className="stat-value text-2xl font-bold">{kpi.value}</div>
      <div className="text-xs text-muted-foreground mt-1">Target: {kpi.target}</div>
    </div>
  )
}

function TimeRangeSelector({ value, onChange }: { value: string; onChange: (v: '24h' | '7d' | '30d' | '1y') => void }) {
  const options = ['24h', '7d', '30d', '1y'] as const
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/20">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${value === opt ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="glass-panel rounded-lg p-3 border border-border/50">
      <div className="text-xs text-muted-foreground mb-2">{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function OutputGauge({ value, max }: { value: number; max: number }) {
  const percentage = (value / max) * 100
  const data = [{ name: 'Output', value: percentage, fill: HEX_COLORS.primary }]

  return (
    <div className="relative h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" startAngle={180} endAngle={0} data={data}>
          <RadialBar background={{ fill: 'rgba(255,255,255,0.1)' }} dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold gradient-text">{value.toFixed(1)}</div>
        <div className="text-sm text-muted-foreground">MW</div>
        <div className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% of {max} MW</div>
      </div>
    </div>
  )
}

function CaptureRateGauge({ value }: { value: number }) {
  const data = [{ name: 'Rate', value, fill: value >= 95 ? HEX_COLORS.success : value >= 90 ? HEX_COLORS.warning : HEX_COLORS.error }]

  return (
    <div className="relative h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="100%" innerRadius="80%" outerRadius="100%" startAngle={180} endAngle={0} data={data}>
          <RadialBar background={{ fill: 'rgba(255,255,255,0.1)' }} dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <div className="text-3xl font-bold">{value.toFixed(1)}%</div>
      </div>
    </div>
  )
}

function FleetStatusRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = (value / total) * 100
  const colorClasses = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function AlertRow({ alert }: { alert: typeof windfarmAlerts[0] }) {
  const severityIcons = {
    critical: <AlertTriangle className="h-4 w-4 text-red-400" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    info: <Info className="h-4 w-4 text-blue-400" />,
  }

  return (
    <div className="data-row flex items-start gap-3 p-2 rounded-lg bg-muted/10">
      <div className="mt-0.5">{severityIcons[alert.severity]}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{alert.title}</div>
        <div className="text-xs text-muted-foreground truncate">{alert.message}</div>
      </div>
      {!alert.acknowledged && (
        <Badge variant="outline" className="shrink-0 text-[10px]">New</Badge>
      )}
    </div>
  )
}

function WeatherMetric({ icon, label, value, subvalue, color }: { icon: React.ReactNode; label: string; value: string; subvalue: string; color: string }) {
  const colorClasses: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-500/10',
    primary: 'text-primary bg-primary/10',
    amber: 'text-amber-400 bg-amber-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
      <div className="text-xs text-muted-foreground">{subvalue}</div>
    </div>
  )
}

function WindCompass({ direction, speed }: { direction: number; speed: number }) {
  return (
    <div className="relative w-full aspect-square max-w-[180px] mx-auto">
      {/* Compass background */}
      <div className="absolute inset-0 rounded-full border-2 border-border/50 bg-muted/10" />

      {/* Direction labels */}
      {['N', 'E', 'S', 'W'].map((dir, i) => (
        <div
          key={dir}
          className="absolute text-xs text-muted-foreground font-medium"
          style={{
            top: i === 0 ? '5%' : i === 2 ? '85%' : '45%',
            left: i === 1 ? '85%' : i === 3 ? '5%' : '47%',
          }}
        >
          {dir}
        </div>
      ))}

      {/* Arrow */}
      <div
        className="absolute inset-[20%] flex items-center justify-center"
        style={{ transform: `rotate(${direction}deg)` }}
      >
        <div className="w-1 h-full bg-gradient-to-b from-cyan-400 to-transparent rounded-full" />
      </div>

      {/* Center info */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-background/80 rounded-full p-3">
          <div className="text-lg font-bold text-cyan-400">{speed}</div>
          <div className="text-[10px] text-muted-foreground">m/s</div>
        </div>
      </div>
    </div>
  )
}

function RevenueMetric({ label, value, change, subvalue }: { label: string; value: string; change: number; subvalue: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`flex items-center text-xs font-semibold ${change >= 0 ? 'success-glow' : 'error-glow'}`}>
          {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(change)}%
        </span>
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{subvalue}</div>
    </div>
  )
}

function TurbineCell({ turbine }: { turbine: typeof turbineData[0] }) {
  const statusColors = {
    running: 'bg-emerald-500/20 border-emerald-500/40 hover:border-emerald-500',
    maintenance: 'bg-amber-500/20 border-amber-500/40 hover:border-amber-500',
    warning: 'bg-red-500/20 border-red-500/40 hover:border-red-500 animate-pulse',
  }

  return (
    <div
      className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all cursor-pointer hover:scale-110 ${statusColors[turbine.status]}`}
      title={`${turbine.name}\nOutput: ${turbine.output} MW\nEfficiency: ${turbine.efficiency}%\nWind: ${turbine.windSpeed} m/s`}
    >
      <Wind className={`h-3 w-3 ${turbine.status === 'running' ? 'text-emerald-400' : turbine.status === 'maintenance' ? 'text-amber-400' : 'text-red-400'}`} />
      <span className="text-[8px] mt-0.5 text-muted-foreground">{turbine.name.replace('WTG-', '')}</span>
    </div>
  )
}

// ============ Generation Unit Helper Components ============

function UnitSummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="obsidian-card stat-card rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-muted/20 ${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={`text-xl font-bold ${color}`}>{value}</div>
        </div>
      </div>
    </div>
  )
}

function ClusterCard({ cluster }: { cluster: typeof clusterPerformanceData[0] }) {
  const statusColors = {
    optimal: 'border-emerald-500/40 bg-emerald-500/5',
    degraded: 'border-amber-500/40 bg-amber-500/5',
    critical: 'border-red-500/40 bg-red-500/5',
  }

  return (
    <Card className={`obsidian-card border ${statusColors[cluster.status]}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-semibold">{cluster.name}</span>
          </div>
          <Badge
            variant="outline"
            className={
              cluster.status === 'optimal'
                ? 'border-emerald-500/50 text-emerald-400'
                : cluster.status === 'degraded'
                  ? 'border-amber-500/50 text-amber-400'
                  : 'border-red-500/50 text-red-400'
            }
          >
            {cluster.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Units Online</div>
            <div className="font-semibold">{cluster.onlineUnits}/{cluster.units}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Output</div>
            <div className="font-semibold text-primary">{cluster.currentOutput.toFixed(0)} MW</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Efficiency</div>
            <div className="font-semibold success-glow">{cluster.avgEfficiency.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Availability</div>
            <div className="font-semibold">{cluster.availability.toFixed(1)}%</div>
          </div>
        </div>
        {cluster.alerts > 0 && (
          <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2 text-amber-400 text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span>{cluster.alerts} active alert{cluster.alerts > 1 ? 's' : ''}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type UnitWithRank = typeof generationUnits[0] & { rank: number }

function UnitRankRow({ unit, metric }: { unit: UnitWithRank; metric: 'efficiency' | 'output' | 'deviation' }) {
  const getValue = () => {
    switch (metric) {
      case 'efficiency':
        return `${unit.efficiency.toFixed(1)}%`
      case 'output':
        return `${unit.currentOutput.toFixed(1)} MW`
      case 'deviation':
        return `${unit.powerCurveDeviation.toFixed(1)}%`
    }
  }

  const getColor = () => {
    switch (metric) {
      case 'efficiency':
        return 'success-glow'
      case 'output':
        return 'text-cyan-400'
      case 'deviation':
        return 'error-glow'
    }
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-5">#{unit.rank}</span>
        <div>
          <span className="font-medium text-sm">{unit.displayName}</span>
          <span className="text-xs text-muted-foreground ml-2">{unit.cluster}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">{unit.modelId}</span>
        <span className={`font-semibold text-sm ${getColor()}`}>{getValue()}</span>
      </div>
    </div>
  )
}

function GenerationUnitCell({ unit }: { unit: typeof generationUnits[0] }) {
  const statusColors = {
    online: 'bg-emerald-500/20 border-emerald-500/40 hover:border-emerald-500',
    curtailed: 'bg-blue-500/20 border-blue-500/40 hover:border-blue-500',
    maintenance: 'bg-amber-500/20 border-amber-500/40 hover:border-amber-500',
    warning: 'bg-red-500/20 border-red-500/40 hover:border-red-500 animate-pulse',
    offline: 'bg-gray-500/20 border-gray-500/40 hover:border-gray-500',
  }

  const statusTextColors = {
    online: 'text-emerald-400',
    curtailed: 'text-blue-400',
    maintenance: 'text-amber-400',
    warning: 'text-red-400',
    offline: 'text-gray-400',
  }

  return (
    <div
      className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all cursor-pointer hover:scale-110 ${statusColors[unit.status]}`}
      title={`${unit.displayName} (${unit.model})
Status: ${unit.status}
Output: ${unit.currentOutput} MW
Efficiency: ${unit.efficiency}%
Wind: ${unit.windSpeed} m/s
Cluster: ${unit.cluster}`}
    >
      <Cpu className={`h-3 w-3 ${statusTextColors[unit.status]}`} />
      <span className="text-[7px] mt-0.5 text-muted-foreground">{unit.displayName.replace('WTG-', '')}</span>
    </div>
  )
}
