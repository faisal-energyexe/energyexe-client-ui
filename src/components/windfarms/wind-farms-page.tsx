import { useState, useMemo } from 'react'
import { Wind, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { WindfarmDataTable } from './windfarm-data-table'
import { WindfarmCard } from './windfarm-card'
import { WindfarmCompactList } from './windfarm-compact-list'
import {
  WindfarmFilters,
  defaultFilters,
  type WindfarmFiltersState,
} from './windfarm-filters'
import { ViewModeSelector, type ViewMode } from './view-mode-selector'
import { useWindfarms, useSearchWindfarms } from '@/lib/windfarms-api'
import type { WindfarmListItem } from '@/types/windfarm'

export function WindFarmsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [filters, setFilters] = useState<WindfarmFiltersState>(defaultFilters)

  // Determine if we're searching or just fetching all
  const isSearching = filters.search.length >= 1

  // Use search query when searching, otherwise fetch all
  const { data: allWindfarms, isLoading: isLoadingAll, refetch: refetchAll } = useWindfarms({
    limit: 500,
  })

  const { data: searchResults, isLoading: isLoadingSearch } = useSearchWindfarms(
    filters.search,
    { limit: 500 },
  )

  const isLoading = isSearching ? isLoadingSearch : isLoadingAll
  const rawData = isSearching ? searchResults : allWindfarms

  // Calculate max capacity for filter slider
  const maxCapacity = useMemo(() => {
    if (!allWindfarms) return 500
    const max = Math.max(
      ...allWindfarms.map((wf) => wf.nameplate_capacity_mw || 0),
    )
    return Math.ceil(max / 100) * 100 || 500
  }, [allWindfarms])

  // Apply client-side filters
  const filteredData = useMemo(() => {
    if (!rawData) return []

    return rawData.filter((windfarm: WindfarmListItem) => {
      // Status filter
      if (filters.status !== 'all' && windfarm.status !== filters.status) {
        return false
      }

      // Location type filter
      if (
        filters.locationType !== 'all' &&
        windfarm.location_type !== filters.locationType
      ) {
        return false
      }

      // Capacity range filter
      const capacity = windfarm.nameplate_capacity_mw || 0
      if (capacity < filters.capacityMin || capacity > filters.capacityMax) {
        return false
      }

      return true
    })
  }, [rawData, filters])

  // Stats
  const totalCapacity = useMemo(() => {
    return filteredData.reduce(
      (sum, wf) => sum + (wf.nameplate_capacity_mw || 0),
      0,
    )
  }, [filteredData])

  const operationalCount = useMemo(() => {
    return filteredData.filter((wf) => wf.status === 'operational').length
  }, [filteredData])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-cyan-500 shadow-lg shadow-primary/25">
              <Wind className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Wind Farms
            </h1>
          </div>
          <p className="text-muted-foreground">
            Explore and analyze your wind farm portfolio
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchAll()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Wind Farms"
          value={isLoading ? '—' : filteredData.length.toString()}
          isLoading={isLoading}
        />
        <StatsCard
          label="Operational"
          value={isLoading ? '—' : operationalCount.toString()}
          isLoading={isLoading}
        />
        <StatsCard
          label="Total Capacity"
          value={isLoading ? '—' : `${totalCapacity.toFixed(1)} MW`}
          isLoading={isLoading}
        />
        <StatsCard
          label="Countries"
          value={
            isLoading
              ? '—'
              : new Set(filteredData.map((wf) => wf.country_id)).size.toString()
          }
          isLoading={isLoading}
        />
      </div>

      {/* Filters & View Mode */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <WindfarmFilters
            filters={filters}
            onFiltersChange={setFilters}
            maxCapacity={maxCapacity}
          />
        </div>
        <ViewModeSelector value={viewMode} onChange={setViewMode} />
      </div>

      {/* Content */}
      {viewMode === 'table' && (
        <WindfarmDataTable data={filteredData} isLoading={isLoading} />
      )}

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))
          ) : filteredData.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No wind farms found.
            </div>
          ) : (
            filteredData.map((windfarm) => (
              <WindfarmCard key={windfarm.id} windfarm={windfarm} />
            ))
          )}
        </div>
      )}

      {viewMode === 'compact' && (
        <WindfarmCompactList data={filteredData} isLoading={isLoading} />
      )}
    </div>
  )
}

function StatsCard({
  label,
  value,
  isLoading,
}: {
  label: string
  value: string
  isLoading?: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 p-4">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-cyan-500/50" />
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {isLoading ? (
        <Skeleton className="h-7 w-20" />
      ) : (
        <p className="text-xl font-bold text-foreground">{value}</p>
      )}
    </div>
  )
}
