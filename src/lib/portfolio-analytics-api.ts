import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'

const PORTFOLIO_ANALYTICS_KEY = ['portfolio-analytics']

// Types for Portfolio Generation Stats
export interface PortfolioGenerationStats {
  total_mwh: number
  avg_capacity_factor: number
  farm_count: number
  record_count: number
  avg_quality_score: number
  total_capacity_mw: number
  top_performers: PortfolioFarmPerformer[]
  bottom_performers: PortfolioFarmPerformer[]
}

export interface PortfolioFarmPerformer {
  windfarm_id: number
  name: string
  total_mwh: number
  capacity_factor: number
  avg_quality: number
}

export interface PortfolioGenerationStatsParams {
  start_date: string
  end_date: string
  portfolio_id?: number
  country_id?: number
}

export const usePortfolioGenerationStats = (params: PortfolioGenerationStatsParams) => {
  return useQuery({
    queryKey: [...PORTFOLIO_ANALYTICS_KEY, 'generation', 'stats', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('start_date', params.start_date)
      searchParams.append('end_date', params.end_date)
      if (params.portfolio_id !== undefined)
        searchParams.append('portfolio_id', params.portfolio_id.toString())
      if (params.country_id !== undefined)
        searchParams.append('country_id', params.country_id.toString())

      return await apiClient.get<PortfolioGenerationStats>(
        `/generation/portfolio/stats?${searchParams.toString()}`,
      )
    },
    enabled: !!params.start_date && !!params.end_date,
  })
}

// Types for Portfolio Generation Timeseries
export interface PortfolioGenerationTimeseries {
  aggregation: string
  start_date: string
  end_date: string
  timeseries: PortfolioTimeseriesPoint[]
  by_farm: Record<string, PortfolioFarmTimeseriesPoint[]>
}

export interface PortfolioTimeseriesPoint {
  period: string
  total_mwh: number
  avg_quality: number
  farm_count: number
}

export interface PortfolioFarmTimeseriesPoint {
  period: string
  mwh: number
}

export interface PortfolioGenerationTimeseriesParams {
  start_date: string
  end_date: string
  aggregation?: 'hourly' | 'daily' | 'weekly' | 'monthly'
  portfolio_id?: number
  country_id?: number
}

export const usePortfolioGenerationTimeseries = (
  params: PortfolioGenerationTimeseriesParams,
) => {
  return useQuery({
    queryKey: [...PORTFOLIO_ANALYTICS_KEY, 'generation', 'timeseries', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('start_date', params.start_date)
      searchParams.append('end_date', params.end_date)
      if (params.aggregation)
        searchParams.append('aggregation', params.aggregation)
      if (params.portfolio_id !== undefined)
        searchParams.append('portfolio_id', params.portfolio_id.toString())
      if (params.country_id !== undefined)
        searchParams.append('country_id', params.country_id.toString())

      return await apiClient.get<PortfolioGenerationTimeseries>(
        `/generation/portfolio/timeseries?${searchParams.toString()}`,
      )
    },
    enabled: !!params.start_date && !!params.end_date,
  })
}
