import { useState } from 'react'
import { RefreshCw, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/generation/date-range-picker'
import { getDateRangePreset } from '@/lib/generation-api'
import {
  usePriceStatistics,
  useCaptureRate,
  useRevenueMetrics,
  usePriceProfile,
  useGenerationPriceCorrelation,
  type Aggregation,
} from '@/lib/market-api'
import { PriceKPIs } from './price-kpis'
import { CaptureRateChart } from './capture-rate-chart'
import { RevenueChart } from './revenue-chart'
import { CorrelationCard } from './correlation-card'
import { PriceProfileChart } from './price-profile-chart'
import { NegativePriceSummary } from './negative-price-summary'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MarketTabProps {
  windfarmId: number
  bidzoneId: number | null
}

export function MarketTab({ windfarmId, bidzoneId }: MarketTabProps) {
  // Date range state - default to 1 year for market data
  const [preset, setPreset] = useState('1Y')
  const [dateRange, setDateRange] = useState(() => getDateRangePreset('1Y'))
  const [aggregation, setAggregation] = useState<Aggregation>('month')
  const [profileType, setProfileType] = useState<'hourly' | 'daily'>('hourly')

  // Fetch all market data
  const {
    data: statistics,
    isLoading: isLoadingStats,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = usePriceStatistics(windfarmId, dateRange.startDate, dateRange.endDate)

  const {
    data: captureRate,
    isLoading: isLoadingCaptureRate,
    refetch: refetchCaptureRate,
  } = useCaptureRate(windfarmId, dateRange.startDate, dateRange.endDate, aggregation)

  const {
    data: revenue,
    isLoading: isLoadingRevenue,
    refetch: refetchRevenue,
  } = useRevenueMetrics(windfarmId, dateRange.startDate, dateRange.endDate, aggregation)

  const {
    data: correlation,
    isLoading: isLoadingCorrelation,
    refetch: refetchCorrelation,
  } = useGenerationPriceCorrelation(windfarmId, dateRange.startDate, dateRange.endDate)

  const {
    data: priceProfile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = usePriceProfile(bidzoneId, dateRange.startDate, dateRange.endDate, profileType)

  // Handle date range change
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate })
  }

  // Handle refresh all
  const handleRefresh = () => {
    refetchStats()
    refetchCaptureRate()
    refetchRevenue()
    refetchCorrelation()
    refetchProfile()
  }

  const isRefreshing = isFetchingStats

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 text-primary" />
            <span>Market Analytics</span>
          </div>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
            preset={preset}
            onPresetChange={setPreset}
          />
          <Select value={aggregation} onValueChange={(value) => setAggregation(value as Aggregation)}>
            <SelectTrigger className="w-[140px] bg-card/50 border-border/50">
              <SelectValue placeholder="Aggregation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-card/50 border-border/50 gap-2"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Price KPIs */}
      <PriceKPIs
        statistics={statistics}
        captureRate={captureRate?.overall}
        isLoading={isLoadingStats || isLoadingCaptureRate}
      />

      {/* Price Volatility & Risk Summary */}
      <NegativePriceSummary
        statistics={statistics}
        priceProfile={priceProfile}
        isLoading={isLoadingStats || isLoadingProfile}
      />

      {/* Capture Rate and Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CaptureRateChart data={captureRate} isLoading={isLoadingCaptureRate} />
        <RevenueChart data={revenue} isLoading={isLoadingRevenue} />
      </div>

      {/* Correlation and Price Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorrelationCard data={correlation} isLoading={isLoadingCorrelation} />
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <Select value={profileType} onValueChange={(value) => setProfileType(value as 'hourly' | 'daily')}>
              <SelectTrigger className="w-[140px] bg-card/50 border-border/50">
                <SelectValue placeholder="Profile type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">By Hour</SelectItem>
                <SelectItem value="daily">By Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <PriceProfileChart
            data={priceProfile}
            isLoading={isLoadingProfile}
            aggregation={profileType}
          />
        </div>
      </div>

      {/* Data freshness indicator */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Market data from {new Date(dateRange.startDate).toLocaleDateString()} to{' '}
            {new Date(dateRange.endDate).toLocaleDateString()}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          ENTSOE Day-Ahead Prices
        </span>
      </div>
    </div>
  )
}
