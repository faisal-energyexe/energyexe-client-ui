import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { quickStatsData } from '@/lib/mock-data'

export function QuickStats() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickStatsData.map((stat) => {
          // Extract numeric value for progress bar
          const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''))
          const progressValue = stat.label === 'Grid Frequency'
            ? ((numericValue - 49) / 2) * 100
            : numericValue

          return (
            <div key={stat.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-medium">{stat.value}</span>
              </div>
              <Progress
                value={Math.min(progressValue, 100)}
                className="h-2"
                style={{
                  ['--progress-background' as string]: `var(--color-${stat.color})`,
                }}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
