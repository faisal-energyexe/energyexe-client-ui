import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Loader2, AlertCircle } from 'lucide-react'
import { useWindfarmWithOwners } from '@/lib/windfarms-api'
import { WindfarmHero } from '@/components/windfarms/windfarm-hero'
import { WindfarmTabs } from '@/components/windfarms/windfarm-tabs'
import { QuickActions } from '@/components/windfarms/quick-actions'
import { DataAvailabilityAlert } from '@/components/windfarms/data-availability-alert'

export const Route = createFileRoute('/_protected/wind-farms/$windfarmId')({
  component: WindfarmDetailsLayout,
})

function WindfarmDetailsLayout() {
  const { windfarmId } = Route.useParams()
  const id = parseInt(windfarmId, 10)

  const {
    data: windfarm,
    isLoading: isLoadingWindfarm,
    error: windfarmError,
  } = useWindfarmWithOwners(id)

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

      {/* Tab Content - Rendered by child routes */}
      <Outlet />
    </div>
  )
}
