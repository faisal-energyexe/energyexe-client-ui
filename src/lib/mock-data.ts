// Mock data for the demo dashboard

// KPI Card data
export const kpiData = [
  {
    id: 'total-capacity',
    title: 'Total Capacity',
    value: '2.4 GW',
    change: '+5.2%',
    trend: 'up' as const,
    description: 'Combined wind farm capacity',
  },
  {
    id: 'active-turbines',
    title: 'Active Turbines',
    value: '847',
    change: '+12',
    trend: 'up' as const,
    description: 'Currently operational units',
  },
  {
    id: 'energy-output',
    title: 'Energy Output',
    value: '1.2 TWh',
    change: '+8.3%',
    trend: 'up' as const,
    description: 'Year-to-date generation',
  },
  {
    id: 'avg-efficiency',
    title: 'Avg Efficiency',
    value: '94.2%',
    change: '+1.4%',
    trend: 'up' as const,
    description: 'Operational efficiency',
  },
  {
    id: 'co2-offset',
    title: 'CO2 Offset',
    value: '450K tons',
    change: '+6.8%',
    trend: 'up' as const,
    description: 'Carbon emissions avoided',
  },
  {
    id: 'revenue',
    title: 'Revenue',
    value: '$2.1M',
    change: '+4.1%',
    trend: 'up' as const,
    description: 'Monthly revenue',
  },
]

// Generation chart data (30 days)
export const generateChartData = () => {
  const data = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Simulate wind patterns with some variability
    const baseGeneration = 85 + Math.sin(i * 0.3) * 15
    const windFactor = 0.7 + Math.random() * 0.6
    const generation = Math.round(baseGeneration * windFactor * 10) / 10

    data.push({
      date: date.toISOString().split('T')[0],
      generation: generation,
      capacity: 100,
      forecast: Math.round((baseGeneration + (Math.random() - 0.5) * 10) * 10) / 10,
    })
  }

  return data
}

export const generationChartData = generateChartData()

// Windfarm locations for map
export const windfarmLocations = [
  {
    id: 1,
    name: 'North Sea Wind Park',
    lat: 55.5,
    lng: 3.5,
    capacity: '620 MW',
    turbines: 124,
    status: 'operational',
  },
  {
    id: 2,
    name: 'Baltic Breeze',
    lat: 54.8,
    lng: 12.2,
    capacity: '480 MW',
    turbines: 96,
    status: 'operational',
  },
  {
    id: 3,
    name: 'Atlantic Gateway',
    lat: 51.2,
    lng: -9.8,
    capacity: '540 MW',
    turbines: 108,
    status: 'operational',
  },
  {
    id: 4,
    name: 'Nordic Horizon',
    lat: 58.3,
    lng: 6.1,
    capacity: '420 MW',
    turbines: 84,
    status: 'maintenance',
  },
  {
    id: 5,
    name: 'Celtic Wind',
    lat: 53.1,
    lng: -5.5,
    capacity: '380 MW',
    turbines: 76,
    status: 'operational',
  },
]

// Alerts data
export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface Alert {
  id: number
  title: string
  message: string
  severity: AlertSeverity
  timestamp: string
  location: string
  acknowledged: boolean
}

export const alertsData: Alert[] = [
  {
    id: 1,
    title: 'High Wind Speed Alert',
    message: 'Wind speeds exceeding 25 m/s detected. Turbine cutout initiated.',
    severity: 'critical',
    timestamp: '2 min ago',
    location: 'North Sea Wind Park',
    acknowledged: false,
  },
  {
    id: 2,
    title: 'Scheduled Maintenance',
    message: 'Turbine T-47 entering maintenance window.',
    severity: 'info',
    timestamp: '15 min ago',
    location: 'Nordic Horizon',
    acknowledged: true,
  },
  {
    id: 3,
    title: 'Gearbox Temperature Warning',
    message: 'Elevated gearbox temperature detected in Turbine T-23.',
    severity: 'warning',
    timestamp: '28 min ago',
    location: 'Baltic Breeze',
    acknowledged: false,
  },
  {
    id: 4,
    title: 'Grid Connection Issue',
    message: 'Intermittent grid connection detected.',
    severity: 'warning',
    timestamp: '45 min ago',
    location: 'Atlantic Gateway',
    acknowledged: true,
  },
  {
    id: 5,
    title: 'Blade Pitch Adjustment',
    message: 'Automatic blade pitch adjustment completed.',
    severity: 'info',
    timestamp: '1 hour ago',
    location: 'Celtic Wind',
    acknowledged: true,
  },
  {
    id: 6,
    title: 'Performance Optimization',
    message: 'AI-driven optimization improved efficiency by 2.3%.',
    severity: 'info',
    timestamp: '2 hours ago',
    location: 'All Sites',
    acknowledged: true,
  },
  {
    id: 7,
    title: 'Ice Detection',
    message: 'Ice formation detected on blade surfaces.',
    severity: 'warning',
    timestamp: '3 hours ago',
    location: 'Nordic Horizon',
    acknowledged: false,
  },
  {
    id: 8,
    title: 'Power Output Record',
    message: 'New daily generation record achieved: 18.4 GWh.',
    severity: 'info',
    timestamp: '5 hours ago',
    location: 'All Sites',
    acknowledged: true,
  },
  {
    id: 9,
    title: 'Vibration Anomaly',
    message: 'Unusual vibration pattern in nacelle detected.',
    severity: 'warning',
    timestamp: '6 hours ago',
    location: 'North Sea Wind Park',
    acknowledged: true,
  },
  {
    id: 10,
    title: 'Firmware Update Complete',
    message: 'SCADA system firmware updated successfully.',
    severity: 'info',
    timestamp: '8 hours ago',
    location: 'All Sites',
    acknowledged: true,
  },
]

// Quick stats data
export const quickStatsData = [
  { label: 'Availability', value: '98.7%', color: 'chart-1' },
  { label: 'Capacity Factor', value: '42.3%', color: 'chart-2' },
  { label: 'Wind Speed', value: '12.4 m/s', color: 'chart-3' },
  { label: 'Grid Frequency', value: '50.02 Hz', color: 'chart-4' },
]

// Sidebar navigation items
export const sidebarNavItems = [
  { title: 'Dashboard', icon: 'LayoutDashboard', href: '/demo' },
  { title: 'Wind Farms', icon: 'Wind', href: '#' },
  { title: 'Turbines', icon: 'Fan', href: '#' },
  { title: 'Analytics', icon: 'BarChart3', href: '#' },
  { title: 'Alerts', icon: 'Bell', href: '#' },
  { title: 'Reports', icon: 'FileText', href: '#' },
  { title: 'Settings', icon: 'Settings', href: '#' },
]

// Time filter options for chart
export const timeFilterOptions = [
  { label: '7D', value: '7d' },
  { label: '14D', value: '14d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
]
