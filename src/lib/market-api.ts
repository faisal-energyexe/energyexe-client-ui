import { useQuery } from '@tanstack/react-query'
import { apiClient } from './api'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PriceStatistics {
  hours_with_data: number
  day_ahead: {
    average: number | null
    min: number | null
    max: number | null
  }
  intraday: {
    average: number | null
    min: number | null
    max: number | null
  }
}

export interface PriceCoverage {
  total_hours: number
  hours_with_data: number
  hours_with_day_ahead: number
  hours_with_intraday: number
  coverage_percent: number
  day_ahead_coverage_percent: number
  intraday_coverage_percent: number
}

export interface CaptureRatePeriod {
  period: string | null
  total_generation_mwh: number
  revenue_eur: number
  achieved_price: number | null
  market_average_price: number | null
  hours_in_period: number
  capture_rate: number | null
}

export interface CaptureRateOverall {
  total_generation_mwh: number
  total_revenue_eur: number
  achieved_price: number | null
  market_average_price: number | null
  capture_rate: number | null
}

export interface CaptureRateResponse {
  windfarm_id: number
  windfarm_name: string | null
  start_date: string
  end_date: string
  aggregation: string
  price_type: string
  overall: CaptureRateOverall
  periods: CaptureRatePeriod[]
}

export interface RevenuePeriod {
  period: string | null
  total_generation_mwh: number
  day_ahead_revenue_eur: number
  total_revenue_eur: number
  avg_day_ahead_price: number | null
  avg_intraday_price: number | null
  hours_with_generation: number
}

export interface RevenueMetricsResponse {
  windfarm_id: number
  windfarm_name: string | null
  start_date: string
  end_date: string
  aggregation: string
  periods: RevenuePeriod[]
}

export interface PriceProfileEntry {
  hour_of_day?: number
  day_of_week?: number
  day_name?: string
  avg_price: number | null
  min_price: number | null
  max_price: number | null
  stddev: number | null
  sample_count: number
}

export interface PriceProfileResponse {
  bidzone_id: number
  bidzone_code: string | null
  bidzone_name: string | null
  start_date: string
  end_date: string
  aggregation: string
  profile: PriceProfileEntry[]
}

export interface CorrelationResponse {
  windfarm_id: number
  windfarm_name: string | null
  start_date: string
  end_date: string
  correlation: number | null
  sample_size: number
  interpretation: string | null
  message: string | null
}

export type Aggregation = 'hour' | 'day' | 'week' | 'month' | 'year'
export type PriceType = 'day_ahead' | 'intraday'

// ============================================================================
// QUERY KEYS
// ============================================================================

export const MARKET_QUERY_KEY = ['market']

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Price Statistics
export function usePriceStatistics(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<PriceStatistics>({
    queryKey: [...MARKET_QUERY_KEY, 'statistics', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<PriceStatistics>(
        `/prices/windfarms/${windfarmId}/statistics?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Price Coverage
export function usePriceCoverage(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<PriceCoverage>({
    queryKey: [...MARKET_QUERY_KEY, 'coverage', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<PriceCoverage>(
        `/prices/windfarms/${windfarmId}/coverage?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Capture Rate
export function useCaptureRate(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
  aggregation: Aggregation = 'month',
  priceType: PriceType = 'day_ahead',
) {
  return useQuery<CaptureRateResponse>({
    queryKey: [...MARKET_QUERY_KEY, 'capture-rate', windfarmId, startDate, endDate, aggregation, priceType],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        aggregation,
        price_type: priceType,
      })

      return await apiClient.get<CaptureRateResponse>(
        `/prices/analytics/capture-rate/${windfarmId}?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Revenue Metrics
export function useRevenueMetrics(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
  aggregation: Aggregation = 'month',
) {
  return useQuery<RevenueMetricsResponse>({
    queryKey: [...MARKET_QUERY_KEY, 'revenue', windfarmId, startDate, endDate, aggregation],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        aggregation,
      })

      return await apiClient.get<RevenueMetricsResponse>(
        `/prices/analytics/revenue/${windfarmId}?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Price Profile
export function usePriceProfile(
  bidzoneId: number | null,
  startDate: string | null,
  endDate: string | null,
  aggregation: 'hourly' | 'daily' = 'hourly',
) {
  return useQuery<PriceProfileResponse>({
    queryKey: [...MARKET_QUERY_KEY, 'profile', bidzoneId, startDate, endDate, aggregation],
    queryFn: async () => {
      if (!bidzoneId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        aggregation,
      })

      return await apiClient.get<PriceProfileResponse>(
        `/prices/analytics/price-profile/${bidzoneId}?${params}`,
      )
    },
    enabled: !!bidzoneId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// Generation-Price Correlation
export function useGenerationPriceCorrelation(
  windfarmId: number | null,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery<CorrelationResponse>({
    queryKey: [...MARKET_QUERY_KEY, 'correlation', windfarmId, startDate, endDate],
    queryFn: async () => {
      if (!windfarmId || !startDate || !endDate)
        throw new Error('Missing parameters')

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      return await apiClient.get<CorrelationResponse>(
        `/prices/analytics/correlation/${windfarmId}?${params}`,
      )
    },
    enabled: !!windfarmId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatPrice(price: number | null, currency: string = 'EUR'): string {
  if (price === null) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatRevenue(revenue: number | null, currency: string = 'EUR'): string {
  if (revenue === null) return 'N/A'
  if (revenue >= 1000000) {
    return `${(revenue / 1000000).toFixed(2)}M ${currency}`
  }
  if (revenue >= 1000) {
    return `${(revenue / 1000).toFixed(2)}k ${currency}`
  }
  return formatPrice(revenue, currency)
}

export function formatCaptureRate(rate: number | null): string {
  if (rate === null) return 'N/A'
  return `${(rate * 100).toFixed(1)}%`
}

export function getCaptureRateColor(rate: number | null): string {
  if (rate === null) return 'text-muted-foreground'
  if (rate >= 1.05) return 'text-emerald-400' // Outperforming market
  if (rate >= 0.95) return 'text-cyan-400' // Near market
  if (rate >= 0.85) return 'text-yellow-400' // Slightly below
  return 'text-red-400' // Significantly below
}

export function getCaptureRateLabel(rate: number | null): string {
  if (rate === null) return 'Unknown'
  if (rate >= 1.05) return 'Outperforming'
  if (rate >= 0.95) return 'Market Rate'
  if (rate >= 0.85) return 'Below Market'
  return 'Underperforming'
}
