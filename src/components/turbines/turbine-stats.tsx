import { Fan, Gauge, Building2, Wind } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TurbineUnitStats } from '@/types/windfarm'

interface TurbineStatsProps {
  stats?: TurbineUnitStats
  isLoading: boolean
}

export function TurbineStats({ stats, isLoading }: TurbineStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statItems = [
    {
      label: 'Total Turbines',
      value: stats?.total_count?.toLocaleString() ?? '0',
      icon: Fan,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Capacity',
      value: `${(stats?.total_capacity_mw ?? 0).toLocaleString()} MW`,
      icon: Gauge,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Wind Farms',
      value: stats?.windfarm_count?.toLocaleString() ?? '0',
      icon: Building2,
      iconColor: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'Avg Hub Height',
      value: stats?.avg_hub_height_m
        ? `${stats.avg_hub_height_m.toFixed(1)} m`
        : 'N/A',
      icon: Wind,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card
          key={item.label}
          className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  {item.label}
                </p>
                <p className="text-xl font-bold text-foreground">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
