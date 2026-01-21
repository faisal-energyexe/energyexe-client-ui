import { ShieldCheck, ShieldAlert, ShieldQuestion, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DataQualityIndicatorProps {
  score: number // 0-1
  label?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function DataQualityIndicator({
  score,
  label = false,
  size = 'md',
}: DataQualityIndicatorProps) {
  const percentage = score * 100

  const getQualityInfo = () => {
    if (percentage >= 90) {
      return {
        icon: ShieldCheck,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20',
        borderColor: 'border-emerald-500/30',
        label: 'Excellent',
        description: 'High confidence data with complete measurements',
      }
    }
    if (percentage >= 70) {
      return {
        icon: ShieldCheck,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-500/30',
        label: 'Good',
        description: 'Reliable data with minor gaps',
      }
    }
    if (percentage >= 50) {
      return {
        icon: ShieldQuestion,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/20',
        borderColor: 'border-amber-500/30',
        label: 'Fair',
        description: 'Some interpolation or missing data',
      }
    }
    return {
      icon: ShieldAlert,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      label: 'Poor',
      description: 'Significant data quality issues',
    }
  }

  const info = getQualityInfo()
  const Icon = info.icon

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const badgeSizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`${info.bgColor} ${info.borderColor} ${badgeSizes[size]} gap-1.5 cursor-help`}
          >
            <Icon className={`${sizeClasses[size]} ${info.color}`} />
            {label && (
              <span className={info.color}>
                {info.label} ({percentage.toFixed(0)}%)
              </span>
            )}
            {!label && (
              <span className={info.color}>{percentage.toFixed(0)}%</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">
              Data Quality: {info.label} ({percentage.toFixed(1)}%)
            </p>
            <p className="text-sm text-muted-foreground">{info.description}</p>
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Based on completeness, measurement type, and validation</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface DataQualityBarProps {
  score: number
  showLabel?: boolean
}

export function DataQualityBar({ score, showLabel = true }: DataQualityBarProps) {
  const percentage = score * 100

  const getBarColor = () => {
    if (percentage >= 90) return 'bg-emerald-500'
    if (percentage >= 70) return 'bg-cyan-500'
    if (percentage >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Data Quality</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor()} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
