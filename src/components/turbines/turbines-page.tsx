import { useState } from 'react'
import { Fan, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TurbineStats } from './turbine-stats'
import { TurbineFilters, defaultFilters, type TurbineFiltersState } from './turbine-filters'
import { TurbineDataTable } from './turbine-data-table'
import { useTurbineUnits, useTurbineUnitsStats, useTurbineModels } from '@/lib/turbine-units-api'
import { useWindfarms } from '@/lib/windfarms-api'

export function TurbinesPage() {
  const [filters, setFilters] = useState<TurbineFiltersState>(defaultFilters)

  // Fetch turbine units with filters
  const {
    data: turbineUnits,
    isLoading: isLoadingTurbines,
    refetch: refetchTurbines,
  } = useTurbineUnits({
    limit: 1000,
    windfarm_id: filters.windfarm_id,
    model_id: filters.model_id,
    status: filters.status,
    search: filters.search || undefined,
  })

  // Fetch statistics with filters
  const { data: stats, isLoading: isLoadingStats } = useTurbineUnitsStats({
    windfarm_id: filters.windfarm_id,
    model_id: filters.model_id,
    status: filters.status,
  })

  // Fetch windfarms and models for filter dropdowns
  const { data: windfarms, isLoading: isLoadingWindfarms } = useWindfarms({
    limit: 500,
  })

  const { data: turbineModels, isLoading: isLoadingModels } = useTurbineModels({
    limit: 500,
  })

  const isLoading = isLoadingTurbines || isLoadingStats

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-cyan-500 shadow-lg shadow-primary/25">
              <Fan className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Turbines
            </h1>
          </div>
          <p className="text-muted-foreground">
            Global turbine inventory across all wind farms
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchTurbines()}
          disabled={isLoading}
          className="border-border/50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <TurbineStats stats={stats} isLoading={isLoadingStats} />

      {/* Filters */}
      <TurbineFilters
        filters={filters}
        onFiltersChange={setFilters}
        windfarms={windfarms}
        turbineModels={turbineModels}
        isLoadingWindfarms={isLoadingWindfarms}
        isLoadingModels={isLoadingModels}
      />

      {/* Data Table */}
      <TurbineDataTable
        data={turbineUnits ?? []}
        isLoading={isLoadingTurbines}
      />
    </div>
  )
}
