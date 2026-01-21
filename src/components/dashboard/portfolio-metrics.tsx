import { Wind, Zap, Globe, Building2, MapPin, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePortfolioSummary, formatCapacity } from '@/lib/dashboard-api'

interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  iconColor?: string
  subLabel?: string
}

function MetricCard({ label, value, icon, iconColor = 'text-primary', subLabel }: MetricCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subLabel && (
              <p className="text-xs text-muted-foreground">{subLabel}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-primary/10 ${iconColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

export function PortfolioMetrics() {
  const { data, isLoading, error } = usePortfolioSummary()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Unable to load portfolio metrics
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard
        label="Total Wind Farms"
        value={data.total_windfarms}
        icon={<Wind className="h-5 w-5" />}
        subLabel="in portfolio"
      />

      <MetricCard
        label="Total Capacity"
        value={formatCapacity(data.total_capacity_mw)}
        icon={<Zap className="h-5 w-5" />}
        iconColor="text-yellow-400"
        subLabel="installed capacity"
      />

      <MetricCard
        label="Operational"
        value={data.operational_farms}
        icon={<Activity className="h-5 w-5" />}
        iconColor="text-emerald-400"
        subLabel="active farms"
      />

      <MetricCard
        label="Offshore"
        value={data.offshore_farms}
        icon={<MapPin className="h-5 w-5" />}
        iconColor="text-cyan-400"
        subLabel="offshore farms"
      />

      <MetricCard
        label="Onshore"
        value={data.onshore_farms}
        icon={<Building2 className="h-5 w-5" />}
        iconColor="text-orange-400"
        subLabel="onshore farms"
      />

      <MetricCard
        label="Countries"
        value={data.countries}
        icon={<Globe className="h-5 w-5" />}
        iconColor="text-purple-400"
        subLabel="markets"
      />
    </div>
  )
}
