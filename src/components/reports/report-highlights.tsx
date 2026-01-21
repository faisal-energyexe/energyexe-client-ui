/**
 * ReportHighlights - Display key findings and highlights.
 */

import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ReportHighlightsProps {
  highlights: string[]
  className?: string
}

export function ReportHighlights({ highlights, className }: ReportHighlightsProps) {
  if (!highlights || highlights.length === 0) {
    return null
  }

  return (
    <Card className={cn('bg-card/50 backdrop-blur-sm border-border/50', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          Key Highlights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {highlights.map((highlight, index) => (
            <HighlightItem key={index} text={highlight} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

interface HighlightItemProps {
  text: string
}

function HighlightItem({ text }: HighlightItemProps) {
  // Determine icon based on content
  const icon = getHighlightIcon(text)
  const { Icon, color } = icon

  return (
    <li className="flex items-start gap-3">
      <div className={cn('p-1.5 rounded-md', color.replace('text-', 'bg-') + '/10')}>
        <Icon className={cn('h-4 w-4', color)} />
      </div>
      <span className="text-sm text-muted-foreground leading-relaxed pt-0.5">
        {text}
      </span>
    </li>
  )
}

function getHighlightIcon(text: string): {
  Icon: React.ElementType
  color: string
} {
  const lowerText = text.toLowerCase()

  // Check for positive indicators
  if (
    lowerText.includes('above') ||
    lowerText.includes('exceeded') ||
    lowerText.includes('top') ||
    lowerText.includes('best') ||
    lowerText.includes('improved') ||
    lowerText.includes('strong')
  ) {
    return { Icon: TrendingUp, color: 'text-emerald-400' }
  }

  // Check for negative indicators
  if (
    lowerText.includes('below') ||
    lowerText.includes('underperformed') ||
    lowerText.includes('decline') ||
    lowerText.includes('lowest') ||
    lowerText.includes('worst')
  ) {
    return { Icon: TrendingDown, color: 'text-red-400' }
  }

  // Check for warnings
  if (
    lowerText.includes('warning') ||
    lowerText.includes('caution') ||
    lowerText.includes('attention') ||
    lowerText.includes('concern')
  ) {
    return { Icon: AlertCircle, color: 'text-amber-400' }
  }

  // Check for achievements
  if (
    lowerText.includes('achieved') ||
    lowerText.includes('reached') ||
    lowerText.includes('milestone')
  ) {
    return { Icon: CheckCircle, color: 'text-blue-400' }
  }

  // Default
  return { Icon: Lightbulb, color: 'text-primary' }
}

/**
 * Compact highlights for summaries.
 */
interface HighlightsCompactProps {
  highlights: string[]
  limit?: number
}

export function HighlightsCompact({ highlights, limit = 3 }: HighlightsCompactProps) {
  const displayHighlights = highlights.slice(0, limit)

  return (
    <div className="space-y-2">
      {displayHighlights.map((highlight, index) => {
        const { Icon, color } = getHighlightIcon(highlight)
        return (
          <div
            key={index}
            className="flex items-start gap-2 text-xs text-muted-foreground"
          >
            <Icon className={cn('h-3.5 w-3.5 mt-0.5 shrink-0', color)} />
            <span className="line-clamp-1">{highlight}</span>
          </div>
        )
      })}
      {highlights.length > limit && (
        <span className="text-xs text-muted-foreground">
          +{highlights.length - limit} more highlights
        </span>
      )}
    </div>
  )
}
