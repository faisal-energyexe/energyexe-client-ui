import { createFileRoute } from '@tanstack/react-router'
import { AlertsPage } from '@/components/alerts'

export const Route = createFileRoute('/_protected/alerts')({
  component: AlertsPageRoute,
})

function AlertsPageRoute() {
  return (
    <div className="p-6 lg:p-8">
      <AlertsPage />
    </div>
  )
}
