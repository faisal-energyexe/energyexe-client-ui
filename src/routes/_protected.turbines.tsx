import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Fan, Construction } from 'lucide-react'

export const Route = createFileRoute('/_protected/turbines')({
  component: TurbinesPage,
})

function TurbinesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Fan className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Turbines</h1>
            <p className="text-muted-foreground">
              Global turbine inventory across all wind farms
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
            The turbines inventory page is currently under development. This page will provide
            a global view of all turbines across your wind farms, including filtering by manufacturer,
            model, and status.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
