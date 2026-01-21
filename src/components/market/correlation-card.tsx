import { TrendingUp, AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { CorrelationResponse } from '@/lib/market-api'

interface CorrelationCardProps {
  data: CorrelationResponse | undefined
  isLoading: boolean
}

function getCorrelationStrength(correlation: number | null): {
  label: string
  color: string
  description: string
} {
  if (correlation === null) {
    return {
      label: 'Unknown',
      color: 'text-muted-foreground',
      description: 'Insufficient data to calculate correlation',
    }
  }

  const absCorr = Math.abs(correlation)

  if (absCorr >= 0.7) {
    return {
      label: correlation > 0 ? 'Strong Positive' : 'Strong Negative',
      color: correlation > 0 ? 'text-red-400' : 'text-emerald-400',
      description:
        correlation > 0
          ? 'Higher generation strongly correlates with higher prices'
          : 'Higher generation strongly correlates with lower prices',
    }
  }
  if (absCorr >= 0.4) {
    return {
      label: correlation > 0 ? 'Moderate Positive' : 'Moderate Negative',
      color: correlation > 0 ? 'text-orange-400' : 'text-cyan-400',
      description:
        correlation > 0
          ? 'Higher generation moderately correlates with higher prices'
          : 'Higher generation moderately correlates with lower prices',
    }
  }
  if (absCorr >= 0.2) {
    return {
      label: 'Weak',
      color: 'text-yellow-400',
      description: 'Weak relationship between generation and prices',
    }
  }
  return {
    label: 'Negligible',
    color: 'text-muted-foreground',
    description: 'No significant relationship between generation and prices',
  }
}

export function CorrelationCard({ data, isLoading }: CorrelationCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const correlation = data?.correlation ?? null
  const strength = getCorrelationStrength(correlation)
  const sampleSize = data?.sample_size ?? 0

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Generation-Price Correlation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Correlation value */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">
                {correlation !== null ? correlation.toFixed(3) : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">Correlation Coefficient</p>
            </div>
            <Badge variant="outline" className={strength.color}>
              {strength.label}
            </Badge>
          </div>

          {/* Interpretation */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground">{strength.description}</p>
                {data?.interpretation && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {data.interpretation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* What this means */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">What this means:</p>
            {correlation !== null && correlation < 0 ? (
              <div className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Negative correlation is typical for wind farms - when wind is strong (high generation),
                  many wind farms produce, increasing supply and lowering prices.
                </p>
              </div>
            ) : correlation !== null && correlation > 0 ? (
              <div className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Positive correlation is unusual for wind farms. This may indicate the farm
                  captures high-price periods or operates in a unique market.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  The relationship between generation and prices appears random or neutral.
                </p>
              </div>
            )}
          </div>

          {/* Sample size */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {sampleSize < 100 && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
              <span>Based on {sampleSize.toLocaleString()} data points</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
