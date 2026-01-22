import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Construction } from 'lucide-react'

export const Route = createFileRoute('/_protected/analytics/revenue')({
  component: PortfolioRevenuePage,
})

function PortfolioRevenuePage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Revenue & Pricing</h1>
            <p className="text-muted-foreground">
              Portfolio-wide revenue and pricing analytics
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
            The portfolio revenue analytics page is currently under development. This page will
            provide total revenue KPIs, revenue breakdown by farm, price comparison across bidzones,
            and capture rate rankings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
