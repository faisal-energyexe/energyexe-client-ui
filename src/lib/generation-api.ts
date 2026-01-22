import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// SINGLE WINDFARM GENERATION DATA (using comparison API endpoints)
// ============================================================================

export interface SingleWindfarmGenerationPoint {
  period: string
  total_generation: number
  avg_generation: number
  max_generation: number
  min_generation: number
  avg_capacity_factor: number | null
  data_points: number
}

export interface SingleWindfarmGenerationResponse {
  data: SingleWindfarmGenerationPoint[]
  summary: {
    total_generation: number
    avg_capacity_factor: number
    total_records: number
    date_range: {
      start: string
      end: string
    }
  }
}

export interface SingleWindfarmStats {
  windfarm_id: number
  windfarm_name: string
  capacity_mw: number | null
  total_generation: number
  peak_generation: number
  min_generation: number
  avg_generation: number
  stddev_generation: number
  avg_capacity_factor: number
  max_capacity_factor: number
  min_capacity_factor: number
  data_points: number
  period_days: number
  availability_percent: number
  data_completeness: number
}

/**
 * Fetch generation time series data for a single windfarm using the comparison API
 */
export async function getSingleWindfarmGeneration(
  windfarmId: number,
  startDate: string,
  endDate: string,
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<SingleWindfarmGenerationResponse> {
  const params = new URLSearchParams()
  params.append('windfarm_ids', windfarmId.toString())
  params.append('start_date', startDate)
  params.append('end_date', endDate)
  params.append('granularity', granularity)

  const url = `/comparison/compare?${params.toString()}`
  console.log('[Generation API] Fetching:', url)

  const response = await apiClient.get<SingleWindfarmGenerationResponse>(url)
  console.log('[Generation API] Response:', response?.data?.length, 'data points')
  return response
}

/**
 * Fetch statistics for a single windfarm using the comparison API
 */
export async function getSingleWindfarmStats(
  windfarmId: number,
  periodDays: number = 30
): Promise<SingleWindfarmStats | null> {
  const params = new URLSearchParams()
  params.append('windfarm_ids', windfarmId.toString())
  params.append('period_days', periodDays.toString())

  const url = `/comparison/statistics?${params.toString()}`
  console.log('[Stats API] Fetching:', url)

  const response = await apiClient.get<SingleWindfarmStats[]>(url)
  console.log('[Stats API] Response:', response?.length, 'items')
  return response.length > 0 ? response[0] : null
}

/**
 * Hook to fetch single windfarm generation time series
 */
export function useSingleWindfarmGeneration(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
) {
  return useQuery({
    queryKey: ['single-windfarm-generation', windfarmId, startDate, endDate, granularity],
    queryFn: () => getSingleWindfarmGeneration(windfarmId!, startDate!, endDate!, granularity),
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch single windfarm statistics
 */
export function useSingleWindfarmStats(windfarmId: number | null, periodDays: number = 30) {
  return useQuery({
    queryKey: ['single-windfarm-stats', windfarmId, periodDays],
    queryFn: () => getSingleWindfarmStats(windfarmId!, periodDays),
    enabled: !!windfarmId,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================================================
// LEGACY TYPES (for backward compatibility)
// ============================================================================

// Types for generation data
export interface GenerationHourlyData {
  hour: string
  generation_mwh: number
  generation_unit_id: number | null
  windfarm_id: number | null
  source: string
  quality_score: number | null
  quality_flag: 'measured' | 'aggregated' | 'interpolated' | null
  is_manual_override: boolean
}

export interface GenerationHourlyParams {
  windfarmId: number
  startDate: string
  endDate: string
  source?: string
  minQualityScore?: number
}

export interface GenerationAggregatedParams {
  windfarmId: number
  startDate: string
  endDate: string
  groupBy: 'hourly' | 'daily' | 'monthly'
}

export interface GenerationAggregatedData {
  period: string
  total_generation_mwh: number
  avg_generation_mwh: number
  max_generation_mwh: number
  min_generation_mwh: number
  record_count: number
  avg_quality: number
}

export interface GenerationStatsParams {
  windfarmId: number
  startDate: string
  endDate: string
}

export interface GenerationStats {
  total_generation_mwh: number
  avg_hourly_generation_mwh: number
  max_hourly_generation_mwh: number
  peak_hour: string | null
  capacity_factor_percent: number | null
  operating_hours: number
  total_hours: number
  avg_quality_score: number
}

export interface GenerationAvailabilityParams {
  windfarmId: number
  year: number
  month: number
  sources?: string[]
}

export interface GenerationAvailabilityDay {
  date: string
  sources: string[]
  recordCount: number
  quality: number
}

export interface GenerationAvailability {
  availability: Record<string, GenerationAvailabilityDay>
  summary: {
    totalDays: number
    daysWithData: number
    coverage: number
    sources: string[]
  }
}

export interface QualityStatsParams {
  windfarmId?: number
  startDate: string
  endDate: string
  groupBy?: 'hour' | 'day' | 'month'
}

export interface QualityStats {
  stats: Array<{
    period: string
    avgQuality: number
    minQuality: number
    maxQuality: number
    completeness: number
    recordCount: number
    manualOverrides: number
  }>
  summary: {
    overallAvgQuality: number
    totalRecords: number
    totalManualOverrides: number
  }
}

const GENERATION_QUERY_KEY = ['generation']

// Get hourly generation data for a windfarm
export function useGenerationHourly(params: GenerationHourlyParams | null) {
  return useQuery({
    queryKey: [...GENERATION_QUERY_KEY, 'hourly', params],
    queryFn: async () => {
      if (!params) throw new Error('Missing parameters')

      const searchParams = new URLSearchParams()
      searchParams.append('windfarm_id', params.windfarmId.toString())
      searchParams.append('start_date', params.startDate)
      searchParams.append('end_date', params.endDate)
      if (params.source) searchParams.append('source', params.source)
      if (params.minQualityScore !== undefined) {
        searchParams.append('min_quality_score', params.minQualityScore.toString())
      }

      const response = await apiClient.get<GenerationHourlyData[]>(
        `/generation/hourly?${searchParams.toString()}`
      )
      return response
    },
    enabled: !!params,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get aggregated generation data (daily/monthly)
export function useGenerationAggregated(params: GenerationAggregatedParams | null) {
  return useQuery({
    queryKey: [...GENERATION_QUERY_KEY, 'aggregated', params],
    queryFn: async () => {
      if (!params) throw new Error('Missing parameters')

      const searchParams = new URLSearchParams()
      searchParams.append('windfarm_id', params.windfarmId.toString())
      searchParams.append('start_date', params.startDate)
      searchParams.append('end_date', params.endDate)
      searchParams.append('group_by', params.groupBy)

      const response = await apiClient.get<GenerationAggregatedData[]>(
        `/generation/aggregated?${searchParams.toString()}`
      )
      return response
    },
    enabled: !!params,
    staleTime: 5 * 60 * 1000,
  })
}

// Get generation statistics for a windfarm
export function useGenerationStats(params: GenerationStatsParams | null) {
  return useQuery({
    queryKey: [...GENERATION_QUERY_KEY, 'stats', params?.windfarmId, params?.startDate, params?.endDate],
    queryFn: async () => {
      if (!params) throw new Error('Missing parameters')

      const searchParams = new URLSearchParams()
      searchParams.append('windfarm_id', params.windfarmId.toString())
      searchParams.append('start_date', params.startDate)
      searchParams.append('end_date', params.endDate)

      const response = await apiClient.get<GenerationStats>(
        `/generation/windfarm-stats?${searchParams.toString()}`
      )
      return response
    },
    enabled: !!params,
    staleTime: 5 * 60 * 1000,
  })
}

// Get data availability calendar
export function useGenerationAvailability(params: GenerationAvailabilityParams | null) {
  return useQuery({
    queryKey: [...GENERATION_QUERY_KEY, 'availability', params],
    queryFn: async () => {
      if (!params) throw new Error('Missing parameters')

      const searchParams = new URLSearchParams()
      searchParams.append('windfarm_id', params.windfarmId.toString())
      searchParams.append('year', params.year.toString())
      searchParams.append('month', params.month.toString())
      if (params.sources?.length) {
        searchParams.append('sources', params.sources.join(','))
      }

      const response = await apiClient.get<GenerationAvailability>(
        `/generation/availability?${searchParams.toString()}`
      )
      return response
    },
    enabled: !!params,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get quality statistics
export function useQualityStats(params: QualityStatsParams | null) {
  return useQuery({
    queryKey: [...GENERATION_QUERY_KEY, 'quality-stats', params],
    queryFn: async () => {
      if (!params) throw new Error('Missing parameters')

      const searchParams = new URLSearchParams()
      if (params.windfarmId) searchParams.append('windfarm_id', params.windfarmId.toString())
      searchParams.append('start_date', params.startDate)
      searchParams.append('end_date', params.endDate)
      if (params.groupBy) searchParams.append('group_by', params.groupBy)

      const response = await apiClient.get<QualityStats>(
        `/generation/quality-stats?${searchParams.toString()}`
      )
      return response
    },
    enabled: !!params,
    staleTime: 5 * 60 * 1000,
  })
}

// Utility function to calculate date ranges
export function getDateRangePreset(preset: string): { startDate: string; endDate: string } {
  const now = new Date()
  const endDate = now.toISOString().split('T')[0]
  let startDate: string

  switch (preset) {
    case '7D':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case '30D':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case '90D':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'YTD':
      startDate = `${now.getFullYear()}-01-01`
      break
    case '1Y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'ALL':
      startDate = '2010-01-01'
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }

  return { startDate, endDate }
}

// Utility function to format generation values
export function formatGeneration(mwh: number): string {
  if (mwh >= 1000000) {
    return `${(mwh / 1000000).toFixed(2)} TWh`
  } else if (mwh >= 1000) {
    return `${(mwh / 1000).toFixed(2)} GWh`
  } else {
    return `${mwh.toFixed(2)} MWh`
  }
}

// Utility function to format capacity factor (input is decimal, e.g., 0.45 = 45%)
export function formatCapacityFactor(decimal: number | null): string {
  if (decimal === null) return 'N/A'
  return `${(decimal * 100).toFixed(1)}%`
}
