import { createFileRoute } from '@tanstack/react-router'
import { TurbinesPage } from '@/components/turbines'

export const Route = createFileRoute('/_protected/turbines')({
  component: TurbinesPage,
})
