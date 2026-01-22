import { createFileRoute } from '@tanstack/react-router'
import { HelpPage } from '@/components/help'

export const Route = createFileRoute('/_protected/help')({
  component: HelpPage,
})
