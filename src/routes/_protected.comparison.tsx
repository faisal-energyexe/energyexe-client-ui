import { createFileRoute } from '@tanstack/react-router'
import { ComparisonPage } from '@/components/comparison'

export const Route = createFileRoute('/_protected/comparison')({
  component: ComparisonPage,
})
