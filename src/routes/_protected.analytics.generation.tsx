import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Construction } from 'lucide-react'

export const Route = createFileRoute('/_protected/analytics/generation')({
  component: PortfolioGenerationPage,
})

function PortfolioGenerationPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Generation Analytics</h1>
            <p className="text-muted-foreground">
              Portfolio-wide generation performance across all wind farms
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
            The portfolio generation analytics page is currently under development. This page will
            provide aggregated generation KPIs, stacked charts showing contribution by farm,
            and top/bottom performer rankings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
