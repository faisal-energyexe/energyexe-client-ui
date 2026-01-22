import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CloudSun, Construction } from 'lucide-react'

export const Route = createFileRoute('/_protected/analytics/weather')({
  component: PortfolioWeatherPage,
})

function PortfolioWeatherPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <CloudSun className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Weather Impact</h1>
            <p className="text-muted-foreground">
              Portfolio-wide weather patterns and correlations
            </p>
          </div>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-amber-500" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The portfolio weather analytics page is currently under development. This page will
            provide average wind speed across portfolio, wind conditions by region,
            correlation summaries, and seasonal pattern comparisons.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
