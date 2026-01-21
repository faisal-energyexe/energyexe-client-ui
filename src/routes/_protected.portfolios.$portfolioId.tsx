/**
 * Route: /portfolios/:portfolioId
 * Portfolio detail page.
 */

import { createFileRoute } from '@tanstack/react-router'
import { PortfolioDetail } from '@/components/portfolio'

export const Route = createFileRoute('/_protected/portfolios/$portfolioId')({
  component: PortfolioDetailPage,
})

function PortfolioDetailPage() {
  const { portfolioId } = Route.useParams()

  return <PortfolioDetail portfolioId={parseInt(portfolioId, 10)} />
}
