import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/contexts/auth-context'
import {
  Wind,
  Fan,
  Zap,
  TrendingUp,
  DollarSign,
  CloudSun,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export const Route = createFileRoute('/_protected/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Total Generation',
      value: '24.8 GWh',
      change: '+12.5%',
      trend: 'up',
      icon: Zap,
      color: 'from-primary to-blue-400',
    },
    {
      title: 'Active Turbines',
      value: '847',
      change: '99.2% uptime',
      trend: 'up',
      icon: Fan,
      color: 'from-cyan-500 to-teal-400',
    },
    {
      title: 'Wind Farms',
      value: '12',
      change: '+2 this month',
      trend: 'up',
      icon: Wind,
      color: 'from-emerald-500 to-green-400',
    },
    {
      title: 'Revenue (MTD)',
      value: '$2.4M',
      change: '+8.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-amber-500 to-yellow-400',
    },
  ]

  const quickActions = [
    {
      title: 'View Generation Analytics',
      description: 'Analyze power output across all wind farms',
      icon: TrendingUp,
      href: '/analytics/generation',
    },
    {
      title: 'Check Weather Impact',
      description: 'See how weather affects your generation',
      icon: CloudSun,
      href: '/analytics/weather',
    },
    {
      title: 'Live Monitor',
      description: 'Real-time turbine performance monitoring',
      icon: Activity,
      href: '/live-monitor',
    },
    {
      title: 'Revenue Analysis',
      description: 'Track revenue and market prices',
      icon: DollarSign,
      href: '/analytics/revenue',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.first_name || 'User'}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your wind farm portfolio performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Gradient accent line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
            />

            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="group relative overflow-hidden rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card/50"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card/50 to-cyan-500/10 border border-primary/20 p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Wind Farm Analytics Platform
            </h2>
            <p className="text-muted-foreground">
              Your complete solution for wind energy insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Generation Data</h3>
            <p className="text-sm text-muted-foreground">
              Track power output, capacity factors, and generation trends across your entire
              portfolio.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Market & Revenue</h3>
            <p className="text-sm text-muted-foreground">
              Analyze power prices, revenue optimization, and market opportunities in real-time.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Weather Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Correlate weather data with generation to forecast output and optimize operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
