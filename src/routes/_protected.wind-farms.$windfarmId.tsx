import { createFileRoute } from '@tanstack/react-router'
import { Loader2, AlertCircle } from 'lucide-react'
import { useWindfarmWithOwners, useWindfarmTurbineUnits } from '@/lib/windfarms-api'
import { WindfarmHero } from '@/components/windfarms/windfarm-hero'
import { TechnicalSpecs } from '@/components/windfarms/technical-specs'
import { OwnershipTable } from '@/components/windfarms/ownership-table'
import { LocationCard } from '@/components/windfarms/location-card'
import { WindfarmTabs } from '@/components/windfarms/windfarm-tabs'
import { QuickActions } from '@/components/windfarms/quick-actions'
import { GenerationPerformanceCard } from '@/components/windfarms/generation-performance-card'
import { DataAvailabilityAlert } from '@/components/windfarms/data-availability-alert'
import { TurbineFleetSummary } from '@/components/windfarms/turbine-fleet-summary'

export const Route = createFileRoute('/_protected/wind-farms/$windfarmId')({
  component: WindfarmDetailsPage,
})

function WindfarmDetailsPage() {
  const { windfarmId } = Route.useParams()
  const id = parseInt(windfarmId, 10)

  const {
    data: windfarm,
    isLoading: isLoadingWindfarm,
    error: windfarmError,
  } = useWindfarmWithOwners(id)

  const {
    data: turbineUnits,
    isLoading: isLoadingTurbines,
  } = useWindfarmTurbineUnits(id)

  // Loading state
  if (isLoadingWindfarm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading wind farm details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (windfarmError || !windfarm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Wind Farm Not Found
            </h2>
            <p className="text-muted-foreground mt-1">
              The wind farm you're looking for doesn't exist or couldn't be loaded.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <WindfarmHero windfarm={windfarm} />
        </div>
        <div className="lg:pt-16">
          <QuickActions windfarmId={id} />
        </div>
      </div>

      {/* Data Availability Alert */}
      <DataAvailabilityAlert
        windfarmId={id}
        nameplateCapacityMw={windfarm.nameplate_capacity_mw}
        bidzoneId={windfarm.bidzone_id}
      />

      {/* Tab Navigation */}
      <WindfarmTabs windfarmId={id} />

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
    </div>
  )
}
