import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WindStatistics {
  meanSpeed: number
  medianSpeed: number
  modeSpeed: number
  p10Speed: number
  p50Speed: number
  p90Speed: number
  maxSpeed: number
  minSpeed: number
  stdDev: number
  variance: number
  meanTemperature: number
  maxTemperature: number
  minTemperature: number
  prevailingDirection: number
  prevailingDirectionName: string
  capacityFactorEstimate: number
  totalHours: number
  calmHours: number
  calmPercentage: number
}

export interface WindRoseData {
  directionBins: number[]
  speedBins: Array<{ min: number; max: number; label: string }>
  frequency: number[][]
  totalHours: number
  calmPercentage: number
}

export interface WindSpeedDistribution {
  speedBins: number[]
  frequency: number[]
  frequencyPercentage: number[]
  weibullK: number
  weibullC: number
  weibullFit: number[]
  meanSpeed: number
  medianSpeed: number
  modeSpeed: number
  stdDev: number
}

export interface DiurnalPattern {
  hours: number[]
  avgWindSpeed: number[]
  minWindSpeed: number[]
  maxWindSpeed: number[]
  medianWindSpeed: number[]
  stdDev: number[]
}

export interface SeasonalPattern {
  months: string[]
  monthNumbers: number[]
  avgWindSpeed: number[]
  minWindSpeed: number[]
  maxWindSpeed: number[]
  avgTemperature: number[]
}

export interface WindSpeedDurationCurve {
  hours: number[]
  windSpeed: number[]
  cumulativePercentage: number[]
}

export interface CorrelationData {
  windSpeedBins: number[]
  avgGenerationMw: number[]
  minGenerationMw: number[]
  maxGenerationMw: number[]
  stdDevGeneration: number[]
  recordCount: number[]
  correlationCoefficient: number
  rSquared: number
}

export interface PowerCurveData {
  windSpeed: number[]
  generationMw: number[]
  sampleCount: number[]
  stdDev: number[]
  cutInSpeed: number | null
  ratedSpeed: number | null
  cutOutSpeed: number | null
  ratedPower: number | null
  correlationCoefficient: number
  rSquared: number
}

export interface CapacityFactorData {
  windSpeedBins: string[]
  windSpeedCenters: number[]
  capacityFactors: number[]
  frequencies: number[]
  generationContributions: number[]
  overallCapacityFactor: number
}

export interface EnergyRoseData {
  directionBins: number[]
  generationByDirection: number[]
  percentageByDirection: number[]
  frequencyByDirection: number[]
}

export interface TemperatureImpactData {
  referenceWindSpeed: number
  temperatureBins: number[]
  avgGeneration: number[]
  sampleCount: number[]
  impactPercentage: number
}

export interface HeatmapData {
  hours: number[]
  months: string[]
  values: number[][]
  metric: string
  unit: string
}

// ============================================================================
// QUERY KEY
// ============================================================================

export const WEATHER_QUERY_KEY = ['weather-data']

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Weather Statistics
export function useWeatherStatistics(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<WindStatistics>({
    queryKey: [...WEATHER_QUERY_KEY, 'statistics', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<WindStatistics>(
        `/weather-data/windfarms/${windfarmId}/statistics?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Wind Rose
export function useWindRose(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<WindRoseData>({
    queryKey: [...WEATHER_QUERY_KEY, 'wind-rose', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<WindRoseData>(
        `/weather-data/windfarms/${windfarmId}/wind-rose?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Wind Speed Distribution
export function useWindSpeedDistribution(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<WindSpeedDistribution>({
    queryKey: [...WEATHER_QUERY_KEY, 'distribution', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<WindSpeedDistribution>(
        `/weather-data/windfarms/${windfarmId}/distribution?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Diurnal Pattern
export function useDiurnalPattern(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<DiurnalPattern>({
    queryKey: [...WEATHER_QUERY_KEY, 'diurnal-pattern', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<DiurnalPattern>(
        `/weather-data/windfarms/${windfarmId}/diurnal-pattern?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Seasonal Pattern
export function useSeasonalPattern(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<SeasonalPattern>({
    queryKey: [...WEATHER_QUERY_KEY, 'seasonal-pattern', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<SeasonalPattern>(
        `/weather-data/windfarms/${windfarmId}/seasonal-pattern?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Duration Curve
export function useWindSpeedDurationCurve(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<WindSpeedDurationCurve>({
    queryKey: [...WEATHER_QUERY_KEY, 'duration-curve', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<WindSpeedDurationCurve>(
        `/weather-data/windfarms/${windfarmId}/duration-curve?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Correlation
export function useWeatherGenerationCorrelation(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<CorrelationData>({
    queryKey: [...WEATHER_QUERY_KEY, 'correlation', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<CorrelationData>(
        `/weather-data/windfarms/${windfarmId}/correlation?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Power Curve
export function usePowerCurve(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<PowerCurveData>({
    queryKey: [...WEATHER_QUERY_KEY, 'power-curve', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<PowerCurveData>(
        `/weather-data/windfarms/${windfarmId}/power-curve?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Capacity Factor by Wind
export function useCapacityFactorByWind(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<CapacityFactorData>({
    queryKey: [...WEATHER_QUERY_KEY, 'capacity-factor-by-wind', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<CapacityFactorData>(
        `/weather-data/windfarms/${windfarmId}/capacity-factor-by-wind?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Energy Rose
export function useEnergyRose(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<EnergyRoseData>({
    queryKey: [...WEATHER_QUERY_KEY, 'energy-rose', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<EnergyRoseData>(
        `/weather-data/windfarms/${windfarmId}/energy-rose?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Temperature Impact
export function useTemperatureImpact(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
  referenceWindSpeed: number = 10,
) {
  return useQuery<TemperatureImpactData>({
    queryKey: [...WEATHER_QUERY_KEY, 'temperature-impact', windfarmId, startDate, endDate, referenceWindSpeed],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        reference_wind_speed: referenceWindSpeed.toString(),
      })

      return await apiClient.get<TemperatureImpactData>(
        `/weather-data/windfarms/${windfarmId}/temperature-impact?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Weather Heatmap
export function useWeatherHeatmap(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
  metric: 'wind_speed' | 'temperature' | 'generation' = 'wind_speed',
) {
  return useQuery<HeatmapData>({
    queryKey: [...WEATHER_QUERY_KEY, 'heatmap', windfarmId, startDate, endDate, metric],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        metric,
      })

      return await apiClient.get<HeatmapData>(
        `/weather-data/windfarms/${windfarmId}/heatmap?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatWindSpeed(speed: number): string {
  return `${speed.toFixed(1)} m/s`
}

export function formatTemperature(temp: number): string {
  return `${temp.toFixed(1)}°C`
}

export function getDirectionName(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function getWindSpeedCategory(speed: number): {
  label: string
  color: string
} {
  if (speed < 3) return { label: 'Calm', color: 'text-blue-400' }
  if (speed < 6) return { label: 'Light', color: 'text-cyan-400' }
  if (speed < 10) return { label: 'Moderate', color: 'text-emerald-400' }
  if (speed < 15) return { label: 'Fresh', color: 'text-yellow-400' }
  if (speed < 20) return { label: 'Strong', color: 'text-orange-400' }
  return { label: 'Very Strong', color: 'text-red-400' }
}
