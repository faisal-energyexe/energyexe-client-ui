import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'

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

// Utility function to format capacity factor
export function formatCapacityFactor(percent: number | null): string {
  if (percent === null) return 'N/A'
  return `${percent.toFixed(1)}%`
}
