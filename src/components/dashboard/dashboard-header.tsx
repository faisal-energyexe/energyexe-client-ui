import { Link } from '@tanstack/react-router'
import { Moon, Sun, Wind } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  const { mode, toggleMode } = useTheme()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <Link to="/demo/windfarm" className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">WindfarmOS</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Mode Toggle */}
        <Button variant="outline" size="icon" onClick={toggleMode}>
          {mode === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme mode</span>
        </Button>
      </div>
    </header>
  )
}
