import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PortfolioSummary {
  total_windfarms: number
  total_capacity_mw: number
  operational_farms: number
  offshore_farms: number
  onshore_farms: number
  countries: number
}

export interface GenerationSummary {
  total_generation_mwh: number
  avg_capacity_factor: number
  hours_with_data: number
  period_start: string
  period_end: string
}

export interface TopPerformer {
  windfarm_id: number
  windfarm_name: string
  country: string
  capacity_mw: number | null
  capacity_factor: number | null
  generation_mwh: number
}

export interface DataFreshness {
  source: string
  latest_data_date: string | null
  records_count: number
}

export interface PriceSummary {
  bidzone_id: number
  bidzone_code: string | null
  bidzone_name: string | null
  avg_price: number | null
  min_price: number | null
  max_price: number | null
}

// ============================================================================
// QUERY KEYS
// ============================================================================

export const DASHBOARD_QUERY_KEY = ['dashboard']

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Portfolio Summary - uses existing windfarms endpoint
export function usePortfolioSummary() {
  return useQuery<PortfolioSummary>({
    queryKey: [...DASHBOARD_QUERY_KEY, 'portfolio-summary'],
    queryFn: async () => {
      // Fetch windfarms list and compute summary
      const windfarms = await apiClient.get<Array<{
        id: number
        nameplate_capacity_mw: number | null
        status: string | null
        location_type: string | null
        country_id: number | null
      }>>('/windfarms?limit=1000')

      const totalCapacity = windfarms.reduce((sum, wf) => sum + (wf.nameplate_capacity_mw || 0), 0)
      const operationalCount = windfarms.filter(wf => wf.status === 'operational').length
      const offshoreCount = windfarms.filter(wf => wf.location_type === 'offshore').length
      const onshoreCount = windfarms.filter(wf => wf.location_type === 'onshore').length
      const uniqueCountries = new Set(windfarms.map(wf => wf.country_id)).size

      return {
        total_windfarms: windfarms.length,
        total_capacity_mw: totalCapacity,
        operational_farms: operationalCount,
        offshore_farms: offshoreCount,
        onshore_farms: onshoreCount,
        countries: uniqueCountries,
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Generation Summary - aggregated generation for period
export function useGenerationSummary(
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<GenerationSummary>({
    queryKey: [...DASHBOARD_QUERY_KEY, 'generation-summary', startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) throw new Error('Missing date parameters')

      // Get generation stats endpoint if available
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      try {
        const stats = await apiClient.get<{
          total_generation_mwh: number
          average_capacity_factor: number
          hours_with_data: number
        }>(`/generation/stats?${params}`)

        return {
          total_generation_mwh: stats.total_generation_mwh,
          avg_capacity_factor: stats.average_capacity_factor,
          hours_with_data: stats.hours_with_data,
          period_start: startDate,
          period_end: endDate,
        }
      } catch {
        // Return default if endpoint not available
        return {
          total_generation_mwh: 0,
          avg_capacity_factor: 0,
          hours_with_data: 0,
          period_start: startDate,
          period_end: endDate,
        }
      }
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Top Performers by capacity factor
export function useTopPerformers(
  startDate: string | null,
  endDate: string | null,
  limit: number = 5,
) {
  return useQuery<TopPerformer[]>({
    queryKey: [...DASHBOARD_QUERY_KEY, 'top-performers', startDate, endDate, limit],
    queryFn: async () => {
      if (!startDate || !endDate) throw new Error('Missing date parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        order_by: 'capacity_factor',
        order: 'desc',
        limit: limit.toString(),
      })

      try {
        return await apiClient.get<TopPerformer[]>(`/generation/rankings?${params}`)
      } catch {
        // Return empty if endpoint not available
        return []
      }
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Low Performers
export function useLowPerformers(
  startDate: string | null,
  endDate: string | null,
  limit: number = 5,
) {
  return useQuery<TopPerformer[]>({
    queryKey: [...DASHBOARD_QUERY_KEY, 'low-performers', startDate, endDate, limit],
    queryFn: async () => {
      if (!startDate || !endDate) throw new Error('Missing date parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        order_by: 'capacity_factor',
        order: 'asc',
        limit: limit.toString(),
      })

      try {
        return await apiClient.get<TopPerformer[]>(`/generation/rankings?${params}`)
      } catch {
        return []
      }
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Data Freshness - using generation availability endpoint
export function useDataFreshness() {
  return useQuery<DataFreshness[]>({
    queryKey: [...DASHBOARD_QUERY_KEY, 'data-freshness'],
    queryFn: async () => {
      try {
        return await apiClient.get<DataFreshness[]>('/generation/data-freshness')
      } catch {
        return []
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Recent windfarms for quick access
export function useRecentWindfarms(limit: number = 5) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'recent-windfarms', limit],
    queryFn: async () => {
      // Get most recently updated windfarms
      const params = new URLSearchParams({
        limit: limit.toString(),
        order_by: 'updated_at',
        order: 'desc',
      })

      return await apiClient.get<Array<{
        id: number
        code: string
        name: string
        country?: { name: string } | null
        nameplate_capacity_mw: number | null
        status: string | null
      }>>(`/windfarms?${params}`)
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatCapacity(capacityMW: number | null): string {
  if (capacityMW === null) return 'N/A'
  if (capacityMW >= 1000) {
    return `${(capacityMW / 1000).toFixed(2)} GW`
  }
  return `${capacityMW.toFixed(0)} MW`
}

export function formatGeneration(generationMWh: number | null): string {
  if (generationMWh === null) return 'N/A'
  if (generationMWh >= 1000000000) {
    return `${(generationMWh / 1000000000).toFixed(2)} TWh`
  }
  if (generationMWh >= 1000000) {
    return `${(generationMWh / 1000000).toFixed(2)} GWh`
  }
  if (generationMWh >= 1000) {
    return `${(generationMWh / 1000).toFixed(1)} MWh`
  }
  return `${generationMWh.toFixed(0)} MWh`
}

export function formatCapacityFactor(cf: number | null): string {
  if (cf === null) return 'N/A'
  return `${(cf * 100).toFixed(1)}%`
}

export function getCapacityFactorColor(cf: number | null): string {
  if (cf === null) return 'text-muted-foreground'
  if (cf >= 0.4) return 'text-emerald-400' // Excellent
  if (cf >= 0.3) return 'text-cyan-400' // Good
  if (cf >= 0.2) return 'text-yellow-400' // Fair
  return 'text-red-400' // Poor
}

export function getCapacityFactorLabel(cf: number | null): string {
  if (cf === null) return 'Unknown'
  if (cf >= 0.4) return 'Excellent'
  if (cf >= 0.3) return 'Good'
  if (cf >= 0.2) return 'Fair'
  return 'Below Average'
}
