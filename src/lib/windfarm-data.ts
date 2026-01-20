/**
 * Comprehensive mock data for Windfarm Details Page
 * Contains all metrics for a world-class energy monitoring dashboard
 */

// Windfarm Overview
export const windfarmInfo = {
  id: 'WF-001',
  name: 'North Sea Alpha',
  location: 'North Sea, 45km offshore',
  coordinates: { lat: 55.9533, lng: 3.1883 },
  capacity: 450, // MW
  turbineCount: 75,
  turbineModel: 'Vestas V164-9.5 MW',
  commissionDate: '2021-06-15',
  operator: 'EnergyExe Operations',
  status: 'operational' as const,
}

// Real-time generation metrics
export const realtimeMetrics = {
  currentOutput: 387.5, // MW
  maxCapacity: 450, // MW
  capacityFactor: 86.1, // %
  availability: 98.7, // %
  windSpeed: 12.4, // m/s
  windDirection: 285, // degrees
  temperature: 8.2, // °C
  airDensity: 1.225, // kg/m³
  turbinesOnline: 73,
  turbinesTotal: 75,
}

// Generation time series (24 hours, 15-min intervals)
export const generationTimeSeries = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4)
  const minute = (i % 4) * 15
  const baseGeneration = 320 + Math.sin(i / 10) * 80 + Math.random() * 40
  const forecast = 310 + Math.sin(i / 10) * 75 + Math.random() * 20
  return {
    time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    timestamp: new Date(Date.now() - (95 - i) * 15 * 60 * 1000).toISOString(),
    actual: Math.round(baseGeneration * 10) / 10,
    forecast: Math.round(forecast * 10) / 10,
    capacity: 450,
  }
})

// Weekly generation data
export const weeklyGeneration = [
  { day: 'Mon', generation: 9850, forecast: 9500, revenue: 485000 },
  { day: 'Tue', generation: 10200, forecast: 10100, revenue: 512000 },
  { day: 'Wed', generation: 8900, forecast: 9200, revenue: 423000 },
  { day: 'Thu', generation: 10800, forecast: 10500, revenue: 567000 },
  { day: 'Fri', generation: 9600, forecast: 9800, revenue: 478000 },
  { day: 'Sat', generation: 10100, forecast: 9900, revenue: 498000 },
  { day: 'Sun', generation: 9200, forecast: 9400, revenue: 445000 },
]

// Monthly capacity factor trend
export const capacityFactorTrend = [
  { month: 'Jan', actual: 42.5, target: 40, industry: 38 },
  { month: 'Feb', actual: 45.2, target: 42, industry: 40 },
  { month: 'Mar', actual: 38.8, target: 38, industry: 36 },
  { month: 'Apr', actual: 35.1, target: 35, industry: 33 },
  { month: 'May', actual: 32.4, target: 32, industry: 30 },
  { month: 'Jun', actual: 28.9, target: 30, industry: 28 },
  { month: 'Jul', actual: 26.5, target: 28, industry: 26 },
  { month: 'Aug', actual: 29.2, target: 29, industry: 27 },
  { month: 'Sep', actual: 34.8, target: 33, industry: 31 },
  { month: 'Oct', actual: 41.2, target: 38, industry: 36 },
  { month: 'Nov', actual: 44.6, target: 42, industry: 40 },
  { month: 'Dec', actual: 46.8, target: 44, industry: 42 },
]

// Wind speed distribution (for wind rose)
export const windRoseData = [
  { direction: 'N', speed_0_5: 2, speed_5_10: 5, speed_10_15: 8, speed_15_20: 4, speed_20_plus: 1 },
  { direction: 'NNE', speed_0_5: 1, speed_5_10: 3, speed_10_15: 5, speed_15_20: 2, speed_20_plus: 0 },
  { direction: 'NE', speed_0_5: 2, speed_5_10: 4, speed_10_15: 6, speed_15_20: 3, speed_20_plus: 1 },
  { direction: 'ENE', speed_0_5: 1, speed_5_10: 3, speed_10_15: 4, speed_15_20: 2, speed_20_plus: 0 },
  { direction: 'E', speed_0_5: 2, speed_5_10: 5, speed_10_15: 7, speed_15_20: 3, speed_20_plus: 1 },
  { direction: 'ESE', speed_0_5: 1, speed_5_10: 4, speed_10_15: 5, speed_15_20: 2, speed_20_plus: 0 },
  { direction: 'SE', speed_0_5: 2, speed_5_10: 6, speed_10_15: 8, speed_15_20: 4, speed_20_plus: 1 },
  { direction: 'SSE', speed_0_5: 3, speed_5_10: 7, speed_10_15: 10, speed_15_20: 5, speed_20_plus: 2 },
  { direction: 'S', speed_0_5: 4, speed_5_10: 9, speed_10_15: 12, speed_15_20: 6, speed_20_plus: 2 },
  { direction: 'SSW', speed_0_5: 5, speed_5_10: 11, speed_10_15: 15, speed_15_20: 8, speed_20_plus: 3 },
  { direction: 'SW', speed_0_5: 6, speed_5_10: 14, speed_10_15: 18, speed_15_20: 10, speed_20_plus: 4 },
  { direction: 'WSW', speed_0_5: 5, speed_5_10: 12, speed_10_15: 16, speed_15_20: 9, speed_20_plus: 3 },
  { direction: 'W', speed_0_5: 4, speed_5_10: 10, speed_10_15: 14, speed_15_20: 7, speed_20_plus: 2 },
  { direction: 'WNW', speed_0_5: 3, speed_5_10: 8, speed_10_15: 11, speed_15_20: 5, speed_20_plus: 2 },
  { direction: 'NW', speed_0_5: 2, speed_5_10: 6, speed_10_15: 9, speed_15_20: 4, speed_20_plus: 1 },
  { direction: 'NNW', speed_0_5: 2, speed_5_10: 4, speed_10_15: 7, speed_15_20: 3, speed_20_plus: 1 },
]

// Weather forecast (48 hours)
export const weatherForecast = Array.from({ length: 48 }, (_, i) => {
  const date = new Date(Date.now() + i * 60 * 60 * 1000)
  const windBase = 10 + Math.sin(i / 8) * 5 + Math.random() * 3
  return {
    hour: i,
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    windSpeed: Math.round(windBase * 10) / 10,
    windDirection: Math.round(270 + Math.sin(i / 12) * 30 + Math.random() * 20),
    temperature: Math.round((8 + Math.sin(i / 12) * 4 + Math.random() * 2) * 10) / 10,
    humidity: Math.round(70 + Math.sin(i / 6) * 15 + Math.random() * 10),
    precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 5 * 10) / 10 : 0,
    cloudCover: Math.round(40 + Math.sin(i / 10) * 30 + Math.random() * 20),
    condition: Math.random() > 0.6 ? 'cloudy' : Math.random() > 0.3 ? 'partly-cloudy' : 'clear',
  }
})

// Power prices (24 hours ahead)
export const powerPrices = Array.from({ length: 48 }, (_, i) => {
  const hour = i % 24
  // Simulate typical price pattern with peak at morning and evening
  const basePrice = 45 +
    (hour >= 7 && hour <= 9 ? 25 : 0) +
    (hour >= 17 && hour <= 20 ? 35 : 0) +
    (hour >= 0 && hour <= 5 ? -15 : 0) +
    Math.random() * 15
  return {
    hour: i,
    time: `${(hour).toString().padStart(2, '0')}:00`,
    dayAhead: Math.round(basePrice * 100) / 100,
    intraday: Math.round((basePrice + (Math.random() - 0.5) * 10) * 100) / 100,
    imbalance: Math.round((basePrice + (Math.random() - 0.5) * 20) * 100) / 100,
  }
})

// Capture rate metrics
export const captureRates = {
  current: {
    captureRate: 94.2, // %
    capturePrice: 52.80, // €/MWh
    marketAverage: 56.10, // €/MWh
    volumeWeightedPrice: 54.30, // €/MWh
  },
  monthly: [
    { month: 'Jan', captureRate: 95.2, marketPrice: 58.5, capturedPrice: 55.7 },
    { month: 'Feb', captureRate: 93.8, marketPrice: 62.3, capturedPrice: 58.4 },
    { month: 'Mar', captureRate: 91.5, marketPrice: 55.2, capturedPrice: 50.5 },
    { month: 'Apr', captureRate: 89.2, marketPrice: 48.7, capturedPrice: 43.4 },
    { month: 'May', captureRate: 87.5, marketPrice: 42.3, capturedPrice: 37.0 },
    { month: 'Jun', captureRate: 85.8, marketPrice: 38.9, capturedPrice: 33.4 },
    { month: 'Jul', captureRate: 84.2, marketPrice: 35.6, capturedPrice: 30.0 },
    { month: 'Aug', captureRate: 86.5, marketPrice: 39.2, capturedPrice: 33.9 },
    { month: 'Sep', captureRate: 90.1, marketPrice: 45.8, capturedPrice: 41.3 },
    { month: 'Oct', captureRate: 93.4, marketPrice: 52.4, capturedPrice: 48.9 },
    { month: 'Nov', captureRate: 95.8, marketPrice: 59.7, capturedPrice: 57.2 },
    { month: 'Dec', captureRate: 96.5, marketPrice: 65.3, capturedPrice: 63.0 },
  ],
}

// Turbine-level data
export const turbineData = Array.from({ length: 75 }, (_, i) => {
  const statuses = ['running', 'running', 'running', 'running', 'running', 'running', 'running', 'running', 'maintenance', 'warning'] as const
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  return {
    id: `T-${(i + 1).toString().padStart(3, '0')}`,
    name: `WTG-${i + 1}`,
    status,
    output: status === 'running' ? Math.round((4.5 + Math.random() * 5) * 10) / 10 : 0, // MW
    windSpeed: status === 'running' ? Math.round((10 + Math.random() * 5) * 10) / 10 : 0,
    rotorSpeed: status === 'running' ? Math.round((8 + Math.random() * 4) * 10) / 10 : 0, // rpm
    efficiency: status === 'running' ? Math.round((85 + Math.random() * 12) * 10) / 10 : 0, // %
    availability: Math.round((95 + Math.random() * 5) * 10) / 10, // %
    powerCurveDeviation: Math.round((Math.random() - 0.5) * 10 * 10) / 10, // %
    lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextMaintenance: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalGeneration: Math.round((15000 + Math.random() * 10000) * 10) / 10, // MWh
    operatingHours: Math.round(8000 + Math.random() * 2000),
  }
})

// Power curve data (theoretical vs actual)
export const powerCurveData = Array.from({ length: 26 }, (_, i) => {
  const windSpeed = i
  const cutIn = 3 // m/s
  const ratedSpeed = 12 // m/s
  const cutOut = 25 // m/s
  const ratedPower = 9.5 // MW

  let theoretical = 0
  if (windSpeed >= cutIn && windSpeed < ratedSpeed) {
    theoretical = ratedPower * Math.pow((windSpeed - cutIn) / (ratedSpeed - cutIn), 3)
  } else if (windSpeed >= ratedSpeed && windSpeed <= cutOut) {
    theoretical = ratedPower
  }

  const actual = theoretical > 0 ? theoretical * (0.92 + Math.random() * 0.1) : 0

  return {
    windSpeed,
    theoretical: Math.round(theoretical * 100) / 100,
    actual: Math.round(actual * 100) / 100,
    samples: windSpeed >= cutIn && windSpeed <= cutOut ? Math.round(100 + Math.random() * 500) : 0,
  }
})

// Revenue metrics
export const revenueMetrics = {
  today: {
    revenue: 1245000, // €
    generation: 8750, // MWh
    avgPrice: 54.20, // €/MWh
    vsYesterday: 5.2, // %
  },
  mtd: {
    revenue: 18500000, // €
    generation: 125000, // MWh
    avgPrice: 52.80, // €/MWh
    vsLastMonth: 8.5, // %
    target: 17000000, // €
  },
  ytd: {
    revenue: 185000000, // €
    generation: 1250000, // MWh
    avgPrice: 51.20, // €/MWh
    vsLastYear: 12.3, // %
    target: 175000000, // €
  },
}

// Hourly revenue heatmap (7 days x 24 hours)
export const revenueHeatmap = Array.from({ length: 7 }, (_, dayIndex) => {
  return Array.from({ length: 24 }, (_, hourIndex) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const baseRevenue = 40000 +
      (hourIndex >= 7 && hourIndex <= 9 ? 20000 : 0) +
      (hourIndex >= 17 && hourIndex <= 20 ? 25000 : 0) +
      (hourIndex >= 0 && hourIndex <= 5 ? -15000 : 0)
    return {
      day: dayNames[dayIndex],
      hour: hourIndex,
      revenue: Math.round(baseRevenue + Math.random() * 15000),
      generation: Math.round(300 + Math.random() * 150),
    }
  })
}).flat()

// Environmental impact
export const environmentalMetrics = {
  co2Avoided: {
    today: 4375, // tonnes
    mtd: 62500, // tonnes
    ytd: 625000, // tonnes
  },
  homesPowered: {
    current: 285000, // homes
    annual: 312000, // homes (average)
  },
  waterSaved: 125000000, // liters (vs thermal)
  fossilFuelAvoided: 156000, // tonnes (coal equivalent)
}

// Alerts and events
export const windfarmAlerts = [
  {
    id: 'ALT-001',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    severity: 'warning' as const,
    type: 'performance',
    title: 'Power Curve Deviation',
    message: 'WTG-23 showing -8.5% deviation from expected power curve',
    turbine: 'WTG-23',
    acknowledged: false,
  },
  {
    id: 'ALT-002',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: 'info' as const,
    type: 'maintenance',
    title: 'Scheduled Maintenance',
    message: 'WTG-45 scheduled for blade inspection in 2 days',
    turbine: 'WTG-45',
    acknowledged: true,
  },
  {
    id: 'ALT-003',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'critical' as const,
    type: 'grid',
    title: 'Grid Curtailment',
    message: 'Grid operator requested 15% curtailment due to congestion',
    turbine: null,
    acknowledged: false,
  },
  {
    id: 'ALT-004',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    severity: 'info' as const,
    type: 'weather',
    title: 'High Wind Warning',
    message: 'Wind speeds expected to exceed 20 m/s in next 6 hours',
    turbine: null,
    acknowledged: true,
  },
  {
    id: 'ALT-005',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    severity: 'warning' as const,
    type: 'equipment',
    title: 'Gearbox Temperature',
    message: 'WTG-12 gearbox temperature elevated, monitoring active',
    turbine: 'WTG-12',
    acknowledged: false,
  },
]

// Curtailment events
export const curtailmentEvents = [
  { date: '2024-01-15', duration: 4.5, energy: 1350, reason: 'Grid congestion', compensation: 67500 },
  { date: '2024-01-12', duration: 2.0, energy: 580, reason: 'Negative prices', compensation: 0 },
  { date: '2024-01-08', duration: 6.0, energy: 1890, reason: 'Grid congestion', compensation: 94500 },
  { date: '2024-01-03', duration: 1.5, energy: 420, reason: 'Frequency regulation', compensation: 21000 },
]

// Key Performance Indicators
export const kpis = {
  generation: {
    value: '387.5 MW',
    trend: 'up' as const,
    change: '+5.2%',
    target: '400 MW',
    unit: 'Current Output',
  },
  capacityFactor: {
    value: '86.1%',
    trend: 'up' as const,
    change: '+2.8%',
    target: '85%',
    unit: 'Capacity Factor',
  },
  availability: {
    value: '98.7%',
    trend: 'up' as const,
    change: '+0.3%',
    target: '97%',
    unit: 'Availability',
  },
  revenue: {
    value: '€1.24M',
    trend: 'up' as const,
    change: '+8.5%',
    target: '€1.15M',
    unit: "Today's Revenue",
  },
  captureRate: {
    value: '94.2%',
    trend: 'down' as const,
    change: '-1.2%',
    target: '95%',
    unit: 'Capture Rate',
  },
  co2Avoided: {
    value: '4,375 t',
    trend: 'up' as const,
    change: '+5.0%',
    target: '4,200 t',
    unit: 'CO₂ Avoided Today',
  },
}

// Comparison with other windfarms
export const benchmarkData = [
  { name: 'North Sea Alpha', capacityFactor: 42.5, availability: 98.7, captureRate: 94.2, isOwn: true },
  { name: 'Baltic Wind', capacityFactor: 38.2, availability: 97.5, captureRate: 92.1, isOwn: false },
  { name: 'Celtic Array', capacityFactor: 40.1, availability: 96.8, captureRate: 91.5, isOwn: false },
  { name: 'Dogger Bank', capacityFactor: 44.8, availability: 98.2, captureRate: 95.8, isOwn: false },
  { name: 'Hornsea Two', capacityFactor: 41.2, availability: 97.9, captureRate: 93.4, isOwn: false },
]

// Generation by time of day (for pattern analysis)
export const generationByTimeOfDay = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  timeLabel: `${hour.toString().padStart(2, '0')}:00`,
  avgGeneration: Math.round((280 + Math.sin((hour - 6) / 24 * Math.PI * 2) * 80 + Math.random() * 30) * 10) / 10,
  minGeneration: Math.round((200 + Math.sin((hour - 6) / 24 * Math.PI * 2) * 60) * 10) / 10,
  maxGeneration: Math.round((380 + Math.sin((hour - 6) / 24 * Math.PI * 2) * 100) * 10) / 10,
  avgPrice: Math.round((45 + (hour >= 7 && hour <= 9 ? 20 : 0) + (hour >= 17 && hour <= 20 ? 25 : 0) + (hour >= 0 && hour <= 5 ? -12 : 0)) * 100) / 100,
}))

// ============ GENERATION UNITS DATA ============

// Generation Unit Types/Models
export const generationUnitModels = [
  { id: 'V164-9.5', name: 'Vestas V164-9.5 MW', manufacturer: 'Vestas', capacity: 9.5, rotorDiameter: 164, hubHeight: 105, count: 45 },
  { id: 'SG-8.0', name: 'Siemens Gamesa SG 8.0-167 DD', manufacturer: 'Siemens Gamesa', capacity: 8.0, rotorDiameter: 167, hubHeight: 102, count: 20 },
  { id: 'HALIADE-X', name: 'GE Haliade-X 12 MW', manufacturer: 'GE Renewable', capacity: 12.0, rotorDiameter: 220, hubHeight: 138, count: 10 },
]

// Generation Unit Clusters/Groups
export const generationUnitClusters = [
  { id: 'CLUSTER-A', name: 'Cluster Alpha', units: 25, totalCapacity: 237.5, avgEfficiency: 94.2, status: 'optimal' as const },
  { id: 'CLUSTER-B', name: 'Cluster Beta', units: 25, totalCapacity: 200.0, avgEfficiency: 92.8, status: 'optimal' as const },
  { id: 'CLUSTER-C', name: 'Cluster Gamma', units: 15, totalCapacity: 142.5, avgEfficiency: 91.5, status: 'degraded' as const },
  { id: 'CLUSTER-D', name: 'Cluster Delta', units: 10, totalCapacity: 120.0, avgEfficiency: 95.1, status: 'optimal' as const },
]

// Detailed Generation Units with extended metrics
export const generationUnits = Array.from({ length: 75 }, (_, i) => {
  const statuses = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'maintenance', 'curtailed', 'warning', 'offline'] as const
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const modelIndex = i < 45 ? 0 : i < 65 ? 1 : 2
  const model = generationUnitModels[modelIndex]
  const clusterIndex = i < 25 ? 0 : i < 50 ? 1 : i < 65 ? 2 : 3
  const cluster = generationUnitClusters[clusterIndex]

  const baseEfficiency = 88 + Math.random() * 10
  const isOperating = status === 'online' || status === 'curtailed'

  return {
    id: `GU-${(i + 1).toString().padStart(3, '0')}`,
    name: `Unit ${i + 1}`,
    displayName: `WTG-${(i + 1).toString().padStart(2, '0')}`,
    model: model.name,
    modelId: model.id,
    manufacturer: model.manufacturer,
    ratedCapacity: model.capacity,
    rotorDiameter: model.rotorDiameter,
    hubHeight: model.hubHeight,
    cluster: cluster.name,
    clusterId: cluster.id,
    status,
    // Real-time metrics
    currentOutput: isOperating ? Math.round((model.capacity * 0.7 + Math.random() * model.capacity * 0.25) * 10) / 10 : 0,
    capacityFactor: isOperating ? Math.round((75 + Math.random() * 20) * 10) / 10 : 0,
    efficiency: isOperating ? Math.round(baseEfficiency * 10) / 10 : 0,
    availability: Math.round((94 + Math.random() * 5.5) * 10) / 10,
    windSpeed: isOperating ? Math.round((10 + Math.random() * 6) * 10) / 10 : 0,
    rotorSpeed: isOperating ? Math.round((7 + Math.random() * 5) * 10) / 10 : 0,
    pitchAngle: isOperating ? Math.round((2 + Math.random() * 8) * 10) / 10 : 0,
    yawAngle: Math.round(Math.random() * 360),
    nacelleDirection: Math.round(Math.random() * 360),
    // Performance metrics
    powerCurveDeviation: Math.round((Math.random() - 0.5) * 8 * 10) / 10,
    lossesPercent: Math.round((2 + Math.random() * 5) * 10) / 10,
    curtailmentMWh: status === 'curtailed' ? Math.round(Math.random() * 50 * 10) / 10 : 0,
    // Historical metrics
    totalGeneration: Math.round((12000 + Math.random() * 15000) * 10) / 10, // MWh lifetime
    monthlyGeneration: Math.round((800 + Math.random() * 600) * 10) / 10, // MWh this month
    dailyGeneration: Math.round((80 + Math.random() * 100) * 10) / 10, // MWh today
    operatingHours: Math.round(18000 + Math.random() * 8000),
    // Maintenance
    lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextMaintenance: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    maintenanceScore: Math.round((70 + Math.random() * 30) * 10) / 10,
    // Alerts
    activeAlerts: status === 'warning' ? Math.floor(1 + Math.random() * 3) : 0,
    // Coordinates (grid layout)
    gridX: i % 10,
    gridY: Math.floor(i / 10),
    // Financial
    revenueToday: isOperating ? Math.round((3500 + Math.random() * 4000) * 100) / 100 : 0,
    revenueMonth: Math.round((85000 + Math.random() * 60000) * 100) / 100,
  }
})

// Generation unit production comparison (last 7 days per unit - top 10)
export const unitProductionComparison = generationUnits
  .sort((a, b) => b.monthlyGeneration - a.monthlyGeneration)
  .slice(0, 15)
  .map(unit => ({
    name: unit.displayName,
    actual: unit.monthlyGeneration,
    target: Math.round(unit.ratedCapacity * 24 * 30 * 0.42 * 10) / 10, // 42% capacity factor target
    efficiency: unit.efficiency,
    status: unit.status,
  }))

// Generation unit efficiency scatter data
export const unitEfficiencyScatter = generationUnits
  .filter(u => u.status === 'online')
  .map(unit => ({
    name: unit.displayName,
    windSpeed: unit.windSpeed,
    efficiency: unit.efficiency,
    output: unit.currentOutput,
    model: unit.modelId,
    cluster: unit.cluster,
  }))

// Generation unit status distribution
export const unitStatusDistribution = [
  { status: 'Online', count: generationUnits.filter(u => u.status === 'online').length, color: '#22C55E' },
  { status: 'Curtailed', count: generationUnits.filter(u => u.status === 'curtailed').length, color: '#3B82F6' },
  { status: 'Maintenance', count: generationUnits.filter(u => u.status === 'maintenance').length, color: '#F59E0B' },
  { status: 'Warning', count: generationUnits.filter(u => u.status === 'warning').length, color: '#EF4444' },
  { status: 'Offline', count: generationUnits.filter(u => u.status === 'offline').length, color: '#6B7280' },
]

// Generation unit hourly production (24h timeline for selected units)
export const unitHourlyProduction = Array.from({ length: 24 }, (_, hour) => {
  const baseOutput = 6 + Math.sin((hour - 6) / 24 * Math.PI * 2) * 2
  return {
    hour,
    time: `${hour.toString().padStart(2, '0')}:00`,
    unit1: Math.round((baseOutput + Math.random() * 1.5) * 10) / 10,
    unit2: Math.round((baseOutput * 0.95 + Math.random() * 1.2) * 10) / 10,
    unit3: Math.round((baseOutput * 1.05 + Math.random() * 1.8) * 10) / 10,
    unit4: Math.round((baseOutput * 0.9 + Math.random() * 1) * 10) / 10,
    unit5: Math.round((baseOutput * 1.1 + Math.random() * 2) * 10) / 10,
  }
})

// Generation unit ranking by multiple metrics
export const unitRankings = {
  byEfficiency: [...generationUnits]
    .filter(u => u.status === 'online')
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 10)
    .map((u, i) => ({ rank: i + 1, ...u })),
  byOutput: [...generationUnits]
    .filter(u => u.status === 'online')
    .sort((a, b) => b.currentOutput - a.currentOutput)
    .slice(0, 10)
    .map((u, i) => ({ rank: i + 1, ...u })),
  byAvailability: [...generationUnits]
    .sort((a, b) => b.availability - a.availability)
    .slice(0, 10)
    .map((u, i) => ({ rank: i + 1, ...u })),
  byRevenue: [...generationUnits]
    .sort((a, b) => b.revenueMonth - a.revenueMonth)
    .slice(0, 10)
    .map((u, i) => ({ rank: i + 1, ...u })),
  underperforming: [...generationUnits]
    .filter(u => u.status === 'online' && u.powerCurveDeviation < -2)
    .sort((a, b) => a.powerCurveDeviation - b.powerCurveDeviation)
    .slice(0, 5)
    .map((u, i) => ({ rank: i + 1, ...u })),
}

// Model performance comparison
export const modelPerformanceComparison = generationUnitModels.map(model => {
  const modelUnits = generationUnits.filter(u => u.modelId === model.id)
  const onlineUnits = modelUnits.filter(u => u.status === 'online')
  return {
    model: model.name,
    modelId: model.id,
    unitCount: model.count,
    onlineCount: onlineUnits.length,
    avgEfficiency: onlineUnits.length > 0
      ? Math.round(onlineUnits.reduce((sum, u) => sum + u.efficiency, 0) / onlineUnits.length * 10) / 10
      : 0,
    avgOutput: onlineUnits.length > 0
      ? Math.round(onlineUnits.reduce((sum, u) => sum + u.currentOutput, 0) / onlineUnits.length * 10) / 10
      : 0,
    totalOutput: Math.round(onlineUnits.reduce((sum, u) => sum + u.currentOutput, 0) * 10) / 10,
    avgAvailability: Math.round(modelUnits.reduce((sum, u) => sum + u.availability, 0) / modelUnits.length * 10) / 10,
    ratedCapacity: model.capacity,
  }
})

// Cluster performance data
export const clusterPerformanceData = generationUnitClusters.map(cluster => {
  const clusterUnits = generationUnits.filter(u => u.clusterId === cluster.id)
  const onlineUnits = clusterUnits.filter(u => u.status === 'online')
  return {
    ...cluster,
    onlineUnits: onlineUnits.length,
    currentOutput: Math.round(onlineUnits.reduce((sum, u) => sum + u.currentOutput, 0) * 10) / 10,
    avgEfficiency: onlineUnits.length > 0
      ? Math.round(onlineUnits.reduce((sum, u) => sum + u.efficiency, 0) / onlineUnits.length * 10) / 10
      : 0,
    availability: Math.round(clusterUnits.reduce((sum, u) => sum + u.availability, 0) / clusterUnits.length * 10) / 10,
    alerts: clusterUnits.reduce((sum, u) => sum + u.activeAlerts, 0),
  }
})
