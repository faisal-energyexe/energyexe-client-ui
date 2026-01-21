import { LayoutGrid, List, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export type ViewMode = 'table' | 'card' | 'compact'

interface ViewModeSelectorProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

const viewModes: { value: ViewMode; label: string; icon: typeof Table }[] = [
  { value: 'table', label: 'Table View', icon: Table },
  { value: 'card', label: 'Card View', icon: LayoutGrid },
  { value: 'compact', label: 'Compact List', icon: List },
]

export function ViewModeSelector({ value, onChange }: ViewModeSelectorProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center rounded-lg border border-border/50 bg-card/30 p-1">
        {viewModes.map((mode) => (
          <Tooltip key={mode.value}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(mode.value)}
                className={cn(
                  'h-8 w-8 p-0 transition-all',
                  value === mode.value
                    ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <mode.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {mode.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
