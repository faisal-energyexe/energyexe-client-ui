import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useWindfarmWithOwners, useWindfarmTurbineUnits } from '@/lib/windfarms-api'
import { TechnicalSpecs } from '@/components/windfarms/technical-specs'
import { OwnershipTable } from '@/components/windfarms/ownership-table'
import { LocationCard } from '@/components/windfarms/location-card'
import { GenerationPerformanceCard } from '@/components/windfarms/generation-performance-card'
import { TurbineFleetSummary } from '@/components/windfarms/turbine-fleet-summary'

export const Route = createFileRoute('/_protected/wind-farms/$windfarmId/')({
  component: WindfarmOverviewTab,
})

function WindfarmOverviewTab() {
  const { windfarmId } = Route.useParams()
  const id = parseInt(windfarmId, 10)

  const { data: windfarm } = useWindfarmWithOwners(id)

  const {
    data: turbineUnits,
    isLoading: isLoadingTurbines,
  } = useWindfarmTurbineUnits(id)

  if (!windfarm) {
    return null // Parent layout handles loading/error states
  }

  return (
    <>
      {/* Overview Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Technical Specs & Generation Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generation Performance Card */}
          <GenerationPerformanceCard
            windfarmId={id}
            nameplateCapacityMw={windfarm.nameplate_capacity_mw}
          />
          <TechnicalSpecs
            windfarm={windfarm}
            turbineUnits={turbineUnits}
          />
        </div>

        {/* Right Column - Location, Ownership & Turbines */}
        <div className="space-y-6">
          <LocationCard windfarm={windfarm} />
          <TurbineFleetSummary
            turbineUnits={turbineUnits}
            nameplateCapacityMw={windfarm.nameplate_capacity_mw}
            isLoading={isLoadingTurbines}
          />
          <OwnershipTable owners={windfarm.windfarm_owners || []} />
        </div>
      </div>

      {/* Data Quality Indicator */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Data last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        {isLoadingTurbines && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading turbine data...
          </div>
        )}
      </div>
    </>
  )
}
