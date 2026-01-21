import { createFileRoute } from '@tanstack/react-router'
import { AlertsPage } from '@/components/alerts'

export const Route = createFileRoute('/_protected/alerts')({
  component: AlertsPage,
})
