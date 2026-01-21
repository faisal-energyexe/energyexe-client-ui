import { createFileRoute } from '@tanstack/react-router'
import { WindFarmsPage } from '@/components/windfarms'

export const Route = createFileRoute('/_protected/wind-farms/')({
  component: WindFarmsPage,
})
