import { Link } from '@tanstack/react-router'
import { Wind, ChevronRight, ArrowUpRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRecentWindfarms, formatCapacity } from '@/lib/dashboard-api'

function WindfarmItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

export function QuickAccessPanel() {
  const { data: windfarms, isLoading, error } = useRecentWindfarms(6)

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Wind Farms
        </CardTitle>
        <Link to="/wind-farms">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <WindfarmItemSkeleton key={i} />
            ))}
          </div>
        ) : error || !windfarms?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Wind className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No wind farms found</p>
            <Link to="/wind-farms" className="mt-4">
              <Button variant="outline" size="sm">
                Browse Wind Farms
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {windfarms.map((wf) => (
              <Link
                key={wf.id}
                to="/wind-farms/$windfarmId"
                params={{ windfarmId: wf.id.toString() }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wind className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {wf.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {wf.country?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {formatCapacity(wf.nameplate_capacity_mw)}
                  </Badge>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
