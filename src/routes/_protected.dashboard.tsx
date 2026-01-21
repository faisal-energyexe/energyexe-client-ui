import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Wind,
  TrendingUp,
  DollarSign,
  CloudSun,
  Activity,
  ArrowUpRight,
  BarChart3,
  Gauge,
} from 'lucide-react'
import { WelcomeHeader } from '@/components/dashboard/welcome-header'
import { PortfolioMetrics } from '@/components/dashboard/portfolio-metrics'
import { QuickAccessPanel } from '@/components/dashboard/quick-access-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_protected/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const quickActions = [
    {
      title: 'Browse Wind Farms',
      description: 'Explore your wind farm portfolio',
      icon: Wind,
      href: '/wind-farms',
    },
    {
      title: 'View Generation',
      description: 'Analyze power output trends',
      icon: BarChart3,
      href: '/wind-farms',
    },
    {
      title: 'Weather Insights',
      description: 'Wind patterns and correlations',
      icon: CloudSun,
      href: '/wind-farms',
    },
    {
      title: 'Market Analytics',
      description: 'Prices and capture rates',
      icon: DollarSign,
      href: '/wind-farms',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Portfolio Metrics */}
      <PortfolioMetrics />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access Panel - Takes 2 columns */}
        <div className="lg:col-span-2">
          <QuickAccessPanel />
        </div>

        {/* Quick Actions */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Feature Highlights */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card/50 to-cyan-500/10 border border-primary/20 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-primary/20">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Wind Farm Analytics Platform
            </h2>
            <p className="text-muted-foreground">
              Comprehensive insights for your renewable energy portfolio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard
            icon={BarChart3}
            title="Generation Analytics"
            description="Track power output, capacity factors, and generation trends with hourly resolution"
          />
          <FeatureCard
            icon={CloudSun}
            title="Weather Intelligence"
            description="Correlate ERA5 weather data with generation for accurate performance analysis"
          />
          <FeatureCard
            icon={DollarSign}
            title="Market & Revenue"
            description="Analyze capture rates, day-ahead prices, and revenue optimization"
          />
          <FeatureCard
            icon={Gauge}
            title="Performance Metrics"
            description="Monitor capacity factors, availability, and benchmarks across your portfolio"
          />
        </div>
      </div>

      {/* Getting Started Tips */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <h3 className="font-medium">Browse Wind Farms</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-8">
                Navigate to the Wind Farms page to see your portfolio and search for specific assets.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <h3 className="font-medium">Select a Farm</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-8">
                Click on any wind farm to see detailed analytics including generation, weather, and market data.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <h3 className="font-medium">Analyze Performance</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-8">
                Use the tabs to explore generation charts, weather patterns, and revenue metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="space-y-2">
      <div className="p-2 rounded-lg bg-card/50 w-fit">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
