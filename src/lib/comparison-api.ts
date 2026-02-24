import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WindfarmForComparison {
  id: number
  name: string
  capacity_mw: number | null
  has_data: boolean
}

export interface ComparisonDataPoint {
  period: string
  windfarm_id: number
  windfarm_name: string
  total_generation: number
  avg_generation: number
  max_generation: number
  min_generation: number
  avg_capacity_factor: number | null
  avg_raw_capacity_factor: number | null
  avg_raw_capacity: number | null
  avg_capacity: number | null
  data_points: number
  ramp_up_points: number
}

export interface ComparisonSummary {
  total_generation: number
  avg_capacity_factor: number
  windfarm_count: number
  total_records: number
  date_range: {
    start: string
    end: string
  }
}

export interface ComparisonResponse {
  data: ComparisonDataPoint[]
  summary: ComparisonSummary
}

export interface WindfarmStatistics {
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
  avg_raw_capacity_factor: number
  max_raw_capacity_factor: number
  min_raw_capacity_factor: number
  avg_raw_capacity: number
  data_points: number
  period_days: number
  availability_percent: number
  data_completeness: number
}

// ============================================================================
// QUERY KEYS
// ============================================================================

export const COMPARISON_QUERY_KEY = ['comparison'] as const

// ============================================================================
// API FUNCTIONS
// ============================================================================

export async function getWindfarmsForComparison(): Promise<WindfarmForComparison[]> {
  const response = await apiClient.get<WindfarmForComparison[]>('/comparison/windfarms')
  return response
}

export async function getComparisonData(
  windfarmIds: number[],
  startDate: string,
  endDate: string,
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' = 'daily',
  excludeRampUp: boolean = true
): Promise<ComparisonResponse> {
  const params = new URLSearchParams()
  windfarmIds.forEach((id) => params.append('windfarm_ids', id.toString()))
  params.append('start_date', startDate)
  params.append('end_date', endDate)
  params.append('granularity', granularity)
  params.append('exclude_ramp_up', excludeRampUp.toString())

  const response = await apiClient.get<ComparisonResponse>(`/comparison/compare?${params.toString()}`)
  return response
}

export async function getComparisonStatistics(
  windfarmIds: number[],
  periodDays: number = 30,
  excludeRampUp: boolean = true
): Promise<WindfarmStatistics[]> {
  const params = new URLSearchParams()
  windfarmIds.forEach((id) => params.append('windfarm_ids', id.toString()))
  params.append('period_days', periodDays.toString())
  params.append('exclude_ramp_up', excludeRampUp.toString())

  const response = await apiClient.get<WindfarmStatistics[]>(`/comparison/statistics?${params.toString()}`)
  return response
}

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useWindfarmsForComparison() {
  return useQuery<WindfarmForComparison[]>({
    queryKey: [...COMPARISON_QUERY_KEY, 'windfarms'],
    queryFn: getWindfarmsForComparison,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useComparisonData(
  windfarmIds: number[],
  startDate: string | null,
  endDate: string | null,
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' = 'daily',
  excludeRampUp: boolean = true
) {
  return useQuery<ComparisonResponse>({
    queryKey: [...COMPARISON_QUERY_KEY, 'compare', windfarmIds, startDate, endDate, granularity, excludeRampUp],
    queryFn: () => getComparisonData(windfarmIds, startDate!, endDate!, granularity, excludeRampUp),
    enabled: windfarmIds.length >= 2 && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

export function useComparisonStatistics(windfarmIds: number[], periodDays: number = 30, excludeRampUp: boolean = true) {
  return useQuery<WindfarmStatistics[]>({
    queryKey: [...COMPARISON_QUERY_KEY, 'statistics', windfarmIds, periodDays, excludeRampUp],
    queryFn: () => getComparisonStatistics(windfarmIds, periodDays, excludeRampUp),
    enabled: windfarmIds.length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatGeneration(value: number | null | undefined): string {
  if (value == null || value === 0) return '0 MWh'
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)} GWh`
  if (value >= 1000) return `${(value / 1000).toFixed(2)} MWh`
  return `${value.toFixed(2)} MWh`
}

export function formatCapacityFactor(value: number | null | undefined): string {
  if (value == null) return 'N/A'
  return `${(value * 100).toFixed(1)}%`
}

export function formatCapacityMW(value: number | null | undefined): string {
  if (value == null) return 'N/A'
  return `${value.toFixed(1)} MW`
}

// Color palette for charts
export const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#10b981', // emerald
] as const

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length]
}
