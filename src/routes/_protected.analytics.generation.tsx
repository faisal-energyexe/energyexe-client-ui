import { createFileRoute } from '@tanstack/react-router'
import { PortfolioGenerationPage } from '@/components/analytics/portfolio-generation-page'

export const Route = createFileRoute('/_protected/analytics/generation')({
  component: PortfolioGenerationPage,
})
