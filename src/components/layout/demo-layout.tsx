import { useState, type ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Wind,
  Fan,
  BarChart3,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Zap,
  Activity,
  TrendingUp,
  MapPin,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  icon: typeof LayoutDashboard
  href: string
  badge?: string | null
  live?: boolean
  alert?: boolean
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/demo/windfarm' },
  { title: 'Wind Farms', icon: Wind, href: '#', badge: '12' },
  { title: 'Turbines', icon: Fan, href: '#', badge: '847' },
  { title: 'Live Monitor', icon: Activity, href: '#', live: true },
]

const analyticsNavItems: NavItem[] = [
  { title: 'Analytics', icon: BarChart3, href: '#' },
  { title: 'Performance', icon: TrendingUp, href: '#' },
  { title: 'Locations', icon: MapPin, href: '#' },
]

const systemNavItems: NavItem[] = [
  { title: 'Alerts', icon: Bell, href: '#', badge: '3', alert: true },
  { title: 'Reports', icon: FileText, href: '#' },
  { title: 'Settings', icon: Settings, href: '#' },
  { title: 'Help', icon: HelpCircle, href: '#' },
]

interface DemoLayoutProps {
  children: ReactNode
}

export function DemoLayout({ children }: DemoLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { mode, toggleMode } = useTheme()
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '#') return false
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const NavItem = ({ item, showLabel }: { item: NavItem; showLabel: boolean }) => {
    const active = isActive(item.href)

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.href}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
              active
                ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-primary'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            {/* Active indicator line */}
            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary via-primary to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}

            {/* Icon with glow effect on active */}
            <div className={cn(
              'relative flex items-center justify-center',
              active && 'text-primary'
            )}>
              <item.icon className={cn(
                'h-5 w-5 transition-all duration-300',
                active && 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
                !active && 'group-hover:scale-110'
              )} />

              {/* Live indicator pulse */}
              {'live' in item && item.live && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </span>
              )}
            </div>

            {showLabel && (
              <>
                <span className="flex-1 truncate">{item.title}</span>

                {/* Badge */}
                {item.badge && (
                  <span className={cn(
                    'px-2 py-0.5 text-xs font-semibold rounded-full transition-all',
                    'alert' in item && item.alert
                      ? 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      : 'bg-sidebar-accent text-sidebar-foreground/80'
                  )}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        </TooltipTrigger>
        {!showLabel && (
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
            {item.badge && (
              <span className={cn(
                'px-1.5 py-0.5 text-xs rounded-full',
                'alert' in item && item.alert
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-muted text-muted-foreground'
              )}>
                {item.badge}
              </span>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  const NavGroup = ({ label, items, showLabel }: { label: string; items: NavItem[]; showLabel: boolean }) => (
    <div className="space-y-1">
      {showLabel && (
        <div className="px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            {label}
          </span>
        </div>
      )}
      {items.map((item) => (
        <NavItem key={item.title} item={item} showLabel={showLabel} />
      ))}
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Premium Sidebar */}
      <aside
        className={cn(
          'relative flex flex-col bg-sidebar transition-all duration-300 ease-out',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {/* Animated gradient border on right */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

        {/* Subtle animated gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Logo Section */}
        <div className={cn(
          'relative flex items-center gap-3 px-4 h-16 border-b border-sidebar-border/50',
          collapsed && 'justify-center px-0'
        )}>
          <div className="relative">
            {/* Animated glow behind logo */}
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl animate-pulse" />
            <div className={cn(
              'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-500 p-2 shadow-lg shadow-primary/25',
              'transition-transform duration-300 hover:scale-105'
            )}>
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold text-sidebar-foreground tracking-tight">
                WindfarmOS
              </span>
              <span className="text-[10px] text-sidebar-foreground/50 font-medium tracking-wide">
                ENERGY PLATFORM
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto scrollbar-thin">
          <TooltipProvider delayDuration={0}>
            <NavGroup label="Main" items={mainNavItems} showLabel={!collapsed} />
            <NavGroup label="Analytics" items={analyticsNavItems} showLabel={!collapsed} />
            <NavGroup label="System" items={systemNavItems} showLabel={!collapsed} />
          </TooltipProvider>
        </nav>

        {/* User Profile Section */}
        <div className="relative p-3 border-t border-sidebar-border/50">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

          <div className={cn(
            'relative flex items-center gap-3 p-2 rounded-xl transition-all duration-300',
            'hover:bg-sidebar-accent/30',
            collapsed && 'justify-center'
          )}>
            {/* Avatar with status ring */}
            <div className="relative">
              <Avatar className="h-9 w-9 ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-sidebar">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-500 text-white text-xs font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              {/* Online status dot */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-sidebar shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </div>

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-sidebar-foreground/50 truncate">
                    Administrator
                  </p>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Sign out</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-3 border-t border-sidebar-border/50 space-y-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            className={cn(
              'w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
              collapsed && 'justify-center px-0'
            )}
          >
            {mode === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {!collapsed && (
              <span className="text-xs">
                {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            )}
          </Button>

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
