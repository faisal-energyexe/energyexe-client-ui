import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TurbineModel, WindfarmListItem } from '@/types/windfarm'

export interface TurbineFiltersState {
  search: string
  windfarm_id: number | undefined
  model_id: number | undefined
  status: string | undefined
}

export const defaultFilters: TurbineFiltersState = {
  search: '',
  windfarm_id: undefined,
  model_id: undefined,
  status: undefined,
}

interface TurbineFiltersProps {
  filters: TurbineFiltersState
  onFiltersChange: (filters: TurbineFiltersState) => void
  windfarms?: WindfarmListItem[]
  turbineModels?: TurbineModel[]
  isLoadingWindfarms?: boolean
  isLoadingModels?: boolean
}

export function TurbineFilters({
  filters,
  onFiltersChange,
  windfarms,
  turbineModels,
  isLoadingWindfarms,
  isLoadingModels,
}: TurbineFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.windfarm_id !== undefined ||
    filters.model_id !== undefined ||
    filters.status !== undefined

  const handleReset = () => {
    onFiltersChange(defaultFilters)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by turbine code..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="pl-10 bg-background/50 border-border/50"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onFiltersChange({ ...filters, search: '' })}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Wind Farm Filter */}
      <Select
        value={filters.windfarm_id?.toString() ?? 'all'}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            windfarm_id: value === 'all' ? undefined : parseInt(value, 10),
          })
        }
      >
        <SelectTrigger className="w-full lg:w-[200px] bg-background/50 border-border/50">
          <SelectValue placeholder="All Wind Farms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Wind Farms</SelectItem>
          {isLoadingWindfarms ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            windfarms?.map((wf) => (
              <SelectItem key={wf.id} value={wf.id.toString()}>
                {wf.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Turbine Model Filter */}
      <Select
        value={filters.model_id?.toString() ?? 'all'}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            model_id: value === 'all' ? undefined : parseInt(value, 10),
          })
        }
      >
        <SelectTrigger className="w-full lg:w-[200px] bg-background/50 border-border/50">
          <SelectValue placeholder="All Models" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Models</SelectItem>
          {isLoadingModels ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            turbineModels?.map((model) => (
              <SelectItem key={model.id} value={model.id.toString()}>
                {model.model} ({model.supplier})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status ?? 'all'}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: value === 'all' ? undefined : value,
          })
        }
      >
        <SelectTrigger className="w-full lg:w-[160px] bg-background/50 border-border/50">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="operational">Operational</SelectItem>
          <SelectItem value="installing">Installing</SelectItem>
          <SelectItem value="decommissioned">Decommissioned</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
