import { createFileRoute } from '@tanstack/react-router'
import { ReportsCenterPage } from '@/components/reports-center'

export const Route = createFileRoute('/_protected/reports')({
  component: ReportsCenterPage,
})
