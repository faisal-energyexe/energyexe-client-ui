import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/components/settings'

export const Route = createFileRoute('/_protected/settings')({
  component: SettingsPage,
})
