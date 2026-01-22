/**
 * Route: /portfolios
 * Portfolio management page.
 */

import { createFileRoute } from '@tanstack/react-router'
import { PortfolioManager } from '@/components/portfolio'

export const Route = createFileRoute('/_protected/portfolios')({
  component: PortfoliosPage,
})

function PortfoliosPage() {
  return (
    <div className="p-6 lg:p-8">
      <PortfolioManager />
    </div>
  )
}
