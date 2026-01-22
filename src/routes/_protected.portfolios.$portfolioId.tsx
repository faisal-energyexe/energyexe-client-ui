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

  return (
    <div className="p-6 lg:p-8">
      <PortfolioDetail portfolioId={parseInt(portfolioId, 10)} />
    </div>
  )
}
