/**
 * NegativePriceSummary - Shows insights about negative/low price hours and market risks.
 * Displays price volatility metrics and helps users understand curtailment risks.
 */

import { AlertTriangle, TrendingDown, Clock, Zap, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { PriceStatistics, PriceProfileResponse } from '@/lib/market-api'

interface NegativePriceSummaryProps {
  statistics?: PriceStatistics
  priceProfile?: PriceProfileResponse
  isLoading?: boolean
}

interface PriceRiskLevel {
  level: 'low' | 'moderate' | 'high' | 'severe'
  color: string
  bgColor: string
  borderColor: string
}

export function NegativePriceSummary({
  statistics,
  priceProfile,
  isLoading,
}: NegativePriceSummaryProps) {
  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!statistics) {
    return null
  }

  // Calculate metrics from available data
  const minPrice = statistics.day_ahead?.min ?? 0
  const maxPrice = statistics.day_ahead?.max ?? 0
  const avgPrice = statistics.day_ahead?.average ?? 0
  const hasNegativePrices = minPrice < 0

  // Calculate price volatility (spread as % of average)
  const priceSpread = maxPrice - minPrice
  const volatilityPercent = avgPrice > 0 ? (priceSpread / avgPrice) * 100 : 0

  // Estimate negative price hours from profile data (if available)
  let negativeHours = 0
  let lowPriceHours = 0 // Hours below 20 EUR/MWh
  const totalProfileHours = priceProfile?.profile?.length ?? 0

  if (priceProfile?.profile) {
    priceProfile.profile.forEach((entry) => {
      if (entry.min_price !== null && entry.min_price < 0) {
        negativeHours++
      }
      if (entry.avg_price !== null && entry.avg_price < 20) {
        lowPriceHours++
      }
    })
  }

  // Determine risk level based on metrics
  const getRiskLevel = (): PriceRiskLevel => {
    if (minPrice < -50 || volatilityPercent > 300) {
      return {
        level: 'severe',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
      }
    }
    if (minPrice < 0 || volatilityPercent > 200) {
      return {
        level: 'high',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
      }
    }
    if (minPrice < 20 || volatilityPercent > 100) {
      return {
        level: 'moderate',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
      }
    }
    return {
      level: 'low',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    }
  }

  const risk = getRiskLevel()

  const formatPrice = (price: number | null): string => {
    if (price === null) return 'N/A'
    return `€${price.toFixed(2)}/MWh`
  }

  return (
    <Card className={`bg-card/50 backdrop-blur-sm ${risk.borderColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${risk.color}`} />
            Price Volatility & Risk
          </div>
          <Badge variant="outline" className={`${risk.color} ${risk.borderColor}`}>
            {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)} Risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Risk Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Min Price */}
          <div className={`p-3 rounded-lg ${risk.bgColor}`}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingDown className="h-3.5 w-3.5" />
              Min Price
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lowest day-ahead price in the period</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className={`text-lg font-bold ${minPrice < 0 ? 'text-red-500' : 'text-foreground'}`}>
              {formatPrice(minPrice)}
            </p>
          </div>

          {/* Max Price */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Zap className="h-3.5 w-3.5" />
              Max Price
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatPrice(maxPrice)}
            </p>
          </div>

          {/* Price Spread */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-3.5 w-3.5" />
              Price Spread
            </div>
            <p className="text-lg font-bold text-foreground">
              €{priceSpread.toFixed(2)}
            </p>
          </div>

          {/* Volatility */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Volatility
            </div>
            <p className={`text-lg font-bold ${volatilityPercent > 150 ? 'text-orange-500' : 'text-foreground'}`}>
              {volatilityPercent.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Negative Price Alert */}
        {hasNegativePrices && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-500">Negative Prices Detected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Day-ahead prices dropped to {formatPrice(minPrice)} during this period.
                  Consider curtailment strategies or storage optimization to avoid generating
                  during negative price periods.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Low Price Hours Summary (from profile data) */}
        {totalProfileHours > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Price Distribution Summary
            </h4>
            <div className="space-y-2">
              {negativeHours > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Hours with negative prices
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(negativeHours / totalProfileHours) * 100}
                      className="w-24 h-2"
                    />
                    <span className="text-sm font-medium text-red-500">
                      {negativeHours} ({((negativeHours / totalProfileHours) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
              {lowPriceHours > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Hours below €20/MWh
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(lowPriceHours / totalProfileHours) * 100}
                      className="w-24 h-2"
                    />
                    <span className="text-sm font-medium text-yellow-500">
                      {lowPriceHours} ({((lowPriceHours / totalProfileHours) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {risk.level === 'low' && (
              <>Price volatility is within normal range. Market conditions favor stable revenue.</>
            )}
            {risk.level === 'moderate' && (
              <>Moderate price volatility detected. Consider monitoring off-peak generation patterns.</>
            )}
            {risk.level === 'high' && (
              <>High price volatility may impact revenue predictability. Review generation scheduling.</>
            )}
            {risk.level === 'severe' && (
              <>Severe price volatility with negative prices. Implement curtailment strategies during low-price periods.</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default NegativePriceSummary
