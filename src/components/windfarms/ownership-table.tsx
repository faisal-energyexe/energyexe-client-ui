import { Users, Building2, Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { WindfarmOwnerWithDetails } from '@/types/windfarm'

interface OwnershipTableProps {
  owners: WindfarmOwnerWithDetails[]
}

export function OwnershipTable({ owners }: OwnershipTableProps) {
  // Sort by ownership percentage descending
  const sortedOwners = [...owners].sort((a, b) => {
    const aPercent = parseFloat(a.ownership_percentage) || 0
    const bPercent = parseFloat(b.ownership_percentage) || 0
    return bPercent - aPercent
  })

  // Calculate total ownership
  const totalOwnership = owners.reduce(
    (sum, owner) => sum + (parseFloat(owner.ownership_percentage) || 0),
    0,
  )

  // Color palette for ownership bars
  const colors = [
    'bg-primary',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-pink-500',
  ]

  if (owners.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Ownership Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            No ownership information available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Ownership Structure
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {owners.length} owner{owners.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ownership distribution visual */}
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-muted/30 overflow-hidden flex">
            {sortedOwners.map((owner, index) => {
              const percentage = parseFloat(owner.ownership_percentage) || 0
              return (
                <div
                  key={owner.id}
                  className={`h-full ${colors[index % colors.length]} transition-all`}
                  style={{ width: `${percentage}%` }}
                  title={`${owner.owner?.name}: ${percentage.toFixed(1)}%`}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>Total: {totalOwnership.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Owner list */}
        <div className="space-y-3">
          {sortedOwners.map((owner, index) => {
            const percentage = parseFloat(owner.ownership_percentage) || 0
            return (
              <div
                key={owner.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {/* Color indicator */}
                <div
                  className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
                />

                {/* Owner info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground truncate">
                      {owner.owner?.name || 'Unknown Owner'}
                    </span>
                  </div>
                  {owner.owner?.code && (
                    <span className="text-xs text-muted-foreground font-mono ml-6">
                      {owner.owner.code}
                    </span>
                  )}
                </div>

                {/* Percentage */}
                <div className="flex items-center gap-3">
                  <div className="w-24 hidden sm:block">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <div className="flex items-center gap-1 min-w-[70px] justify-end">
                    <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-bold text-foreground">
                      {percentage.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ownership summary */}
        {totalOwnership < 100 && (
          <div className="flex items-center justify-between p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
            <span className="text-sm text-amber-400">
              Unaccounted ownership
            </span>
            <span className="font-medium text-amber-400">
              {(100 - totalOwnership).toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
