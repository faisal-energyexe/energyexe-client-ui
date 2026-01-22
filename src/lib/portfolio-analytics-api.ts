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

// Types for Portfolio Revenue
export interface PortfolioRevenueData {
  start_date: string
  end_date: string
  aggregation: string
  total_revenue_eur: number
  total_generation_mwh: number
  avg_achieved_price: number
  avg_market_price: number
  avg_capture_rate: number
  farm_count: number
  by_farm: PortfolioFarmRevenue[]
  by_period: PortfolioRevenuePeriod[]
}

export interface PortfolioFarmRevenue {
  windfarm_id: number
  name: string
  total_generation_mwh: number
  total_revenue_eur: number
  achieved_price: number
  capture_rate: number
}

export interface PortfolioRevenuePeriod {
  period: string
  total_generation_mwh: number
  total_revenue_eur: number
  avg_price: number
  achieved_price: number
  farm_count: number
}

export interface PortfolioRevenueParams {
  start_date: string
  end_date: string
  portfolio_id?: number
  country_id?: number
  aggregation?: 'day' | 'week' | 'month'
}

export const usePortfolioRevenue = (params: PortfolioRevenueParams) => {
  return useQuery({
    queryKey: [...PORTFOLIO_ANALYTICS_KEY, 'revenue', params],
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

      return await apiClient.get<PortfolioRevenueData>(
        `/prices/analytics/portfolio/revenue?${searchParams.toString()}`,
      )
    },
    enabled: !!params.start_date && !!params.end_date,
  })
}

// Types for Portfolio Capture Rates
export interface PortfolioCaptureRatesData {
  start_date: string
  end_date: string
  market_average_price: number
  farm_count: number
  statistics: {
    avg_capture_rate: number
    max_capture_rate: number
    min_capture_rate: number
  }
  farms: PortfolioFarmCaptureRate[]
}

export interface PortfolioFarmCaptureRate {
  windfarm_id: number
  name: string
  bidzone_code: string | null
  total_generation_mwh: number
  total_revenue_eur: number
  achieved_price: number
  capture_rate: number
}

export interface PortfolioCaptureRatesParams {
  start_date: string
  end_date: string
  portfolio_id?: number
  country_id?: number
  sort_by?: 'capture_rate' | 'revenue' | 'generation'
}

export const usePortfolioCaptureRates = (params: PortfolioCaptureRatesParams) => {
  return useQuery({
    queryKey: [...PORTFOLIO_ANALYTICS_KEY, 'capture-rates', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('start_date', params.start_date)
      searchParams.append('end_date', params.end_date)
      if (params.sort_by) searchParams.append('sort_by', params.sort_by)
      if (params.portfolio_id !== undefined)
        searchParams.append('portfolio_id', params.portfolio_id.toString())
      if (params.country_id !== undefined)
        searchParams.append('country_id', params.country_id.toString())

      return await apiClient.get<PortfolioCaptureRatesData>(
        `/prices/analytics/portfolio/capture-rates?${searchParams.toString()}`,
      )
    },
    enabled: !!params.start_date && !!params.end_date,
  })
}

// Types for Portfolio Weather Summary
export interface PortfolioWeatherSummary {
  start_date: string
  end_date: string
  avg_wind_speed: number
  min_wind_speed: number
  max_wind_speed: number
  avg_temperature: number
  farm_count: number
  total_hours: number
  by_country: PortfolioWeatherByCountry[]
  correlation_summary: PortfolioWeatherCorrelation[]
  seasonal_patterns: PortfolioWeatherSeasonal[]
}

export interface PortfolioWeatherByCountry {
  country_id: number
  country_name: string
  country_code: string
  avg_wind_speed: number
  avg_temperature: number
  farm_count: number
  data_points: number
}

export interface PortfolioWeatherCorrelation {
  windfarm_id: number
  windfarm_name: string
  windfarm_code: string
  country_name: string
  avg_wind_speed: number
  avg_generation_mwh: number
  capacity_factor: number
  wind_gen_correlation: number | null
  data_points: number
}

export interface PortfolioWeatherSeasonal {
  month: number
  month_name: string
  avg_wind_speed: number
  avg_temperature: number
  farm_count: number
  data_points: number
}

export interface PortfolioWeatherParams {
  start_date: string
  end_date: string
  portfolio_id?: number
  country_id?: number
}

export const usePortfolioWeatherSummary = (params: PortfolioWeatherParams) => {
  return useQuery({
    queryKey: [...PORTFOLIO_ANALYTICS_KEY, 'weather', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('start_date', params.start_date)
      searchParams.append('end_date', params.end_date)
      if (params.portfolio_id !== undefined)
        searchParams.append('portfolio_id', params.portfolio_id.toString())
      if (params.country_id !== undefined)
        searchParams.append('country_id', params.country_id.toString())

      return await apiClient.get<PortfolioWeatherSummary>(
        `/weather-data/portfolio/summary?${searchParams.toString()}`,
      )
    },
    enabled: !!params.start_date && !!params.end_date,
  })
}

// Types for Portfolio Performance
export interface PortfolioPerformanceData {
  start_date: string
  end_date: string
  hours_in_period: number
  farm_count: number
  cf_distribution: CapacityFactorBin[]
  performance_ranking: PerformanceRanking[]
  performance_trend: PerformanceTrend[]
  by_technology: TechnologyPerformance[]
  statistics: PerformanceStatistics
}

export interface CapacityFactorBin {
  bin_start: number
  bin_end: number
  bin_label: string
  count: number
}

export interface PerformanceRanking {
  windfarm_id: number
  windfarm_name: string
  windfarm_code: string
  country_name: string
  capacity_mw: number
  total_mwh: number
  capacity_factor: number
  avg_quality: number
  record_count: number
}

export interface PerformanceTrend {
  period: string
  total_mwh: number
  capacity_factor: number
  farm_count: number
}

export interface TechnologyPerformance {
  model_id: number
  manufacturer: string
  model_name: string
  rated_power_kw: number
  farm_count: number
  turbine_count: number
  total_capacity_mw: number
  total_mwh: number
  capacity_factor: number
}

export interface PerformanceStatistics {
  avg_capacity_factor: number
  max_capacity_factor: number
  min_capacity_factor: number
  total_capacity_mw: number
  total_generation_mwh: number
}

export interface PortfolioPerformanceParams {
  start_date: string
  end_date: string
  portfolio_id?: number
  country_id?: number
}

export const usePortfolioPerformance = (params: PortfolioPerformanceParams) => {
  return useQuery({
    queryKey: [...PORTFOLIO_ANALYTICS_KEY, 'performance', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('start_date', params.start_date)
      searchParams.append('end_date', params.end_date)
      if (params.portfolio_id !== undefined)
        searchParams.append('portfolio_id', params.portfolio_id.toString())
      if (params.country_id !== undefined)
        searchParams.append('country_id', params.country_id.toString())

      return await apiClient.get<PortfolioPerformanceData>(
        `/generation/portfolio/performance?${searchParams.toString()}`,
      )
    },
    enabled: !!params.start_date && !!params.end_date,
  })
}
