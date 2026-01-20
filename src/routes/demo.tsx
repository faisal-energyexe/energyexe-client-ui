import { createFileRoute, Navigate, Outlet, useMatches } from '@tanstack/react-router'
import { ThemeProvider } from '@/contexts/theme-context'

function DemoRoute() {
  const matches = useMatches()
  // Check if we're on a child route or the root demo page
  const isRoot = matches.length <= 2 // root + /demo

  // Redirect /demo to /demo/windfarm
  if (isRoot) {
    return <Navigate to="/demo/windfarm" />
  }

  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  )
}

export const Route = createFileRoute('/demo')({
  component: DemoRoute,
})
