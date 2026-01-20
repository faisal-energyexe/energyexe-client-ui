import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@/contexts/theme-context'
import { DemoLayout } from '@/components/layout/demo-layout'
import { WindfarmDetailsPage } from '@/components/layouts'

function WindfarmPage() {
  const { setTheme, setMode } = useTheme()

  useEffect(() => {
    setTheme('obsidian')
    // Obsidian is designed for dark mode
    setMode('dark')
  }, [setTheme, setMode])

  return (
    <DemoLayout>
      <WindfarmDetailsPage />
    </DemoLayout>
  )
}

export const Route = createFileRoute('/demo/windfarm')({
  component: WindfarmPage,
})
