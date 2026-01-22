import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getDateRangePreset } from '@/lib/generation-api'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onDateRangeChange: (startDate: string, endDate: string) => void
  preset: string
  onPresetChange: (preset: string) => void
}

const presets = [
  { value: '7D', label: '7 Days' },
  { value: '30D', label: '30 Days' },
  { value: '90D', label: '90 Days' },
  { value: 'YTD', label: 'Year to Date' },
  { value: '1Y', label: '1 Year' },
  { value: 'ALL', label: 'All Time' },
  { value: 'custom', label: 'Custom' },
]

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  preset,
  onPresetChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customStart, setCustomStart] = useState(startDate)
  const [customEnd, setCustomEnd] = useState(endDate)

  const handlePresetSelect = (value: string) => {
    onPresetChange(value)
    if (value !== 'custom') {
      const { startDate: newStart, endDate: newEnd } = getDateRangePreset(value)
      onDateRangeChange(newStart, newEnd)
      setIsOpen(false)
    }
  }

  const handleCustomApply = () => {
    onDateRangeChange(customStart, customEnd)
    setIsOpen(false)
  }

  const formatDateRange = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
  }

  const selectedPreset = presets.find((p) => p.value === preset)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-card/50 border-border/50 hover:bg-card gap-2 justify-between min-w-[280px]"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {selectedPreset?.label || 'Select range'}
            </span>
            <span className="text-xs text-muted-foreground">
              ({formatDateRange()})
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-2 border-b border-border/50">
          <p className="text-sm font-medium text-foreground px-2 py-1">
            Quick Presets
          </p>
          <div className="grid grid-cols-3 gap-1">
            {presets
              .filter((p) => p.value !== 'custom')
              .map((p) => (
                <Button
                  key={p.value}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'justify-start',
                    preset === p.value &&
                      'bg-primary/10 text-primary hover:bg-primary/20'
                  )}
                  onClick={() => handlePresetSelect(p.value)}
                >
                  {p.label}
                </Button>
              ))}
          </div>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm font-medium text-foreground">Custom Range</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Start Date
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => {
                  setCustomStart(e.target.value)
                  onPresetChange('custom')
                }}
                className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">End Date</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => {
                  setCustomEnd(e.target.value)
                  onPresetChange('custom')
                }}
                className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          {preset === 'custom' && (
            <Button
              className="w-full"
              size="sm"
              onClick={handleCustomApply}
            >
              Apply Custom Range
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
