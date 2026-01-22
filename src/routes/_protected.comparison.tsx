import { createFileRoute } from '@tanstack/react-router'
import { ComparisonPage } from '@/components/comparison'

export const Route = createFileRoute('/_protected/comparison')({
  component: ComparisonPageRoute,
})

function ComparisonPageRoute() {
  return (
    <div className="p-6 lg:p-8">
      <ComparisonPage />
    </div>
  )
}
