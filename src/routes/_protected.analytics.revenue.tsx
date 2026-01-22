import { createFileRoute } from '@tanstack/react-router'
import { PortfolioRevenuePage } from '@/components/analytics/portfolio-revenue-page'

export const Route = createFileRoute('/_protected/analytics/revenue')({
  component: PortfolioRevenuePage,
})
