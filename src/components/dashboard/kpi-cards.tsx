import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { kpiData } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiData.map((kpi) => (
        <Card key={kpi.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              {kpi.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <CardTitle className="text-2xl font-bold">{kpi.value}</CardTitle>
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {kpi.change}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
