import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Cloud,
  DollarSign,
  Info,
  Wind,
} from 'lucide-react'

interface WindfarmTabsProps {
  windfarmId: number
}

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  route: string
  disabled?: boolean
}

export function WindfarmTabs({ windfarmId }: WindfarmTabsProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Info,
      route: 'overview',
    },
    {
      id: 'generation',
      label: 'Generation',
      icon: BarChart3,
      route: 'generation',
    },
    {
      id: 'weather',
      label: 'Weather',
      icon: Cloud,
      route: 'weather',
      disabled: true, // Phase 3
    },
    {
      id: 'market',
      label: 'Market & Revenue',
      icon: DollarSign,
      route: 'market',
      disabled: true, // Phase 4
    },
    {
      id: 'turbines',
      label: 'Turbines',
      icon: Wind,
      route: 'turbines',
      disabled: true, // Future
    },
  ]

  const isActive = (tab: TabItem) => {
    const basePath = `/wind-farms/${windfarmId}`
    if (tab.id === 'overview') {
      // Overview is active when path is exactly the windfarm detail page
      return currentPath === basePath || currentPath === `${basePath}/`
    }
    return currentPath.includes(`/${tab.route}`)
  }

  return (
    <div className="border-b border-border/50">
      <nav className="flex space-x-1 overflow-x-auto" aria-label="Windfarm navigation">
        {tabs.map((tab) => {
          const active = isActive(tab)
          const Icon = tab.icon

          if (tab.disabled) {
            return (
              <div
                key={tab.id}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                  'text-muted-foreground/50 cursor-not-allowed',
                  'border-b-2 border-transparent'
                )}
                title="Coming soon"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            )
          }

          // Use proper Link routing based on tab
          if (tab.id === 'overview') {
            return (
              <Link
                key={tab.id}
                to="/wind-farms/$windfarmId"
                params={{ windfarmId: windfarmId.toString() }}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                  'transition-colors whitespace-nowrap',
                  'border-b-2',
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            )
          }

          if (tab.id === 'generation') {
            return (
              <Link
                key={tab.id}
                to="/wind-farms/$windfarmId/generation"
                params={{ windfarmId: windfarmId.toString() }}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                  'transition-colors whitespace-nowrap',
                  'border-b-2',
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            )
          }

          // Fallback for other tabs (should not reach here due to disabled check)
          return (
            <div
              key={tab.id}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium',
                'text-muted-foreground/50 cursor-not-allowed',
                'border-b-2 border-transparent'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
