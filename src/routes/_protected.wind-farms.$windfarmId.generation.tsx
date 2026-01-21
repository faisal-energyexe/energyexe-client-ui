import { createFileRoute, Link } from '@tanstack/react-router'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWindfarmWithOwners } from '@/lib/windfarms-api'
import { WindfarmTabs } from '@/components/windfarms/windfarm-tabs'
import { GenerationTab } from '@/components/generation'

export const Route = createFileRoute(
  '/_protected/wind-farms/$windfarmId/generation'
)({
  component: WindfarmGenerationPage,
})

function WindfarmGenerationPage() {
  const { windfarmId } = Route.useParams()
  const id = parseInt(windfarmId, 10)

  const {
    data: windfarm,
    isLoading,
    error,
  } = useWindfarmWithOwners(id)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading generation data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !windfarm) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/wind-farms/$windfarmId" params={{ windfarmId: windfarmId }}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Generation Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              {windfarm.name} ({windfarm.code})
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <WindfarmTabs windfarmId={id} />

      {/* Generation Content */}
      <GenerationTab
        windfarmId={id}
        nameplateMW={windfarm.nameplate_capacity_mw || undefined}
      />
    </div>
  )
}
