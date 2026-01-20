// Mock data for showcase components

// Turbine data for tables
export const turbineTableData = [
  { id: 'T-001', name: 'Alpha', site: 'North Sea Wind', capacity: '3.6 MW', status: 'running', efficiency: 94.2, lastMaintenance: '2024-11-15' },
  { id: 'T-002', name: 'Beta', site: 'North Sea Wind', capacity: '3.6 MW', status: 'running', efficiency: 91.8, lastMaintenance: '2024-10-22' },
  { id: 'T-003', name: 'Gamma', site: 'Baltic Offshore', capacity: '4.2 MW', status: 'maintenance', efficiency: 0, lastMaintenance: '2025-01-10' },
  { id: 'T-004', name: 'Delta', site: 'Baltic Offshore', capacity: '4.2 MW', status: 'running', efficiency: 89.5, lastMaintenance: '2024-09-08' },
  { id: 'T-005', name: 'Epsilon', site: 'Celtic Sea Park', capacity: '5.0 MW', status: 'running', efficiency: 96.1, lastMaintenance: '2024-12-01' },
  { id: 'T-006', name: 'Zeta', site: 'Celtic Sea Park', capacity: '5.0 MW', status: 'idle', efficiency: 0, lastMaintenance: '2024-08-20' },
  { id: 'T-007', name: 'Eta', site: 'Danish Strait', capacity: '3.6 MW', status: 'running', efficiency: 92.7, lastMaintenance: '2024-11-30' },
  { id: 'T-008', name: 'Theta', site: 'Danish Strait', capacity: '3.6 MW', status: 'running', efficiency: 93.4, lastMaintenance: '2024-10-15' },
  { id: 'T-009', name: 'Iota', site: 'North Sea Wind', capacity: '4.2 MW', status: 'warning', efficiency: 78.2, lastMaintenance: '2024-07-05' },
  { id: 'T-010', name: 'Kappa', site: 'Scottish Waters', capacity: '5.0 MW', status: 'running', efficiency: 95.0, lastMaintenance: '2024-12-18' },
  { id: 'T-011', name: 'Lambda', site: 'Scottish Waters', capacity: '5.0 MW', status: 'running', efficiency: 94.8, lastMaintenance: '2024-11-05' },
  { id: 'T-012', name: 'Mu', site: 'Norwegian Coast', capacity: '6.0 MW', status: 'running', efficiency: 97.3, lastMaintenance: '2024-12-22' },
  { id: 'T-013', name: 'Nu', site: 'Norwegian Coast', capacity: '6.0 MW', status: 'maintenance', efficiency: 0, lastMaintenance: '2025-01-08' },
  { id: 'T-014', name: 'Xi', site: 'Celtic Sea Park', capacity: '4.2 MW', status: 'running', efficiency: 90.1, lastMaintenance: '2024-09-28' },
  { id: 'T-015', name: 'Omicron', site: 'Baltic Offshore', capacity: '3.6 MW', status: 'running', efficiency: 88.9, lastMaintenance: '2024-10-10' },
]

export type TurbineStatus = 'running' | 'maintenance' | 'idle' | 'warning'

export interface TurbineData {
  id: string
  name: string
  site: string
  capacity: string
  status: TurbineStatus
  efficiency: number
  lastMaintenance: string
}

// Energy breakdown for pie/donut charts
export const energyBreakdown = [
  { name: 'Wind', value: 65, fill: 'var(--chart-1)' },
  { name: 'Solar', value: 20, fill: 'var(--chart-2)' },
  { name: 'Hydro', value: 10, fill: 'var(--chart-3)' },
  { name: 'Other', value: 5, fill: 'var(--chart-4)' },
]

// Monthly generation data for bar/line charts
export const monthlyGeneration = [
  { month: 'Jan', actual: 1200, forecast: 1150, target: 1100 },
  { month: 'Feb', actual: 1350, forecast: 1300, target: 1200 },
  { month: 'Mar', actual: 1480, forecast: 1400, target: 1350 },
  { month: 'Apr', actual: 1520, forecast: 1500, target: 1400 },
  { month: 'May', actual: 1650, forecast: 1600, target: 1550 },
  { month: 'Jun', actual: 1420, forecast: 1450, target: 1400 },
  { month: 'Jul', actual: 1280, forecast: 1300, target: 1250 },
  { month: 'Aug', actual: 1350, forecast: 1380, target: 1300 },
  { month: 'Sep', actual: 1480, forecast: 1450, target: 1400 },
  { month: 'Oct', actual: 1620, forecast: 1580, target: 1550 },
  { month: 'Nov', actual: 1750, forecast: 1700, target: 1650 },
  { month: 'Dec', actual: 1890, forecast: 1800, target: 1750 },
]

// Hourly generation for line charts
export const hourlyGeneration = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  output: Math.floor(Math.random() * 800 + 200),
  demand: Math.floor(Math.random() * 700 + 300),
}))

// Efficiency gauge data
export const efficiencyGauges = [
  { name: 'System Efficiency', value: 87, max: 100 },
  { name: 'Grid Availability', value: 99.2, max: 100 },
  { name: 'Capacity Factor', value: 42, max: 100 },
  { name: 'Turbine Uptime', value: 95.8, max: 100 },
]

// Form select options
export const countryOptions = [
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'dk', label: 'Denmark' },
  { value: 'no', label: 'Norway' },
  { value: 'se', label: 'Sweden' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'be', label: 'Belgium' },
  { value: 'fr', label: 'France' },
  { value: 'ie', label: 'Ireland' },
  { value: 'es', label: 'Spain' },
]

export const turbineTypes = [
  { value: 'onshore', label: 'Onshore Wind' },
  { value: 'offshore', label: 'Offshore Wind' },
  { value: 'floating', label: 'Floating Offshore' },
]

export const regionOptions = [
  { value: 'north-sea', label: 'North Sea' },
  { value: 'baltic', label: 'Baltic Sea' },
  { value: 'celtic', label: 'Celtic Sea' },
  { value: 'atlantic', label: 'Atlantic Coast' },
  { value: 'mediterranean', label: 'Mediterranean' },
]

export const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'running', label: 'Running' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'idle', label: 'Idle' },
  { value: 'warning', label: 'Warning' },
]

export const capacityOptions = [
  { value: 'all', label: 'All Capacities' },
  { value: '0-3', label: '0 - 3 MW' },
  { value: '3-5', label: '3 - 5 MW' },
  { value: '5-8', label: '5 - 8 MW' },
  { value: '8+', label: '8+ MW' },
]

// Priority options for forms
export const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

// Site performance data for composed chart
export const sitePerformance = [
  { site: 'North Sea', generation: 4500, efficiency: 92, turbines: 25 },
  { site: 'Baltic', generation: 3200, efficiency: 88, turbines: 18 },
  { site: 'Celtic Sea', generation: 2800, efficiency: 91, turbines: 15 },
  { site: 'Danish Strait', generation: 2100, efficiency: 85, turbines: 12 },
  { site: 'Scottish Waters', generation: 3800, efficiency: 94, turbines: 20 },
  { site: 'Norwegian Coast', generation: 4200, efficiency: 96, turbines: 22 },
]

// Weekly trend data
export const weeklyTrend = [
  { day: 'Mon', generation: 2450, revenue: 18500 },
  { day: 'Tue', generation: 2680, revenue: 20100 },
  { day: 'Wed', generation: 2520, revenue: 18900 },
  { day: 'Thu', generation: 2890, revenue: 21700 },
  { day: 'Fri', generation: 2750, revenue: 20600 },
  { day: 'Sat', generation: 2320, revenue: 17400 },
  { day: 'Sun', generation: 2180, revenue: 16350 },
]

// Alert/notification samples
export const sampleAlerts = [
  { id: 1, type: 'success', title: 'Turbine Online', message: 'T-006 Zeta has resumed operation after maintenance.' },
  { id: 2, type: 'warning', title: 'Low Wind Speed', message: 'North Sea Wind farm experiencing below-average wind conditions.' },
  { id: 3, type: 'error', title: 'Connection Lost', message: 'Lost connection to monitoring system at Baltic Offshore.' },
  { id: 4, type: 'info', title: 'Scheduled Maintenance', message: 'T-013 Nu scheduled for routine inspection tomorrow.' },
]

// Navigation breadcrumb examples
export const breadcrumbExamples = [
  [
    { label: 'Dashboard', href: '/demo' },
    { label: 'Wind Farms', href: '/demo/windfarms' },
    { label: 'North Sea Wind' },
  ],
  [
    { label: 'Dashboard', href: '/demo' },
    { label: 'Analytics', href: '/demo/analytics' },
    { label: 'Generation Report' },
  ],
]
