import { createFileRoute } from '@tanstack/react-router'
import { PortfolioPerformancePage } from '@/components/analytics/portfolio-performance-page'

export const Route = createFileRoute('/_protected/analytics/performance')({
  component: PortfolioPerformancePage,
})
