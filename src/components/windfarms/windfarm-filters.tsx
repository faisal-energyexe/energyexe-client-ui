import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { WINDFARM_STATUS_OPTIONS, LOCATION_TYPE_OPTIONS } from '@/types/windfarm'
import { cn } from '@/lib/utils'

export interface WindfarmFiltersState {
  search: string
  status: string
  locationType: string
  capacityMin: number
  capacityMax: number
}

interface WindfarmFiltersProps {
  filters: WindfarmFiltersState
  onFiltersChange: (filters: WindfarmFiltersState) => void
  maxCapacity?: number
}

export function WindfarmFilters({
  filters,
  onFiltersChange,
  maxCapacity = 500,
}: WindfarmFiltersProps) {
  const activeFiltersCount = [
    filters.status !== 'all',
    filters.locationType !== 'all',
    filters.capacityMin > 0,
    filters.capacityMax < maxCapacity,
  ].filter(Boolean).length

  const handleReset = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      locationType: 'all',
      capacityMin: 0,
      capacityMax: maxCapacity,
    })
  }

  return (
    <Collapsible>
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search wind farms..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="bg-card/50 border-border/50"
          />
        </div>

        {/* Quick Filter: Status */}
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value })
          }
        >
          <SelectTrigger className="w-[150px] bg-card/50 border-border/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {WINDFARM_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Quick Filter: Location Type */}
        <Select
          value={filters.locationType}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, locationType: value })
          }
        >
          <SelectTrigger className="w-[130px] bg-card/50 border-border/50">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {LOCATION_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'gap-2',
              activeFiltersCount > 0 && 'border-primary/50 text-primary',
            )}
          >
            <Filter className="h-4 w-4" />
            Advanced
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-xs bg-primary/20 text-primary"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        {/* Reset Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <CollapsibleContent>
        <div className="mt-4 p-4 rounded-lg border border-border/50 bg-card/30 space-y-4">
          {/* Capacity Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Capacity Range (MW)</Label>
              <span className="text-sm text-muted-foreground">
                {filters.capacityMin} - {filters.capacityMax} MW
              </span>
            </div>
            <Slider
              value={[filters.capacityMin, filters.capacityMax]}
              onValueChange={([min, max]) =>
                onFiltersChange({
                  ...filters,
                  capacityMin: min,
                  capacityMax: max,
                })
              }
              min={0}
              max={maxCapacity}
              step={10}
              className="py-2"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={filters.capacityMin}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      capacityMin: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="h-8 bg-card/50"
                  min={0}
                  max={filters.capacityMax}
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={filters.capacityMax}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      capacityMax: Math.min(maxCapacity, Number(e.target.value)),
                    })
                  }
                  className="h-8 bg-card/50"
                  min={filters.capacityMin}
                  max={maxCapacity}
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const defaultFilters: WindfarmFiltersState = {
  search: '',
  status: 'all',
  locationType: 'all',
  capacityMin: 0,
  capacityMax: 500,
}
