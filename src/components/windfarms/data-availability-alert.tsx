/**
 * DataAvailabilityAlert - Shows data availability status for analytics tabs.
 * Helps users understand if generation, weather, or price data is available.
 */

import { AlertCircle, CheckCircle2, Info, Database, CloudSun, DollarSign, Zap } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface DataAvailabilityStatus {
  generation: {
    available: boolean
    dataPoints?: number
    lastUpdate?: string
  }
  weather: {
    available: boolean
    dataPoints?: number
  }
  prices: {
    available: boolean
    hasBidzone: boolean
  }
}

interface DataAvailabilityAlertProps {
  windfarmId: number
  nameplateCapacityMw?: number | null
  bidzoneId?: number | null
  status?: DataAvailabilityStatus
  compact?: boolean
}

export function DataAvailabilityAlert({
  nameplateCapacityMw,
  bidzoneId,
  status,
  compact = false,
}: DataAvailabilityAlertProps) {
  // Calculate data availability issues
  const issues: Array<{
    type: 'generation' | 'weather' | 'prices' | 'metadata'
    severity: 'warning' | 'info'
    message: string
    icon: React.ReactNode
  }> = []

  // Check metadata
  if (!nameplateCapacityMw) {
    issues.push({
      type: 'metadata',
      severity: 'warning',
      message: 'Nameplate capacity not set - capacity factor calculations will be unavailable',
      icon: <Database className="h-4 w-4" />,
    })
  }

  // Check prices availability
  if (!bidzoneId) {
    issues.push({
      type: 'prices',
      severity: 'info',
      message: 'No bidzone assigned - market and revenue analytics unavailable',
      icon: <DollarSign className="h-4 w-4" />,
    })
  }

  // Check status if provided
  if (status) {
    if (!status.generation.available) {
      issues.push({
        type: 'generation',
        severity: 'warning',
        message: 'No generation data available for the selected period',
        icon: <Zap className="h-4 w-4" />,
      })
    }

    if (!status.weather.available) {
      issues.push({
        type: 'weather',
        severity: 'info',
        message: 'Weather data not available for this location',
        icon: <CloudSun className="h-4 w-4" />,
      })
    }

    if (!status.prices.available && status.prices.hasBidzone) {
      issues.push({
        type: 'prices',
        severity: 'info',
        message: 'Price data not available for the selected period',
        icon: <DollarSign className="h-4 w-4" />,
      })
    }
  }

  // If no issues, don't render anything
  if (issues.length === 0) {
    return null
  }

  const warnings = issues.filter(i => i.severity === 'warning')
  const infos = issues.filter(i => i.severity === 'info')

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {warnings.length > 0 && (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 gap-1">
            <AlertCircle className="h-3 w-3" />
            {warnings.length} data issue{warnings.length > 1 ? 's' : ''}
          </Badge>
        )}
        {infos.length > 0 && (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <Info className="h-3 w-3" />
            {infos.length} notice{infos.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {warnings.length > 0 && (
        <Alert className="border-yellow-500/30 bg-yellow-500/5">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="flex items-center gap-2 text-yellow-500">
            Data Availability Issues
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
              {warnings.length}
            </Badge>
          </AlertTitle>
          <AlertDescription>
            <ul className="space-y-2 mt-2">
              {warnings.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-yellow-500">{issue.icon}</span>
                  <span>{issue.message}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {infos.length > 0 && warnings.length === 0 && (
        <Alert className="border-border/50 bg-muted/20">
          <Info className="h-4 w-4 text-muted-foreground" />
          <AlertTitle className="flex items-center gap-2 text-muted-foreground">
            Data Notices
            <Badge variant="outline">
              {infos.length}
            </Badge>
          </AlertTitle>
          <AlertDescription>
            <ul className="space-y-2 mt-2">
              {infos.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5">{issue.icon}</span>
                  <span>{issue.message}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

/**
 * DataAvailabilityBadges - Compact inline badges showing data availability status.
 */
interface DataAvailabilityBadgesProps {
  hasGenerationData?: boolean
  hasWeatherData?: boolean
  hasPriceData?: boolean
  hasBidzone?: boolean
}

export function DataAvailabilityBadges({
  hasGenerationData = false,
  hasWeatherData = false,
  hasPriceData = false,
  hasBidzone = false,
}: DataAvailabilityBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge
        variant="outline"
        className={hasGenerationData
          ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
          : 'text-muted-foreground border-border/50'
        }
      >
        {hasGenerationData ? (
          <CheckCircle2 className="h-3 w-3 mr-1" />
        ) : (
          <AlertCircle className="h-3 w-3 mr-1" />
        )}
        Generation
      </Badge>

      <Badge
        variant="outline"
        className={hasWeatherData
          ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
          : 'text-muted-foreground border-border/50'
        }
      >
        {hasWeatherData ? (
          <CheckCircle2 className="h-3 w-3 mr-1" />
        ) : (
          <AlertCircle className="h-3 w-3 mr-1" />
        )}
        Weather
      </Badge>

      <Badge
        variant="outline"
        className={hasPriceData
          ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
          : hasBidzone
            ? 'text-muted-foreground border-border/50'
            : 'text-orange-500 border-orange-500/30 bg-orange-500/5'
        }
      >
        {hasPriceData ? (
          <CheckCircle2 className="h-3 w-3 mr-1" />
        ) : (
          <AlertCircle className="h-3 w-3 mr-1" />
        )}
        Prices {!hasBidzone && '(no bidzone)'}
      </Badge>
    </div>
  )
}

export default DataAvailabilityAlert
