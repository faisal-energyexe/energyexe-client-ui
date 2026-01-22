import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Construction } from 'lucide-react'

export const Route = createFileRoute('/_protected/reports')({
  component: ReportsCenterPage,
})

function ReportsCenterPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">
              Central reports hub for generating and viewing reports
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
            The reports center is currently under development. This page will provide
            report templates, recent reports history, quick generate buttons, and
            download options for previous reports.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
