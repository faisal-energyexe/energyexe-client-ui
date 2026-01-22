import { createFileRoute } from '@tanstack/react-router'
import { AnomaliesPage } from '@/components/anomalies'

export const Route = createFileRoute('/_protected/anomalies')({
  component: AnomaliesPage,
})
