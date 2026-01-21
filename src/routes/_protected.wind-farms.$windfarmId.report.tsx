/**
 * Route: /wind-farms/:windfarmId/report
 * Windfarm performance report page.
 */

import { createFileRoute } from '@tanstack/react-router'
import { ReportPage } from '@/components/reports'
import { useWindfarmWithOwners } from '@/lib/windfarms-api'

export const Route = createFileRoute('/_protected/wind-farms/$windfarmId/report')({
  component: WindfarmReportPage,
})

function WindfarmReportPage() {
  const { windfarmId } = Route.useParams()
  const windfarmIdNum = parseInt(windfarmId, 10)

  const { data: windfarm } = useWindfarmWithOwners(windfarmIdNum)

  return (
    <div className="p-6">
      <ReportPage
        windfarmId={windfarmIdNum}
        windfarmName={windfarm?.name || 'Wind Farm'}
      />
    </div>
  )
}
